import React, { useState } from 'react';
import { GameShell } from '../common/GameShell';
import { GAME_CATALOG } from '../../game/catalog';
import {
  checkCloudHopWin,
  CLOUD_HOP_TARGET_STEPS,
  checkWishesSortWin,
  validateShootingStarWishesDetailed,
  WishesValidationResult,
  NIGHT_WISHES,
  DAY_WISHES,
  checkHiddenTreasuresWin,
  CARNIVAL_TREASURES,
  checkGoldenKeyWin,
  GoldenKeyProgress,
  checkFinalParadeWin,
  ParadeProgress,
} from '../../game/rules';
import { sound } from '../../utils/audio';
import { Sparkles, Check, Heart, Lock, Key, Award } from 'lucide-react';
import { MafcikMascot } from '../common/MafcikMascot';

interface GameProps {
  onWin: () => void;
  onBackToMap: () => void;
  onNextGame: () => void;
}

// -------------------------------------------------------------
// GAME 16: Cloud Hop
// -------------------------------------------------------------
interface HopStep {
  clue: string;
  choices: Array<{ label: string; icon: string; isCorrect: boolean }>;
}

export const Game16CloudHop: React.FC<GameProps> = ({ onWin, onBackToMap, onNextGame }) => {
  const game = GAME_CATALOG[15];
  const [currentStep, setCurrentStep] = useState(0); // 0 to 5
  const [feedback, setFeedback] = useState<string | null>(null);

  const isWon = checkCloudHopWin(currentStep, CLOUD_HOP_TARGET_STEPS);

  const hopSteps: HopStep[] = [
    {
      clue: 'Step 1: Hop towards the glowing Star Cloud ⭐',
      choices: [
        { label: 'Star Cloud', icon: '⭐', isCorrect: true },
        { label: 'Rain Cloud', icon: '🌧️', isCorrect: false },
      ],
    },
    {
      clue: 'Step 2: Leap to the warm Pink Cotton Cloud 🌸',
      choices: [
        { label: 'Grey Mist', icon: '🌫️', isCorrect: false },
        { label: 'Pink Cloud', icon: '🌸', isCorrect: true },
      ],
    },
    {
      clue: 'Step 3: Glide toward the Crescent Moon Cloud 🌙',
      choices: [
        { label: 'Crescent Cloud', icon: '🌙', isCorrect: true },
        { label: 'Wind Cloud', icon: '💨', isCorrect: false },
      ],
    },
    {
      clue: 'Step 4: Spring onto the Mint Green Cloud 🍀',
      choices: [
        { label: 'Mint Cloud', icon: '🍀', isCorrect: true },
        { label: 'Stone Cloud', icon: '🪨', isCorrect: false },
      ],
    },
    {
      clue: 'Step 5: Final hop to the Rainbow Pavilion Cloud 🌈',
      choices: [
        { label: 'Fog Cloud', icon: '🌫️', isCorrect: false },
        { label: 'Rainbow Cloud', icon: '🌈', isCorrect: true },
      ],
    },
  ];

  const handleHop = (isCorrect: boolean) => {
    if (isWon) return;

    if (isCorrect) {
      sound.playSparkle();
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setFeedback('Soft puppy landing! Well hopped!');
      if (checkCloudHopWin(nextStep, CLOUD_HOP_TARGET_STEPS)) {
        onWin();
      }
    } else {
      sound.playTone(280, 'sine', 0.2);
      setFeedback('Gentle breeze blew Mafcik back to this cloud. Try the other!');
    }
  };

  const resetRound = () => {
    setCurrentStep(0);
    setFeedback(null);
  };

  const activeHop = hopSteps[Math.min(currentStep, hopSteps.length - 1)];

  return (
    <GameShell
      game={game}
      isWon={isWon}
      onResetRound={resetRound}
      onBackToMap={onBackToMap}
      onNextGame={onNextGame}
      mafcikSpeech={isWon ? "Mafcik reached the cloud summit with you, Julcia!" : "Help me choose the right pastel cloud to hop on next!"}
    >
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Step Progress */}
        <div className="mb-4 px-4 py-1.5 rounded-2xl bg-purple-500/20 border border-purple-400/40 text-xs font-bold text-purple-200">
          Cloud Hop: Step <span className="text-white font-black">{Math.min(currentStep + 1, 5)}</span> of 5
        </div>

        {/* Current Sky Clue */}
        <div className="w-full p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center mb-6">
          <p className="text-sm font-bold text-amber-200">{activeHop.clue}</p>
        </div>

        {/* Cloud Choices */}
        <div className="flex justify-center gap-4 sm:gap-6 w-full mb-6">
          {activeHop.choices.map((choice, i) => (
            <button
              key={i}
              onClick={() => handleHop(choice.isCorrect)}
              disabled={isWon}
              className="flex-1 py-6 px-4 rounded-3xl bg-gradient-to-b from-white/15 to-white/5 border-2 border-white/20 hover:border-pink-300 hover:scale-105 transition-all flex flex-col items-center justify-center shadow-lg active:scale-95 group"
            >
              <span className="text-4xl sm:text-5xl mb-2 group-hover:animate-bounce">{choice.icon}</span>
              <span className="text-xs font-bold text-white">{choice.label}</span>
            </button>
          ))}
        </div>

        {feedback && (
          <p className="text-xs font-semibold text-pink-200 animate-fade-in text-center">
            {feedback}
          </p>
        )}
      </div>
    </GameShell>
  );
};

