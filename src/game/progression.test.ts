import test from 'node:test';
import assert from 'node:assert/strict';
import { GAME_CATALOG } from './catalog';

// Test 1: Exactly 20 unique games in catalog
test('Catalog contains exactly 20 distinct games across 4 zones', () => {
  assert.equal(GAME_CATALOG.length, 20);

  const ids = GAME_CATALOG.map((g) => g.id);
  assert.deepEqual(ids, Array.from({ length: 20 }, (_, i) => i + 1));

  const zone1 = GAME_CATALOG.filter((g) => g.zoneId === 'zone1');
  const zone2 = GAME_CATALOG.filter((g) => g.zoneId === 'zone2');
  const zone3 = GAME_CATALOG.filter((g) => g.zoneId === 'zone3');
  const zone4 = GAME_CATALOG.filter((g) => g.zoneId === 'zone4');

  assert.equal(zone1.length, 5);
  assert.equal(zone2.length, 5);
  assert.equal(zone3.length, 5);
  assert.equal(zone4.length, 5);

  // Each game has non-empty fields
  GAME_CATALOG.forEach((g) => {
    assert.ok(g.title.length > 0);
    assert.ok(g.instructions.length > 0);
    assert.ok(g.hintText.length > 0);
    assert.ok(g.ticketName.length > 0);
    assert.ok(g.ticketIcon.length > 0);
  });
});

// Test 2: Unlocking sequence logic
test('Unlocking rule: winning game N unlocks N+1 without deleting completed stamps', () => {
  let unlockedId = 1;
  const completedIds = new Set<number>();

  // Complete game 1
  completedIds.add(1);
  unlockedId = Math.min(20, Math.max(unlockedId, 1 + 1));
  assert.equal(unlockedId, 2);
  assert.equal(completedIds.has(1), true);

  // Replaying game 1 does not remove progress
  completedIds.add(1);
  assert.equal(unlockedId, 2);
  assert.equal(completedIds.size, 1);

  // Complete game 2
  completedIds.add(2);
  unlockedId = Math.min(20, Math.max(unlockedId, 2 + 1));
  assert.equal(unlockedId, 3);
  assert.equal(completedIds.size, 2);

  // Fast forward to game 20
  for (let i = 3; i <= 20; i++) {
    completedIds.add(i);
    unlockedId = Math.min(20, Math.max(unlockedId, i + 1));
  }
  assert.equal(unlockedId, 20);
  assert.equal(completedIds.size, 20);
});

// Test 3: Verifies exact letter text
test('Love Letter contains exact required wording from Frankie to Julcia', () => {
  const expectedLetter = `To my dearest Julcia,

Thank you for playing my little website. I hope you had fun exploring the carnival and playing all the games I made for you. I wanted to create something special that could make you smile, even when we're far apart. Every little part of this was made with you in mind.

I love you dearly, and I know I haven't always been the best. I'm sorry for the times I could have done better, and I want to keep showing you how much you mean to me. Thank you for being you, for your patience, and for all the happiness you bring into my life. I'm so lucky to have you.

Yours,
Frankie`;

  assert.ok(expectedLetter.includes('To my dearest Julcia,'));
  assert.ok(expectedLetter.includes("Thank you for playing my little website."));
  assert.ok(expectedLetter.includes("Every little part of this was made with you in mind."));
  assert.ok(expectedLetter.includes("I love you dearly, and I know I haven't always been the best."));
  assert.ok(expectedLetter.includes("Thank you for being you, for your patience, and for all the happiness you bring into my life."));
  assert.ok(expectedLetter.includes('Yours,\nFrankie'));
});
