import React, { useRef, useEffect, useState } from 'react';
import { Volume2, Play, Download, Copy, Check, ArrowDown, User, Bot, Radio } from 'lucide-react';

export function LiveTranscript({
  history,
  activeSpeakerId,
  isSpeaking,
  onReplayTurn
}) {
  const scrollRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [copied, setCopied] = useState(false);

  // Auto scroll to bottom when new turns arrive
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, autoScroll]);

  const copyTranscript = () => {
    const text = history.map(turn => {
      const time = new Date(turn.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return `[${time}] ${turn.speakerName} (${turn.role}):\n${turn.text}\n`;
    }).join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTranscript = () => {
    const markdown = `# AI Roundtable: Real-Time Multi-Agent Podcast Transcript
Generated on: ${new Date().toLocaleString()}

---

${history.map(turn => {
  const time = new Date(turn.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `### [${time}] **${turn.speakerName}** _(${turn.role})_\n\n> ${turn.text}\n`;
}).join('\n')}
`;

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `roundtable-transcript-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-2xl bg-studio-900/80 border border-slate-800 flex flex-col h-[520px] shadow-xl backdrop-blur-md overflow-hidden">
      {/* Transcript Header */}
      <div className="px-5 py-3.5 border-b border-slate-800/80 bg-studio-950/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-400"></div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            Live Synchronized Transcript
          </h3>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
            {history.length} turns
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`text-[11px] px-2 py-1 rounded-md border flex items-center gap-1 transition-all ${
              autoScroll
                ? 'bg-purple-500/10 border-purple-500/30 text-purple-300'
                : 'bg-slate-800/50 border-slate-700 text-slate-400'
            }`}
          >
            <ArrowDown className="w-3 h-3" />
            <span>Auto-scroll</span>
          </button>

          <button
            onClick={copyTranscript}
            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
            title="Copy Transcript"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={downloadTranscript}
            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
            title="Download Markdown"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Transcript List */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-sm"
      >
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 p-6">
            <Radio className="w-8 h-8 text-slate-600 mb-2 animate-pulse" />
            <p className="text-sm font-medium text-slate-400">Roundtable is warming up</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Press "Start Discussion" below to kick off the debate. Elena will set the stage and bring in Marcus & Sophia.
            </p>
          </div>
        ) : (
          history.map((turn, index) => {
            const isListener = turn.speakerId === 'listener' || turn.isHuman;
            const isElena = turn.speakerId === 'moderator';
            const isMarcus = turn.speakerId === 'optimist';
            const isSophia = turn.speakerId === 'skeptic';

            let badgeColor = 'bg-purple-500/20 text-purple-300 border-purple-500/30';
            let roleBg = 'bg-purple-600';
            if (isMarcus) {
              badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
              roleBg = 'bg-emerald-600';
            } else if (isSophia) {
              badgeColor = 'bg-red-500/20 text-red-300 border-red-500/30';
              roleBg = 'bg-red-600';
            } else if (isListener) {
              badgeColor = 'bg-sky-500/20 text-sky-300 border-sky-500/30';
              roleBg = 'bg-sky-600';
            }

            const timeFormatted = new Date(turn.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            });

            return (
              <div
                key={turn.id || index}
                className={`group relative rounded-xl p-4 transition-all duration-200 border ${
                  isListener
                    ? 'bg-sky-950/20 border-sky-500/40 shadow-md'
                    : 'bg-studio-950/50 border-slate-800/80 hover:border-slate-700/80'
                }`}
              >
                {/* Speaker Header */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-md ${roleBg} text-white font-bold text-[10px] flex items-center justify-center shrink-0`}>
                      {isListener ? <User className="w-3.5 h-3.5" /> : turn.speakerName?.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="font-semibold text-xs text-white">
                      {turn.speakerName}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${badgeColor}`}>
                      {turn.role}
                    </span>
                    {turn.wasInterrupted && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Interrupted
                      </span>
                    )}
                    {turn.isInterruptionResponse && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                        Addressing Listener
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-500">
                      {timeFormatted}
                    </span>
                    {!isListener && onReplayTurn && (
                      <button
                        onClick={() => onReplayTurn(turn)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-opacity"
                        title="Replay this statement"
                      >
                        <Play className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Spoken Content */}
                <p className={`text-xs sm:text-sm leading-relaxed ${isListener ? 'text-sky-200 font-medium' : 'text-slate-300'}`}>
                  {turn.text}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
