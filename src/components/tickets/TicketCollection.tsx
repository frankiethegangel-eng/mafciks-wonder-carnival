import React from 'react';
import { GAME_CATALOG } from '../../game/catalog';
import { MafcikMascot } from '../common/MafcikMascot';
import { ArrowLeft, Award, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import { sound } from '../../utils/audio';

interface TicketCollectionProps {
  completedGameIds: number[];
  onBackToMap: () => void;
  onPlayGame: (id: number) => void;
}

export const TicketCollection: React.FC<TicketCollectionProps> = ({
  completedGameIds,
  onBackToMap,
  onPlayGame,
}) => {
  const completedSet = new Set(completedGameIds);
  const totalCompleted = completedSet.size;

  return (
    <div className="min-h-screen py-8 px-3 sm:px-6 max-w-5xl mx-auto w-full text-white">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => {
              sound.playClick();
              onBackToMap();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-700/60 mb-3 transition-colors active:scale-95"
            aria-label="Back to carnival map"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Map</span>
          </button>
          <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-pink-300 via-purple-200 to-amber-200 bg-clip-text text-transparent">
            Julcia's Carnival Stamp Passport
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            A keepsake collection of all 20 unique festival tokens earned throughout the night.
          </p>
        </div>

        {/* Counter Badge */}
        <div className="self-start sm:self-auto px-4 py-2 rounded-2xl bg-slate-900/80 border border-pink-500/30 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-pink-500/20 text-pink-300 flex items-center justify-center text-lg">
            🎟️
          </div>
          <div>
            <div className="text-[10px] text-pink-300 font-bold uppercase tracking-wider">Collected</div>
            <div className="text-base font-black text-white">{totalCompleted} of 20 Stamps</div>
          </div>
        </div>
      </div>

      {/* Mascot note */}
      <div className="mb-8 p-4 rounded-3xl bg-slate-900/60 border border-purple-500/20 flex items-center gap-4">
        <MafcikMascot
          mood={totalCompleted >= 20 ? 'cheering' : 'happy'}
          size="sm"
          showNameTag={false}
        />
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
          {totalCompleted >= 20
            ? "Every single stamp is in your book, Julcia! What an incredible journey we shared together!"
            : `Keep exploring the stalls! Each completed game permanently preserves its handcrafted stamp here in your book.`}
        </p>
      </div>

      {/* Grid of 20 Stamps */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
        {GAME_CATALOG.map((game) => {
          const isCollected = completedSet.has(game.id);

          return (
            <div
              key={game.id}
              className={`rounded-2xl p-4 transition-all duration-300 relative flex flex-col items-center text-center justify-between min-h-[170px] ${
                isCollected
                  ? 'bg-gradient-to-b from-slate-900/90 to-slate-950 border-2 shadow-lg group hover:scale-[1.02]'
                  : 'bg-slate-950/40 border border-white/5 opacity-50'
              }`}
              style={{
                borderColor: isCollected ? game.ticketColor : 'rgba(255,255,255,0.08)',
                boxShadow: isCollected ? `0 4px 20px ${game.ticketColor}25` : undefined,
              }}
            >
              {/* Stall index badge */}
              <div className="w-full flex items-center justify-between text-[10px] font-bold text-slate-400 mb-2">
                <span>Stall #{game.id}</span>
                {isCollected ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-600" />
                )}
              </div>

              {/* Stamp Artwork Silhouette or Icon */}
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl my-1 border-2 border-dashed ${
                  isCollected
                    ? 'border-white/40 shadow-md transform -rotate-2 group-hover:rotate-0 transition-transform'
                    : 'border-white/10 bg-white/5 text-slate-600'
                }`}
                style={{
                  backgroundColor: isCollected ? `${game.ticketColor}25` : undefined,
                }}
              >
                {isCollected ? game.ticketIcon : '✨'}
              </div>

              {/* Stamp Title */}
              <div className="my-1">
                <h4 className="text-xs font-black text-white line-clamp-1">
                  {isCollected ? game.ticketName : 'Mystery Stamp'}
                </h4>
                <p className="text-[10px] text-pink-300/80 font-medium line-clamp-1">
                  {game.title}
                </p>
              </div>

              {/* Replay Button if collected */}
              {isCollected ? (
                <button
                  onClick={() => {
                    sound.playClick();
                    onPlayGame(game.id);
                  }}
                  className="mt-2 w-full py-1 rounded-xl bg-white/10 hover:bg-white/20 text-[10px] font-bold text-slate-200 transition-colors"
                >
                  Replay Game
                </button>
              ) : (
                <div className="mt-2 text-[10px] text-slate-500 font-medium">Locked</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
