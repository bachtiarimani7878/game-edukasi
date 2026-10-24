export type DifficultyLevel = 'mudah' | 'sedang' | 'sulit';
export type GameMode = 'solo' | 'two_player';

export interface GameSettings {
  difficulty: DifficultyLevel;
  mode: GameMode;
  soundEnabled: boolean;
  arEnabled: boolean;
  fontSizeMultiplier: number;
}

export interface WasteItem {
  id: string;
  name: string;
  category: 'organik' | 'anorganik' | 'b3';
  description: string;
  decompositionFact: string;
  svgKey: string;
  points: number;
}

export interface PlantPlot {
  id: number;
  stage: number; // 0 = withered, 1 = watered, 2 = healthy fruiting
  watered: boolean;
  fertilized: boolean;
}

export interface ScenarioOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
  pointValue: number;
}

export interface ScenarioItem {
  id: number;
  location: string;
  title: string;
  situation: string;
  svgKey: string;
  options: ScenarioOption[];
}

export interface WordScramblePuzzle {
  id: number;
  keyword: string;
  clue: string;
  principle: string;
  svgKey: string;
  scrambled: string[];
}

export interface ClawItem {
  id: number;
  name: string;
  station: 'reduce' | 'reuse' | 'recycle';
  valueRp: number;
  description: string;
  svgKey: string;
}

export interface RadarHotspot {
  id: number;
  city: string;
  island: string;
  title: string;
  coords: { x: number; y: number }; // percentage on SVG map
  fact: string;
  newsTitle: string;
  newsUrl: string;
  newsSource: string;
  svgKey: string;
  options: ScenarioOption[];
}

export interface GameEvaluation {
  mission1Accuracy: number;
  mission2Accuracy: number;
  mission3Accuracy: number;
  mission4Accuracy: number;
  mission5Accuracy: number;
  mission6Accuracy: number;
  totalAnswered: number;
  correctCount: number;
  feedbackNotes: string[];
}
