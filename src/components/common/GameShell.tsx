import React, { useState, useEffect } from 'react';
import { GameInfo } from '../../types';
import { ArrowLeft, RotateCcw, Lightbulb, CheckCircle2, Award, ChevronRight } from 'lucide-react';
import { MafcikMascot } from './MafcikMascot';
import { sound } from '../../utils/audio';
import confetti from 'canvas-confetti';

interface GameShellProps {
  game: GameInfo;
  isWon: boolean;
  onResetRound: () => void;
  onBackToMap: () => void;
  onNextGame?: () => void;
  mafcikSpeech?: string;
  children: React.ReactNode;
}

export const GameShell: React.FC<GameShellProps> = ({
  game,
  isWon,
  onResetRound,
  onBackToMap,
  onNextGame,
  mafcikSpeech,
  children,
}) => {
  const [showHintModal, setShowHintModal] = useState(false);
  const [hasCelebrated, setHasCelebrated] = useState(false);

  // Trigger win effects once upon victory
  useEffect(() => {
    if (isWon && !hasCelebrated) {
      setHasCelebrated(true);
      sound.playWin();

      // Launch gentle celebratory confetti for real users
      try {
        if (typeof window !== 'undefined' && !window.navigator.webdriver) {
          confetti({
            particleCount: 35,
            ticks: 50,
            spread: 60,
            origin: { y: 0.6 },
            disableForReducedMotion: true,
            colors: ['#f472b6', '#c084fc', '#fde047', '#6ee7b7', '#fbcfe8'],
          });
        }
      } catch {
        // Safe ignore
      }
    } else if (!isWon && hasCelebrated) {
      setHasCelebrated(false);
    }
  }, [isWon, hasCelebrated]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between py-4 px-3 sm:px-6 max-w-4xl mx-auto w-full">
      {/* Top Header Bar */}
      <div className="mb-4">
        {/* Navigation & Controls */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <button
            onClick={() => {
              sound.playClick();
              onBackToMap();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-700/60 shadow-sm transition-colors active:scale-95"
            aria-label="Back to carnival map"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Map</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Hint Button */}
            <button
              onClick={() => {
                sound.playClick();
                setShowHintModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold shadow-sm transition-all active:scale-95"
              aria-label="Show hint from Mafcik"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Hint</span>
            </button>

            {/* Reset Round Button */}
            <button
              onClick={() => {
                sound.playClick();
                setHasCelebrated(false);
                onResetRound();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 text-xs font-semibold shadow-sm transition-colors active:scale-95"
              aria-label="Reset current game round"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Title & Instructions Card */}
        <div className="bg-slate-900/70 backdrop-blur-md rounded-3xl p-4 sm:p-5 border border-pink-500/25 shadow-xl">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-pink-500/20 text-pink-300 border border-pink-400/30 mb-1.5">
                <span>{game.zoneName}</span>
                <span>•</span>
                <span>Stall #{game.id}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {game.title}
              </h2>
              <p className="text-xs sm:text-sm text-pink-200/90 font-medium mt-0.5">
                {game.instructions}
              </p>
            </div>

            <div className="hidden sm:block shrink-0">
              <MafcikMascot
                mood={isWon ? 'cheering' : 'happy'}
                speech={mafcikSpeech}
                size="sm"
                showNameTag={false}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Playable Game Surface */}
      <div className="flex-1 flex flex-col justify-center my-2">
        <div className="bg-slate-950/70 backdrop-blur-lg rounded-3xl p-4 sm:p-6 border border-white/10 shadow-2xl relative overflow-hidden min-h-[360px] flex flex-col justify-center items-center">
          {children}
        </div>
      </div>

      {/* Mobile Mascot Footer */}
      <div className="sm:hidden flex items-center justify-center pt-2">
        <MafcikMascot
          mood={isWon ? 'cheering' : 'happy'}
          speech={mafcikSpeech}
          size="sm"
          showNameTag={true}
        />
      </div>

      {/* Hint Modal with Mafcik */}
      {showHintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-amber-400/50 rounded-3xl p-6 text-white shadow-2xl relative text-center">
            <div className="flex justify-center mb-2">
              <MafcikMascot mood="thinking" size="md" showNameTag={false} />
            </div>

            <h4 className="text-lg font-bold text-amber-300 flex items-center justify-center gap-2 mb-2">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              Mafcik's Helpful Hint
            </h4>

            <p className="text-sm text-slate-200 leading-relaxed mb-6 bg-white/5 p-4 rounded-2xl border border-white/10">
              "{game.hintText}"
            </p>

            <button
              onClick={() => {
                sound.playClick();
                setShowHintModal(false);
              }}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-400 hover:to-pink-400 rounded-2xl font-bold text-sm text-slate-950 shadow-lg active:scale-98 transition-all"
            >
              Got it, thank you Mafcik! 🐾
            </button>
          </div>
        </div>
      )}

      {/* Win Celebration Modal with Collectible Stamp */}
      {isWon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-pink-400/60 rounded-3xl p-6 sm:p-8 text-white shadow-[0_0_50px_rgba(244,114,182,0.3)] text-center relative overflow-hidden">
            {/* Background radiant glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="flex justify-center mb-3">
              <MafcikMascot mood="cheering" speech="Woof! Julcia, you did it!" size="lg" showNameTag={true} />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-bold uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Attraction Completed!
            </div>

            <h3 className="text-2xl font-black bg-gradient-to-r from-pink-300 via-amber-200 to-purple-200 bg-clip-text text-transparent mb-1">
              {game.title} Solved!
            </h3>

            {/* Collectible Stamp Display Card */}
            <div className="my-5 p-4 rounded-2xl bg-white/5 border border-pink-300/30 shadow-inner flex items-center justify-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg border-2 border-dashed border-white/40 transform -rotate-3"
                style={{ backgroundColor: `${game.ticketColor}33`, borderColor: game.ticketColor }}
              >
                <span>{game.ticketIcon}</span>
              </div>
              <div className="text-left">
                <div className="text-xs text-pink-300 font-semibold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  Collectible Stamp Earned
                </div>
                <div className="text-base font-bold text-white">{game.ticketName}</div>
                <div className="text-[11px] text-slate-400">Saved to your Carnival Ticket Book</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button
                onClick={() => {
                  sound.playClick();
                  setHasCelebrated(false);
                  onResetRound();
                }}
                className="flex-1 py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-bold text-slate-200 transition-colors"
              >
                Replay Stall
              </button>

              {onNextGame && game.id < 20 ? (
                <button
                  onClick={() => {
                    sound.playClick();
                    onNextGame();
                  }}
                  className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 font-extrabold text-sm text-white shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <span>Next Attraction</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    sound.playClick();
                    onBackToMap();
                  }}
                  className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 font-extrabold text-sm text-white shadow-lg shadow-pink-500/25 active:scale-95 transition-all"
                >
                  Return to Map
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
