import React from 'react';
import { MafcikMascot } from '../common/MafcikMascot';
import { Sparkles, ArrowRight, Play, Heart } from 'lucide-react';
import { sound } from '../../utils/audio';

interface CarnivalIntroProps {
  onEnter: () => void;
  onSkip: () => void;
  hasSeenBefore: boolean;
  completedCount: number;
  reducedMotion: boolean;
}

export const CarnivalIntro: React.FC<CarnivalIntroProps> = ({
  onEnter,
  onSkip,
  hasSeenBefore,
  completedCount,
  reducedMotion,
}) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#0c0f24] via-[#141a3d] to-[#1e1338] text-white flex flex-col justify-between py-8 px-4 sm:px-6">
      {/* Whimsical Night Sky with Twinkling Stars and Lanterns */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft atmospheric gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-pink-600/15 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px]" />

        {/* Twinkling star field */}
        <svg className="w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
          {[
            { cx: '12%', cy: '15%', r: 2 },
            { cx: '25%', cy: '25%', r: 2.5 },
            { cx: '40%', cy: '10%', r: 1.5 },
            { cx: '60%', cy: '18%', r: 2 },
            { cx: '75%', cy: '12%', r: 2.5 },
            { cx: '88%', cy: '22%', r: 1.5 },
            { cx: '18%', cy: '45%', r: 2 },
            { cx: '82%', cy: '50%', r: 2.2 },
            { cx: '35%', cy: '60%', r: 1.5 },
            { cx: '70%', cy: '65%', r: 2 },
            { cx: '50%', cy: '35%', r: 3 },
          ].map((star, i) => (
            <circle
              key={i}
              cx={star.cx}
              cy={star.cy}
              r={star.r}
              fill="#fef08a"
              className={reducedMotion ? '' : 'animate-pulse'}
              style={{ animationDelay: `${i * 0.4}s` }}
            />
          ))}
        </svg>

        {/* Paper Festival Lanterns hanging from garlands */}
        <div className="absolute top-0 left-0 w-full flex justify-around px-2 sm:px-12 pt-2">
          {['#f472b6', '#fbbf24', '#c084fc', '#34d399', '#f472b6'].map((color, i) => (
            <div
              key={i}
              className={`flex flex-col items-center origin-top ${
                reducedMotion ? '' : 'animate-bounce'
              }`}
              style={{
                animationDuration: `${3.5 + i * 0.5}s`,
                animationIterationCount: 'infinite',
              }}
            >
              <div className="w-0.5 h-6 sm:h-12 bg-amber-200/40" />
              <div
                className="w-7 h-10 sm:w-10 sm:h-14 rounded-2xl shadow-lg border border-white/30 flex items-center justify-center text-xs font-bold"
                style={{
                  backgroundColor: color,
                  boxShadow: `0 0 20px ${color}88`,
                }}
              >
                🏮
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Skip Intro / Info Bar */}
      <div className="relative z-10 max-w-4xl mx-auto w-full flex justify-end">
        <button
          onClick={() => {
            sound.playClick();
            onSkip();
          }}
          className="text-xs font-semibold text-pink-200/80 hover:text-white px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          aria-label="Skip introduction and proceed directly to map"
        >
          Skip Intro →
        </button>
      </div>

      {/* Center Cinematic Content */}
      <div className="relative z-10 max-w-2xl mx-auto text-center flex flex-col items-center my-auto px-4">
        {/* Softly rotating Ferris Wheel in background behind title */}
        <div className="relative mt-4 mb-2 flex items-center justify-center min-h-[220px] sm:min-h-[260px]">
          <div
            className={`w-40 h-40 sm:w-52 sm:h-52 rounded-full border-4 border-dashed border-pink-400/30 flex items-center justify-center relative ${
              reducedMotion ? '' : 'animate-[spin_45s_linear_infinite]'
            }`}
          >
            {/* Spokes */}
            <div className="absolute inset-0 border-t-2 border-pink-400/20 my-auto" />
            <div className="absolute inset-0 border-l-2 border-pink-400/20 mx-auto" />
            <div className="w-12 h-12 rounded-full border-2 border-amber-300/40 bg-purple-900/40" />
          </div>

          {/* Mafcik Mascot center arrival */}
          <div className="absolute inset-0 flex items-center justify-center">
            <MafcikMascot
              mood="cheering"
              speech="Woof! Welcome Julcia! I’ve been waiting for you! 🐾"
              size="hero"
              showNameTag={false}
            />
          </div>
        </div>

        {/* Title & Romantic Subtitle */}
        <div className="mt-4 mb-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-400/40 text-xs font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            A Special Carnival Night
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white drop-shadow-[0_4px_16px_rgba(236,72,153,0.4)]">
            MAFCIK'S WONDER CARNIVAL
          </h1>

          <p className="mt-2 text-sm sm:text-lg text-pink-200/90 font-medium">
            Twenty little adventures, one unforgettable night.
          </p>

          <p className="mt-1 text-xs sm:text-sm text-amber-300/90 font-semibold flex items-center justify-center gap-1.5">
            <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400 inline" />
            Created with love by Frankie for Julcia
          </p>
        </div>

        {/* Description & Inviting Card */}
        <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl p-4 sm:p-6 border border-pink-500/30 shadow-2xl max-w-lg mt-4 mb-6">
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Stroll through lantern-lit lanes, play twenty original carnival attractions, collect golden ticket stamps, and unlock a special handwritten letter waiting at the heart of the fairground.
          </p>

          {completedCount > 0 && (
            <div className="mt-3 text-xs font-bold text-emerald-300 bg-emerald-950/40 py-1.5 px-3 rounded-xl border border-emerald-500/30 inline-block">
              Progress saved: {completedCount} / 20 Stamps Collected
            </div>
          )}
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
          {hasSeenBefore ? (
            <>
              <button
                onClick={() => {
                  sound.playSparkle();
                  onEnter();
                }}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-amber-500 hover:from-pink-400 hover:to-amber-400 text-white font-black text-sm sm:text-base shadow-[0_0_25px_rgba(236,72,153,0.5)] flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <span>Continue Adventure</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                sound.playSparkle();
                onEnter();
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-amber-500 hover:from-pink-400 hover:to-amber-400 text-white font-black text-sm sm:text-base shadow-[0_0_25px_rgba(236,72,153,0.5)] flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <span>Enter The Carnival</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Footer credits */}
      <div className="relative z-10 text-center text-[11px] text-slate-400 font-medium">
        Made with affection • Mafcik the Pug Mascot 🐾 • 20 Interactive Carnival Stalls
      </div>
    </div>
  );
};
