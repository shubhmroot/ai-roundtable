// High-Performance Audio Engine for Multi-Agent Speech Synthesis with Concurrency Lock

class AudioEngine {
  constructor() {
    this.currentAudio = null;
    this.currentUtterance = null;
    this.isPlaying = false;
    this.playbackRate = 1.0;
    this.volume = 1.0;
    this.cachedVoices = [];
    this.activeSpeakerId = null;
    this.currentSessionId = 0; // Incremented on every speech start or stop

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initSpeechSynthesis();
    }
  }

  initSpeechSynthesis() {
    const loadVoices = () => {
      this.cachedVoices = window.speechSynthesis.getVoices();
    };
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  setPlaybackRate(rate) {
    this.playbackRate = rate;
    if (this.currentAudio) {
      this.currentAudio.playbackRate = rate;
    }
  }

  setVolume(vol) {
    this.volume = vol;
    if (this.currentAudio) {
      this.currentAudio.volume = vol;
    }
  }

  /**
   * Stop any playing audio immediately with strict session invalidation
   * (Prevents voice overlap and race conditions!)
   */
  stop() {
    this.currentSessionId++; // Invalidate any pending callbacks
    this.isPlaying = false;
    this.activeSpeakerId = null;

    if (this.currentAudio) {
      try {
        this.currentAudio.onplay = null;
        this.currentAudio.onended = null;
        this.currentAudio.onerror = null;
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio.src = '';
      } catch (e) {
        console.warn('Error stopping audio element:', e);
      }
      this.currentAudio = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        if (this.currentUtterance) {
          this.currentUtterance.onstart = null;
          this.currentUtterance.onend = null;
          this.currentUtterance.onerror = null;
          this.currentUtterance = null;
        }
        window.speechSynthesis.cancel();
      } catch (e) {
        console.warn('Error cancelling speech synthesis:', e);
      }
    }
  }

  /**
   * Play speech using ElevenLabs API or Web Speech API Fallback
   */
  async playSpeech({ text, voiceId, speakerId, apiKey, onStart, onEnd, onError }) {
    // 1. Immediately kill any prior audio & invalidate previous sessions
    this.stop();
    const sessionId = ++this.currentSessionId;
    this.activeSpeakerId = speakerId;

    const hasElevenKey = Boolean(apiKey && apiKey.trim().length > 5);

    if (hasElevenKey) {
      try {
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            voiceId,
            apiKey: apiKey.trim()
          })
        });

        // If user cancelled / clicked next while fetching, discard this result!
        if (sessionId !== this.currentSessionId) {
          return;
        }

        const contentType = response.headers.get('content-type') || '';
        if (response.ok && contentType.includes('audio')) {
          const blob = await response.blob();

          if (sessionId !== this.currentSessionId) {
            return;
          }

          const audioUrl = URL.createObjectURL(blob);
          const audio = new Audio(audioUrl);
          audio.playbackRate = this.playbackRate;
          audio.volume = this.volume;
          this.currentAudio = audio;

          audio.onplay = () => {
            if (sessionId !== this.currentSessionId) {
              audio.pause();
              return;
            }
            this.isPlaying = true;
            if (onStart) onStart({ mode: 'elevenlabs' });
          };

          audio.onended = () => {
            URL.revokeObjectURL(audioUrl);
            if (sessionId !== this.currentSessionId) return;
            this.isPlaying = false;
            this.activeSpeakerId = null;
            if (onEnd) onEnd();
          };

          audio.onerror = (e) => {
            URL.revokeObjectURL(audioUrl);
            if (sessionId !== this.currentSessionId) return;
            console.warn('ElevenLabs playback error, falling back:', e);
            this.playWithBrowserTTS({ text, speakerId, sessionId, onStart, onEnd, onError });
          };

          await audio.play();
          return;
        } else {
          const errData = await response.json().catch(() => ({}));
          console.info('ElevenLabs fallback notice:', errData.message || errData.error);
        }
      } catch (err) {
        if (sessionId !== this.currentSessionId) return;
        console.warn('ElevenLabs fetch failed, using browser fallback:', err);
      }
    }

    // Fallback: Web Speech API
    if (sessionId === this.currentSessionId) {
      this.playWithBrowserTTS({ text, speakerId, sessionId, onStart, onEnd, onError });
    }
  }

  /**
   * Fallback using browser's built-in Web Speech API with session protection
   */
  playWithBrowserTTS({ text, speakerId, sessionId, onStart, onEnd, onError }) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onError) onError(new Error('Speech Synthesis not supported in this browser.'));
      return;
    }

    if (sessionId && sessionId !== this.currentSessionId) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = this.playbackRate;
    utterance.volume = this.volume;

    const voices = this.cachedVoices.length ? this.cachedVoices : window.speechSynthesis.getVoices();
    const englishVoices = voices.filter(v => v.lang.startsWith('en'));

    if (speakerId === 'moderator') {
      const hostVoice = englishVoices.find(v => v.name.includes('Samantha') || v.name.includes('Victoria') || v.name.includes('Karen') || (v.name.includes('Female') && v.lang.includes('GB'))) || englishVoices[0];
      if (hostVoice) utterance.voice = hostVoice;
      utterance.pitch = 1.05;
    } else if (speakerId === 'optimist') {
      const maleVoice = englishVoices.find(v => v.name.includes('Daniel') || v.name.includes('Alex') || v.name.includes('David') || (v.name.includes('Male') && !v.name.includes('Female'))) || englishVoices[1] || englishVoices[0];
      if (maleVoice) utterance.voice = maleVoice;
      utterance.pitch = 0.95;
    } else if (speakerId === 'skeptic') {
      const skepticVoice = englishVoices.find(v => v.name.includes('Zira') || v.name.includes('Moira') || v.name.includes('Google UK English Female') || v.name.includes('Fiona')) || englishVoices[2] || englishVoices[0];
      if (skepticVoice) utterance.voice = skepticVoice;
      utterance.pitch = 1.15;
    }

    utterance.onstart = () => {
      if (sessionId && sessionId !== this.currentSessionId) {
        window.speechSynthesis.cancel();
        return;
      }
      this.isPlaying = true;
      if (onStart) onStart({ mode: 'browser' });
    };

    utterance.onend = () => {
      if (sessionId && sessionId !== this.currentSessionId) return;
      this.isPlaying = false;
      this.activeSpeakerId = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (event) => {
      if (sessionId && sessionId !== this.currentSessionId) return;
      if (event.error === 'canceled' || event.error === 'interrupted') {
        return;
      }
      this.isPlaying = false;
      this.activeSpeakerId = null;
      if (onError) onError(event);
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }
}

export const audioEngine = new AudioEngine();