// -------------------------------------------------------------
// GAME 17: Shooting Star Wishes (Constellation Sorting)
// -------------------------------------------------------------
export const Game17StarWishes: React.FC<GameProps> = ({ onWin, onBackToMap, onNextGame }) => {
  const game = GAME_CATALOG[16];
  const allWishes = [...NIGHT_WISHES, ...DAY_WISHES];

  const [unassigned, setUnassigned] = useState<string[]>(allWishes);
  const [nightSlot, setNightSlot] = useState<string[]>([]);
  const [daySlot, setDaySlot] = useState<string[]>([]);
  const [validation, setValidation] = useState<WishesValidationResult | null>(null);

  const isWon = validation?.isWin ?? false;

  const moveTo = (wish: string, target: 'night' | 'day' | 'unassigned') => {
    if (isWon) return;
    sound.playClick();
    setValidation(null); // Clear previous check on change

    const nextUn = unassigned.filter((w) => w !== wish);
    const nextNight = nightSlot.filter((w) => w !== wish);
    const nextDay = daySlot.filter((w) => w !== wish);

    if (target === 'night') nextNight.push(wish);
    else if (target === 'day') nextDay.push(wish);
    else nextUn.push(wish);

    setUnassigned(nextUn);
    setNightSlot(nextNight);
    setDaySlot(nextDay);
  };

  const handleCheck = () => {
    sound.playClick();
    const res = validateShootingStarWishesDetailed(nightSlot, daySlot);
    setValidation(res);

    if (res.isWin) {
      sound.playSparkle();
      onWin();
    } else {
      sound.playTone(320, 'sine', 0.2);
    }
  };

  const resetRound = () => {
    setUnassigned(allWishes);
    setNightSlot([]);
    setDaySlot([]);
    setValidation(null);
  };

  const allPlaced = nightSlot.length + daySlot.length === 6;

  return (
    <GameShell
      game={game}
      isWon={isWon}
      onResetRound={resetRound}
      onBackToMap={onBackToMap}
      onNextGame={onNextGame}
      mafcikSpeech={
        isWon
          ? "Both constellations glitter with harmonious wishes, Julcia!"
          : "Sort each wish into Night (dreams & rest) or Day (adventures & laughter), then press Check Answer!"
      }
    >
      <div className="w-full max-w-xl flex flex-col items-center">
        {/* Instructions strip */}
        <div className="w-full p-3 rounded-2xl bg-white/5 border border-purple-500/20 text-center mb-4">
          <p className="text-xs text-purple-200">
            🌙 <strong>Night Wishes:</strong> Quiet dreams, sweet rest &amp; coziness<br />
            ☀️ <strong>Day Wishes:</strong> Outdoor adventures, dancing &amp; sunny laughter
          </p>
        </div>

        {/* Unassigned Wishes Pool */}
        {unassigned.length > 0 && (
          <div className="w-full p-4 rounded-2xl bg-slate-900/90 border border-white/10 mb-5 text-center">
            <div className="text-xs font-bold text-amber-200 uppercase tracking-wider mb-3 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Available Wishes ({unassigned.length} remaining)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {unassigned.map((w) => (
                <div
                  key={w}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10"
                >
                  <span className="text-xs font-bold text-white text-left pl-1">✨ {w}</span>
                  <div className="flex gap-1.5 shrink-0">
                    <button
                      onClick={() => moveTo(w, 'night')}
                      className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-[11px] font-bold text-white shadow-sm active:scale-95 transition-all"
                      aria-label={`Move ${w} to Night Wishes`}
                    >
                      🌙 Night
                    </button>
                    <button
                      onClick={() => moveTo(w, 'day')}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-[11px] font-bold text-white shadow-sm active:scale-95 transition-all"
                      aria-label={`Move ${w} to Day Wishes`}
                    >
                      ☀️ Day
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* The Two Constellations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-5">
          {/* Night Constellation */}
          <div className="p-4 rounded-3xl bg-indigo-950/50 border-2 border-indigo-500/40 min-h-[220px] flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-indigo-400/20 text-xs font-bold text-indigo-300">
                <span className="flex items-center gap-1.5">
                  <span className="text-base">🌙</span> Night Constellation
                </span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 font-mono">
                  {nightSlot.length}/3
                </span>
              </div>

              <div className="space-y-2">
                {nightSlot.length === 0 ? (
                  <div className="py-8 text-center text-xs text-indigo-300/40 italic border border-dashed border-indigo-400/20 rounded-2xl">
                    Assign 3 night wishes here
                  </div>
                ) : (
                  nightSlot.map((w) => {
                    const isIncorrect = validation && validation.nightIncorrect.includes(w);
                    const isCorrect = validation && validation.nightCorrect.includes(w);

                    return (
                      <div
                        key={w}
                        className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                          isCorrect
                            ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200'
                            : isIncorrect
                            ? 'bg-red-950/60 border-red-400 text-red-200'
                            : 'bg-indigo-900/60 border-indigo-400/30 text-white'
                        }`}
                      >
                        <div>
                          <div className="font-bold flex items-center gap-1.5">
                            <span>⭐</span>
                            <span>{w}</span>
                          </div>
                          {isIncorrect && (
                            <div className="text-[10px] text-red-300 font-semibold mt-0.5">
                              Belongs in Day Wishes ☀️
                            </div>
                          )}
                          {isCorrect && (
                            <div className="text-[10px] text-emerald-300 font-semibold mt-0.5">
                              ✓ Perfect fit!
                            </div>
                          )}
                        </div>

                        {!isWon && (
                          <div className="flex gap-1 shrink-0 ml-2">
                            <button
                              onClick={() => moveTo(w, 'day')}
                              className="px-2 py-1 rounded-lg bg-amber-600/70 hover:bg-amber-600 text-[10px] font-bold text-white transition-colors"
                              title="Move to Day Constellation"
                            >
                              → Day
                            </button>
                            <button
                              onClick={() => moveTo(w, 'unassigned')}
                              className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] font-bold text-slate-300 transition-colors"
                              title="Return to available pool"
                            >
                              ↩
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Day Constellation */}
          <div className="p-4 rounded-3xl bg-amber-950/50 border-2 border-amber-500/40 min-h-[220px] flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-amber-400/20 text-xs font-bold text-amber-300">
                <span className="flex items-center gap-1.5">
                  <span className="text-base">☀️</span> Day Constellation
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/30 font-mono">
                  {daySlot.length}/3
                </span>
              </div>

              <div className="space-y-2">
                {daySlot.length === 0 ? (
                  <div className="py-8 text-center text-xs text-amber-300/40 italic border border-dashed border-amber-400/20 rounded-2xl">
                    Assign 3 day wishes here
                  </div>
                ) : (
                  daySlot.map((w) => {
                    const isIncorrect = validation && validation.dayIncorrect.includes(w);
                    const isCorrect = validation && validation.dayCorrect.includes(w);

                    return (
                      <div
                        key={w}
                        className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                          isCorrect
                            ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200'
                            : isIncorrect
                            ? 'bg-red-950/60 border-red-400 text-red-200'
                            : 'bg-amber-900/60 border-amber-400/30 text-white'
                        }`}
                      >
                        <div>
                          <div className="font-bold flex items-center gap-1.5">
                            <span>✨</span>
                            <span>{w}</span>
                          </div>
                          {isIncorrect && (
                            <div className="text-[10px] text-red-300 font-semibold mt-0.5">
                              Belongs in Night Wishes 🌙
                            </div>
                          )}
                          {isCorrect && (
                            <div className="text-[10px] text-emerald-300 font-semibold mt-0.5">
                              ✓ Perfect fit!
                            </div>
                          )}
                        </div>

                        {!isWon && (
                          <div className="flex gap-1 shrink-0 ml-2">
                            <button
                              onClick={() => moveTo(w, 'night')}
                              className="px-2 py-1 rounded-lg bg-indigo-600/70 hover:bg-indigo-600 text-[10px] font-bold text-white transition-colors"
                              title="Move to Night Constellation"
                            >
                              → Night
                            </button>
                            <button
                              onClick={() => moveTo(w, 'unassigned')}
                              className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] font-bold text-slate-300 transition-colors"
                              title="Return to available pool"
                            >
                              ↩
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Message if any */}
        {validation && (
          <div
            className={`w-full p-3 rounded-2xl text-xs font-semibold text-center mb-4 border animate-fade-in ${
              validation.isWin
                ? 'bg-emerald-950/50 border-emerald-400 text-emerald-200'
                : 'bg-amber-950/50 border-amber-400 text-amber-200'
            }`}
          >
            {validation.feedbackMessage}
          </div>
        )}

        {/* Dedicated CHECK ANSWER button */}
        {!isWon && (
          <button
            onClick={handleCheck}
            disabled={!allPlaced}
            className={`w-full sm:w-72 py-3.5 px-6 rounded-2xl font-black text-sm tracking-wider uppercase transition-all shadow-xl flex items-center justify-center gap-2 ${
              allPlaced
                ? 'bg-gradient-to-r from-pink-500 via-purple-600 to-amber-400 hover:brightness-110 text-white shadow-purple-500/30 active:scale-95 cursor-pointer ring-2 ring-pink-400/40'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
            }`}
            aria-label="Check sorted wishes answer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Check Answer</span>
            <Sparkles className="w-4 h-4" />
          </button>
        )}
      </div>
    </GameShell>
  );
};

// -------------------------------------------------------------
// GAME 18: Hidden Carnival Treasures
// -------------------------------------------------------------
export const Game18HiddenTreasures: React.FC<GameProps> = ({ onWin, onBackToMap, onNextGame }) => {
  const game = GAME_CATALOG[17];
  const [foundIds, setFoundIds] = useState<string[]>([]);

  const isWon = checkHiddenTreasuresWin(foundIds);

  const items = [
    { id: 'golden-ticket', name: 'Golden Ticket', icon: '🎟️', x: '18%', y: '25%' },
    { id: 'sugar-wand', name: 'Spun Sugar Wand', icon: '🪄', x: '78%', y: '22%' },
    { id: 'star-balloon', name: 'Star Balloon', icon: '🎈', x: '45%', y: '18%' },
    { id: 'brass-key', name: 'Brass Key', icon: '🗝️', x: '22%', y: '72%' },
    { id: 'tiny-bell', name: 'Tiny Bell', icon: '🔔', x: '52%', y: '78%' },
    { id: 'mafcik-bowtie', name: "Mafcik's Ribbon", icon: '🎀', x: '82%', y: '68%' },
  ];

  const handleItemClick = (id: string) => {
    if (isWon || foundIds.includes(id)) return;
    sound.playSparkle();
    const next = [...foundIds, id];
    setFoundIds(next);
    if (checkHiddenTreasuresWin(next)) {
      onWin();
    }
  };

  const resetRound = () => {
    setFoundIds([]);
  };

  return (
    <GameShell
      game={game}
      isWon={isWon}
      onResetRound={resetRound}
      onBackToMap={onBackToMap}
      onNextGame={onNextGame}
      mafcikSpeech={isWon ? "Every hidden treasure discovered in the night scenery!" : "Tap the hidden treasures tucked inside this carnival pavilion scene!"}
    >
      <div className="w-full max-w-lg flex flex-col items-center">
        {/* Scene Container */}
        <div className="relative w-full h-64 sm:h-76 rounded-3xl bg-gradient-to-b from-indigo-950/90 via-purple-950/70 to-slate-950 border border-pink-500/30 overflow-hidden shadow-2xl my-2">
          {/* Decorative fairground backdrop SVG elements */}
          <div className="absolute bottom-0 w-full h-24 bg-purple-900/30 rounded-t-full border-t border-purple-500/20" />
          <div className="absolute top-4 left-6 text-3xl opacity-20">🎪</div>
          <div className="absolute top-8 right-8 text-4xl opacity-20">🎡</div>

          {/* Hidden Objects with Large Accessible Click targets */}
          {items.map((item) => {
            const isFound = foundIds.includes(item.id);

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                disabled={isFound}
                className={`absolute w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all transform -translate-x-1/2 -translate-y-1/2 cursor-pointer ${
                  isFound
                    ? 'bg-emerald-500/40 border-2 border-emerald-400 scale-110 shadow-[0_0_15px_#34d399]'
                    : 'hover:scale-125 hover:bg-white/10 active:scale-95'
                }`}
                style={{ left: item.x, top: item.y }}
                aria-label={`Find ${item.name}`}
              >
                <span>{item.icon}</span>
                {isFound && <span className="absolute -top-1 -right-1 text-emerald-300 text-xs font-bold">✓</span>}
              </button>
            );
          })}
        </div>

        {/* Checklist */}
        <div className="grid grid-cols-3 gap-2 w-full mt-3">
          {items.map((item) => {
            const isFound = foundIds.includes(item.id);
            return (
              <div
                key={item.id}
                className={`p-2 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 ${
                  isFound
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : 'bg-white/5 border-white/10 text-slate-400'
                }`}
              >
                <span>{item.icon}</span>
                <span className="line-clamp-1">{item.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </GameShell>
  );
};

// -------------------------------------------------------------
// GAME 19: Golden Key (3-Step Lock)
// -------------------------------------------------------------
export const Game19GoldenKey: React.FC<GameProps> = ({ onWin, onBackToMap, onNextGame }) => {
  const game = GAME_CATALOG[18];
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [progress, setProgress] = useState<GoldenKeyProgress>({
    symbolMatched: false,
    gemsOrdered: false,
    silhouetteChosen: false,
  });

  const isWon = checkGoldenKeyWin(progress);

  // Step 1: Symbol Match
  const handleSymbolChoice = (isCorrect: boolean) => {
    if (isCorrect) {
      sound.playSparkle();
      const updated = { ...progress, symbolMatched: true };
      setProgress(updated);
      setStep(2);
    } else {
      sound.playTone(300, 'sine', 0.15);
    }
  };

  // Step 2: Gem Order (Rose, Gold, Mint)
  const [gemSlots, setGemSlots] = useState<string[]>([]);
  const handleGemClick = (color: string) => {
    sound.playClick();
    const next = [...gemSlots, color];
    setGemSlots(next);

    if (next.length === 3) {
      if (next[0] === 'rose' && next[1] === 'gold' && next[2] === 'mint') {
        sound.playSparkle();
        const updated = { ...progress, gemsOrdered: true };
        setProgress(updated);
        setStep(3);
      } else {
        setTimeout(() => setGemSlots([]), 500);
      }
    }
  };

  // Step 3: Key Silhouette (Heart bow key is correct)
  const handleKeyChoice = (isCorrect: boolean) => {
    if (isCorrect) {
      sound.playWin();
      const updated = { ...progress, silhouetteChosen: true };
      setProgress(updated);
      onWin();
    } else {
      sound.playTone(300, 'sine', 0.15);
    }
  };

  const resetRound = () => {
    setStep(1);
    setProgress({ symbolMatched: false, gemsOrdered: false, silhouetteChosen: false });
    setGemSlots([]);
  };

  return (
    <GameShell
      game={game}
      isWon={isWon}
      onResetRound={resetRound}
      onBackToMap={onBackToMap}
      onNextGame={onNextGame}
      mafcikSpeech={isWon ? "Click! The golden pavilion lock swings open!" : "Unlock all three mechanical seals step by step!"}
    >
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Step Indicator */}
        <div className="flex gap-2 mb-4 w-full">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 py-1.5 rounded-xl border text-[10px] font-bold text-center ${
                step === s
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : s < step
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                  : 'bg-white/5 border-white/10 text-slate-500'
              }`}
            >
              Seal #{s}
            </div>
          ))}
        </div>

        {/* Challenge Step 1 */}
        {step === 1 && (
          <div className="w-full p-4 rounded-3xl bg-slate-900 border border-white/10 text-center animate-fade-in">
            <h4 className="text-sm font-bold text-amber-200 mb-2">Seal 1: Match the Ancient Star Compass</h4>
            <p className="text-xs text-slate-300 mb-4">Select the symbol that matches the carnival seal:</p>
            <div className="flex justify-center gap-3">
              {[
                { name: 'Anchor', icon: '⚓', isCorrect: false },
                { name: 'Star Compass', icon: '🧭', isCorrect: true },
                { name: 'Hourglass', icon: '⌛', isCorrect: false },
              ].map((sym) => (
                <button
                  key={sym.name}
                  onClick={() => handleSymbolChoice(sym.isCorrect)}
                  className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-3xl active:scale-95 transition-all"
                  aria-label={sym.name}
                >
                  {sym.icon}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Challenge Step 2 */}
        {step === 2 && (
          <div className="w-full p-4 rounded-3xl bg-slate-900 border border-white/10 text-center animate-fade-in">
            <h4 className="text-sm font-bold text-amber-200 mb-2">Seal 2: Order Three Glowing Crystals</h4>
            <p className="text-xs text-slate-300 mb-4">Tap in order: Rose Pink, Champagne Gold, Mint Green</p>

            <div className="flex justify-center gap-3 mb-4">
              {['rose', 'gold', 'mint'].map((col) => (
                <button
                  key={col}
                  onClick={() => handleGemClick(col)}
                  className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center text-xl active:scale-95 transition-all ${
                    col === 'rose'
                      ? 'bg-pink-500 border-pink-300'
                      : col === 'gold'
                      ? 'bg-amber-400 border-amber-200'
                      : 'bg-emerald-400 border-emerald-200'
                  }`}
                  aria-label={col}
                >
                  💎
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-400">
              Gems placed: {gemSlots.length} / 3
            </div>
          </div>
        )}

        {/* Challenge Step 3 */}
        {step === 3 && (
          <div className="w-full p-4 rounded-3xl bg-slate-900 border border-white/10 text-center animate-fade-in">
            <h4 className="text-sm font-bold text-amber-200 mb-2">Seal 3: Choose the Key Silhouette</h4>
            <p className="text-xs text-slate-300 mb-4">Pick the key with the heart bow that fits the heart lock:</p>

            <div className="flex justify-center gap-4">
              {[
                { label: 'Square Key', icon: '🔑', isCorrect: false },
                { label: 'Heart Key', icon: '🗝️', isCorrect: true },
                { label: 'Oval Key', icon: '🗝', isCorrect: false },
              ].map((k) => (
                <button
                  key={k.label}
                  onClick={() => handleKeyChoice(k.isCorrect)}
                  className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-3xl active:scale-95 transition-all"
                  aria-label={k.label}
                >
                  {k.icon}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

// -------------------------------------------------------------
// GAME 20: The Final Parade (Grand Finale)
// -------------------------------------------------------------
export const Game20FinalParade: React.FC<GameProps> = ({ onWin, onBackToMap, onNextGame }) => {
  const game = GAME_CATALOG[19];
  const [progress, setProgress] = useState<ParadeProgress>({
    floatsLit: [false, false, false, false],
    bannerSelected: false,
    fireworksLaunched: false,
  });

  const isWon = checkFinalParadeWin(progress);

  const floatNames = ['Swan Float 🦢', 'Dragon Float 🐉', 'Carousel Float 🎠', 'Starlight Float ✨'];

  const handleFloatClick = (idx: number) => {
    sound.playSparkle();
    const nextFloats = [...progress.floatsLit];
    nextFloats[idx] = true;
    setProgress((prev) => ({ ...prev, floatsLit: nextFloats }));
  };

  const handleBannerSelect = () => {
    sound.playSparkle();
    setProgress((prev) => ({ ...prev, bannerSelected: true }));
  };

  const handleLaunchFireworks = () => {
    sound.playWin();
    const updated = { ...progress, fireworksLaunched: true };
    setProgress(updated);
    if (checkFinalParadeWin(updated)) {
      onWin();
    }
  };

  const resetRound = () => {
    setProgress({
      floatsLit: [false, false, false, false],
      bannerSelected: false,
      fireworksLaunched: false,
    });
  };

  const allFloatsLit = progress.floatsLit.every(Boolean);

  return (
    <GameShell
      game={game}
      isWon={isWon}
      onResetRound={resetRound}
      onBackToMap={onBackToMap}
      onNextGame={onNextGame}
      mafcikSpeech={isWon ? "Fireworks light up the entire midnight sky for Frankie & Julcia!" : "Prepare the parade: light the 4 floats, raise the banner, and launch fireworks!"}
    >
      <div className="w-full max-w-lg flex flex-col items-center">
        {/* Step 1: Floats */}
        <div className="w-full p-3 rounded-2xl bg-white/5 border border-white/10 mb-4 text-center">
          <div className="text-xs font-bold text-pink-300 uppercase tracking-wider mb-2">
            1. Light the 4 Grand Parade Floats
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {floatNames.map((name, i) => {
              const isLit = progress.floatsLit[i];
              return (
                <button
                  key={name}
                  onClick={() => handleFloatClick(i)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    isLit
                      ? 'bg-emerald-500 text-slate-950 border-emerald-300 shadow-[0_0_12px_#34d399]'
                      : 'bg-slate-800 border-white/10 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Banner */}
        <div className="w-full p-3 rounded-2xl bg-white/5 border border-white/10 mb-4 text-center">
          <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
            2. Choose the Grand Parade Banner
          </div>
          <button
            onClick={handleBannerSelect}
            disabled={!allFloatsLit}
            className={`w-full py-3 px-4 rounded-xl border-2 font-black text-sm tracking-wide transition-all ${
              progress.bannerSelected
                ? 'bg-amber-400 text-slate-950 border-white shadow-[0_0_20px_#fbbf24]'
                : allFloatsLit
                ? 'bg-slate-800 hover:bg-slate-700 border-amber-400/60 text-amber-200'
                : 'opacity-40 border-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            "FOR JULCIA WITH LOVE" 💖
          </button>
        </div>

        {/* Step 3: Launch Fireworks Button */}
        <button
          onClick={handleLaunchFireworks}
          disabled={!allFloatsLit || !progress.bannerSelected || isWon}
          className={`w-full py-4 rounded-2xl font-black text-base uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xl transition-all ${
            allFloatsLit && progress.bannerSelected && !isWon
              ? 'bg-gradient-to-r from-pink-500 via-purple-600 to-amber-400 text-white shadow-pink-500/50 hover:brightness-110 active:scale-95 animate-pulse'
              : 'opacity-40 bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <span>🎆</span>
          <span>Launch Grand Fireworks Display</span>
          <span>🎆</span>
        </button>
      </div>
    </GameShell>
  );
};
