import React, { useState, useEffect, useRef } from 'react';
import { DifficultyLevel, GameMode } from './types/game';
import { SplashScreen } from './components/SplashScreen';
import { HeaderHUD } from './components/HeaderHUD';
import { EducationalModal } from './components/EducationalModal';
import { CertificateModal } from './components/CertificateModal';
import { TwoPlayerDuel } from './components/TwoPlayerDuel';
import { PauseModal } from './components/PauseModal';
import { GameOverModal } from './components/GameOverModal';
import { FeedbackToast } from './components/FeedbackToast';
import { VictoryView } from './components/VictoryView';
import { ARCameraOverlay } from './components/ARCameraOverlay';
import { MissionMapModal } from './components/MissionMapModal';
import { MissionCompleteModal } from './components/MissionCompleteModal';
import { LevelTransitionNotification } from './components/LevelTransitionNotification';

// Missions
import { Mission1Waste } from './components/Missions/Mission1Waste';
import { Mission2Forestry } from './components/Missions/Mission2Forestry';
import { Mission3Scenarios } from './components/Missions/Mission3Scenarios';
import { Mission4WordScramble } from './components/Missions/Mission4WordScramble';
import { Mission5ClawMachine } from './components/Missions/Mission5ClawMachine';
import { Mission6ArchipelagoMap } from './components/Missions/Mission6ArchipelagoMap';
import { soundManager } from './utils/audio';

type ScreenState = 'splash' | 'game' | 'victory' | 'game_over';

const MISSION_TITLES = [
  'Pilah Sampah SNI',
  'Reforestasi Taman',
  'Sikap Etis HOTS',
  'Susun Kata 3R',
  'Mesin Capit 3R',
  'Radar Kasus Nusantara',
];

