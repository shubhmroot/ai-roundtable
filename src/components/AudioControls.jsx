import React from 'react';
import { Play, Pause, SkipForward, RotateCcw, Volume2, FastForward, Loader2, Sparkles } from 'lucide-react';

export function AudioControls({
  isPlaying,
  isLoading,
  autoAdvance,
  playbackSpeed,
  volume,
  onTogglePlay,
  onNextTurn,
  onResetEpisode,
  onToggleAutoAdvance,
  onChangeSpeed,
  onChangeVolume,
  turnCount
}) {
  return (
    <div className="rounded-2xl bg-studio-950/90 border border-slate-800 p-3 sm:p-4 shadow-2xl backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: Play/Pause, Next Turn, Reset */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Main Action Button */}
          <button
            onClick={onTogglePlay}
            disabled={isLoading}
            className={`px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/25'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Thinking...</span>
              </>
            ) : isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>{turnCount === 0 ? 'Start Podcast' : 'Resume'}</span>
              </>
            )}
          </button>

          {/* Next Turn Button */}
          <button
            onClick={onNextTurn}
            disabled={isLoading}
            className="px-3.5 py-2.5 rounded-xl bg-studio-900 hover:bg-studio-850 border border-slate-850 hover:border-slate-700 text-slate-300 hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5 disabled:opacity-40"
            title="Advance to next speaker turn"
          >
            <SkipForward className="w-4 h-4" />
            <span className="hidden sm:inline">Next Speaker</span>
          </button>

          {/* Reset Episode Button */}
          <button
            onClick={onResetEpisode}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-studio-900 hover:bg-studio-850 border border-slate-850 hover:border-slate-700 text-slate-400 hover:text-white transition-all disabled:opacity-40"
            title="Reset Episode"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Auto-advance switch */}
        <div className="flex items-center gap-2 bg-studio-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-300">
            <input
              type="checkbox"
              checked={autoAdvance}
              onChange={(e) => onToggleAutoAdvance(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-8 h-4 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-purple-600 relative"></div>
            <span className="select-none">Continuous Flow</span>
          </label>
        </div>

        {/* Right: Speed & Volume */}
        <div className="flex items-center gap-3">
          {/* Speed Pills */}
          <div className="flex items-center bg-studio-900 rounded-lg p-0.5 border border-slate-800">
            {[1.0, 1.25, 1.5].map((speed) => (
              <button
                key={speed}
                onClick={() => onChangeSpeed(speed)}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                  playbackSpeed === speed
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>

          {/* Volume Control */}
          <div className="hidden md:flex items-center gap-2 text-slate-400">
            <Volume2 className="w-4 h-4" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
              className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
