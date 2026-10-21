import React from 'react';
import { Mic, Radio, Settings, Sparkles, Volume2, Code, Sliders } from 'lucide-react';

export function StudioHeader({
  topic,
  onOpenTopicModal,
  onOpenSettings,
  isLive,
  isElevenLabsActive,
  turnCount
}) {
  return (
    <header className="border-b border-slate-800/80 bg-studio-950/80 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Live Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-emerald-500 p-0.5 shadow-lg shadow-purple-500/20">
            <div className="w-full h-full bg-studio-950 rounded-[10px] flex items-center justify-center">
              <Radio className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                AI Roundtable
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  ElevenLabs Voice AI
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2">
              Multi-Agent Live Podcast with Human Interruption
              {isLive ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                  LIVE ON AIR
                </span>
              ) : (
                <span className="text-[11px] text-slate-500">Episode #{turnCount > 0 ? '1' : '0'}</span>
              )}
            </p>
          </div>
        </div>

        {/* Center: Current Topic Banner */}
        <div className="flex-1 max-w-xl mx-auto hidden md:block">
          <button
            onClick={onOpenTopicModal}
            className="w-full flex items-center justify-between gap-2 px-3.5 py-1.5 rounded-lg bg-studio-900/90 border border-slate-700/60 hover:border-purple-500/50 hover:bg-studio-850 transition-all text-left group"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
              <span className="text-xs text-slate-400 shrink-0">Topic:</span>
              <span className="text-xs font-medium text-slate-200 truncate group-hover:text-purple-300">
                {topic}
              </span>
            </div>
            <span className="text-[11px] text-purple-400/80 group-hover:text-purple-300 shrink-0 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
              Change
            </span>
          </button>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2">
          {/* ElevenLabs voice status indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-slate-900/90 border border-slate-800 text-slate-300">
            <Volume2 className={`w-3.5 h-3.5 ${isElevenLabsActive ? 'text-emerald-400' : 'text-amber-400'}`} />
            <span className="text-[11px] font-medium hidden sm:inline">
              {isElevenLabsActive ? 'ElevenLabs Audio' : 'Web Speech Mode'}
            </span>
          </div>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-studio-900 border border-slate-800 hover:border-slate-700 hover:bg-studio-850 text-slate-300 hover:text-white transition-all text-xs font-medium shadow-sm"
            title="Configure Voices & API Keys"
          >
            <Sliders className="w-3.5 h-3.5 text-purple-400" />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </header>
  );
}
