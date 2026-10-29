import { CarnivalSaveData } from '../types';

const STORAGE_KEY = 'mafcik_carnival_save_v1';

export const INITIAL_SAVE_DATA: CarnivalSaveData = {
  version: 1,
  unlockedGameId: 1, // Game 1 starts unlocked
  completedGameIds: [],
  hasSeenIntro: false,
  soundEnabled: true,
  reducedMotion: false,
  lastUpdated: Date.now(),
};

export function loadSaveData(): CarnivalSaveData {
  if (typeof window === 'undefined') return { ...INITIAL_SAVE_DATA };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...INITIAL_SAVE_DATA };

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return { ...INITIAL_SAVE_DATA };
    }

    // Validate schema
    const unlockedGameId = typeof parsed.unlockedGameId === 'number' && parsed.unlockedGameId >= 1 && parsed.unlockedGameId <= 20
      ? parsed.unlockedGameId
      : 1;

    const completedGameIds = Array.isArray(parsed.completedGameIds)
      ? parsed.completedGameIds.filter((id: unknown): id is number => typeof id === 'number' && id >= 1 && id <= 20)
      : [];

    return {
      version: 1,
      unlockedGameId,
      completedGameIds: Array.from(new Set(completedGameIds)),
      hasSeenIntro: Boolean(parsed.hasSeenIntro),
      soundEnabled: parsed.soundEnabled !== false, // default true
      reducedMotion: Boolean(parsed.reducedMotion),
      lastUpdated: parsed.lastUpdated || Date.now(),
    };
  } catch (e) {
    console.warn('Could not parse carnival save data, resetting safely:', e);
    return { ...INITIAL_SAVE_DATA };
  }
}

export function saveGameProgress(data: Partial<CarnivalSaveData>): CarnivalSaveData {
  if (typeof window === 'undefined') return { ...INITIAL_SAVE_DATA, ...data };

  try {
    const current = loadSaveData();
    const updated: CarnivalSaveData = {
      ...current,
      ...data,
      lastUpdated: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn('Could not persist carnival progress to localStorage:', e);
    return { ...INITIAL_SAVE_DATA, ...data };
  }
}

export function completeGameInStorage(gameId: number): CarnivalSaveData {
  const current = loadSaveData();
  const completedSet = new Set(current.completedGameIds);
  completedSet.add(gameId);

  // Unlocking rule: winning game N unlocks game N + 1 (capped at 20)
  const nextUnlock = Math.min(20, Math.max(current.unlockedGameId, gameId + 1));

  return saveGameProgress({
    completedGameIds: Array.from(completedSet),
    unlockedGameId: nextUnlock,
  });
}

export function clearSaveData(): CarnivalSaveData {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  return { ...INITIAL_SAVE_DATA };
}