export default function App() {
  // Screen & Navigation
  const [screen, setScreen] = useState<ScreenState>('splash');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('sedang');
  const [mode, setMode] = useState<GameMode>('solo');

  // Modals & Overlays
  const [isEducationOpen, setIsEducationOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isMissionMapOpen, setIsMissionMapOpen] = useState(false);
  const [isMissionCompleteOpen, setIsMissionCompleteOpen] = useState(false);
  const [isLevelNotificationOpen, setIsLevelNotificationOpen] = useState(false);
  const [isTwoPlayerOpen, setIsTwoPlayerOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [arEnabled, setArEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1);
  const [gameOverReason, setGameOverReason] = useState<'lives' | 'time'>('lives');
  const [missionKey, setMissionKey] = useState(0);

  // Feedback Toast
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const feedbackTimerRef = useRef<number | null>(null);

  // Gameplay State
  const [currentMissionIndex, setCurrentMissionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [maxLives, setMaxLives] = useState(3);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [earthHealth, setEarthHealth] = useState(50);
  const [bankSavings, setBankSavings] = useState(0);

  // Difficulty time setup
  const getTimeForDifficulty = (diff: DifficultyLevel) => {
    switch (diff) {
      case 'mudah':
        return 90;
      case 'sedang':
        return 60;
      case 'sulit':
        return 45;
    }
  };

  const getLivesForDifficulty = (diff: DifficultyLevel) => {
    return diff === 'mudah' ? 5 : 3;
  };

  const getScoreMultiplier = (diff: DifficultyLevel) => {
    return diff === 'mudah' ? 1.0 : diff === 'sedang' ? 1.2 : 1.5;
  };

  // Start new game
  const handleStartGame = () => {
    soundManager.playClick();
    if (mode === 'two_player') {
      setIsTwoPlayerOpen(true);
      return;
    }

    const initialLives = getLivesForDifficulty(difficulty);
    const initialTime = getTimeForDifficulty(difficulty);

    setLives(initialLives);
    setMaxLives(initialLives);
    setTimeRemaining(initialTime);
    setScore(0);
    setEarthHealth(50);
    setBankSavings(0);
    setCurrentMissionIndex(0);
    setMissionKey((prev) => prev + 1);
    setIsPaused(false);
    setIsMissionCompleteOpen(false);
    setIsLevelNotificationOpen(true);
    setScreen('game');
  };

  // Countdown Timer
  useEffect(() => {
    if (
      screen !== 'game' ||
      isPaused ||
      isEducationOpen ||
      isCertificateOpen ||
      isMissionCompleteOpen ||
      isMissionMapOpen ||
      isLevelNotificationOpen
    )
      return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          soundManager.playError();
          setGameOverReason('time');
          setScreen('game_over');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [
    screen,
    isPaused,
    isEducationOpen,
    isCertificateOpen,
    isMissionCompleteOpen,
    isMissionMapOpen,
    isLevelNotificationOpen,
  ]);

  // Show Feedback Toast Helper
  const showFeedback = (isCorrect: boolean, text: string) => {
    if (feedbackTimerRef.current) {
      clearTimeout(feedbackTimerRef.current);
    }
    setFeedback({ isCorrect, text });
    feedbackTimerRef.current = window.setTimeout(() => {
      setFeedback(null);
    }, 3200);
  };

  // Action Handlers across missions
  const handleAnswerEvent = (
    isCorrect: boolean,
    feedbackText: string,
    points: number,
    savingsToAdd: number = 0
  ) => {
    showFeedback(isCorrect, feedbackText);

    if (isCorrect) {
      const multiplier = getScoreMultiplier(difficulty);
      const earnedPoints = Math.round(points * multiplier);
      setScore((prev) => prev + earnedPoints);
      setEarthHealth((prev) => Math.min(100, prev + 8));
      if (savingsToAdd > 0) {
        setBankSavings((prev) => prev + savingsToAdd);
      }
    } else {
      setEarthHealth((prev) => Math.max(10, prev - 8));
      setLives((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          soundManager.playError();
          setGameOverReason('lives');
          setScreen('game_over');
        }
        return next;
      });
    }
  };

  // Show mission complete evaluation modal (No auto-advance)
  const handleMissionComplete = () => {
    soundManager.playSuccess();
    setIsMissionCompleteOpen(true);
  };

  // User explicitly clicks "Lanjut ke Misi Berikutnya"
  const handleProceedToNextMission = () => {
    setIsMissionCompleteOpen(false);
    if (currentMissionIndex + 1 < MISSION_TITLES.length) {
      const nextIndex = currentMissionIndex + 1;
      setCurrentMissionIndex(nextIndex);
      setTimeRemaining(getTimeForDifficulty(difficulty));
      setMissionKey((prev) => prev + 1);
      setIsLevelNotificationOpen(true);
      showFeedback(
        true,
        `Misi ${nextIndex + 1} Dimulai: ${MISSION_TITLES[nextIndex]}!`
      );
    } else {
      setEarthHealth(100);
      setScreen('victory');
    }
  };

  // User explicitly clicks "Ulangi Misi Ini"
  const handleRetryCurrentMission = () => {
    setIsMissionCompleteOpen(false);
    setTimeRemaining(getTimeForDifficulty(difficulty));
    setMissionKey((prev) => prev + 1);
    setIsLevelNotificationOpen(true);
    showFeedback(
      true,
      `Mengulang Misi ${currentMissionIndex + 1}: ${MISSION_TITLES[currentMissionIndex]}!`
    );
  };

  const handleRestartMission = () => {
    setTimeRemaining(getTimeForDifficulty(difficulty));
    setMissionKey((prev) => prev + 1);
    setIsPaused(false);
    setIsLevelNotificationOpen(true);
  };

  const handleSelectMission = (missionIdx: number) => {
    soundManager.playSuccess();
    setIsMissionCompleteOpen(false);
    setCurrentMissionIndex(missionIdx);
    setMissionKey((prev) => prev + 1);
    setTimeRemaining(getTimeForDifficulty(difficulty));
    setIsPaused(false);
    setIsLevelNotificationOpen(true);
    if (screen !== 'game') {
      const initialLives = getLivesForDifficulty(difficulty);
      setLives(initialLives);
      setMaxLives(initialLives);
      setScreen('game');
    }
    showFeedback(
      true,
      `Melompat ke Misi ${missionIdx + 1}: ${MISSION_TITLES[missionIdx]}!`
    );
  };

  const handleSoundToggle = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    soundManager.setEnabled(nextVal);
  };

  return (
    <div
      style={{ fontSize: `${fontSizeMultiplier * 100}%` }}
      className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans transition-all selection:bg-emerald-500 selection:text-white"
    >
      {/* SCREEN: SPLASH */}
      {screen === 'splash' && (
        <SplashScreen
          difficulty={difficulty}
          mode={mode}
          onSelectDifficulty={(d) => {
            soundManager.playClick();
            setDifficulty(d);
          }}
          onSelectMode={(m) => {
            soundManager.playClick();
            setMode(m);
            if (m === 'two_player') {
              setIsTwoPlayerOpen(true);
            }
          }}
          onStartGame={handleStartGame}
          onOpenEducationInfo={() => {
            soundManager.playClick();
            setIsEducationOpen(true);
          }}
          onOpenMissionMap={() => {
            soundManager.playClick();
            setIsMissionMapOpen(true);
          }}
        />
      )}

      {/* SCREEN: GAMEPLAY */}
      {screen === 'game' && (
        <div className="flex-1 flex flex-col">
          {/* Top HUD */}
          <HeaderHUD
            currentMissionIndex={currentMissionIndex}
            missionTitle={MISSION_TITLES[currentMissionIndex]}
            earthHealth={earthHealth}
            score={score}
            lives={lives}
            maxLives={maxLives}
            timeRemaining={timeRemaining}
            isPaused={isPaused}
            soundEnabled={soundEnabled}
            arEnabled={arEnabled}
            fontSizeMultiplier={fontSizeMultiplier}
            onTogglePause={() => {
              soundManager.playClick();
              setIsPaused(!isPaused);
            }}
            onToggleSound={handleSoundToggle}
            onToggleAR={() => {
              soundManager.playClick();
              setArEnabled(!arEnabled);
            }}
            onZoomIn={() => {
              soundManager.playClick();
              setFontSizeMultiplier((prev) => Math.min(1.25, prev + 0.05));
            }}
            onZoomOut={() => {
              soundManager.playClick();
              setFontSizeMultiplier((prev) => Math.max(0.9, prev - 0.05));
            }}
            onExitGame={() => {
              soundManager.playClick();
              setScreen('splash');
            }}
            onOpenInfo={() => {
              soundManager.playClick();
              setIsEducationOpen(true);
            }}
            onOpenMissionMap={() => {
              soundManager.playClick();
              setIsMissionMapOpen(true);
            }}
          />

          {/* Mission Content Stage */}
          <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 overflow-y-auto">
            {currentMissionIndex === 0 && (
              <Mission1Waste
                key={`m1-${missionKey}`}
                onItemSorted={(isCorrect, fb, pts) => handleAnswerEvent(isCorrect, fb, pts)}
                onMissionComplete={handleMissionComplete}
                arEnabled={arEnabled}
                onToggleAR={() => setArEnabled((prev) => !prev)}
              />
            )}
            {currentMissionIndex === 1 && (
              <Mission2Forestry
                key={`m2-${missionKey}`}
                onPlotCared={(isCorrect, fb, pts) => handleAnswerEvent(isCorrect, fb, pts)}
                onMissionComplete={handleMissionComplete}
                arEnabled={arEnabled}
                onToggleAR={() => setArEnabled((prev) => !prev)}
              />
            )}
            {currentMissionIndex === 2 && (
              <Mission3Scenarios
                key={`m3-${missionKey}`}
                onScenarioAnswered={(isCorrect, fb, pts) => handleAnswerEvent(isCorrect, fb, pts)}
                onMissionComplete={handleMissionComplete}
              />
            )}
            {currentMissionIndex === 3 && (
              <Mission4WordScramble
                key={`m4-${missionKey}`}
                onWordSolved={(isCorrect, fb, pts) => handleAnswerEvent(isCorrect, fb, pts)}
                onMissionComplete={handleMissionComplete}
              />
            )}
            {currentMissionIndex === 4 && (
              <Mission5ClawMachine
                key={`m5-${missionKey}`}
                bankSavings={bankSavings}
                onItemProcessed={(isCorrect, fb, pts, sav) => handleAnswerEvent(isCorrect, fb, pts, sav)}
                onMissionComplete={handleMissionComplete}
              />
            )}
            {currentMissionIndex === 5 && (
              <Mission6ArchipelagoMap
                key={`m6-${missionKey}`}
                onHotspotResolved={(isCorrect, fb, pts) => handleAnswerEvent(isCorrect, fb, pts)}
                onMissionComplete={handleMissionComplete}
              />
            )}
          </main>
        </div>
      )}

      {/* SCREEN: VICTORY */}
      {screen === 'victory' && (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <VictoryView
            finalScore={score}
            bankSavings={bankSavings}
            earthHealth={earthHealth}
            difficulty={difficulty}
            onOpenCertificate={() => {
              soundManager.playClick();
              setIsCertificateOpen(true);
            }}
            onRestartGame={handleStartGame}
            onExitGame={() => setScreen('splash')}
          />
        </div>
      )}

      {/* SCREEN: GAME OVER */}
      {screen === 'game_over' && (
        <GameOverModal
          score={score}
          reason={gameOverReason}
          onRetry={handleStartGame}
          onExit={() => setScreen('splash')}
        />
      )}

      {/* Modals & In-Game Overlays */}
      <FeedbackToast feedback={feedback} />

      <PauseModal
        isOpen={isPaused}
        onResume={() => setIsPaused(false)}
        onRestart={handleRestartMission}
        onExit={() => {
          setIsPaused(false);
          setScreen('splash');
        }}
      />

      <EducationalModal
        isOpen={isEducationOpen}
        onClose={() => setIsEducationOpen(false)}
      />

      <MissionMapModal
        isOpen={isMissionMapOpen}
        onClose={() => setIsMissionMapOpen(false)}
        currentMissionIndex={currentMissionIndex}
        onSelectMission={handleSelectMission}
      />

      {/* Professional Mission Complete / Scorecard Evaluation Modal */}
      <MissionCompleteModal
        isOpen={isMissionCompleteOpen}
        missionIndex={currentMissionIndex}
        missionTitle={MISSION_TITLES[currentMissionIndex]}
        totalScore={score}
        earthHealth={earthHealth}
        bankSavings={bankSavings}
        timeRemaining={timeRemaining}
        lives={lives}
        maxLives={maxLives}
        isFinalMission={currentMissionIndex === MISSION_TITLES.length - 1}
        onNextMission={handleProceedToNextMission}
        onRetryMission={handleRetryCurrentMission}
        onOpenMap={() => {
          setIsMissionCompleteOpen(false);
          setIsMissionMapOpen(true);
        }}
      />

      {/* Prominent Level Transition Notification Banner */}
      <LevelTransitionNotification
        isOpen={isLevelNotificationOpen}
        levelIndex={currentMissionIndex}
        timeRemaining={timeRemaining}
        onDismiss={() => setIsLevelNotificationOpen(false)}
      />

      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        finalScore={score}
        difficulty={difficulty}
        earthHealth={earthHealth}
        bankSavings={bankSavings}
      />

      {isTwoPlayerOpen && (
        <TwoPlayerDuel
          onClose={() => {
            setIsTwoPlayerOpen(false);
            setMode('solo');
          }}
        />
      )}

      {/* For missions 1 & 2, AR camera & MediaPipe render directly on the interactive canvas */}
      <ARCameraOverlay
        enabled={arEnabled && currentMissionIndex > 1}
        onClose={() => setArEnabled(false)}
      />
    </div>
  );
}
