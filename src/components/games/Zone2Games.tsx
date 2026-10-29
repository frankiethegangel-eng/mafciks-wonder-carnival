import React, { useState, useEffect, useRef } from 'react';
import { GameShell } from '../common/GameShell';
import { GAME_CATALOG } from '../../game/catalog';
import {
  checkRingTossWin,
  checkStarCatcherWin,
  checkWhackAMoleWin,
  checkFerrisWheelWin,
  FERRIS_TARGET_SEATS,
  checkDuckPondWin,
  REQUIRED_DUCK_SYMBOLS,
} from '../../game/rules';
import { sound } from '../../utils/audio';
import { ArrowLeft, ArrowRight, Sparkles, Check } from 'lucide-react';

interface GameProps {
  onWin: () => void;
  onBackToMap: () => void;
  onNextGame: () => void;
}

// -------------------------------------------------------------
// GAME 6: Ring Toss
// -------------------------------------------------------------
export const Game6RingToss: React.FC<GameProps> = ({ onWin, onBackToMap, onNextGame }) => {
  const game = GAME_CATALOG[5];
  const [landed, setLanded] = useState({ left: false, center: false, right: false });
  const [selectedBottle, setSelectedBottle] = useState<'left' | 'center' | 'right'>('center');
  const [isTossing, setIsTossing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const isWon = checkRingTossWin(landed);

  const handleToss = () => {
    if (isTossing || isWon) return;
    setIsTossing(true);
    sound.playTone(350, 'sine', 0.15);

    setTimeout(() => {
      sound.playSparkle();
      const updated = { ...landed, [selectedBottle]: true };
      setLanded(updated);
      setFeedback(`Direct hit on the ${selectedBottle} bottle!`);
      setIsTossing(false);

      if (checkRingTossWin(updated)) {
        onWin();
      } else {
        // Auto pick next unlanded bottle for convenience
        if (!updated.left) setSelectedBottle('left');
        else if (!updated.center) setSelectedBottle('center');
        else if (!updated.right) setSelectedBottle('right');
      }
    }, 450);
  };

  const resetRound = () => {
    setLanded({ left: false, center: false, right: false });
    setSelectedBottle('center');
    setIsTossing(false);
    setFeedback(null);
  };

  return (
    <GameShell
      game={game}
      isWon={isWon}
      onResetRound={resetRound}
      onBackToMap={onBackToMap}
      onNextGame={onNextGame}
      mafcikSpeech={isWon ? "Bullseye! All three bottles are crowned with gold rings!" : "Select a bottle and toss your ring! Unlimited retries!"}
    >
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Bottles Stand */}
        <div className="grid grid-cols-3 gap-4 sm:gap-6 w-full my-4">
          {(['left', 'center', 'right'] as const).map((pos) => {
            const hasRing = landed[pos];
            const isSelected = selectedBottle === pos;

            return (
              <button
                key={pos}
                onClick={() => {
                  sound.playClick();
                  setSelectedBottle(pos);
                }}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center relative ${
                  isSelected
                    ? 'border-amber-400 bg-amber-950/40 shadow-[0_0_20px_#fbbf2444] scale-105'
                    : 'border-white/10 bg-slate-900/60 hover:border-white/20'
                }`}
                aria-label={`${pos} bottle. ${hasRing ? 'Ring landed' : 'Empty'}`}
              >
                <div className="text-[10px] uppercase font-bold text-slate-400 mb-2 capitalize">
                  {pos} Bottle
                </div>

                {/* Bottle SVG / illustration */}
                <div className="relative w-12 h-24 flex items-center justify-center">
                  <div className="w-6 h-20 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-lg rounded-b-2xl border border-emerald-300 shadow-md relative" />
                  <div className="w-3 h-5 bg-emerald-500 rounded-t-sm absolute top-0" />

                  {/* Golden Ring over bottle */}
                  {hasRing && (
                    <div className="absolute top-10 w-14 h-6 border-4 border-amber-300 rounded-full shadow-[0_0_12px_#fde047] transform -rotate-6 animate-bounce" />
                  )}
                </div>

                <div className="mt-3 text-xs font-bold">
                  {hasRing ? (
                    <span className="text-emerald-400">✓ Ringed</span>
                  ) : (
                    <span className="text-slate-400">Target</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Toss Button */}
        <button
          onClick={handleToss}
          disabled={isTossing || isWon}
          className="mt-4 w-full sm:w-64 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 hover:brightness-110 font-black text-sm text-slate-950 shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span>⭕</span>
          <span>{isTossing ? 'Tossing Ring...' : `Toss Ring at ${selectedBottle.toUpperCase()}`}</span>
        </button>

        {feedback && (
          <p className="mt-4 text-xs font-semibold text-amber-200 animate-fade-in text-center">
            {feedback}
          </p>
        )}
      </div>
    </GameShell>
  );
};

// -------------------------------------------------------------
// GAME 7: Star Catcher (rAF Basket)
// -------------------------------------------------------------
interface StarObj {
  id: number;
  x: number; // percentage (0 to 90)
  y: number; // percentage (0 to 100)
  speed: number;
}

export const Game7StarCatcher: React.FC<GameProps> = ({ onWin, onBackToMap, onNextGame }) => {
  const game = GAME_CATALOG[6];
  const [basketX, setBasketX] = useState(50); // percentage
  const [caughtCount, setCaughtCount] = useState(0);
  const [stars, setStars] = useState<StarObj[]>([
    { id: 1, x: 20, y: 10, speed: 0.35 },
    { id: 2, x: 60, y: 40, speed: 0.3 },
  ]);

  const caughtRef = useRef(caughtCount);
  caughtRef.current = caughtCount;
  const isWon = checkStarCatcherWin(caughtCount, 5);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setBasketX((x) => Math.max(10, x - 8));
      } else if (e.key === 'ArrowRight') {
        setBasketX((x) => Math.min(90, x + 8));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Animation Frame Loop for falling stars
  useEffect(() => {
    if (isWon) return;
    let animId: number;

    const loop = () => {
      setStars((prev) => {
        return prev.map((s) => {
          let nextY = s.y + s.speed;
          // Check collision with basket when near bottom (80-92% y, within 15% x)
          if (nextY >= 80 && nextY <= 92 && Math.abs(s.x - basketX) < 16) {
            sound.playSparkle();
            const nextCount = caughtRef.current + 1;
            setCaughtCount(nextCount);
            if (checkStarCatcherWin(nextCount, 5)) {
              onWin();
            }
            // Respawn star at top with random x
            return { ...s, y: -5, x: Math.floor(15 + Math.random() * 70) };
          }
          // If star fell off bottom, respawn at top
          if (nextY > 100) {
            return { ...s, y: -5, x: Math.floor(15 + Math.random() * 70) };
          }
          return { ...s, y: nextY };
        });
      });
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [basketX, isWon, onWin]);

  const resetRound = () => {
    setBasketX(50);
    setCaughtCount(0);
    setStars([
      { id: 1, x: 25, y: 10, speed: 0.35 },
      { id: 2, x: 65, y: 40, speed: 0.3 },
    ]);
  };

  return (
    <GameShell
      game={game}
      isWon={isWon}
      onResetRound={resetRound}
      onBackToMap={onBackToMap}
      onNextGame={onNextGame}
      mafcikSpeech={isWon ? "Five starlight crystals collected in your velvet basket!" : "Move the basket left or right to catch 5 falling stars!"}
    >
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Score Meter */}
        <div className="mb-2 px-4 py-1.5 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-xs font-bold text-amber-200">
          Stars Caught: <span className="text-sm font-black text-white">{caughtCount}</span> / 5
        </div>

        {/* Sky Playfield */}
        <div className="relative w-full h-64 sm:h-72 rounded-3xl bg-gradient-to-b from-indigo-950/80 via-slate-900 to-slate-950 border border-pink-500/30 overflow-hidden shadow-inner select-none">
          {/* Falling Stars */}
          {stars.map((s) => (
            <div
              key={s.id}
              className="absolute text-2xl transition-transform"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              ⭐
            </div>
          ))}

          {/* Velvet Basket */}
          <div
            className="absolute bottom-4 flex flex-col items-center transition-all duration-75"
            style={{
              left: `${basketX}%`,
              transform: 'translateX(-50%)',
            }}
          >
            <div className="w-16 h-10 rounded-b-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 border-2 border-amber-300 shadow-[0_0_15px_#f472b688] flex items-center justify-center text-xs font-bold text-amber-100">
              🧺
            </div>
          </div>
        </div>

        {/* Mobile Left / Right Buttons */}
        <div className="flex gap-4 mt-4 w-full">
          <button
            onClick={() => setBasketX((x) => Math.max(10, x - 12))}
            className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center gap-2 font-bold text-sm active:scale-95 transition-all"
            aria-label="Move basket left"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Left</span>
          </button>
          <button
            onClick={() => setBasketX((x) => Math.min(90, x + 12))}
            className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center gap-2 font-bold text-sm active:scale-95 transition-all"
            aria-label="Move basket right"
          >
            <span>Right</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </GameShell>
  );
};

// -------------------------------------------------------------
// GAME 8: Friendly Whack-a-Mole (Star Tapping)
// -------------------------------------------------------------
export const Game8WhackAMole: React.FC<GameProps> = ({ onWin, onBackToMap, onNextGame }) => {
  const game = GAME_CATALOG[7];
  const [activeHole, setActiveHole] = useState<number>(0);
  const [starsCollected, setStarsCollected] = useState(0);

  const isWon = checkWhackAMoleWin(starsCollected, 5);

  // Friendly plushies rotate between 9 holes
  useEffect(() => {
    if (isWon) return;
    const interval = setInterval(() => {
      setActiveHole((prev) => (prev + 1) % 9);
    }, 1200);

    return () => clearInterval(interval);
  }, [isWon]);

  const handleTapStar = (holeIdx: number) => {
    if (isWon) return;
    if (holeIdx === activeHole) {
      sound.playSparkle();
      const updated = starsCollected + 1;
      setStarsCollected(updated);
      setActiveHole((holeIdx + 3) % 9); // Advance hole immediately
      if (checkWhackAMoleWin(updated, 5)) {
        onWin();
      }
    }
  };

  const resetRound = () => {
    setActiveHole(0);
    setStarsCollected(0);
  };

  return (
    <GameShell
      game={game}
      isWon={isWon}
      onResetRound={resetRound}
      onBackToMap={onBackToMap}
      onNextGame={onNextGame}
      mafcikSpeech={isWon ? "Mafcik's plushie friends gave you all their glowing stars!" : "Tap the bright stars my friends are holding up!"}
    >
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Score Header */}
        <div className="mb-4 px-4 py-1.5 rounded-2xl bg-pink-500/20 border border-pink-400/40 text-xs font-bold text-pink-200">
          Stars Collected: <span className="text-sm font-black text-white">{starsCollected}</span> / 5
        </div>

        {/* 3x3 Burrow Grid */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full">
          {Array.from({ length: 9 }).map((_, idx) => {
            const isPopUp = idx === activeHole;

            return (
              <div
                key={idx}
                className="h-24 sm:h-28 rounded-3xl bg-slate-900 border border-white/10 relative overflow-hidden flex flex-col items-center justify-end p-2 shadow-inner"
              >
                {/* Burrow mound */}
                <div className="w-full h-6 bg-slate-800 rounded-full border border-slate-700 absolute bottom-1" />

                {/* Friendly Plushie popping up */}
                {isPopUp && (
                  <div className="relative z-10 flex flex-col items-center animate-fade-in">
                    {/* Glowing Star to Tap */}
                    <button
                      onClick={() => handleTapStar(idx)}
                      className="w-10 h-10 rounded-full bg-amber-400 border-2 border-white shadow-[0_0_15px_#fbbf24] flex items-center justify-center text-lg active:scale-90 hover:scale-110 transition-transform cursor-pointer"
                      aria-label="Collect glowing star"
                    >
                      ⭐
                    </button>
                    {/* Cute Plush Puppy Friend */}
                    <span className="text-2xl mt-0.5 select-none">🐶</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </GameShell>
  );
};

// -------------------------------------------------------------
// GAME 9: Ferris Wheel Seats
// -------------------------------------------------------------
export const Game9FerrisWheelSeats: React.FC<GameProps> = ({ onWin, onBackToMap, onNextGame }) => {
  const game = GAME_CATALOG[8];
  // Initial scrambled seats
  const [seats, setSeats] = useState<Record<number, string>>({
    1: 'Bunny',
    2: 'Mafcik',
    3: 'Bear',
    4: 'Kitten',
  });
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);

  const isWon = checkFerrisWheelWin(seats);

  const characterIcons: Record<string, string> = {
    Mafcik: '🐶',
    Bear: '🧸',
    Bunny: '🐰',
    Kitten: '🐱',
  };

  const handleSeatClick = (seatNum: number) => {
    if (isWon) return;
    sound.playClick();

    if (selectedSeat === null) {
      setSelectedSeat(seatNum);
    } else {
      if (selectedSeat !== seatNum) {
        // Swap characters
        const temp = seats[seatNum];
        const updated = {
          ...seats,
          [seatNum]: seats[selectedSeat],
          [selectedSeat]: temp,
        };
        setSeats(updated);
        setSelectedSeat(null);
        if (checkFerrisWheelWin(updated)) {
          sound.playSparkle();
          onWin();
        }
      } else {
        setSelectedSeat(null);
      }
    }
  };

  const resetRound = () => {
    setSeats({
      1: 'Bunny',
      2: 'Mafcik',
      3: 'Bear',
      4: 'Kitten',
    });
    setSelectedSeat(null);
  };

  return (
    <GameShell
      game={game}
      isWon={isWon}
      onResetRound={resetRound}
      onBackToMap={onBackToMap}
      onNextGame={onNextGame}
      mafcikSpeech={isWon ? "Everyone is nestled happily in their perfect gondolas!" : "Read the clues: Mafcik sits at Seat 1, Bunny opposite in Seat 3!"}
    >
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Clues Card */}
        <div className="w-full p-3 rounded-2xl bg-white/5 border border-purple-500/30 text-center mb-6">
          <div className="text-[11px] font-bold text-purple-300 uppercase tracking-wider mb-1 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Positional Gondola Clues
          </div>
          <p className="text-xs text-slate-200">
            • <strong>Clue 1:</strong> Mafcik takes Seat 1 (top).<br />
            • <strong>Clue 2:</strong> Bunny sits directly opposite Mafcik in Seat 3.<br />
            • Bear in Seat 2, Kitten in Seat 4.
          </p>
        </div>

        {/* Circular Gondola Layout */}
        <div className="grid grid-cols-2 gap-4 w-full">
          {[1, 2, 3, 4].map((num) => {
            const char = seats[num];
            const isSelected = selectedSeat === num;
            const isTargetCorrect = char === FERRIS_TARGET_SEATS[num];

            return (
              <button
                key={num}
                onClick={() => handleSeatClick(num)}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center relative ${
                  isSelected
                    ? 'border-purple-400 bg-purple-950/40 shadow-[0_0_15px_#c084fc44] scale-102'
                    : 'border-white/10 bg-slate-900/60 hover:border-white/20'
                }`}
                aria-label={`Gondola #${num}: currently seated by ${char}`}
              >
                <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1">
                  Gondola #{num}
                </div>

                <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-3xl my-1 shadow-md">
                  {characterIcons[char]}
                </div>

                <div className="text-xs font-bold text-white mt-1">{char}</div>

                {isWon && (
                  <div className="text-[10px] text-emerald-400 font-bold mt-1">✓ Seated</div>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-4 text-xs text-slate-400 text-center">
          Tap two gondolas to swap their friends.
        </div>
      </div>
    </GameShell>
  );
};

// -------------------------------------------------------------
// GAME 10: Lucky Duck Pond
// -------------------------------------------------------------
export const Game10LuckyDuckPond: React.FC<GameProps> = ({ onWin, onBackToMap, onNextGame }) => {
  const game = GAME_CATALOG[9];

  const ducksInitial = [
    { id: 1, symbol: 'Crescent Moon', icon: '🌙', uncovered: false },
    { id: 2, symbol: 'Friendship Heart', icon: '💖', uncovered: false },
    { id: 3, symbol: 'Golden Star', icon: '⭐', uncovered: false },
    { id: 4, symbol: 'Little Bell', icon: '🔔', uncovered: false },
    { id: 5, symbol: 'Four-Leaf Clover', icon: '🍀', uncovered: false },
    { id: 6, symbol: 'Sweet Bow', icon: '🎀', uncovered: false },
  ];

  const [ducks, setDucks] = useState(ducksInitial);
  const uncoveredSymbols = ducks.filter((d) => d.uncovered).map((d) => d.symbol);

  const isWon = checkDuckPondWin(uncoveredSymbols);

  const handlePickDuck = (id: number) => {
    if (isWon) return;
    sound.playTone(420, 'sine', 0.15);
    const updated = ducks.map((d) => (d.id === id ? { ...d, uncovered: true } : d));
    setDucks(updated);

    const newUncovered = updated.filter((d) => d.uncovered).map((d) => d.symbol);
    if (checkDuckPondWin(newUncovered)) {
      onWin();
    }
  };

  const resetRound = () => {
    setDucks(ducksInitial);
  };

  return (
    <GameShell
      game={game}
      isWon={isWon}
      onResetRound={resetRound}
      onBackToMap={onBackToMap}
      onNextGame={onNextGame}
      mafcikSpeech={isWon ? "Quack! You found all three lucky carnival symbols!" : "Pick the friendly ducks floating across the gentle water stream!"}
    >
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Required Checklist */}
        <div className="w-full p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 mb-6 flex justify-around text-xs font-bold">
          {REQUIRED_DUCK_SYMBOLS.map((sym) => {
            const found = uncoveredSymbols.includes(sym);
            const icon = sym === 'Crescent Moon' ? '🌙' : sym === 'Golden Star' ? '⭐' : '🍀';

            return (
              <div key={sym} className={`flex items-center gap-1.5 ${found ? 'text-emerald-300' : 'text-slate-400'}`}>
                <span>{icon}</span>
                <span>{sym.split(' ')[0]}</span>
                {found && <Check className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
            );
          })}
        </div>

        {/* Circular Pond Surface */}
        <div className="w-full h-64 sm:h-72 rounded-full bg-gradient-to-br from-cyan-950/60 via-blue-950/80 to-indigo-950/60 border-4 border-cyan-400/30 relative flex items-center justify-center p-4 shadow-inner">
          <div className="grid grid-cols-3 gap-4">
            {ducks.map((duck) => (
              <button
                key={duck.id}
                onClick={() => handlePickDuck(duck.id)}
                className={`w-16 h-16 sm:w-18 sm:h-18 rounded-2xl border-2 transition-all flex flex-col items-center justify-center shadow-lg active:scale-90 ${
                  duck.uncovered
                    ? 'bg-emerald-950/60 border-emerald-400'
                    : 'bg-amber-400/20 border-amber-300 hover:bg-amber-400/30'
                }`}
                aria-label={`Duck #${duck.id}. ${duck.uncovered ? `Revealed ${duck.symbol}` : 'Unpicked'}`}
              >
                <span className="text-2xl sm:text-3xl">🦆</span>
                {duck.uncovered ? (
                  <span className="text-xs font-bold text-white mt-0.5">{duck.icon}</span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-200">Pick</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </GameShell>
  );
};
