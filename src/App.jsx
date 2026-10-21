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

  // Config State
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

  // Reference to track autoAdvance inside async callbacks
  const autoAdvanceRef = useRef(autoAdvance);
  useEffect(() => {
    autoAdvanceRef.current = autoAdvance;
  }, [autoAdvance]);

  const isLiveRef = useRef(isLive);
  useEffect(() => {
    isLiveRef.current = isLive;
  }, [isLive]);

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
   */
  const fetchNextTurn = async ({ userInterruption = null, preferredSpeaker = null } = {}) => {
    if (isLoading) return;

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
          apiKey: config.geminiApiKey || config.openaiApiKey || null,
          apiProvider: config.geminiApiKey ? 'gemini' : (config.openaiApiKey ? 'openai' : 'fallback')
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const turn = await response.json();
      const turnWithId = {
        ...turn,
        id: `turn_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        voiceId: config.voices?.[turn.speakerId] || turn.voiceId
      };

      // Add to conversation history
      setHistory(prev => [...prev, turnWithId]);
      setActiveSpeakerId(turn.speakerId);
      setCurrentSentence(turn.text);

      if (userInterruption) {
        setInterruptionStatus(`${turn.speakerName} is responding to your challenge...`);
        setTimeout(() => setInterruptionStatus(null), 4000);
      }

      // Play audio via ElevenLabs or Browser fallback
      await audioEngine.playSpeech({
        text: turn.text,
        voiceId: turnWithId.voiceId,
        speakerId: turn.speakerId,
        apiKey: config.elevenLabsApiKey,
        onStart: () => {
          setIsSpeaking(true);
          setIsLoading(false);
        },
        onEnd: () => {
          setIsSpeaking(false);
          setActiveSpeakerId(null);
          // Wait 800ms natural conversational pause, then auto-advance if enabled
          if (autoAdvanceRef.current && isLiveRef.current) {
            setTimeout(() => {
              if (autoAdvanceRef.current && isLiveRef.current) {
                fetchNextTurn();
              }
            }, 800);
          }
        },
        onError: (err) => {
          console.warn('Playback error:', err);
          setIsSpeaking(false);
          setIsLoading(false);
        }
      });
    } catch (error) {
      console.error('Failed to generate turn:', error);
      setIsLoading(false);
      setIsSpeaking(false);
    }
  };

  /**
   * REAL-TIME HUMAN INTERRUPTION HANDLER
   * Instantly stops currently playing speech and pivots the roundtable
   */
  const handleInterrupt = (interruptionData) => {
    // 1. Immediately halt audio playback
    audioEngine.stop();
    setIsSpeaking(false);

    // 2. Mark the last turn as interrupted
    setHistory(prev => {
      if (prev.length === 0) return prev;
      const updated = [...prev];
      const last = updated[updated.length - 1];
      if (last && !last.isHuman) {
        updated[updated.length - 1] = { ...last, wasInterrupted: true };
      }
      return updated;
    });

    // 3. Inject human utterance into history
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

    // 4. Trigger next turn with the interruption context
    const preferredSpeaker = interruptionData.target !== 'all' ? interruptionData.target : null;
    fetchNextTurn({
      userInterruption: interruptionData,
      preferredSpeaker
    });
  };

  const handleTogglePlay = () => {
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
    audioEngine.stop();
    setIsSpeaking(false);
    setActiveSpeakerId(null);
    setCurrentSentence('');
    setHistory([]);
    setIsLive(false);
    setInterruptionStatus(null);
  };

  const handleReplayTurn = (turn) => {
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
            moderator: { name: 'Rachel / Sarah' },
            optimist: { name: 'Adam / Josh' },
            skeptic: { name: 'Nicole / Alice' }
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
