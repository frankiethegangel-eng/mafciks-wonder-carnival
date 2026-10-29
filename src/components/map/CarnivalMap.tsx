import React from 'react';
import { GAME_CATALOG } from '../../game/catalog';
import { GameInfo, ZoneId } from '../../types';
import { MafcikMascot } from '../common/MafcikMascot';
import { Lock, CheckCircle, Play, Sparkles, Heart, Mail } from 'lucide-react';
import { sound } from '../../utils/audio';

interface CarnivalMapProps {
  unlockedGameId: number;
  completedGameIds: number[];
  onSelectGame: (gameId: number) => void;
  onOpenLetter: () => void;
}

interface ZoneMeta {
  id: ZoneId;
  name: string;
  tagline: string;
  badgeColor: string;
  gradient: string;
  icon: string;
}

const ZONES: ZoneMeta[] = [
  {
    id: 'zone1',
    name: 'Zone 1: The Twinkling Entrance',
    tagline: 'Warm festival lanterns, sweet cotton candy, and the gentle carousel',
    badgeColor: 'border-pink-500/40 bg-pink-500/10 text-pink-300',
    gradient: 'from-pink-950/40 via-purple-950/30 to-slate-900/60',
    icon: '🏮',
  },
  {
    id: 'zone2',
    name: 'Zone 2: The Moonlit Midway',
    tagline: 'Ring toss games, starlight catchers, and friendly plush companions',
    badgeColor: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
    gradient: 'from-amber-950/40 via-purple-950/30 to-slate-900/60',
    icon: '🎡',
  },
  {
    id: 'zone3',
    name: 'Zone 3: The Enchanted Fairground',
    tagline: 'Chiming music boxes, firefly trails, and bakery workshops',
    badgeColor: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
    gradient: 'from-emerald-950/40 via-purple-950/30 to-slate-900/60',
    icon: '✨',
  },
  {
    id: 'zone4',
    name: 'Zone 4: The Grand Finale',
    tagline: 'Cloud hops, constellation wishes, golden locks, and grand parade',
    badgeColor: 'border-purple-500/40 bg-purple-500/10 text-purple-300',
    gradient: 'from-purple-950/50 via-pink-950/40 to-slate-900/60',
    icon: '🎆',
  },
];

