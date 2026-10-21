import React, { useState } from 'react';
import { X, Key, Sliders, Volume2, Sparkles, Check, Play, Info, ExternalLink, Bot } from 'lucide-react';
import { audioEngine } from '../services/audioEngine';

export function SettingsModal({
  isOpen,
  onClose,
  config,
  onSaveConfig
}) {
  if (!isOpen) return null;

  const [elevenLabsApiKey, setElevenLabsApiKey] = useState(config.elevenLabsApiKey || '');
  const [geminiApiKey, setGeminiApiKey] = useState(config.geminiApiKey || '');
  const [openaiApiKey, setOpenaiApiKey] = useState(config.openaiApiKey || '');
  const [voices, setVoices] = useState(config.voices || {
    moderator: '21m00Tcm4TlvDq8ikWAM', // Rachel
    optimist: 'pNInz6obpgDQGcFmaJgB',  // Adam
    skeptic: 'piTKgcLEGmPE4e6mEKli',   // Nicole
  });

  const [testingSpeaker, setTestingSpeaker] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const popularVoices = [
    { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel (Calm & Articulate - Female)" },
    { id: "pNInz6obpgDQGcFmaJgB", name: "Adam (Deep & Visionary - Male)" },
    { id: "piTKgcLEGmPE4e6mEKli", name: "Nicole (Sharp & Analytical - Female)" },
    { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah (Youthful & Expressive - Female)" },
    { id: "ErXwobaYiN019PkySvjV", name: "Antoni (Conversational & Friendly - Male)" },
    { id: "TxGEqnHWrfWFTfGW9XjX", name: "Josh (Dynamic & Bold - Male)" },
    { id: "JBFqnCBsd6RMkjVDRZzb", name: "George (British & Academic - Male)" },
    { id: "Xb7hH8MSUJpSbSDYk0k2", name: "Alice (Crisp & Confident - Female)" }
  ];

  const handleTestVoice = (speakerId, voiceId) => {
    setTestingSpeaker(speakerId);
    let sampleText = "Hello! I'm Elena Vance, moderating today's AI Roundtable.";
    if (speakerId === 'optimist') {
      sampleText = "I'm Dr. Marcus Sterling. Technological abundance will multiply human creativity!";
    } else if (speakerId === 'skeptic') {
      sampleText = "I'm Sophia Chen. We must examine the real vulnerabilities before deploying blindly.";
    }

    audioEngine.playSpeech({
      text: sampleText,
      voiceId: voiceId,
      speakerId: speakerId,
      apiKey: elevenLabsApiKey,
      onEnd: () => setTestingSpeaker(null),
      onError: () => setTestingSpeaker(null)
    });
  };

  const handleSave = () => {
    onSaveConfig({
      elevenLabsApiKey: elevenLabsApiKey.trim(),
      geminiApiKey: geminiApiKey.trim(),
      openaiApiKey: openaiApiKey.trim(),
      voices
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-studio-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between bg-studio-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Studio Audio & AI Settings</h2>
              <p className="text-xs text-slate-400">Configure ElevenLabs Voices and LLM Orchestration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* ElevenLabs API Key */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-purple-400" />
                ElevenLabs API Key
              </label>
              <a
                href="https://elevenlabs.io"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-purple-400 hover:underline flex items-center gap-1"
              >
                <span>Get API key free</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="password"
              value={elevenLabsApiKey}
              onChange={(e) => setElevenLabsApiKey(e.target.value)}
              placeholder="xi-... (Leave empty to use built-in browser speech synthesis)"
              className="w-full bg-studio-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
            />
            <p className="text-[11px] text-slate-500 flex items-start gap-1">
              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>
                If you don't enter an ElevenLabs key, the app automatically uses high-fidelity browser speech synthesis with unique voice profiles so the podcast runs 100% free!
              </span>
            </p>
          </div>

          {/* Voice Assignment per Agent */}
          <div className="space-y-4 pt-2 border-t border-slate-800/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-purple-400" />
              Agent Voice Assignment (ElevenLabs)
            </h3>

            {/* Elena Vance (Moderator) */}
            <div className="p-3 rounded-xl bg-studio-900/60 border border-slate-800 flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-purple-300">Elena Vance (Moderator)</span>
                <p className="text-[11px] text-slate-400">Host, questions & interruptions</p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={voices.moderator}
                  onChange={(e) => setVoices({ ...voices, moderator: e.target.value })}
                  className="bg-studio-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  {popularVoices.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
                <button
                  onClick={() => handleTestVoice('moderator', voices.moderator)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs"
                  title="Test Voice"
                >
                  <Play className={`w-3.5 h-3.5 ${testingSpeaker === 'moderator' ? 'text-purple-400 animate-pulse' : ''}`} />
                </button>
              </div>
            </div>

            {/* Dr. Marcus Sterling (Optimist) */}
            <div className="p-3 rounded-xl bg-studio-900/60 border border-slate-800 flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-emerald-300">Dr. Marcus Sterling (Optimist)</span>
                <p className="text-[11px] text-slate-400">Visionary, abundance & productivity</p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={voices.optimist}
                  onChange={(e) => setVoices({ ...voices, optimist: e.target.value })}
                  className="bg-studio-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  {popularVoices.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
                <button
                  onClick={() => handleTestVoice('optimist', voices.optimist)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs"
                  title="Test Voice"
                >
                  <Play className={`w-3.5 h-3.5 ${testingSpeaker === 'optimist' ? 'text-emerald-400 animate-pulse' : ''}`} />
                </button>
              </div>
            </div>

            {/* Sophia Chen (Skeptic) */}
            <div className="p-3 rounded-xl bg-studio-900/60 border border-slate-800 flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-red-300">Sophia Chen (Skeptic)</span>
                <p className="text-[11px] text-slate-400">Critical analysis, risks & limits</p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={voices.skeptic}
                  onChange={(e) => setVoices({ ...voices, skeptic: e.target.value })}
                  className="bg-studio-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-red-500"
                >
                  {popularVoices.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
                <button
                  onClick={() => handleTestVoice('skeptic', voices.skeptic)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs"
                  title="Test Voice"
                >
                  <Play className={`w-3.5 h-3.5 ${testingSpeaker === 'skeptic' ? 'text-red-400 animate-pulse' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* LLM API Keys (Optional) */}
          <div className="space-y-3 pt-2 border-t border-slate-800/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-indigo-400" />
              LLM Orchestrator (Optional)
            </h3>
            <p className="text-[11px] text-slate-400">
              The app includes a built-in smart dynamic generator. Or enter your Gemini or OpenAI API key for live LLM responses:
            </p>

            <div className="space-y-2">
              <label className="text-[11px] font-medium text-slate-300">Google Gemini API Key (Gemini 2.0 Flash)</label>
              <input
                type="password"
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                placeholder="AIzaSy... (Optional)"
                className="w-full bg-studio-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 font-mono focus:border-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-medium text-slate-300">OpenAI API Key (GPT-4o Mini)</label>
              <input
                type="password"
                value={openaiApiKey}
                onChange={(e) => setOpenaiApiKey(e.target.value)}
                placeholder="sk-... (Optional)"
                className="w-full bg-studio-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 font-mono focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-studio-900/60 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-purple-600/25"
          >
            {savedSuccess ? <Check className="w-4 h-4" /> : null}
            <span>{savedSuccess ? 'Saved!' : 'Save Settings'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
