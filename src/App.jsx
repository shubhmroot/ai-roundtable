import React, { useState, useEffect, useRef } from 'react';
import { StudioHeader } from './components/StudioHeader';
import { PodcastTable } from './components/PodcastTable';
import { InterruptionBar } from './components/InterruptionBar';
import { LiveTranscript } from './components/LiveTranscript';
import { AudioControls } from './components/AudioControls';
import { SettingsModal } from './components/SettingsModal';
import { TopicModal } from './components/TopicModal';
import { audioEngine } from './services/audioEngine';

const STORAGE_KEY = 'ai_roundtable_config_v1';

export default function App() {
  const [topic, setTopic] = useState("Will AI replace software developers by 2028?");
  const [history, setHistory] = useState([]);
  const [activeSpeakerId, setActiveSpeakerId] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSentence, setCurrentSentence] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [interruptionStatus, setInterruptionStatus] = useState(null);
  const [isLive, setIsLive] = useState(false);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTopicOpen, setIsTopicOpen] = useState(false);

  // Config State (Secrets loaded from localStorage or server .env, never hardcoded in git)
  const [config, setConfig] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return JSON.parse(stored);
      } catch (_) {}
    }
    return {
      elevenLabsApiKey: '',
      geminiApiKey: '',
      openaiApiKey: '',
      voices: {
        moderator: '21m00Tcm4TlvDq8ikWAM', // Rachel
        optimist: 'pNInz6obpgDQGcFmaJgB',  // Adam
        skeptic: 'piTKgcLEGmPE4e6mEKli',   // Nicole
      }
    };
  });

  // Trackers to prevent concurrent overlapping speeches
  const autoAdvanceRef = useRef(autoAdvance);
  useEffect(() => {
    autoAdvanceRef.current = autoAdvance;
  }, [autoAdvance]);

  const isLiveRef = useRef(isLive);
  useEffect(() => {
    isLiveRef.current = isLive;
  }, [isLive]);

  const autoAdvanceTimerRef = useRef(null);
  const turnRequestIdRef = useRef(0);

  // Clear any pending timer helper
  const clearAutoAdvanceTimer = () => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
  };

  // Save config changes
  const handleSaveConfig = (newConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
    } catch (_) {}
  };

  // Speed and volume updates
  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    audioEngine.setPlaybackRate(speed);
  };

  const handleVolumeChange = (vol) => {
    setVolume(vol);
    audioEngine.setVolume(vol);
  };

  /**
   * Main turn fetcher & audio trigger
   * Strict locking: invalidates previous audio & timers to prevent overlap!
   */
  const fetchNextTurn = async ({ userInterruption = null, preferredSpeaker = null } = {}) => {
    clearAutoAdvanceTimer();
    audioEngine.stop();
    setIsSpeaking(false);

    const currentRequestId = ++turnRequestIdRef.current;

    setIsLoading(true);
    setIsLive(true);

    try {
      const response = await fetch('/api/roundtable/turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          history,
          userInterruption,
          preferredSpeaker,
          apiKey: config.openaiApiKey || config.geminiApiKey || null,
          apiProvider: config.openaiApiKey ? 'openai' : (config.geminiApiKey ? 'gemini' : null)
        })
      });

      if (currentRequestId !== turnRequestIdRef.current) {
        return;
      }

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const turn = await response.json();

      if (currentRequestId !== turnRequestIdRef.current) {
        return;
      }

      const turnWithId = {
        ...turn,
        id: `turn_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        voiceId: config.voices?.[turn.speakerId] || turn.voiceId
      };

      setHistory(prev => [...prev, turnWithId]);
      setActiveSpeakerId(turn.speakerId);
      setCurrentSentence(turn.text);

      if (userInterruption) {
        setInterruptionStatus(`${turn.speakerName} is responding to your challenge...`);
        setTimeout(() => setInterruptionStatus(null), 4000);
      }

      await audioEngine.playSpeech({
        text: turn.text,
        voiceId: turnWithId.voiceId,
        speakerId: turn.speakerId,
        apiKey: config.elevenLabsApiKey,
        onStart: () => {
          if (currentRequestId !== turnRequestIdRef.current) return;
          setIsSpeaking(true);
          setIsLoading(false);
        },
        onEnd: () => {
          if (currentRequestId !== turnRequestIdRef.current) return;
          setIsSpeaking(false);
          setActiveSpeakerId(null);

          if (autoAdvanceRef.current && isLiveRef.current) {
            clearAutoAdvanceTimer();
            autoAdvanceTimerRef.current = setTimeout(() => {
              if (autoAdvanceRef.current && isLiveRef.current) {
                fetchNextTurn();
              }
            }, 900);
          }
        },
        onError: (err) => {
          if (currentRequestId !== turnRequestIdRef.current) return;
          console.warn('Playback error:', err);
          setIsSpeaking(false);
          setIsLoading(false);
        }
      });
    } catch (error) {
      if (currentRequestId === turnRequestIdRef.current) {
        console.error('Failed to generate turn:', error);
        setIsLoading(false);
        setIsSpeaking(false);
      }
    }
  };

  /**
   * REAL-TIME HUMAN INTERRUPTION HANDLER
   * Instantly stops currently playing speech and pivots the roundtable
   */
  const handleInterrupt = (interruptionData) => {
    clearAutoAdvanceTimer();
    audioEngine.stop();
    setIsSpeaking(false);

    setHistory(prev => {
      if (prev.length === 0) return prev;
      const updated = [...prev];
      const last = updated[updated.length - 1];
      if (last && !last.isHuman) {
        updated[updated.length - 1] = { ...last, wasInterrupted: true };
      }
      return updated;
    });

    const humanTurn = {
      id: `human_${Date.now()}`,
      speakerId: 'listener',
      speakerName: 'You (Listener)',
      role: 'Audience Participant',
      text: interruptionData.text,
      timestamp: interruptionData.timestamp,
      isHuman: true
    };

    setHistory(prev => [...prev, humanTurn]);
    setInterruptionStatus(`You interrupted! Elena is pivoting the debate...`);

    const preferredSpeaker = interruptionData.target !== 'all' ? interruptionData.target : null;
    fetchNextTurn({
      userInterruption: interruptionData,
      preferredSpeaker
    });
  };

  const handleTogglePlay = () => {
    clearAutoAdvanceTimer();
    if (isSpeaking) {
      audioEngine.stop();
      setIsSpeaking(false);
      setIsLive(false);
    } else {
      setIsLive(true);
      fetchNextTurn();
    }
  };

  const handleResetEpisode = () => {
    clearAutoAdvanceTimer();
    audioEngine.stop();
    setIsSpeaking(false);
    setActiveSpeakerId(null);
    setCurrentSentence('');
    setHistory([]);
    setIsLive(false);
    setInterruptionStatus(null);
  };

  const handleReplayTurn = (turn) => {
    clearAutoAdvanceTimer();
    audioEngine.stop();
    setActiveSpeakerId(turn.speakerId);
    setCurrentSentence(turn.text);
    audioEngine.playSpeech({
      text: turn.text,
      voiceId: config.voices?.[turn.speakerId] || turn.voiceId,
      speakerId: turn.speakerId,
      apiKey: config.elevenLabsApiKey,
      onStart: () => setIsSpeaking(true),
      onEnd: () => {
        setIsSpeaking(false);
        setActiveSpeakerId(null);
      }
    });
  };

  const activeSpeakerName = history.find(t => t.speakerId === activeSpeakerId)?.speakerName;

  return (
    <div className="min-h-screen bg-studio-950 flex flex-col text-slate-100 selection:bg-purple-600 selection:text-white">
      {/* Studio Header */}
      <StudioHeader
        topic={topic}
        onOpenTopicModal={() => setIsTopicOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isLive={isLive}
        isElevenLabsActive={Boolean(config.elevenLabsApiKey && config.elevenLabsApiKey.length > 5)}
        turnCount={history.length}
      />

      {/* Main Studio Arena */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Top: Roundtable Visualizer Desk */}
        <PodcastTable
          activeSpeakerId={activeSpeakerId}
          isSpeaking={isSpeaking}
          currentSentence={currentSentence}
          interruptionStatus={interruptionStatus}
          onQuickInterrupt={(text) => handleInterrupt({ text, target: 'all', timestamp: new Date().toISOString() })}
          voiceProfiles={{
            moderator: { name: 'Rachel (Host)' },
            optimist: { name: 'Adam (Optimist)' },
            skeptic: { name: 'Nicole (Skeptic)' }
          }}
        />

        {/* Center: Real-Time Human Interruption Control Bar */}
        <InterruptionBar
          onInterrupt={handleInterrupt}
          isSpeaking={isSpeaking}
          activeSpeakerName={activeSpeakerName}
          disabled={isLoading}
        />

        {/* Live Synchronized Transcript */}
        <LiveTranscript
          history={history}
          activeSpeakerId={activeSpeakerId}
          isSpeaking={isSpeaking}
          onReplayTurn={handleReplayTurn}
        />
      </main>

      {/* Floating Bottom Audio Controls Bar */}
      <footer className="sticky bottom-0 z-40 p-4 border-t border-slate-800/80 bg-studio-950/90 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto">
          <AudioControls
            isPlaying={isSpeaking || isLive}
            isLoading={isLoading}
            autoAdvance={autoAdvance}
            playbackSpeed={playbackSpeed}
            volume={volume}
            onTogglePlay={handleTogglePlay}
            onNextTurn={() => fetchNextTurn()}
            onResetEpisode={handleResetEpisode}
            onToggleAutoAdvance={setAutoAdvance}
            onChangeSpeed={handleSpeedChange}
            onChangeVolume={handleVolumeChange}
            turnCount={history.length}
          />
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onSaveConfig={handleSaveConfig}
      />

      {/* Topic Selection Modal */}
      <TopicModal
        isOpen={isTopicOpen}
        onClose={() => setIsTopicOpen(false)}
        currentTopic={topic}
        onSelectTopic={(newTopic) => {
          handleResetEpisode();
          setTopic(newTopic);
        }}
      />
    </div>
  );
}
