export type ZoneId = 'zone1' | 'zone2' | 'zone3' | 'zone4';

export interface GameInfo {
  id: number;
  zoneId: ZoneId;
  zoneName: string;
  title: string;
  subtitle: string;
  instructions: string;
  hintText: string;
  ticketName: string;
  ticketIcon: string;
  ticketColor: string;
}

export interface CarnivalSaveData {
  version: number;
  unlockedGameId: number; // Highest unlocked game (1-20)
  completedGameIds: number[]; // List of completed game IDs
  hasSeenIntro: boolean;
  soundEnabled: boolean;
  reducedMotion: boolean;
  lastUpdated: number;
}

export type ViewMode = 'intro' | 'map' | 'game' | 'tickets' | 'letter';
