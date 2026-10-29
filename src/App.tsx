/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ViewMode } from './types';
import { loadSaveData, saveGameProgress, completeGameInStorage, clearSaveData } from './utils/storage';
import { sound } from './utils/audio';

import { Navbar } from './components/common/Navbar';
import { CarnivalIntro } from './components/intro/CarnivalIntro';
import { CarnivalMap } from './components/map/CarnivalMap';
import { TicketCollection } from './components/tickets/TicketCollection';
import { LoveLetter } from './components/letter/LoveLetter';

// Zone 1 Games (1-5)
import {
  Game1LanternLightUp,
  Game2TicketMatch,
  Game3BalloonPop,
  Game4CarouselColour,
  Game5SnackStand,
} from './components/games/Zone1Games';

// Zone 2 Games (6-10)
import {
  Game6RingToss,
  Game7StarCatcher,
  Game8WhackAMole,
  Game9FerrisWheelSeats,
  Game10LuckyDuckPond,
} from './components/games/Zone2Games';

// Zone 3 Games (11-15)
import {
  Game11MusicBoxMelody,
  Game12FireflyTrail,
  Game13CupcakeWorkshop,
  Game14PrizeShelf,
  Game15PuzzlePoster,
} from './components/games/Zone3Games';

// Zone 4 Games (16-20)
import {
  Game16CloudHop,
  Game17StarWishes,
  Game18HiddenTreasures,
  Game19GoldenKey,
  Game20FinalParade,
} from './components/games/Zone4Games';

export default function App() {
  const [saveData, setSaveData] = useState(() => loadSaveData());
  const [currentView, setCurrentView] = useState<ViewMode>(() => {
    // Check if ?autostart=1 in URL
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') {
        return 'map';
      }
    }
    const data = loadSaveData();
    return data.hasSeenIntro ? 'map' : 'intro';
  });

  const [activeGameId, setActiveGameId] = useState<number>(1);

  // Sync audio enabled state with loaded saveData
  useEffect(() => {
    sound.setEnabled(saveData.soundEnabled);
  }, [saveData.soundEnabled]);

  const handleToggleSound = () => {
    const nextVal = !saveData.soundEnabled;
    sound.setEnabled(nextVal);
    const updated = saveGameProgress({ soundEnabled: nextVal });
    setSaveData(updated);
  };

  const handleToggleMotion = () => {
    const nextVal = !saveData.reducedMotion;
    const updated = saveGameProgress({ reducedMotion: nextVal });
    setSaveData(updated);
  };

  const handleResetProgress = () => {
    const cleared = clearSaveData();
    setSaveData(cleared);
    setActiveGameId(1);
    setCurrentView('intro');
  };

  const handleEnterCarnival = () => {
    const updated = saveGameProgress({ hasSeenIntro: true });
    setSaveData(updated);
    setCurrentView('map');
  };

  const handleSelectGame = (gameId: number) => {
    setActiveGameId(gameId);
    setCurrentView('game');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGameWin = (gameId: number) => {
    const updated = completeGameInStorage(gameId);
    setSaveData(updated);

    // If game 20 is beaten, special transition to letter can be triggered
    if (gameId === 20) {
      setTimeout(() => {
        setCurrentView('letter');
      }, 3500);
    }
  };

  const handleNextGame = () => {
    if (activeGameId < 20) {
      const next = activeGameId + 1;
      setActiveGameId(next);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCurrentView('map');
    }
  };

  const renderActiveGame = () => {
    const commonProps = {
      onWin: () => handleGameWin(activeGameId),
      onBackToMap: () => setCurrentView('map'),
      onNextGame: handleNextGame,
    };

    switch (activeGameId) {
      case 1:
        return <Game1LanternLightUp {...commonProps} />;
      case 2:
        return <Game2TicketMatch {...commonProps} />;
      case 3:
        return <Game3BalloonPop {...commonProps} />;
      case 4:
        return <Game4CarouselColour {...commonProps} />;
      case 5:
        return <Game5SnackStand {...commonProps} />;
      case 6:
        return <Game6RingToss {...commonProps} />;
      case 7:
        return <Game7StarCatcher {...commonProps} />;
      case 8:
        return <Game8WhackAMole {...commonProps} />;
      case 9:
        return <Game9FerrisWheelSeats {...commonProps} />;
      case 10:
        return <Game10LuckyDuckPond {...commonProps} />;
      case 11:
        return <Game11MusicBoxMelody {...commonProps} />;
      case 12:
        return <Game12FireflyTrail {...commonProps} />;
      case 13:
        return <Game13CupcakeWorkshop {...commonProps} />;
      case 14:
        return <Game14PrizeShelf {...commonProps} />;
      case 15:
        return <Game15PuzzlePoster {...commonProps} />;
      case 16:
        return <Game16CloudHop {...commonProps} />;
      case 17:
        return <Game17StarWishes {...commonProps} />;
      case 18:
        return <Game18HiddenTreasures {...commonProps} />;
      case 19:
        return <Game19GoldenKey {...commonProps} />;
      case 20:
        return <Game20FinalParade {...commonProps} />;
      default:
        return <Game1LanternLightUp {...commonProps} />;
    }
  };

  return (
    <div className={`min-h-screen bg-[#0a0d20] text-slate-100 font-sans selection:bg-pink-500 selection:text-white ${saveData.reducedMotion ? 'motion-reduce' : ''}`}>
      {/* Navbar rendered on all views except intro */}
      {currentView !== 'intro' && (
        <Navbar
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view)}
          completedCount={saveData.completedGameIds.length}
          soundEnabled={saveData.soundEnabled}
          onToggleSound={handleToggleSound}
          reducedMotion={saveData.reducedMotion}
          onToggleMotion={handleToggleMotion}
          onResetProgress={handleResetProgress}
          onReplayIntro={() => setCurrentView('intro')}
        />
      )}

      {/* Main Views Routing */}
      <main className="w-full">
        {currentView === 'intro' && (
          <CarnivalIntro
            onEnter={handleEnterCarnival}
            onSkip={handleEnterCarnival}
            hasSeenBefore={saveData.hasSeenIntro}
            completedCount={saveData.completedGameIds.length}
            reducedMotion={saveData.reducedMotion}
          />
        )}

        {currentView === 'map' && (
          <CarnivalMap
            unlockedGameId={saveData.unlockedGameId}
            completedGameIds={saveData.completedGameIds}
            onSelectGame={handleSelectGame}
            onOpenLetter={() => setCurrentView('letter')}
          />
        )}

        {currentView === 'tickets' && (
          <TicketCollection
            completedGameIds={saveData.completedGameIds}
            onBackToMap={() => setCurrentView('map')}
            onPlayGame={handleSelectGame}
          />
        )}

        {currentView === 'letter' && (
          <LoveLetter
            completedCount={saveData.completedGameIds.length}
            onBackToMap={() => setCurrentView('map')}
          />
        )}

        {currentView === 'game' && renderActiveGame()}
      </main>
    </div>
  );
}
