import React, { useState } from 'react';
import { ArrowLeft, Heart, Mail, Sparkles, AlertCircle } from 'lucide-react';
import { MafcikMascot } from '../common/MafcikMascot';
import { sound } from '../../utils/audio';

interface LoveLetterProps {
  completedCount: number;
  onBackToMap: () => void;
}

export const LoveLetter: React.FC<LoveLetterProps> = ({
  completedCount,
  onBackToMap,
}) => {
  const isFullyUnlocked = completedCount >= 20;
  const [spoilerAccepted, setSpoilerAccepted] = useState(isFullyUnlocked);
  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(false);

  return (
    <div className="relative min-h-screen py-8 px-4 sm:px-6 w-full flex flex-col justify-between text-white overflow-hidden bg-gradient-to-b from-[#090b1a] via-[#120d26] to-[#1a1130]">
      {/* Floating lanterns in the quiet night sky */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-pink-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-[140px]" />

        {/* Ambient floating lanterns */}
        {[
          { left: '10%', top: '20%', color: '#f472b6', size: 'scale-90', delay: '0s' },
          { left: '85%', top: '30%', color: '#fbbf24', size: 'scale-100', delay: '2s' },
          { left: '75%', top: '75%', color: '#c084fc', size: 'scale-75', delay: '4s' },
          { left: '15%', top: '70%', color: '#6ee7b7', size: 'scale-85', delay: '1.5s' },
        ].map((lantern, idx) => (
          <div
            key={idx}
            className={`absolute ${lantern.size} animate-pulse pointer-events-none`}
            style={{ left: lantern.left, top: lantern.top, animationDuration: '4s', animationDelay: lantern.delay }}
          >
            <div
              className="w-8 h-12 rounded-2xl border border-white/40 flex items-center justify-center text-xs shadow-lg"
              style={{
                backgroundColor: lantern.color,
                boxShadow: `0 0 25px ${lantern.color}88`,
              }}
            >
              🏮
            </div>
          </div>
        ))}
      </div>

      {/* Top Navigation */}
      <div className="relative z-10 max-w-3xl mx-auto w-full mb-6 flex items-center justify-between">
        <button
          onClick={() => {
            sound.playClick();
            onBackToMap();
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-700/60 shadow-sm transition-colors active:scale-95"
          aria-label="Return to carnival map"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Carnival Map</span>
        </button>

        <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>The Starlit Pavilion</span>
        </div>
      </div>

      {/* Main Letter Content Area */}
      <div className="relative z-10 max-w-2xl mx-auto w-full flex-1 flex flex-col items-center justify-center">
        {/* If user hasn't beaten all 20 games and hasn't dismissed spoiler guard */}
        {!spoilerAccepted ? (
          <div className="bg-slate-900/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-amber-400/40 shadow-2xl text-center max-w-lg animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center mx-auto mb-4 border border-amber-400/50">
              <AlertCircle className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-bold text-amber-200 mb-2">
              Gentle Spoiler Notice
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              You’ve currently completed <strong className="text-pink-300">{completedCount} of 20</strong> carnival attractions. This letter was created to be read after you finish the Grand Finale at Stall 20!
              <br /><br />
              Would you like to open it now, or return to play through the remaining stalls?
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  sound.playClick();
                  onBackToMap();
                }}
                className="flex-1 py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/15 text-xs font-bold text-slate-200 transition-colors"
              >
                Return to Carnival
              </button>
              <button
                onClick={() => {
                  sound.playSparkle();
                  setSpoilerAccepted(true);
                }}
                className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-400 hover:to-pink-400 text-xs font-bold text-slate-950 shadow-lg transition-all"
              >
                Read Letter Now
              </button>
            </div>
          </div>
        ) : !isEnvelopeOpened ? (
          /* Folded Envelope State */
          <div className="text-center animate-fade-in my-auto">
            <div className="flex justify-center mb-4">
              <MafcikMascot mood="happy" speech="Frankie wrote this with all his heart for you, Julcia! 🐾" size="md" showNameTag={false} />
            </div>

            {/* Folded Envelope Card */}
            <div
              onClick={() => {
                sound.playSparkle();
                setIsEnvelopeOpened(true);
              }}
              className="group cursor-pointer mx-auto w-72 sm:w-88 p-6 rounded-3xl bg-gradient-to-br from-[#fefaf0] via-[#fdf4e3] to-[#faecd5] border-2 border-amber-400/60 shadow-[0_15px_40px_rgba(251,191,36,0.25)] text-slate-900 transition-transform duration-300 hover:scale-105 active:scale-98 select-none"
              role="button"
              tabIndex={0}
              aria-label="Open Frankie's letter envelope"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  sound.playSparkle();
                  setIsEnvelopeOpened(true);
                }
              }}
            >
              <div className="flex justify-between items-center text-xs text-amber-800 font-serif italic mb-6">
                <span>Hand-Delivered with Love</span>
                <span className="text-base">💌</span>
              </div>

              <div className="py-6 border-y border-amber-300/40 text-center">
                <div className="text-xs uppercase tracking-widest text-amber-800/70 font-semibold mb-1">
                  For
                </div>
                <div className="text-2xl font-serif font-black text-amber-950 tracking-wide">
                  Julcia
                </div>
                <div className="text-xs text-amber-800/80 mt-1 italic">
                  From Frankie
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs font-bold text-pink-700 bg-pink-100/70 py-2 px-4 rounded-full border border-pink-200">
                <Mail className="w-4 h-4 text-pink-600" />
                <span>Tap to Open Letter</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              </div>
            </div>
          </div>
        ) : (
          /* Unfolded Parchment Letter Presentation */
          <div className="w-full bg-[#fdfbf7] text-slate-900 rounded-3xl p-6 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] border-2 border-amber-200 relative my-auto animate-fade-in">
            {/* Subtle paper seal & decorative corner accents */}
            <div className="absolute top-4 right-4 text-xs font-serif italic text-amber-800/50">
              October 2026
            </div>

            <div className="flex items-center gap-2 mb-6 text-pink-600">
              <Heart className="w-5 h-5 fill-pink-500 text-pink-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-pink-700">
                A Letter for Julcia
              </span>
            </div>

            {/* Exact Letter Text Preserved Verbatim */}
            <div className="space-y-4 font-serif text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-line text-left">
              <p className="text-lg font-bold text-amber-950">
                To my dearest Julcia,
              </p>

              <p>
                Thank you for playing my little website. I hope you had fun exploring the carnival and playing all the games I made for you. I wanted to create something special that could make you smile, even when we're far apart. Every little part of this was made with you in mind.
              </p>

              <p>
                I love you dearly, and I know I haven't always been the best. I'm sorry for the times I could have done better, and I want to keep showing you how much you mean to me. Thank you for being you, for your patience, and for all the happiness you bring into my life. I'm so lucky to have you.
              </p>

              <div className="pt-4 text-right">
                <p className="text-base sm:text-lg font-bold text-amber-950">
                  Yours,
                </p>
                <p className="text-lg sm:text-xl font-bold font-serif text-pink-700 italic">
                  Frankie
                </p>
              </div>
            </div>

            {/* Footer Mafcik cuddle */}
            <div className="mt-8 pt-4 border-t border-amber-200/70 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <MafcikMascot mood="happy" size="sm" showNameTag={false} />
                <span className="italic">Mafcik sends warm puppy cuddles too. 🐾</span>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  setIsEnvelopeOpened(false);
                }}
                className="text-xs font-semibold text-amber-800 hover:text-amber-950 underline"
              >
                Fold Envelope
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Ambient bottom note */}
      <div className="relative z-10 max-w-md mx-auto text-center text-[11px] text-slate-400 pt-6">
        The lanterns will keep burning here, night after night.
      </div>
    </div>
  );
};
