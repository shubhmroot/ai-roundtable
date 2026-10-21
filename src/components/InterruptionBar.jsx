import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Send, Hand, CornerDownLeft, Sparkles, MessageSquare } from 'lucide-react';
import { voiceInput } from '../services/speechRecognition';

export function InterruptionBar({
  onInterrupt,
  isSpeaking,
  activeSpeakerName,
  disabled
}) {
  const [inputText, setInputText] = useState('');
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [micInterim, setMicInterim] = useState('');
  const [targetSpeaker, setTargetSpeaker] = useState('all');

  const quickChallenges = [
    { label: 'Job losses & juniors', text: 'Wait, what about the destruction of entry-level developer jobs?' },
    { label: 'Hallucination & safety', text: 'Compilers never hallucinated false code. How do you trust an agent in production?' },
    { label: 'Marcus: Prove it', text: 'Marcus, do you actually have empirical data, or is this just hype?' },
    { label: 'Sophia: Counter Marcus', text: 'Sophia, Marcus claims software demand is infinite. How do you counter that?' }
  ];

  // Handle voice mic toggle
  const toggleMicrophone = () => {
    if (isListeningMic) {
      voiceInput.stopListening();
      setIsListeningMic(false);
      if (micInterim) {
        triggerInterrupt(micInterim);
        setMicInterim('');
      }
    } else {
      setIsListeningMic(true);
      setMicInterim('');
      voiceInput.startListening({
        onInterim: (text) => setMicInterim(text),
        onResult: (text) => {
          setIsListeningMic(false);
          setInputText(text);
          triggerInterrupt(text);
        },
        onEnd: () => {
          setIsListeningMic(false);
        },
        onError: (err) => {
          console.warn('Microphone error:', err);
          setIsListeningMic(false);
        }
      });
    }
  };

  const triggerInterrupt = (text) => {
    const query = (text || inputText).trim();
    if (!query) return;

    onInterrupt({
      text: query,
      target: targetSpeaker,
      timestamp: new Date().toISOString()
    });

    setInputText('');
    setMicInterim('');
    if (isListeningMic) {
      voiceInput.stopListening();
      setIsListeningMic(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      triggerInterrupt();
    }
  };

  return (
    <div className="rounded-2xl bg-studio-900/90 border border-slate-800 p-4 sm:p-5 shadow-xl backdrop-blur-md">
      {/* Header and Quick Prompts */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
            <Hand className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Human Interruption Deck
            </span>
            <span className="text-[11px] text-slate-400 block sm:inline sm:ml-2">
              {isSpeaking ? `Interrupting will instantly halt ${activeSpeakerName || 'speaker'}` : 'Speak or type to inject a prompt'}
            </span>
          </div>
        </div>

        {/* Target Speaker Selector */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="text-[11px]">Direct to:</span>
          <select
            value={targetSpeaker}
            onChange={(e) => setTargetSpeaker(e.target.value)}
            className="bg-studio-950 border border-slate-700/80 rounded-md px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
          >
            <option value="all">Panel (Elena Moderates)</option>
            <option value="optimist">Marcus (Optimist)</option>
            <option value="skeptic">Sophia (Skeptic)</option>
          </select>
        </div>
      </div>

      {/* Quick Interrupt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-3 no-scrollbar">
        <span className="text-[11px] font-medium text-slate-500 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-sky-400" /> Quick Chips:
        </span>
        {quickChallenges.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => triggerInterrupt(chip.text)}
            disabled={disabled}
            className="shrink-0 px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-sky-500/10 hover:border-sky-500/40 border border-slate-700/80 text-slate-300 hover:text-sky-300 text-xs transition-all flex items-center gap-1"
          >
            <span>{chip.label}</span>
          </button>
        ))}
      </div>

      {/* Live Mic Interim Banner */}
      {isListeningMic && (
        <div className="mb-3 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-between gap-3 text-xs text-red-300 animate-pulse">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <span className="font-semibold">Listening to your microphone...</span>
            <span className="text-slate-200 italic">{micInterim || "Speak your question now..."}</span>
          </div>
          <button
            onClick={() => toggleMicrophone()}
            className="px-2 py-0.5 rounded bg-red-500 text-white font-medium text-[11px] hover:bg-red-600"
          >
            Done
          </button>
        </div>
      )}

      {/* Input bar */}
      <div className="flex items-center gap-2">
        {/* Mic Toggle Button */}
        <button
          onClick={toggleMicrophone}
          disabled={disabled}
          title={isListeningMic ? "Stop recording and interrupt" : "Speak to interrupt with your microphone"}
          className={`p-2.5 rounded-xl border font-medium flex items-center justify-center transition-all shrink-0 ${
            isListeningMic
              ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-500/30 animate-pulse'
              : 'bg-studio-950 hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
          }`}
        >
          {isListeningMic ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-sky-400" />}
        </button>

        {/* Text Input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={
              isSpeaking
                ? `Jump in now! Type to interrupt ${activeSpeakerName || 'speaker'}...`
                : "Type a question or challenge for the roundtable..."
            }
            className="w-full bg-studio-950/90 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 transition-all"
          />
        </div>

        {/* Interrupt Send Button */}
        <button
          onClick={() => triggerInterrupt()}
          disabled={disabled || !inputText.trim()}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-lg shadow-sky-600/20 transition-all shrink-0"
        >
          <Hand className="w-4 h-4" />
          <span className="hidden sm:inline">Interrupt Panel</span>
          <span className="sm:hidden">Send</span>
        </button>
      </div>
    </div>
  );
}
