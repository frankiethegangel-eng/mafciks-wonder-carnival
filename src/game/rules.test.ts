import test from 'node:test';
import assert from 'node:assert/strict';
import {
  checkLanternStep,
  LANTERN_TARGET_SEQUENCE,
  checkTicketMatchWin,
  checkBalloonPopWin,
  checkCarouselColour,
  DEFAULT_CAROUSEL_TARGET,
  checkSnackStandWin,
  DEFAULT_SNACK_ORDERS,
  checkRingTossWin,
  checkStarCatcherWin,
  checkWhackAMoleWin,
  checkFerrisWheelWin,
  FERRIS_TARGET_SEATS,
  checkDuckPondWin,
  checkMelodyWin,
  TARGET_MELODY,
  checkFireflyTrailWin,
  checkCupcakeWin,
  TARGET_CUPCAKE,
  checkPrizeShelfWin,
  TARGET_MOVED_TOY,
  checkPuzzlePosterWin,
  checkCloudHopWin,
  checkWishesSortWin,
  validateShootingStarWishesDetailed,
  NIGHT_WISHES,
  DAY_WISHES,
  checkHiddenTreasuresWin,
  CARNIVAL_TREASURES,
  checkGoldenKeyWin,
  checkFinalParadeWin,
} from './rules';

// 1. Lantern Light-Up
test('Game 1: Lantern Light-Up - correctly checks sequence and win', () => {
  let seq: string[] = [];
  for (let i = 0; i < LANTERN_TARGET_SEQUENCE.length - 1; i++) {
    const res = checkLanternStep(seq, LANTERN_TARGET_SEQUENCE[i]);
    assert.equal(res.isValid, true);
    assert.equal(res.isComplete, false);
    seq.push(LANTERN_TARGET_SEQUENCE[i]);
  }
  // final step completes it
  const finalRes = checkLanternStep(seq, LANTERN_TARGET_SEQUENCE[LANTERN_TARGET_SEQUENCE.length - 1]);
  assert.equal(finalRes.isValid, true);
  assert.equal(finalRes.isComplete, true);

  // Invalid step
  const badRes = checkLanternStep(['pink'], 'wrong_color');
  assert.equal(badRes.isValid, false);
  assert.equal(badRes.isComplete, false);
});

// 2. Ticket Match
test('Game 2: Ticket Match - validates 4 matched pairs', () => {
  assert.equal(checkTicketMatchWin(['popcorn', 'ferris', 'carousel', 'star']), true);
  assert.equal(checkTicketMatchWin(['popcorn', 'ferris', 'carousel']), false);
});

// 3. Balloon Pop
test('Game 3: Balloon Pop - validates 5 target balloons popped', () => {
  assert.equal(checkBalloonPopWin(5), true);
  assert.equal(checkBalloonPopWin(4), false);
  assert.equal(checkBalloonPopWin(6), true);
});

// 4. Carousel Colour
test('Game 4: Carousel Colour - validates correct three-horse pattern', () => {
  const win = checkCarouselColour({ left: 'pink', middle: 'lavender', right: 'gold' });
  assert.equal(win.isWin, true);
  assert.equal(win.leftCorrect, true);

  const fail = checkCarouselColour({ left: 'mint', middle: 'lavender', right: 'gold' });
  assert.equal(fail.isWin, false);
  assert.equal(fail.leftCorrect, false);
});

// 5. Snack Stand
test('Game 5: Snack Stand - validates matching snack orders', () => {
  assert.equal(checkSnackStandWin(DEFAULT_SNACK_ORDERS), true);
  assert.equal(checkSnackStandWin({ ...DEFAULT_SNACK_ORDERS, tray1: 'Popcorn' }), false);
});

// 6. Ring Toss
test('Game 6: Ring Toss - validates all 3 bottles ringed', () => {
  assert.equal(checkRingTossWin({ left: true, center: true, right: true }), true);
  assert.equal(checkRingTossWin({ left: true, center: false, right: true }), false);
});

// 7. Star Catcher
test('Game 7: Star Catcher - validates 5 stars caught', () => {
  assert.equal(checkStarCatcherWin(5), true);
  assert.equal(checkStarCatcherWin(3), false);
});

// 8. Whack-a-Mole Friendly
test('Game 8: Whack-a-Mole - validates 5 stars gathered from friends', () => {
  assert.equal(checkWhackAMoleWin(5), true);
  assert.equal(checkWhackAMoleWin(2), false);
});

// 9. Ferris Wheel Seats
test('Game 9: Ferris Wheel Seats - validates positional clues', () => {
  assert.equal(checkFerrisWheelWin(FERRIS_TARGET_SEATS), true);
  assert.equal(checkFerrisWheelWin({ 1: 'Bear', 2: 'Mafcik', 3: 'Bunny', 4: 'Kitten' }), false);
});

// 10. Lucky Duck Pond
test('Game 10: Lucky Duck Pond - validates all 3 carnival emblems found', () => {
  assert.equal(checkDuckPondWin(['Crescent Moon', 'Golden Star', 'Four-Leaf Clover']), true);
  assert.equal(checkDuckPondWin(['Crescent Moon', 'Golden Star']), false);
});

// 11. Music Box Melody
test('Game 11: Music Box Melody - validates 4-note sequence', () => {
  assert.equal(checkMelodyWin([1, 3, 2, 4]), true);
  assert.equal(checkMelodyWin([1, 2, 3, 4]), false);
  assert.equal(checkMelodyWin([1, 3, 2]), false);
});

