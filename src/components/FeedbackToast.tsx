import React from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

interface FeedbackToastProps {
  feedback: {
    isCorrect: boolean;
    text: string;
  } | null;
}

export const FeedbackToast: React.FC<FeedbackToastProps> = ({ feedback }) => {
  if (!feedback) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-lg pointer-events-none animate-bounce">
      <div
        className={`p-3.5 rounded-2xl border-2 shadow-2xl backdrop-blur-md flex items-start gap-3 text-xs sm:text-sm font-semibold transition-all ${
          feedback.isCorrect
            ? 'bg-emerald-950/95 border-emerald-400 text-emerald-100 shadow-emerald-500/30'
            : 'bg-rose-950/95 border-rose-500 text-rose-100 shadow-rose-500/30'
        }`}
      >
        <div className="shrink-0 mt-0.5">
          {feedback.isCorrect ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          )}
        </div>
        <div className="flex-1 leading-snug">
          <span className="font-bold block mb-0.5">
            {feedback.isCorrect ? '✅ JAWABAN TEPAT' : '❌ KURANG TEPAT'}
          </span>
          {feedback.text}
        </div>
      </div>
    </div>
  );
};
