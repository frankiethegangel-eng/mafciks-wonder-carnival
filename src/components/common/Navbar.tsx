import React, { useState } from 'react';
import { ViewMode } from '../../types';
import { Volume2, VolumeX, Sparkles, Map, Mail, Ticket, RotateCcw, HelpCircle, Download } from 'lucide-react';
import { sound } from '../../utils/audio';

interface NavbarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  completedCount: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  reducedMotion: boolean;
  onToggleMotion: () => void;
  onResetProgress: () => void;
  onReplayIntro: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  completedCount,
  soundEnabled,
  onToggleSound,
  reducedMotion,
  onToggleMotion,
  onResetProgress,
  onReplayIntro,
}) => {
  const [showResetModal, setShowResetModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-md border-b border-pink-500/20 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
          {/* Brand & Subtitle */}
          <button
            onClick={() => {
              sound.playClick();
              onNavigate('map');
            }}
            className="flex items-center gap-2.5 text-left group transition-transform active:scale-95"
            aria-label="Mafcik's Wonder Carnival home"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-amber-300 p-0.5 shadow-md group-hover:shadow-pink-500/30 transition-all">
              <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-lg">
                🎡
              </div>
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-extrabold tracking-tight bg-gradient-to-r from-pink-300 via-purple-200 to-amber-200 bg-clip-text text-transparent">
                Mafcik's Wonder Carnival
              </h1>
              <p className="hidden sm:block text-[10px] text-pink-300/70 font-medium">
                Frankie &amp; Julcia's Adventure
              </p>
            </div>
          </button>

          {/* Nav Items */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {/* Map Link */}
            <button
              onClick={() => {
                sound.playClick();
                onNavigate('map');
              }}
              className={`min-h-[40px] px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                currentView === 'map'
                  ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40 shadow-[0_0_12px_rgba(236,72,153,0.25)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
              aria-label="View carnival map"
            >
              <Map className="w-4 h-4" />
              <span className="hidden md:inline">Carnival Map</span>
            </button>

            {/* Stamps Link */}
            <button
              onClick={() => {
                sound.playClick();
                onNavigate('tickets');
              }}
              className={`min-h-[40px] px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                currentView === 'tickets'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
              aria-label="View collected tickets and stamps"
            >
              <Ticket className="w-4 h-4" />
              <span className="hidden md:inline">Stamps</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/30 text-pink-200 border border-pink-400/30">
                {completedCount}/20
              </span>
            </button>

            {/* Frankie's Letter Link */}
            <button
              onClick={() => {
                sound.playClick();
                onNavigate('letter');
              }}
              className={`min-h-[40px] px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                currentView === 'letter'
                  ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 shadow-[0_0_12px_rgba(251,191,36,0.25)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
              aria-label="View Frankie's letter for Julcia"
            >
              <Mail className="w-4 h-4 text-amber-300" />
              <span className="hidden md:inline">Frankie's Letter</span>
              {completedCount === 20 && (
                <span className="animate-pulse w-2 h-2 rounded-full bg-amber-400" />
              )}
            </button>

            {/* Sound Toggle Button */}
            <button
              onClick={() => {
                onToggleSound();
                if (!soundEnabled) {
                  sound.playClick();
                }
              }}
              className={`min-h-[40px] min-w-[40px] p-2 rounded-xl text-xs flex items-center justify-center transition-colors ${
                soundEnabled ? 'text-pink-300 hover:bg-white/5' : 'text-slate-500 hover:bg-white/5'
              }`}
              title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
              aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Settings & Help Modal Trigger */}
            <button
              onClick={() => {
                sound.playClick();
                setShowSettingsModal(true);
              }}
              className="min-h-[40px] min-w-[40px] p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 text-xs flex items-center justify-center transition-colors"
              title="Carnival Settings & Information"
              aria-label="Open Carnival Settings"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </nav>
        </div>
      </header>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-pink-500/30 rounded-3xl p-6 text-white shadow-2xl relative">
            <h3 className="text-xl font-bold bg-gradient-to-r from-pink-300 to-amber-200 bg-clip-text text-transparent mb-1">
              Carnival Settings
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Customize your wonder carnival experience, Julcia.
            </p>

            <div className="space-y-4">
              {/* Sound Option */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
                <div>
                  <div className="text-sm font-semibold flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-pink-400" />
                    Chime Sound Effects
                  </div>
                  <div className="text-xs text-slate-400">Gentle tones and win fanfares</div>
                </div>
                <button
                  onClick={onToggleSound}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                    soundEnabled ? 'bg-pink-500' : 'bg-slate-700'
                  }`}
                  aria-label="Toggle chime sounds"
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      soundEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Reduced Motion Option */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
                <div>
                  <div className="text-sm font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    Reduced Motion
                  </div>
                  <div className="text-xs text-slate-400">Calm transitions without heavy animations</div>
                </div>
                <button
                  onClick={onToggleMotion}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                    reducedMotion ? 'bg-purple-500' : 'bg-slate-700'
                  }`}
                  aria-label="Toggle reduced motion"
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      reducedMotion ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Replay Intro */}
              <button
                onClick={() => {
                  setShowSettingsModal(false);
                  onReplayIntro();
                }}
                className="w-full py-2.5 px-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-colors text-left flex items-center justify-between"
              >
                <span>Replay Carnival Intro Cinematic</span>
                <span className="text-pink-300">Play →</span>
              </button>

              {/* Download Project ZIP Archive */}
              <a
                href="/mafciks-wonder-carnival.zip"
                download="mafciks-wonder-carnival.zip"
                onClick={() => sound.playSparkle()}
                className="w-full py-2.5 px-4 rounded-2xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/40 text-xs font-semibold text-emerald-200 transition-colors text-left flex items-center justify-between group"
              >
                <span className="flex items-center gap-2">
                  <Download className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-y-0.5 transition-transform" />
                  Download Complete Project (.ZIP)
                </span>
                <span className="text-emerald-400 font-bold">.ZIP ⬇</span>
              </a>

              {/* Reset Progress Trigger */}
              <button
                onClick={() => {
                  setShowSettingsModal(false);
                  setShowResetModal(true);
                }}
                className="w-full py-2.5 px-4 rounded-2xl bg-red-950/30 hover:bg-red-900/40 border border-red-500/30 text-xs font-semibold text-red-300 transition-colors text-left flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Carnival Progress
                </span>
                <span className="text-red-400">Reset</span>
              </button>
            </div>

            <button
              onClick={() => setShowSettingsModal(false)}
              className="mt-6 w-full py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl font-bold text-sm text-white shadow-lg shadow-pink-500/20 active:scale-98 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Explicit Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-red-500/40 rounded-3xl p-6 text-white shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mb-3">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Reset All Carnival Progress?</h4>
            <p className="text-xs text-slate-300 mb-6 leading-relaxed">
              This will clear all 20 game completions and ticket stamps back to the start so you can play through Mafcik’s Wonder Carnival again from the beginning.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetModal(false)}
                className="flex-1 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-xs font-bold text-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onResetProgress();
                  setShowResetModal(false);
                }}
                className="flex-1 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white shadow-lg shadow-red-600/30 transition-colors"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
