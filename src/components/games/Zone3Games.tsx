import React, { useState, useEffect } from 'react';
import { GameShell } from '../common/GameShell';
import { GAME_CATALOG } from '../../game/catalog';
import {
  checkMelodyWin,
  TARGET_MELODY,
  checkFireflyTrailWin,
  GridCoord,
  isAdjacent,
  checkCupcakeWin,
  TARGET_CUPCAKE,
  CupcakeRecipe,
  checkPrizeShelfWin,
  TARGET_MOVED_TOY,
  checkPuzzlePosterWin,
} from '../../game/rules';
import { sound } from '../../utils/audio';
import { Sparkles, RotateCcw, Volume2, Check } from 'lucide-react';

interface GameProps {
  onWin: () => void;
  onBackToMap: () => void;
  onNextGame: () => void;
}

// -------------------------------------------------------------
// GAME 11: Music Box Melody
// -------------------------------------------------------------
export const Game11MusicBoxMelody: React.FC<GameProps> = ({ onWin, onBackToMap, onNextGame }) => {
  const game = GAME_CATALOG[10];
  const [playedNotes, setPlayedNotes] = useState<number[]>([]);
  const [activeHighlight, setActiveHighlight] = useState<number | null>(null);
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);

  const isWon = checkMelodyWin(playedNotes, TARGET_MELODY);

  const playSequenceDemo = () => {
    if (isPlayingDemo || isWon) return;
    setIsPlayingDemo(true);
    setPlayedNotes([]);

    TARGET_MELODY.forEach((note, index) => {
      setTimeout(() => {
        setActiveHighlight(note);
        sound.playBell(note);
      }, (index + 1) * 600);

      setTimeout(() => {
        setActiveHighlight(null);
        if (index === TARGET_MELODY.length - 1) {
          setIsPlayingDemo(false);
        }
      }, (index + 1) * 600 + 400);
    });
  };

  useEffect(() => {
    // Play initial demo once mounted
    playSequenceDemo();
  }, []);

  const handlePadClick = (note: number) => {
    if (isPlayingDemo || isWon) return;
    sound.playBell(note);
    const updated = [...playedNotes, note];
    setPlayedNotes(updated);

    if (updated.length === TARGET_MELODY.length) {
      if (checkMelodyWin(updated, TARGET_MELODY)) {
        onWin();
      } else {
        setTimeout(() => {
          setPlayedNotes([]);
        }, 600);
      }
    }
  };

  const resetRound = () => {
    setPlayedNotes([]);
    playSequenceDemo();
  };

  const bellMeta: Record<number, { label: string; noteName: string; color: string; border: string }> = {
    1: { label: 'Bell 1', noteName: 'C5 (Low)', color: 'bg-pink-500', border: 'border-pink-300' },
    2: { label: 'Bell 2', noteName: 'E5', color: 'bg-purple-500', border: 'border-purple-300' },
    3: { label: 'Bell 3', noteName: 'G5', color: 'bg-amber-400', border: 'border-amber-200' },
    4: { label: 'Bell 4', noteName: 'C6 (High)', color: 'bg-emerald-400', border: 'border-emerald-200' },
  };

  return (
    <GameShell
      game={game}
      isWon={isWon}
      onResetRound={resetRound}
      onBackToMap={onBackToMap}
      onNextGame={onNextGame}
      mafcikSpeech={isWon ? "A magnificent four-note harmony echoes across the fairground!" : "Watch the bells chime, then repeat the 4-note melody!"}
    >
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Replay Demo Button */}
        <button
          onClick={playSequenceDemo}
          disabled={isPlayingDemo || isWon}
          className="mb-4 px-4 py-2 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 text-xs font-bold flex items-center gap-2 active:scale-95 transition-all"
        >
          <Volume2 className="w-4 h-4" />
          <span>{isPlayingDemo ? 'Listening to Song...' : 'Replay Melody Sequence'}</span>
        </button>

        {/* 4 Chime Bells */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full my-3">
          {[1, 2, 3, 4].map((note) => {
            const meta = bellMeta[note];
            const isHighlighted = activeHighlight === note;

            return (
              <button
                key={note}
                onClick={() => handlePadClick(note)}
                disabled={isPlayingDemo || isWon}
                className={`h-32 sm:h-36 rounded-3xl border-2 transition-all flex flex-col items-center justify-between p-3 relative active:scale-95 ${
                  isHighlighted
                    ? `${meta.color} ${meta.border} text-slate-950 scale-105 shadow-[0_0_25px_#fde047]`
                    : 'bg-slate-900/80 border-white/20 hover:border-white/40 text-white'
                }`}
                aria-label={`${meta.label} (${meta.noteName})`}
              >
                <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                  {meta.label}
                </span>

                <div className="text-3xl sm:text-4xl">🔔</div>

                <div className="text-[10px] font-mono font-bold bg-white/10 px-2 py-0.5 rounded-full">
                  {meta.noteName}
                </div>
              </button>
            );
          })}
        </div>

        {/* Input Progress indicator */}
        <div className="mt-4 flex gap-2">
          {TARGET_MELODY.map((_, i) => (
            <div
              key={i}
              className={`w-3.5 h-3.5 rounded-full border ${
                playedNotes.length > i ? 'bg-pink-400 border-pink-300' : 'bg-slate-800 border-slate-600'
              }`}
            />
          ))}
        </div>
      </div>
    </GameShell>
  );
};

// -------------------------------------------------------------
// GAME 12: Firefly Trail (4x4 Grid Maze)
// -------------------------------------------------------------
export const Game12FireflyTrail: React.FC<GameProps> = ({ onWin, onBackToMap, onNextGame }) => {
  const game = GAME_CATALOG[11];
  const start: GridCoord = { r: 0, c: 0 };
  const finish: GridCoord = { r: 3, c: 3 };
  const checkpoints: GridCoord[] = [{ r: 1, c: 2 }, { r: 2, c: 1 }];

  const [path, setPath] = useState<GridCoord[]>([start]);
  const isWon = checkFireflyTrailWin(path, start, finish, checkpoints);

  const handleCellClick = (r: number, c: number) => {
    if (isWon) return;
    const current = path[path.length - 1];

    // If clicking the current cell, ignore
    if (current.r === r && current.c === c) return;

    // Check adjacency
    if (isAdjacent(current, { r, c })) {
      sound.playClick();
      const updated = [...path, { r, c }];
      setPath(updated);

      if (checkFireflyTrailWin(updated, start, finish, checkpoints)) {
        onWin();
      }
    }
  };

  const undoLastStep = () => {
    if (path.length > 1 && !isWon) {
      sound.playClick();
      setPath(path.slice(0, -1));
    }
  };

  const resetRound = () => {
    setPath([start]);
  };

  return (
    <GameShell
      game={game}
      isWon={isWon}
      onResetRound={resetRound}
      onBackToMap={onBackToMap}
      onNextGame={onNextGame}
      mafcikSpeech={isWon ? "The firefly constellation is complete from start to finish!" : "Step through adjacent cells, visiting both glowing firefly checkpoints!"}
    >
      <div className="w-full max-w-sm flex flex-col items-center">
        {/* Undo button */}
        <div className="w-full flex justify-end mb-3">
          <button
            onClick={undoLastStep}
            disabled={path.length <= 1 || isWon}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-slate-300 disabled:opacity-40 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Undo Step</span>
          </button>
        </div>

        {/* 4x4 Grid */}
        <div className="grid grid-cols-4 gap-2.5 p-3 rounded-3xl bg-slate-900 border border-emerald-500/30 shadow-2xl">
          {Array.from({ length: 4 }).map((_, r) =>
            Array.from({ length: 4 }).map((_, c) => {
              const isStart = r === start.r && c === start.c;
              const isFinish = r === finish.r && c === finish.c;
              const isCheckpoint = checkpoints.some((cp) => cp.r === r && cp.c === c);
              const pathIdx = path.findIndex((p) => p.r === r && p.c === c);
              const isInPath = pathIdx !== -1;
              const isHead = isInPath && pathIdx === path.length - 1;

              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  className={`w-16 h-16 sm:w-18 sm:h-18 rounded-2xl border-2 transition-all flex flex-col items-center justify-center relative ${
                    isHead
                      ? 'bg-emerald-500 border-white text-slate-950 font-bold scale-105 shadow-[0_0_15px_#34d399]'
                      : isInPath
                      ? 'bg-emerald-950/70 border-emerald-400 text-emerald-300'
                      : isCheckpoint
                      ? 'bg-amber-500/20 border-amber-400/60 text-amber-300 animate-pulse'
                      : isFinish
                      ? 'bg-purple-950/40 border-purple-400 text-purple-300'
                      : 'bg-slate-950/60 border-white/10 hover:border-white/30 text-slate-400'
                  }`}
                  aria-label={`Cell (${r},${c})`}
                >
                  {isStart ? (
                    <span className="text-[10px] font-black uppercase text-amber-300">START</span>
                  ) : isFinish ? (
                    <span className="text-[10px] font-black uppercase text-purple-300">FINISH</span>
                  ) : isCheckpoint ? (
                    <span className="text-xl">✨</span>
                  ) : isInPath ? (
                    <span className="text-xs font-bold">•</span>
                  ) : null}
                </button>
              );
            })
          )}
        </div>
      </div>
    </GameShell>
  );
};

// -------------------------------------------------------------
// GAME 13: Cupcake Workshop
// -------------------------------------------------------------
export const Game13CupcakeWorkshop: React.FC<GameProps> = ({ onWin, onBackToMap, onNextGame }) => {
  const game = GAME_CATALOG[12];
  const [recipe, setRecipe] = useState<CupcakeRecipe>({
    base: 'Vanilla Sponge',
    frosting: 'Vanilla Swirl',
    topper: 'Cherry',
  });
  const [validation, setValidation] = useState<{ baseOk: boolean; frostingOk: boolean; topperOk: boolean; isWin: boolean } | null>(null);

  const isWon = validation?.isWin ?? false;

  const bases = ['Vanilla Sponge', 'Cocoa Sponge', 'Strawberry Sponge'];
  const frostings = ['Berry Pink Swirl', 'Mint Swirl', 'Sky Blue Swirl'];
  const toppers = ['Cherry', 'Sparkle Star', 'Sugar Bow'];

  const handleCheck = () => {
    sound.playClick();
    const result = checkCupcakeWin(recipe, TARGET_CUPCAKE);
    setValidation(result);
    if (result.isWin) {
      onWin();
    }
  };

  const resetRound = () => {
    setRecipe({
      base: 'Vanilla Sponge',
      frosting: 'Vanilla Swirl',
      topper: 'Cherry',
    });
    setValidation(null);
  };

  return (
    <GameShell
      game={game}
      isWon={isWon}
      onResetRound={resetRound}
      onBackToMap={onBackToMap}
      onNextGame={onNextGame}
      mafcikSpeech={isWon ? "Delicious! A pristine festival cupcake baked to perfection!" : "Check the recipe ticket: Cocoa Sponge, Berry Pink Swirl, Sparkle Star!"}
    >
      <div className="w-full max-w-lg flex flex-col items-center">
        {/* Order Ticket */}
        <div className="w-full p-3 rounded-2xl bg-pink-950/30 border border-pink-400/40 text-center mb-5">
          <div className="text-[11px] font-bold text-pink-300 uppercase tracking-wider mb-1 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Julcia's Bespoke Recipe Ticket
          </div>
          <div className="flex justify-center items-center gap-3 text-xs font-bold text-slate-200">
            <span>Base: Cocoa Sponge</span>
            <span>•</span>
            <span>Frosting: Berry Pink Swirl</span>
            <span>•</span>
            <span>Topper: Sparkle Star</span>
          </div>
        </div>

        {/* 3 Component Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mb-6">
          {/* Base */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-xs font-bold text-slate-300 mb-2">1. Sponge Base</div>
            <div className="space-y-1.5">
              {bases.map((b) => (
                <button
                  key={b}
                  onClick={() => {
                    sound.playClick();
                    setRecipe((prev) => ({ ...prev, base: b }));
                    setValidation(null);
                  }}
                  className={`w-full py-1.5 px-2 rounded-xl text-xs font-semibold text-left transition-colors ${
                    recipe.base === b ? 'bg-pink-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Frosting */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-xs font-bold text-slate-300 mb-2">2. Frosting</div>
            <div className="space-y-1.5">
              {frostings.map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    sound.playClick();
                    setRecipe((prev) => ({ ...prev, frosting: f }));
                    setValidation(null);
                  }}
                  className={`w-full py-1.5 px-2 rounded-xl text-xs font-semibold text-left transition-colors ${
                    recipe.frosting === f ? 'bg-pink-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Topper */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-xs font-bold text-slate-300 mb-2">3. Topper</div>
            <div className="space-y-1.5">
              {toppers.map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    sound.playClick();
                    setRecipe((prev) => ({ ...prev, topper: t }));
                    setValidation(null);
                  }}
                  className={`w-full py-1.5 px-2 rounded-xl text-xs font-semibold text-left transition-colors ${
                    recipe.topper === t ? 'bg-pink-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleCheck}
          className="w-full sm:w-60 py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-amber-500 hover:brightness-110 font-black text-sm text-white shadow-lg active:scale-95 transition-all"
        >
          Check Cupcake Recipe
        </button>
      </div>
    </GameShell>
  );
};

// -------------------------------------------------------------
// GAME 14: Prize Shelf
// -------------------------------------------------------------
export const Game14PrizeShelf: React.FC<GameProps> = ({ onWin, onBackToMap, onNextGame }) => {
  const game = GAME_CATALOG[13];
  const [isMovedState, setIsMovedState] = useState(false);
  const [selectedGuess, setSelectedGuess] = useState<string | null>(null);

  const isWon = selectedGuess === TARGET_MOVED_TOY;

  const initialTop = ['Teddy Bear', 'Pug Plushie', 'Magic Duck'];
  const initialBottom = ['Carousel Horse', 'Star Wand', 'Tiny Robot'];

  // In moved state, Pug Plushie swaps to bottom shelf with Star Wand
  const shiftedTop = ['Teddy Bear', 'Star Wand', 'Magic Duck'];
  const shiftedBottom = ['Carousel Horse', 'Pug Plushie', 'Tiny Robot'];

  const toyIcons: Record<string, string> = {
    'Teddy Bear': '🧸',
    'Pug Plushie': '🐶',
    'Magic Duck': '🦆',
    'Carousel Horse': '🎠',
    'Star Wand': '🪄',
    'Tiny Robot': '🤖',
  };

  const handleGuess = (toy: string) => {
    if (isWon) return;
    sound.playClick();
    setSelectedGuess(toy);
    if (checkPrizeShelfWin(toy, TARGET_MOVED_TOY)) {
      onWin();
    }
  };

  const resetRound = () => {
    setIsMovedState(false);
    setSelectedGuess(null);
  };

  return (
    <GameShell
      game={game}
      isWon={isWon}
      onResetRound={resetRound}
      onBackToMap={onBackToMap}
      onNextGame={onNextGame}
      mafcikSpeech={isWon ? "Spot on! The Pug Plushie hopped onto the bottom shelf!" : "Remember where each prize sits, then see who moved!"}
    >
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Toggle Phase Button */}
        {!isMovedState ? (
          <button
            onClick={() => {
              sound.playSparkle();
              setIsMovedState(true);
            }}
            className="mb-4 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-pink-500 font-black text-xs text-slate-950 shadow-md active:scale-95 transition-all"
          >
            I Memorized Them! Ready →
          </button>
        ) : (
          <div className="mb-4 text-xs font-bold text-pink-300">
            One toy swapped places! Which prize moved?
          </div>
        )}

        {/* Two Prize Shelves */}
        <div className="w-full space-y-4 mb-6">
          {/* Shelf 1 */}
          <div className="p-3 rounded-2xl bg-slate-900 border-b-4 border-amber-600/60 shadow-lg">
            <div className="grid grid-cols-3 gap-3">
              {(isMovedState ? shiftedTop : initialTop).map((toy) => (
                <div key={toy} className="flex flex-col items-center p-2 rounded-xl bg-white/5">
                  <span className="text-3xl">{toyIcons[toy]}</span>
                  <span className="text-[10px] text-slate-300 font-bold mt-1 text-center line-clamp-1">{toy}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Shelf 2 */}
          <div className="p-3 rounded-2xl bg-slate-900 border-b-4 border-amber-600/60 shadow-lg">
            <div className="grid grid-cols-3 gap-3">
              {(isMovedState ? shiftedBottom : initialBottom).map((toy) => (
                <div key={toy} className="flex flex-col items-center p-2 rounded-xl bg-white/5">
                  <span className="text-3xl">{toyIcons[toy]}</span>
                  <span className="text-[10px] text-slate-300 font-bold mt-1 text-center line-clamp-1">{toy}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Guess Choices if in moved state */}
        {isMovedState && (
          <div className="grid grid-cols-2 gap-2.5 w-full">
            {['Teddy Bear', 'Pug Plushie', 'Magic Duck', 'Tiny Robot'].map((toy) => (
              <button
                key={toy}
                onClick={() => handleGuess(toy)}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all ${
                  selectedGuess === toy
                    ? toy === TARGET_MOVED_TOY
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                      : 'bg-red-500/20 text-red-300 border-red-400'
                    : 'bg-white/10 hover:bg-white/15 text-slate-200 border-white/10'
                }`}
              >
                <span>{toyIcons[toy]}</span>
                <span>{toy}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </GameShell>
  );
};

// -------------------------------------------------------------
// GAME 15: Puzzle Poster (Solvable 3x3 Tile Swap)
// -------------------------------------------------------------
export const Game15PuzzlePoster: React.FC<GameProps> = ({ onWin, onBackToMap, onNextGame }) => {
  const game = GAME_CATALOG[14];
  // Known solvable scramble: swap 2 and 3, swap 5 and 6
  const [tiles, setTiles] = useState<number[]>([1, 3, 2, 4, 6, 5, 7, 8, 9]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const isWon = checkPuzzlePosterWin(tiles);

  const handleTileClick = (idx: number) => {
    if (isWon) return;
    sound.playClick();

    if (selectedIdx === null) {
      setSelectedIdx(idx);
    } else {
      if (selectedIdx !== idx) {
        const next = [...tiles];
        const temp = next[idx];
        next[idx] = next[selectedIdx];
        next[selectedIdx] = temp;
        setTiles(next);
        setSelectedIdx(null);
        if (checkPuzzlePosterWin(next)) {
          onWin();
        }
      } else {
        setSelectedIdx(null);
      }
    }
  };

  const resetRound = () => {
    setTiles([1, 3, 2, 4, 6, 5, 7, 8, 9]);
    setSelectedIdx(null);
  };

  return (
    <GameShell
      game={game}
      isWon={isWon}
      onResetRound={resetRound}
      onBackToMap={onBackToMap}
      onNextGame={onNextGame}
      mafcikSpeech={isWon ? "The grand carnival poster is fully reassembled!" : "Tap any two tiles to swap them until they count 1 to 9!"}
    >
      <div className="w-full max-w-xs flex flex-col items-center">
        {/* 3x3 Poster Tiles */}
        <div className="grid grid-cols-3 gap-2 p-3 rounded-3xl bg-slate-900 border border-purple-500/30 shadow-2xl w-full">
          {tiles.map((val, idx) => {
            const isSelected = selectedIdx === idx;
            const isCorrectSlot = val === idx + 1;

            return (
              <button
                key={idx}
                onClick={() => handleTileClick(idx)}
                className={`h-20 sm:h-24 rounded-2xl border-2 transition-all flex flex-col items-center justify-center font-black text-lg relative active:scale-95 ${
                  isSelected
                    ? 'border-pink-400 bg-pink-950/60 shadow-[0_0_15px_#f472b6] scale-105'
                    : isCorrectSlot
                    ? 'border-emerald-400/50 bg-emerald-950/30 text-emerald-300'
                    : 'border-white/20 bg-white/5 hover:border-white/40 text-white'
                }`}
                aria-label={`Poster tile ${val}`}
              >
                <span>#{val}</span>
                <span className="text-xl opacity-80 mt-1">🎪</span>
              </button>
            );
          })}
        </div>
      </div>
    </GameShell>
  );
};
