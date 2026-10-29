import React, { useState } from 'react';
import { GameShell } from '../common/GameShell';
import { GAME_CATALOG } from '../../game/catalog';
import {
  LANTERN_TARGET_SEQUENCE,
  checkLanternStep,
  checkTicketMatchWin,
  checkBalloonPopWin,
  checkCarouselColour,
  DEFAULT_CAROUSEL_TARGET,
  checkSnackStandWin,
  DEFAULT_SNACK_ORDERS,
} from '../../game/rules';
import { sound } from '../../utils/audio';
import { Sparkles, Check, CheckCircle2, AlertCircle } from 'lucide-react';

interface GameProps {
  onWin: () => void;
  onBackToMap: () => void;
  onNextGame: () => void;
}

// -------------------------------------------------------------
// GAME 1: Lantern Light-Up
// -------------------------------------------------------------
export const Game1LanternLightUp: React.FC<GameProps> = ({ onWin, onBackToMap, onNextGame }) => {
  const game = GAME_CATALOG[0];
  const [litSequence, setLitSequence] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const isWon = litSequence.length === LANTERN_TARGET_SEQUENCE.length;

  const colorMap: Record<string, { label: string; bg: string; border: string; glow: string; text: string }> = {
    pink: { label: 'Rose Pink', bg: 'bg-pink-500', border: 'border-pink-400', glow: 'shadow-[0_0_20px_#f472b6]', text: 'text-pink-300' },
    gold: { label: 'Champagne Gold', bg: 'bg-amber-400', border: 'border-amber-300', glow: 'shadow-[0_0_20px_#fbbf24]', text: 'text-amber-300' },
    mint: { label: 'Mint Green', bg: 'bg-emerald-400', border: 'border-emerald-300', glow: 'shadow-[0_0_20px_#34d399]', text: 'text-emerald-300' },
  };

  const handleLanternClick = (color: string) => {
    if (isWon) return;
    sound.playClick();
    const result = checkLanternStep(litSequence, color);
    if (result.isValid) {
      const nextSeq = [...litSequence, color];
      setLitSequence(nextSeq);
      setFeedback('Lantern lit brightly!');
      sound.playTone(400 + nextSeq.length * 70, 'sine', 0.2);
      if (result.isComplete) {
        onWin();
      }
    } else {
      setFeedback('Gentle restart: tap following the guide strip!');
      setLitSequence([]);
    }
  };

  const resetRound = () => {
    setLitSequence([]);
    setFeedback(null);
  };

  return (
    <GameShell
      game={game}
      isWon={isWon}
      onResetRound={resetRound}
      onBackToMap={onBackToMap}
      onNextGame={onNextGame}
      mafcikSpeech={isWon ? "All six lanterns glow with magical starlight!" : "Follow the reference strip: Pink, Gold, Mint!"}
    >
      <div className="w-full flex flex-col items-center max-w-lg">
        {/* Reference Strip */}
        <div className="mb-6 w-full p-3.5 rounded-2xl bg-white/5 border border-pink-500/30 text-center">
          <div className="text-[11px] font-bold text-pink-300 uppercase tracking-wider mb-2 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Guide Strip (Pattern Order)
          </div>
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            {LANTERN_TARGET_SEQUENCE.map((c, i) => (
              <div
                key={i}
                className={`w-7 h-7 sm:w-9 sm:h-9 rounded-xl border flex items-center justify-center text-xs font-bold ${
                  litSequence.length > i
                    ? `${colorMap[c].bg} ${colorMap[c].border} ${colorMap[c].glow} text-slate-950 scale-105`
                    : 'bg-slate-800 border-white/20 text-slate-400'
                } transition-all duration-200`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* 6 Festival Lanterns Display */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4 my-4 w-full justify-items-center">
          {LANTERN_TARGET_SEQUENCE.map((color, i) => {
            const isLit = litSequence.length > i;
            const meta = colorMap[color];

            return (
              <div
                key={i}
                className="flex flex-col items-center group transition-all"
              >
                <div className="w-0.5 h-4 bg-amber-200/40" />
                <div
                  className={`w-12 h-16 sm:w-14 sm:h-20 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-300 ${
                    isLit
                      ? `${meta.bg} ${meta.border} ${meta.glow} scale-105`
                      : 'bg-slate-900/90 border-slate-700 text-slate-600'
                  }`}
                >
                  <span className={`text-xl sm:text-2xl ${isLit ? 'animate-pulse' : 'grayscale opacity-30'}`}>
                    🏮
                  </span>
                  <span className={`text-[10px] font-bold mt-1 ${isLit ? 'text-slate-950' : 'text-slate-500'}`}>
                    #{i + 1}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Color Tapping Buttons */}
        <div className="mt-6 w-full flex flex-col sm:flex-row items-center justify-center gap-3">
          {(['pink', 'gold', 'mint'] as const).map((color) => {
            const meta = colorMap[color];
            return (
              <button
                key={color}
                onClick={() => handleLanternClick(color)}
                className={`w-full sm:w-auto px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm text-slate-950 shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all ${meta.bg} ${meta.glow} hover:brightness-110`}
                aria-label={`Light ${meta.label} lantern`}
              >
                <span>🏮</span>
                <span>{meta.label}</span>
              </button>
            );
          })}
        </div>

        {feedback && (
          <p className="mt-4 text-xs font-semibold text-pink-200 animate-fade-in text-center">
            {feedback}
          </p>
        )}
      </div>
    </GameShell>
  );
};

// -------------------------------------------------------------
// GAME 2: Ticket Match (Memory Cards)
// -------------------------------------------------------------
interface CardItem {
  id: number;
  type: string;
  name: string;
  icon: string;
  color: string;
}

const TICKET_CARD_DATA = [
  { type: 'popcorn', name: 'Caramel Popcorn', icon: '🍿', color: '#f472b6' },
  { type: 'ferris', name: 'Moonlit Ferris Wheel', icon: '🎡', color: '#a855f7' },
  { type: 'carousel', name: 'Golden Carousel', icon: '🎠', color: '#fbbf24' },
  { type: 'star', name: 'Wishing Star', icon: '⭐', color: '#34d399' },
];

export const Game2TicketMatch: React.FC<GameProps> = ({ onWin, onBackToMap, onNextGame }) => {
  const game = GAME_CATALOG[1];

  const createDeck = () => {
    const raw: CardItem[] = [];
    let idCounter = 1;
    TICKET_CARD_DATA.forEach((card) => {
      raw.push({ ...card, id: idCounter++ });
      raw.push({ ...card, id: idCounter++ });
    });
    // Deterministic shuffle
    return raw.sort(() => Math.sin(idCounter++) - 0.5);
  };

  const [deck, setDeck] = useState<CardItem[]>(createDeck);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [matchedTypes, setMatchedTypes] = useState<string[]>([]);
  const [isLocked, setIsLocked] = useState(false);

  const isWon = checkTicketMatchWin(matchedTypes, 4);

  const handleCardClick = (card: CardItem) => {
    if (isLocked || isWon) return;
    if (flippedIds.includes(card.id) || matchedTypes.includes(card.type)) return;

    sound.playClick();
    const newFlipped = [...flippedIds, card.id];
    setFlippedIds(newFlipped);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      const [firstId, secondId] = newFlipped;
      const firstCard = deck.find((c) => c.id === firstId);
      const secondCard = deck.find((c) => c.id === secondId);

      if (firstCard && secondCard && firstCard.type === secondCard.type) {
        sound.playSparkle();
        const newMatched = [...matchedTypes, firstCard.type];
        setMatchedTypes(newMatched);
        setFlippedIds([]);
        setIsLocked(false);
        if (checkTicketMatchWin(newMatched, 4)) {
          onWin();
        }
      } else {
        setTimeout(() => {
          setFlippedIds([]);
          setIsLocked(false);
        }, 850);
      }
    }
  };

  const resetRound = () => {
    setDeck(createDeck());
    setFlippedIds([]);
    setMatchedTypes([]);
    setIsLocked(false);
  };

  return (
    <GameShell
      game={game}
      isWon={isWon}
      onResetRound={resetRound}
      onBackToMap={onBackToMap}
      onNextGame={onNextGame}
      mafcikSpeech={isWon ? "You found every single carnival pair!" : "Tap cards gently to find the four ticket pairs!"}
    >
      <div className="w-full max-w-md">
        <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
          {deck.map((card) => {
            const isFlipped = flippedIds.includes(card.id) || matchedTypes.includes(card.type);
            const isMatched = matchedTypes.includes(card.type);

            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(card)}
                disabled={isLocked || isMatched}
                className={`h-24 sm:h-28 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center p-2 relative active:scale-95 ${
                  isFlipped
                    ? isMatched
                      ? 'bg-emerald-950/70 border-emerald-400 shadow-[0_0_15px_#34d39944]'
                      : 'bg-slate-900 border-pink-400 shadow-[0_0_15px_#f472b644]'
                    : 'bg-gradient-to-br from-slate-900 via-purple-950/40 to-slate-900 border-white/20 hover:border-pink-300/60 shadow-md'
                }`}
                aria-label={isFlipped ? `${card.name} ticket` : 'Mystery ticket card'}
              >
                {isFlipped ? (
                  <>
                    <span className="text-3xl sm:text-4xl animate-fade-in">{card.icon}</span>
                    <span className="text-[9px] font-bold text-center mt-1 text-slate-200 line-clamp-1">
                      {card.name.split(' ')[0]}
                    </span>
                    {isMatched && (
                      <span className="absolute top-1 right-1 text-emerald-400 text-xs">✓</span>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center">
                    <span className="text-xl opacity-60">🎟️</span>
                    <span className="text-[10px] text-pink-300/80 font-bold mt-1">?</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-4 text-center text-xs text-slate-300 font-medium">
          Matched: <span className="font-bold text-pink-300">{matchedTypes.length}</span> / 4 Pairs
        </div>
      </div>
    </GameShell>
  );
};

// -------------------------------------------------------------
// GAME 3: Balloon Pop
// -------------------------------------------------------------
interface BalloonItem {
  id: number;
  shape: 'star' | 'heart' | 'moon';
  color: string;
  popped: boolean;
}

export const Game3BalloonPop: React.FC<GameProps> = ({ onWin, onBackToMap, onNextGame }) => {
  const game = GAME_CATALOG[2];

  const initialBalloons: BalloonItem[] = [
    { id: 1, shape: 'star', color: '#f472b6', popped: false },
    { id: 2, shape: 'heart', color: '#ec4899', popped: false },
    { id: 3, shape: 'star', color: '#fbbf24', popped: false },
    { id: 4, shape: 'moon', color: '#c084fc', popped: false },
    { id: 5, shape: 'star', color: '#34d399', popped: false },
    { id: 6, shape: 'heart', color: '#f472b6', popped: false },
    { id: 7, shape: 'star', color: '#60a5fa', popped: false },
    { id: 8, shape: 'moon', color: '#fbbf24', popped: false },
    { id: 9, shape: 'star', color: '#a78bfa', popped: false },
    { id: 10, shape: 'heart', color: '#34d399', popped: false },
  ];

  const [balloons, setBalloons] = useState<BalloonItem[]>(initialBalloons);
  const [feedback, setFeedback] = useState<string | null>(null);

  const starCount = balloons.filter((b) => b.shape === 'star' && b.popped).length;
  const isWon = checkBalloonPopWin(starCount, 5);

  const handlePop = (id: number) => {
    if (isWon) return;
    const target = balloons.find((b) => b.id === id);
    if (!target || target.popped) return;

    sound.playPop();

    if (target.shape === 'star') {
      const next = balloons.map((b) => (b.id === id ? { ...b, popped: true } : b));
      setBalloons(next);
      setFeedback('Nice pop! That had a star inside ⭐');
      const newStarCount = next.filter((b) => b.shape === 'star' && b.popped).length;
      if (checkBalloonPopWin(newStarCount, 5)) {
        onWin();
      }
    } else {
      setFeedback(`Kind bark: That was a ${target.shape === 'heart' ? 'heart 💖' : 'crescent moon 🌙'} balloon! Seek out the 5 Star ⭐ balloons.`);
    }
  };

  const resetRound = () => {
    setBalloons(initialBalloons);
    setFeedback(null);
  };

  return (
    <GameShell
      game={game}
      isWon={isWon}
      onResetRound={resetRound}
      onBackToMap={onBackToMap}
      onNextGame={onNextGame}
      mafcikSpeech={isWon ? "Pop! All five star balloons collected!" : "Look for the five balloons with stars ⭐ inside!"}
    >
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Target Callout */}
        <div className="mb-4 px-4 py-2 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-bold flex items-center gap-2">
          <span>Target Shape:</span>
          <span className="text-base">⭐ STAR</span>
          <span className="text-slate-300">({starCount} / 5 Popped)</span>
        </div>

        {/* Floating Balloons Cluster */}
        <div className="grid grid-cols-5 gap-3 sm:gap-4 my-2 w-full justify-items-center">
          {balloons.map((b) => {
            const shapeIcon = b.shape === 'star' ? '⭐' : b.shape === 'heart' ? '💖' : '🌙';

            return (
              <button
                key={b.id}
                onClick={() => handlePop(b.id)}
                disabled={b.popped || isWon}
                className={`relative w-14 h-18 sm:w-16 sm:h-20 rounded-full flex flex-col items-center justify-center transition-transform active:scale-90 ${
                  b.popped
                    ? 'opacity-20 scale-75 cursor-default'
                    : 'hover:scale-110 shadow-lg cursor-pointer'
                }`}
                style={{
                  backgroundColor: b.popped ? '#475569' : b.color,
                  boxShadow: b.popped ? 'none' : `0 6px 18px ${b.color}88`,
                }}
                aria-label={`Balloon #${b.id} with ${b.shape}`}
              >
                {!b.popped ? (
                  <>
                    <span className="text-xl sm:text-2xl drop-shadow-md select-none">{shapeIcon}</span>
                    <div className="w-1 h-3 bg-amber-100/60 rounded-full mt-1" />
                    <div className="w-0.5 h-4 bg-slate-300/40 absolute -bottom-3" />
                  </>
                ) : (
                  <span className="text-xs text-white">💥</span>
                )}
              </button>
            );
          })}
        </div>

        {feedback && (
          <p className="mt-4 text-xs font-semibold text-pink-200 text-center animate-fade-in bg-white/5 p-2 rounded-xl border border-white/10 w-full">
            {feedback}
          </p>
        )}
      </div>
    </GameShell>
  );
};

// -------------------------------------------------------------
// GAME 4: Carousel Colour
// -------------------------------------------------------------
export const Game4CarouselColour: React.FC<GameProps> = ({ onWin, onBackToMap, onNextGame }) => {
  const game = GAME_CATALOG[3];
  const [slots, setSlots] = useState({ left: 'pink', middle: 'pink', right: 'pink' });
  const [validation, setValidation] = useState<{ leftCorrect: boolean; middleCorrect: boolean; rightCorrect: boolean; isWin: boolean } | null>(null);

  const isWon = validation?.isWin ?? false;

  const colorPalette = [
    { id: 'pink', name: 'Rose Pink', color: '#f472b6' },
    { id: 'lavender', name: 'Lavender', color: '#c084fc' },
    { id: 'gold', name: 'Champagne Gold', color: '#fbbf24' },
    { id: 'mint', name: 'Mint Green', color: '#6ee7b7' },
  ];

  const handleCheck = () => {
    sound.playClick();
    const result = checkCarouselColour(slots, DEFAULT_CAROUSEL_TARGET);
    setValidation(result);
    if (result.isWin) {
      onWin();
    }
  };

  const resetRound = () => {
    setSlots({ left: 'pink', middle: 'pink', right: 'pink' });
    setValidation(null);
  };

  return (
    <GameShell
      game={game}
      isWon={isWon}
      onResetRound={resetRound}
      onBackToMap={onBackToMap}
      onNextGame={onNextGame}
      mafcikSpeech={isWon ? "The royal steeds look resplendent!" : "Match the illuminated festival pattern: Pink, Lavender, Gold!"}
    >
      <div className="w-full max-w-lg flex flex-col items-center">
        {/* Banner with Target Pattern */}
        <div className="w-full p-3 rounded-2xl bg-slate-900/80 border border-amber-400/40 mb-6 text-center">
          <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Illuminated Festival Pattern
          </div>
          <div className="flex justify-center items-center gap-4 text-xs font-bold text-slate-200">
            <span className="text-pink-300">1. Left: Pink</span>
            <span>•</span>
            <span className="text-purple-300">2. Middle: Lavender</span>
            <span>•</span>
            <span className="text-amber-300">3. Right: Gold</span>
          </div>
        </div>

        {/* 3 Carousel Horses Slots */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 w-full mb-6">
          {(['left', 'middle', 'right'] as const).map((pos, idx) => {
            const currentColor = slots[pos];
            const isCorrect = validation ? validation[`${pos}Correct` as keyof typeof validation] : null;

            return (
              <div
                key={pos}
                className="flex flex-col items-center p-3 rounded-2xl bg-white/5 border border-white/10"
              >
                <div className="text-xs font-bold text-slate-300 capitalize mb-2">
                  Horse #{idx + 1}
                </div>

                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 flex items-center justify-center text-3xl shadow-lg mb-3 transition-colors duration-300"
                  style={{
                    backgroundColor: colorPalette.find((c) => c.id === currentColor)?.color,
                    borderColor: 'rgba(255,255,255,0.4)',
                  }}
                >
                  🎠
                </div>

                {/* Color Selector */}
                <div className="grid grid-cols-2 gap-1.5 w-full">
                  {colorPalette.map((cp) => (
                    <button
                      key={cp.id}
                      onClick={() => {
                        sound.playClick();
                        setSlots((prev) => ({ ...prev, [pos]: cp.id }));
                        setValidation(null);
                      }}
                      className={`h-6 rounded-lg border transition-all ${
                        currentColor === cp.id ? 'ring-2 ring-white scale-105' : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: cp.color }}
                      title={cp.name}
                      aria-label={`Select ${cp.name} for horse ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Validation Indicator */}
                {isCorrect !== null && (
                  <div className={`mt-2 text-xs font-bold flex items-center gap-1 ${isCorrect ? 'text-emerald-400' : 'text-pink-400'}`}>
                    {isCorrect ? '✓ Ready' : '✗ Adjust'}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={handleCheck}
          className="w-full sm:w-60 py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-amber-500 hover:from-pink-400 hover:to-amber-400 font-extrabold text-sm text-white shadow-lg active:scale-95 transition-all"
        >
          Check Carousel Colors
        </button>
      </div>
    </GameShell>
  );
};

// -------------------------------------------------------------
// GAME 5: Snack Stand
// -------------------------------------------------------------
export const Game5SnackStand: React.FC<GameProps> = ({ onWin, onBackToMap, onNextGame }) => {
  const game = GAME_CATALOG[4];
  const [trays, setTrays] = useState<{ tray1?: string; tray2?: string; tray3?: string }>({});
  const [activeTray, setActiveTray] = useState<'tray1' | 'tray2' | 'tray3'>('tray1');

  const snackOptions = [
    { name: 'Cotton Candy', icon: '🍭', color: 'bg-pink-500/20 border-pink-400/50' },
    { name: 'Caramel Popcorn', icon: '🍿', color: 'bg-amber-500/20 border-amber-400/50' },
    { name: 'Candied Apple', icon: '🍎', color: 'bg-red-500/20 border-red-400/50' },
  ];

  const isWon = checkSnackStandWin(trays, DEFAULT_SNACK_ORDERS);

  const placeSnack = (snackName: string) => {
    if (isWon) return;
    sound.playClick();
    const updated = { ...trays, [activeTray]: snackName };
    setTrays(updated);

    // Auto advance active tray if not filled
    if (activeTray === 'tray1') setActiveTray('tray2');
    else if (activeTray === 'tray2') setActiveTray('tray3');

    if (checkSnackStandWin(updated, DEFAULT_SNACK_ORDERS)) {
      onWin();
    }
  };

  const resetRound = () => {
    setTrays({});
    setActiveTray('tray1');
  };

  return (
    <GameShell
      game={game}
      isWon={isWon}
      onResetRound={resetRound}
      onBackToMap={onBackToMap}
      onNextGame={onNextGame}
      mafcikSpeech={isWon ? "Yum! Every guest received their favorite carnival snack!" : "Tap a tray to select it, then tap the matching snack!"}
    >
      <div className="w-full max-w-lg flex flex-col items-center">
        {/* Order Trays */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full mb-6">
          {[
            { id: 'tray1' as const, label: 'Order #1', want: 'Cotton Candy', iconWanted: '🍭' },
            { id: 'tray2' as const, label: 'Order #2', want: 'Caramel Popcorn', iconWanted: '🍿' },
            { id: 'tray3' as const, label: 'Order #3', want: 'Candied Apple', iconWanted: '🍎' },
          ].map((tray) => {
            const currentSnack = trays[tray.id];
            const isSelected = activeTray === tray.id;
            const isCorrect = currentSnack === tray.want;

            return (
              <button
                key={tray.id}
                onClick={() => {
                  sound.playClick();
                  setActiveTray(tray.id);
                }}
                className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center text-center relative ${
                  isSelected
                    ? 'border-pink-400 bg-pink-950/40 shadow-[0_0_15px_#f472b644] scale-102'
                    : 'border-white/10 bg-slate-900/60 hover:border-white/20'
                }`}
                aria-label={`${tray.label}: wants ${tray.want}`}
              >
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {tray.label}
                </div>
                <div className="text-xs text-amber-200 font-semibold mb-2">
                  Wants {tray.want}
                </div>

                {/* Tray Surface */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white/5 border border-dashed border-white/20 flex items-center justify-center text-2xl shadow-inner">
                  {currentSnack ? (
                    snackOptions.find((s) => s.name === currentSnack)?.icon
                  ) : (
                    <span className="text-slate-600 text-xs">Empty</span>
                  )}
                </div>

                {currentSnack && (
                  <div className={`mt-2 text-[10px] font-bold ${isCorrect ? 'text-emerald-400' : 'text-pink-400'}`}>
                    {isCorrect ? '✓ Correct' : '✗ Try again'}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Snack Pantry to Tap & Place */}
        <div className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
          <div className="text-xs font-bold text-slate-300 mb-3">
            Available Carnival Snacks (Tap to fill selected {activeTray.replace('tray', 'Tray #')}):
          </div>

          <div className="flex justify-center gap-3">
            {snackOptions.map((snack) => (
              <button
                key={snack.name}
                onClick={() => placeSnack(snack.name)}
                className={`py-2 px-3 sm:px-4 rounded-xl border font-bold text-xs flex items-center gap-2 active:scale-95 transition-all hover:bg-white/15 ${snack.color}`}
              >
                <span className="text-xl">{snack.icon}</span>
                <span>{snack.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </GameShell>
  );
};
