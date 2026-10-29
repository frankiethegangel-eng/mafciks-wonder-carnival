/**
 * Pure rules and validator functions for all 20 minigames in Mafcik's Wonder Carnival.
 * Fully decoupled from React and DOM for high-speed deterministic unit testing.
 */

// Game 1: Lantern Light-Up
export const LANTERN_TARGET_SEQUENCE = ['pink', 'gold', 'mint', 'pink', 'gold', 'mint'] as const;

export function checkLanternStep(currentSequence: string[], nextColor: string): { isValid: boolean; isComplete: boolean } {
  const nextIdx = currentSequence.length;
  if (nextIdx >= LANTERN_TARGET_SEQUENCE.length) {
    return { isValid: false, isComplete: true };
  }
  const isMatch = LANTERN_TARGET_SEQUENCE[nextIdx] === nextColor;
  const newLength = isMatch ? nextIdx + 1 : 0; // Gentle restart if mismatch
  return {
    isValid: isMatch,
    isComplete: isMatch && newLength === LANTERN_TARGET_SEQUENCE.length,
  };
}

// Game 2: Ticket Match
export function checkTicketMatchWin(matchedPairs: string[], totalPairs: number = 4): boolean {
  const unique = new Set(matchedPairs);
  return unique.size >= totalPairs;
}

// Game 3: Balloon Pop
export function checkBalloonPopWin(poppedTargetCount: number, goal: number = 5): boolean {
  return poppedTargetCount >= goal;
}

// Game 4: Carousel Colour
export interface CarouselColorTarget {
  left: string;
  middle: string;
  right: string;
}

export const DEFAULT_CAROUSEL_TARGET: CarouselColorTarget = {
  left: 'pink',
  middle: 'lavender',
  right: 'gold',
};

export function checkCarouselColour(
  selection: CarouselColorTarget,
  target: CarouselColorTarget = DEFAULT_CAROUSEL_TARGET
): { leftCorrect: boolean; middleCorrect: boolean; rightCorrect: boolean; isWin: boolean } {
  const leftCorrect = selection.left === target.left;
  const middleCorrect = selection.middle === target.middle;
  const rightCorrect = selection.right === target.right;
  return {
    leftCorrect,
    middleCorrect,
    rightCorrect,
    isWin: leftCorrect && middleCorrect && rightCorrect,
  };
}

// Game 5: Snack Stand
export const DEFAULT_SNACK_ORDERS = {
  tray1: 'Cotton Candy',
  tray2: 'Caramel Popcorn',
  tray3: 'Candied Apple',
};

export function checkSnackStandWin(
  trays: { tray1?: string; tray2?: string; tray3?: string },
  orders = DEFAULT_SNACK_ORDERS
): boolean {
  return (
    trays.tray1 === orders.tray1 &&
    trays.tray2 === orders.tray2 &&
    trays.tray3 === orders.tray3
  );
}

// Game 6: Ring Toss
export function checkRingTossWin(landedBottles: { left: boolean; center: boolean; right: boolean }): boolean {
  return landedBottles.left && landedBottles.center && landedBottles.right;
}

// Game 7: Star Catcher
export function checkStarCatcherWin(caughtCount: number, target: number = 5): boolean {
  return caughtCount >= target;
}

// Game 8: Friendly Whack-a-Mole
export function checkWhackAMoleWin(starsCollected: number, target: number = 5): boolean {
  return starsCollected >= target;
}

// Game 9: Ferris Wheel Seats
export const FERRIS_TARGET_SEATS: Record<number, string> = {
  1: 'Mafcik',
  2: 'Bear',
  3: 'Bunny',
  4: 'Kitten',
};

export function checkFerrisWheelWin(seats: Record<number, string>): boolean {
  return (
    seats[1] === FERRIS_TARGET_SEATS[1] &&
    seats[2] === FERRIS_TARGET_SEATS[2] &&
    seats[3] === FERRIS_TARGET_SEATS[3] &&
    seats[4] === FERRIS_TARGET_SEATS[4]
  );
}

// Game 10: Lucky Duck Pond
export const REQUIRED_DUCK_SYMBOLS = ['Crescent Moon', 'Golden Star', 'Four-Leaf Clover'];

export function checkDuckPondWin(uncovered: string[]): boolean {
  return REQUIRED_DUCK_SYMBOLS.every((sym) => uncovered.includes(sym));
}

// Game 11: Music Box Melody
export const TARGET_MELODY = [1, 3, 2, 4]; // Bell 1, 3, 2, 4

export function checkMelodyWin(played: number[], target: number[] = TARGET_MELODY): boolean {
  if (played.length !== target.length) return false;
  return played.every((val, idx) => val === target[idx]);
}

// Game 12: Firefly Trail
export interface GridCoord {
  r: number;
  c: number;
}

export function isAdjacent(a: GridCoord, b: GridCoord): boolean {
  const dr = Math.abs(a.r - b.r);
  const dc = Math.abs(a.c - b.c);
  return (dr === 1 && dc === 0) || (dr === 0 && dc === 1);
}

export function checkFireflyTrailWin(
  path: GridCoord[],
  start: GridCoord = { r: 0, c: 0 },
  finish: GridCoord = { r: 3, c: 3 },
  checkpoints: GridCoord[] = [{ r: 1, c: 2 }, { r: 2, c: 1 }]
): boolean {
  if (path.length === 0) return false;
  const first = path[0];
  const last = path[path.length - 1];

  if (first.r !== start.r || first.c !== start.c) return false;
  if (last.r !== finish.r || last.c !== finish.c) return false;

  // Verify path adjacency
  for (let i = 1; i < path.length; i++) {
    if (!isAdjacent(path[i - 1], path[i])) return false;
  }

  // Verify all checkpoints are visited
  return checkpoints.every((cp) =>
    path.some((pt) => pt.r === cp.r && pt.c === cp.c)
  );
}

