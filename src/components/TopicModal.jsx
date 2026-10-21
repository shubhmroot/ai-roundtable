import React, { useState } from 'react';
import { X, Sparkles, MessageSquare, ArrowRight, Radio } from 'lucide-react';

export function TopicModal({
  isOpen,
  onClose,
  currentTopic,
  onSelectTopic
}) {
  if (!isOpen) return null;

  const [customTopic, setCustomTopic] = useState('');

  const PRESET_TOPICS = [
    {
      category: "Tech & Work",
      title: "Will AI replace software developers by 2028?",
      description: "Explores developer productivity multipliers vs junior dev displacement and code hallucination."
    },
    {
      category: "Frontier AI",
      title: "Autonomous Agents: Superhuman leverage or catastrophic security liability?",
      description: "Debating agents executing real code, system access, and runaway recursive workflows."
    },
    {
      category: "Voice & Media",
      title: "The Future of Voice AI: Can synthetic multi-agent podcasts replace human talk shows?",
      description: "Examining real-time conversation dynamics, emotional prosody, and synthetic media authenticity."
    },
    {
      category: "Philosophy & Society",
      title: "Should humanity pause frontier AI research until safety alignment is proven?",
      description: "Weighing accelerationism vs existential risk, regulatory capture, and global competition."
    },
    {
      category: "Economy",
      title: "Universal Basic Income: The only viable economic safety net in an AI world?",
      description: "Examining post-labor economics, tax revenue from compute, and human purpose."
    }
  ];

  const handleSubmitCustom = (e) => {
    e.preventDefault();
    if (customTopic.trim()) {
      onSelectTopic(customTopic.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-studio-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between bg-studio-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Select Roundtable Topic</h2>
              <p className="text-xs text-slate-400">Choose a preset or type any custom debate topic</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Custom Input */}
          <form onSubmit={handleSubmitCustom} className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">
              Type Custom Debate Topic
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="e.g. Is remote work dead in 2026?"
                className="flex-1 bg-studio-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                disabled={!customTopic.trim()}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-xs font-bold transition-all shrink-0 flex items-center gap-1.5"
              >
                <span>Set</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Presets */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Curated Hackathon Topics
            </span>

            <div className="space-y-2.5">
              {PRESET_TOPICS.map((preset, idx) => {
                const isCurrent = currentTopic === preset.title;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      onSelectTopic(preset.title);
                      onClose();
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between group ${
                      isCurrent
                        ? 'bg-purple-950/30 border-purple-500/50 shadow-md'
                        : 'bg-studio-900/50 border-slate-800 hover:border-slate-700 hover:bg-studio-850'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-800 text-purple-400 border border-slate-700">
                        {preset.category}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] text-purple-400 font-bold">Current</span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-slate-200 group-hover:text-purple-300 transition-colors">
                      {preset.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {preset.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