// 12. Firefly Trail
test('Game 12: Firefly Trail - validates connected path visiting checkpoints', () => {
  // 4x4 grid: (0,0) -> (0,1) -> (0,2) -> (1,2: cp) -> (1,1) -> (2,1: cp) -> (3,1) -> (3,2) -> (3,3: end)
  const validPath = [
    { r: 0, c: 0 },
    { r: 0, c: 1 },
    { r: 0, c: 2 },
    { r: 1, c: 2 }, // cp 1
    { r: 1, c: 1 },
    { r: 2, c: 1 }, // cp 2
    { r: 3, c: 1 },
    { r: 3, c: 2 },
    { r: 3, c: 3 },
  ];
  assert.equal(checkFireflyTrailWin(validPath), true);

  // Missing checkpoint
  const pathWithoutCheckpoint = [
    { r: 0, c: 0 },
    { r: 1, c: 0 },
    { r: 2, c: 0 },
    { r: 3, c: 0 },
    { r: 3, c: 1 },
    { r: 3, c: 2 },
    { r: 3, c: 3 },
  ];
  assert.equal(checkFireflyTrailWin(pathWithoutCheckpoint), false);
});

// 13. Cupcake Workshop
test('Game 13: Cupcake Workshop - validates 3 cake attributes', () => {
  const win = checkCupcakeWin(TARGET_CUPCAKE);
  assert.equal(win.isWin, true);
  assert.equal(win.baseOk && win.frostingOk && win.topperOk, true);

  const wrong = checkCupcakeWin({ ...TARGET_CUPCAKE, frosting: 'Vanilla Cream' });
  assert.equal(wrong.isWin, false);
  assert.equal(wrong.frostingOk, false);
});

// 14. Prize Shelf
test('Game 14: Prize Shelf - spots the moved toy', () => {
  assert.equal(checkPrizeShelfWin('Pug Plushie', TARGET_MOVED_TOY), true);
  assert.equal(checkPrizeShelfWin('Teddy Bear', TARGET_MOVED_TOY), false);
});

// 15. Puzzle Poster
test('Game 15: Puzzle Poster - validates 3x3 tiles restored', () => {
  assert.equal(checkPuzzlePosterWin([1, 2, 3, 4, 5, 6, 7, 8, 9]), true);
  assert.equal(checkPuzzlePosterWin([1, 3, 2, 4, 5, 6, 7, 8, 9]), false);
});

// 16. Cloud Hop
test('Game 16: Cloud Hop - validates 5 steps across clouds', () => {
  assert.equal(checkCloudHopWin(5), true);
  assert.equal(checkCloudHopWin(4), false);
});

// 17. Shooting Star Wishes
test('Game 17: Shooting Star Wishes - validates constellation sorting and detailed feedback', () => {
  // Full win
  assert.equal(checkWishesSortWin(NIGHT_WISHES, DAY_WISHES), true);
  assert.equal(checkWishesSortWin(['Sweet Dreams'], ['Sunbeam Walk']), false);

  const detailedWin = validateShootingStarWishesDetailed(NIGHT_WISHES, DAY_WISHES);
  assert.equal(detailedWin.isWin, true);
  assert.equal(detailedWin.allPlaced, true);
  assert.equal(detailedWin.nightIncorrect.length, 0);
  assert.equal(detailedWin.dayIncorrect.length, 0);

  // Partial placement
  const partial = validateShootingStarWishesDetailed(['Sweet Dreams', 'Warm Tea'], ['Sunbeam Walk']);
  assert.equal(partial.isWin, false);
  assert.equal(partial.allPlaced, false);

  // One swapped wish
  const swapped = validateShootingStarWishesDetailed(
    ['Sweet Dreams', 'Warm Tea', 'Sunbeam Walk'], // Sunbeam Walk is Day Wish
    ['Pillow Talk', 'Carnival Dance', 'Picnic Joy'] // Pillow Talk is Night Wish
  );
  assert.equal(swapped.isWin, false);
  assert.equal(swapped.allPlaced, true);
  assert.deepEqual(swapped.nightIncorrect, ['Sunbeam Walk']);
  assert.deepEqual(swapped.dayIncorrect, ['Pillow Talk']);
  assert.ok(swapped.feedbackMessage.includes('Sunbeam Walk'));
  assert.ok(swapped.feedbackMessage.includes('Pillow Talk'));
});

// 18. Hidden Carnival Treasures
test('Game 18: Hidden Carnival Treasures - validates all 6 items found', () => {
  assert.equal(checkHiddenTreasuresWin(CARNIVAL_TREASURES), true);
  assert.equal(checkHiddenTreasuresWin(['golden-ticket', 'sugar-wand']), false);
});

// 19. Golden Key
test('Game 19: Golden Key - validates 3-step lock progression', () => {
  assert.equal(checkGoldenKeyWin({ symbolMatched: true, gemsOrdered: true, silhouetteChosen: true }), true);
  assert.equal(checkGoldenKeyWin({ symbolMatched: true, gemsOrdered: false, silhouetteChosen: true }), false);
});

// 20. The Final Parade
test('Game 20: The Final Parade - validates floats lit, banner chosen, fireworks launched', () => {
  assert.equal(checkFinalParadeWin({ floatsLit: [true, true, true, true], bannerSelected: true, fireworksLaunched: true }), true);
  assert.equal(checkFinalParadeWin({ floatsLit: [true, true, false, true], bannerSelected: true, fireworksLaunched: true }), false);
  assert.equal(checkFinalParadeWin({ floatsLit: [true, true, true, true], bannerSelected: true, fireworksLaunched: false }), false);
});