// Game 13: Cupcake Workshop
export interface CupcakeRecipe {
  base: string;
  frosting: string;
  topper: string;
}

export const TARGET_CUPCAKE: CupcakeRecipe = {
  base: 'Cocoa Sponge',
  frosting: 'Berry Pink Swirl',
  topper: 'Sparkle Star',
};

export function checkCupcakeWin(
  current: CupcakeRecipe,
  target: CupcakeRecipe = TARGET_CUPCAKE
): { baseOk: boolean; frostingOk: boolean; topperOk: boolean; isWin: boolean } {
  const baseOk = current.base === target.base;
  const frostingOk = current.frosting === target.frosting;
  const topperOk = current.topper === target.topper;
  return {
    baseOk,
    frostingOk,
    topperOk,
    isWin: baseOk && frostingOk && topperOk,
  };
}

// Game 14: Prize Shelf
export const TARGET_MOVED_TOY = 'Pug Plushie';

export function checkPrizeShelfWin(selectedToy: string, targetToy: string = TARGET_MOVED_TOY): boolean {
  return selectedToy === targetToy;
}

// Game 15: Puzzle Poster
export function checkPuzzlePosterWin(tiles: number[]): boolean {
  if (tiles.length !== 9) return false;
  for (let i = 0; i < 9; i++) {
    if (tiles[i] !== i + 1) return false;
  }
  return true;
}

// Game 16: Cloud Hop
export const CLOUD_HOP_TARGET_STEPS = 5;

export function checkCloudHopWin(currentStep: number, targetSteps: number = CLOUD_HOP_TARGET_STEPS): boolean {
  return currentStep >= targetSteps;
}

// Game 17: Shooting Star Wishes
export const NIGHT_WISHES = ['Sweet Dreams', 'Warm Tea', 'Pillow Talk'];
export const DAY_WISHES = ['Sunbeam Walk', 'Carnival Dance', 'Picnic Joy'];

export function checkWishesSortWin(nightSlot: string[], daySlot: string[]): boolean {
  const nightOk = NIGHT_WISHES.every((w) => nightSlot.includes(w)) && nightSlot.length === 3;
  const dayOk = DAY_WISHES.every((w) => daySlot.includes(w)) && daySlot.length === 3;
  return nightOk && dayOk;
}

export interface WishesValidationResult {
  isWin: boolean;
  nightCorrect: string[];
  nightIncorrect: string[];
  dayCorrect: string[];
  dayIncorrect: string[];
  allPlaced: boolean;
  feedbackMessage: string;
}

export function validateShootingStarWishesDetailed(
  nightSlot: string[],
  daySlot: string[]
): WishesValidationResult {
  const nightCorrect = nightSlot.filter((w) => NIGHT_WISHES.includes(w));
  const nightIncorrect = nightSlot.filter((w) => !NIGHT_WISHES.includes(w));
  const dayCorrect = daySlot.filter((w) => DAY_WISHES.includes(w));
  const dayIncorrect = daySlot.filter((w) => !DAY_WISHES.includes(w));

  const allPlaced = nightSlot.length + daySlot.length === 6;
  const isWin =
    allPlaced &&
    nightCorrect.length === 3 &&
    nightIncorrect.length === 0 &&
    dayCorrect.length === 3 &&
    dayIncorrect.length === 0;

  let feedbackMessage = '';
  if (!allPlaced) {
    feedbackMessage = `Please place all 6 wishes into the constellations (${nightSlot.length + daySlot.length}/6 placed).`;
  } else if (isWin) {
    feedbackMessage = 'Every starlight wish is nestled in its true constellation! Sparkling victory! ✨';
  } else {
    const issues: string[] = [];
    if (nightIncorrect.length > 0) {
      issues.push(`In Night Wishes, ${nightIncorrect.map((w) => `"${w}"`).join(', ')} belongs to Day Wishes.`);
    }
    if (dayIncorrect.length > 0) {
      issues.push(`In Day Wishes, ${dayIncorrect.map((w) => `"${w}"`).join(', ')} belongs to Night Wishes.`);
    }
    feedbackMessage = issues.join(' ');
  }

  return {
    isWin,
    nightCorrect,
    nightIncorrect,
    dayCorrect,
    dayIncorrect,
    allPlaced,
    feedbackMessage,
  };
}

// Game 18: Hidden Carnival Treasures
export const CARNIVAL_TREASURES = [
  'golden-ticket',
  'sugar-wand',
  'star-balloon',
  'brass-key',
  'tiny-bell',
  'mafcik-bowtie',
];

export function checkHiddenTreasuresWin(foundIds: string[]): boolean {
  return CARNIVAL_TREASURES.every((id) => foundIds.includes(id));
}

// Game 19: Golden Key
export interface GoldenKeyProgress {
  symbolMatched: boolean;
  gemsOrdered: boolean;
  silhouetteChosen: boolean;
}

export function checkGoldenKeyWin(progress: GoldenKeyProgress): boolean {
  return progress.symbolMatched && progress.gemsOrdered && progress.silhouetteChosen;
}

// Game 20: The Final Parade
export interface ParadeProgress {
  floatsLit: boolean[]; // 4 floats
  bannerSelected: boolean;
  fireworksLaunched: boolean;
}

export function checkFinalParadeWin(progress: ParadeProgress): boolean {
  const allFloatsLit = progress.floatsLit.length === 4 && progress.floatsLit.every(Boolean);
  return allFloatsLit && progress.bannerSelected && progress.fireworksLaunched;
}