export const CarnivalMap: React.FC<CarnivalMapProps> = ({
  unlockedGameId,
  completedGameIds,
  onSelectGame,
  onOpenLetter,
}) => {
  const completedSet = new Set(completedGameIds);
  const totalCompleted = completedSet.size;

  // Mascot dynamic commentary
  let mafcikSpeech = "Julcia, welcome to my carnival! Let's explore the lantern stall first! 🏮";
  if (totalCompleted >= 20) {
    mafcikSpeech = "All twenty stalls conquered! Julcia, your special letter from Frankie is waiting! 💌✨";
  } else if (totalCompleted >= 15) {
    mafcikSpeech = "We're in the Grand Finale! Almost at the end of this magical night, Julcia! 🎆";
  } else if (totalCompleted >= 10) {
    mafcikSpeech = "Halfway through the carnival! You're brilliant at these, Julcia! 🧁✨";
  } else if (totalCompleted >= 5) {
    mafcikSpeech = "Look at all those stamps! The Moonlit Midway is all lit up for you! 🎡";
  }

  return (
    <div className="min-h-screen py-8 px-3 sm:px-6 max-w-5xl mx-auto w-full text-white">
      {/* Map Header */}
      <div className="relative mb-8 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-400/40 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          The Illustrated Fairground
        </div>

        <h2 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-pink-300 via-purple-200 to-amber-200 bg-clip-text text-transparent">
          Carnival Attractions Map
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mt-1">
          Follow the lantern path through four enchanted zones. Complete each attraction to collect its unique stamp!
        </p>

        {/* Progress bar card with Mafcik */}
        <div className="mt-6 p-4 sm:p-5 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-pink-500/30 shadow-xl max-w-xl mx-auto flex flex-col sm:flex-row items-center gap-4 text-left">
          <div className="shrink-0">
            <MafcikMascot
              mood={totalCompleted >= 20 ? 'cheering' : totalCompleted > 0 ? 'happy' : 'winking'}
              size="md"
              showNameTag={true}
            />
          </div>

          <div className="flex-1 w-full">
            <div className="text-xs text-pink-200 font-medium mb-1.5 italic bg-white/5 p-2 rounded-xl border border-white/10">
              "{mafcikSpeech}"
            </div>

            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className="text-slate-300">Adventure Progress</span>
              <span className="text-pink-300">{totalCompleted} / 20 Completed</span>
            </div>

            {/* Progress Meter */}
            <div className="w-full h-3 rounded-full bg-slate-800 border border-slate-700 overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-amber-400 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(236,72,153,0.8)]"
                style={{ width: `${(totalCompleted / 20) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4 Themed Carnival Zones */}
      <div className="space-y-10">
        {ZONES.map((zone) => {
          const zoneGames = GAME_CATALOG.filter((g) => g.zoneId === zone.id);
          const zoneCompleted = zoneGames.filter((g) => completedSet.has(g.id)).length;

          return (
            <section
              key={zone.id}
              className={`rounded-3xl p-4 sm:p-6 bg-gradient-to-b ${zone.gradient} border border-white/10 shadow-2xl relative overflow-hidden`}
            >
              {/* Zone Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-xl shadow-inner">
                    {zone.icon}
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                      {zone.name}
                    </h3>
                    <p className="text-xs text-slate-300">{zone.tagline}</p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold bg-white/5 border border-white/10 text-slate-200">
                  <span>Zone Progress:</span>
                  <span className="text-pink-300">{zoneCompleted}/5</span>
                </div>
              </div>

              {/* 5 Game Stalls in this Zone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                {zoneGames.map((game) => {
                  const isCompleted = completedSet.has(game.id);
                  const isUnlocked = game.id <= unlockedGameId || isCompleted;

                  return (
                    <button
                      key={game.id}
                      onClick={() => {
                        if (isUnlocked) {
                          sound.playClick();
                          onSelectGame(game.id);
                        }
                      }}
                      disabled={!isUnlocked}
                      className={`text-left rounded-2xl p-4 transition-all duration-200 relative flex flex-col justify-between min-h-[140px] group ${
                        isCompleted
                          ? 'bg-gradient-to-br from-emerald-950/40 to-slate-900/80 border border-emerald-500/40 hover:border-emerald-400 shadow-md hover:shadow-emerald-500/20 active:scale-98'
                          : isUnlocked
                          ? 'bg-gradient-to-br from-pink-950/40 via-purple-950/30 to-slate-900/80 border border-pink-500/50 hover:border-pink-400 shadow-lg hover:shadow-pink-500/30 active:scale-98 cursor-pointer ring-1 ring-pink-500/30'
                          : 'bg-slate-900/40 border border-white/5 opacity-55 cursor-not-allowed'
                      }`}
                      aria-label={`Stall ${game.id}: ${game.title}. ${
                        isCompleted ? 'Completed' : isUnlocked ? 'Unlocked and playable' : 'Locked'
                      }`}
                    >
                      {/* Top Bar: Stall Number & Status */}
                      <div className="flex items-center justify-between w-full mb-2">
                        <span className="text-[11px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                          Stall #{game.id}
                        </span>

                        {isCompleted ? (
                          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Stamp</span>
                          </div>
                        ) : isUnlocked ? (
                          <div className="flex items-center gap-1 text-[11px] font-bold text-pink-300 bg-pink-500/20 px-2 py-0.5 rounded-full border border-pink-400/30 animate-pulse">
                            <Play className="w-3 h-3 fill-pink-300" />
                            <span>Play</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">
                            <Lock className="w-3 h-3" />
                            <span>Locked</span>
                          </div>
                        )}
                      </div>

                      {/* Title & Ticket icon */}
                      <div className="my-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">{game.ticketIcon}</span>
                          <h4 className="text-sm font-extrabold text-white group-hover:text-pink-200 transition-colors line-clamp-1">
                            {game.title}
                          </h4>
                        </div>
                        <p className="text-[11px] text-slate-300/80 line-clamp-2 leading-snug">
                          {game.subtitle}
                        </p>
                      </div>

                      {/* Footer Badge */}
                      <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                        <span>{game.ticketName.replace(' Stamp', '')}</span>
                        {isUnlocked && <span className="text-pink-300 font-bold group-hover:translate-x-1 transition-transform">→</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Special Heartfelt Letter Pavilion at the end of the fairground */}
      <div className="mt-12 rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-pink-950/60 via-purple-950/50 to-amber-950/60 border-2 border-amber-400/40 shadow-2xl text-center relative overflow-hidden">
        <div className="max-w-md mx-auto">
          <div className="w-14 h-14 rounded-3xl bg-amber-500/20 border border-amber-400/50 text-amber-300 flex items-center justify-center text-2xl mx-auto mb-3 shadow-[0_0_20px_rgba(251,191,36,0.3)]">
            💌
          </div>

          <h3 className="text-2xl font-black text-amber-200 mb-2">
            The Starlit Pavilion &amp; Frankie's Letter
          </h3>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-5">
            {totalCompleted === 20
              ? 'All 20 games are solved! The lanterns shine bright over the quiet pavilion where Frankie has written a heartfelt letter just for you.'
              : `A special handwritten letter awaits Julcia once all 20 attractions are completed (${totalCompleted}/20 collected so far). You may also preview it early from the menu.`}
          </p>

          <button
            onClick={() => {
              sound.playSparkle();
              onOpenLetter();
            }}
            className="py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 hover:from-amber-300 hover:to-purple-500 text-slate-950 font-black text-sm shadow-[0_0_25px_rgba(251,191,36,0.4)] inline-flex items-center gap-2 active:scale-95 transition-all"
          >
            <Mail className="w-4 h-4 text-slate-950" />
            <span>Open Frankie's Letter</span>
            <Sparkles className="w-4 h-4 text-slate-950" />
          </button>
        </div>
      </div>
    </div>
  );
};
