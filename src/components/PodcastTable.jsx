import React from 'react';
import { Mic, Volume2, Sparkles, AlertCircle, User, Bot, Radio } from 'lucide-react';

export function PodcastTable({
  activeSpeakerId,
  isSpeaking,
  currentSentence,
  interruptionStatus,
  onQuickInterrupt,
  voiceProfiles
}) {
  const agents = [
    {
      id: 'moderator',
      name: 'Elena Vance',
      role: 'The Moderator & Host',
      voiceName: voiceProfiles?.moderator?.name || 'Rachel (Calm & Articulate)',
      color: 'moderator',
      bgActive: 'bg-purple-950/40 border-purple-500 shadow-purple-500/20',
      avatarBg: 'bg-purple-600',
      tagColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      avatarInitials: 'EV',
      position: 'top',
      tagline: 'Balances flow & orchestrates debate'
    },
    {
      id: 'optimist',
      name: 'Dr. Marcus Sterling',
      role: 'The Tech Optimist',
      voiceName: voiceProfiles?.optimist?.name || 'Adam (Energetic & Visionary)',
      color: 'optimist',
      bgActive: 'bg-emerald-950/40 border-emerald-500 shadow-emerald-500/20',
      avatarBg: 'bg-emerald-600',
      tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      avatarInitials: 'MS',
      position: 'left',
      tagline: 'Champions productivity & innovation'
    },
    {
      id: 'skeptic',
      name: 'Sophia Chen',
      role: 'The Critical Analyst',
      voiceName: voiceProfiles?.skeptic?.name || 'Nicole (Sharp & Analytical)',
      color: 'skeptic',
      bgActive: 'bg-red-950/40 border-red-500 shadow-red-500/20',
      avatarBg: 'bg-red-600',
      tagColor: 'text-red-400 bg-red-500/10 border-red-500/20',
      avatarInitials: 'SC',
      position: 'right',
      tagline: 'Questions risks, limits & ethics'
    }
  ];

  return (
    <div className="relative w-full rounded-2xl bg-gradient-to-b from-studio-900/90 to-studio-950/95 border border-slate-800/80 p-6 lg:p-8 overflow-hidden shadow-2xl backdrop-blur-xl">
      {/* Background Studio Ambient Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Center Studio Desk Branding */}
      <div className="flex flex-col items-center justify-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 mb-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Virtual Roundtable Studio · ElevenLabs Synthesizer</span>
        </div>

        {interruptionStatus && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/20 border border-sky-500/40 text-xs font-semibold text-sky-300 animate-bounce shadow-lg shadow-sky-500/10">
            <AlertCircle className="w-4 h-4 text-sky-400" />
            <span>{interruptionStatus}</span>
          </div>
        )}
      </div>

      {/* Grid of Agent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 relative z-10">
        {agents.map((agent) => {
          const isActive = activeSpeakerId === agent.id;
          const isActivelyTalking = isActive && isSpeaking;

          return (
            <div
              key={agent.id}
              className={`relative rounded-xl p-5 border transition-all duration-300 flex flex-col justify-between ${
                isActive
                  ? `${agent.bgActive} shadow-xl scale-[1.02]`
                  : 'bg-studio-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-studio-850/60'
              }`}
            >
              {/* Active Speaker Animated Ring & Border */}
              {isActivelyTalking && (
                <div className="absolute inset-0 rounded-xl border-2 border-current pointer-events-none opacity-40 animate-pulse" style={{ color: agent.id === 'moderator' ? '#a78bfa' : agent.id === 'optimist' ? '#34d399' : '#f87171' }} />
              )}

              {/* Top Row: Avatar & Status */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="relative">
                    <div className={`w-14 h-14 rounded-2xl ${agent.avatarBg} text-white font-bold text-lg flex items-center justify-center shadow-md relative z-10 transition-transform ${isActivelyTalking ? 'scale-105' : ''}`}>
                      {agent.avatarInitials}
                    </div>

                    {/* Equalizer Wave / Pulse around avatar */}
                    {isActivelyTalking && (
                      <div className="absolute -inset-1 rounded-2xl border-2 border-white/60 animate-ping opacity-30" />
                    )}
                  </div>

                  {/* Status Indicator */}
                  <div className="text-right">
                    {isActivelyTalking ? (
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-900/90 border border-slate-700 text-xs font-medium text-white shadow">
                        <div className="flex items-center gap-0.5 h-3 text-purple-400">
                          <span className="eq-bar"></span>
                          <span className="eq-bar"></span>
                          <span className="eq-bar"></span>
                          <span className="eq-bar"></span>
                        </div>
                        <span className="text-[11px] font-semibold">Speaking</span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-medium px-2 py-0.5 rounded-full bg-slate-900/40">
                        Listening
                      </span>
                    )}
                  </div>
                </div>

                {/* Name & Role */}
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                    {agent.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${agent.tagColor}`}>
                      {agent.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {agent.tagline}
                  </p>
                </div>
              </div>

              {/* Voice Badge & Live Speech Preview */}
              <div className="mt-4 pt-3 border-t border-slate-800/60">
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
                  <span className="flex items-center gap-1 text-slate-400 font-mono text-[10px]">
                    <Volume2 className="w-3 h-3 text-slate-400" />
                    {agent.voiceName}
                  </span>
                </div>

                {/* Current Spoken Bubble if active */}
                {isActive && currentSentence ? (
                  <div className="p-3 rounded-lg bg-studio-950/80 border border-slate-800 text-xs text-slate-200 italic leading-relaxed animate-fadeIn">
                    "{currentSentence}"
                  </div>
                ) : (
                  <div className="h-10 flex items-center text-[11px] text-slate-600 italic">
                    Ready for next prompt...
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Human Listener Station at Bottom of Roundtable */}
      <div className="mt-6 rounded-xl border border-sky-500/30 bg-gradient-to-r from-sky-950/40 via-studio-900/60 to-sky-950/40 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-300 flex items-center justify-center font-bold text-sm shrink-0">
            <User className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-white">Live Listener (You)</h4>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                Participant
              </span>
            </div>
            <p className="text-xs text-slate-400">
              You have the microphone. Interrupt any speaker at any moment to challenge ideas or steer the debate.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onQuickInterrupt('Wait, what about job displacement and entry-level coders?')}
            className="text-[11px] px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white transition-all"
          >
            "Ask about jobs"
          </button>
          <button
            onClick={() => onQuickInterrupt('Sophia, do you buy Marcus’s claims on productivity?')}
            className="text-[11px] px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white transition-all"
          >
            "Challenge Sophia"
          </button>
        </div>
      </div>
    </div>
  );
}
