// High-Performance Audio Engine for Multi-Agent Speech Synthesis

class AudioEngine {
  constructor() {
    this.currentAudio = null;
    this.currentUtterance = null;
    this.isPlaying = false;
    this.playbackRate = 1.0;
    this.volume = 1.0;
    this.cachedVoices = [];
    this.activeSpeakerId = null;

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
   * Stop any playing audio immediately (Critical for Interruptions!)
   */
  stop() {
    this.isPlaying = false;
    this.activeSpeakerId = null;

    if (this.currentAudio) {
      try {
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
        window.speechSynthesis.cancel();
      } catch (e) {
        console.warn('Error cancelling speech synthesis:', e);
      }
      this.currentUtterance = null;
    }
  }

  /**
   * Play speech using ElevenLabs API or Web Speech API Fallback
   */
  async playSpeech({ text, voiceId, speakerId, apiKey, onStart, onEnd, onError }) {
    // Ensure prior audio is stopped completely
    this.stop();
    this.isPlaying = true;
    this.activeSpeakerId = speakerId;

    // Check if ElevenLabs API key is present
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

        // Check if response is audio/mpeg
        const contentType = response.headers.get('content-type') || '';
        if (response.ok && contentType.includes('audio')) {
          const blob = await response.blob();
          const audioUrl = URL.createObjectURL(blob);
          const audio = new Audio(audioUrl);
          audio.playbackRate = this.playbackRate;
          audio.volume = this.volume;
          this.currentAudio = audio;

          audio.onplay = () => {
            if (onStart) onStart({ mode: 'elevenlabs' });
          };

          audio.onended = () => {
            this.isPlaying = false;
            this.activeSpeakerId = null;
            URL.revokeObjectURL(audioUrl);
            if (onEnd) onEnd();
          };

          audio.onerror = (e) => {
            console.warn('ElevenLabs audio playback error, falling back:', e);
            URL.revokeObjectURL(audioUrl);
            this.playWithBrowserTTS({ text, speakerId, onStart, onEnd, onError });
          };

          await audio.play();
          return;
        } else {
          // Response was JSON error or fallback message
          const errData = await response.json().catch(() => ({}));
          console.info('Using Web Speech fallback (ElevenLabs notice):', errData.message || errData.error);
        }
      } catch (err) {
        console.warn('ElevenLabs fetch failed, using Web Speech fallback:', err);
      }
    }

    // Fallback: Web Speech API
    this.playWithBrowserTTS({ text, speakerId, onStart, onEnd, onError });
  }

  /**
   * Fallback using browser's built-in Web Speech API
   * Chooses realistic distinct voice pitches and accents for each agent
   */
  playWithBrowserTTS({ text, speakerId, onStart, onEnd, onError }) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onError) onError(new Error('Speech Synthesis not supported in this browser.'));
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = this.playbackRate;
    utterance.volume = this.volume;

    const voices = this.cachedVoices.length ? this.cachedVoices : window.speechSynthesis.getVoices();
    const englishVoices = voices.filter(v => v.lang.startsWith('en'));

    // Match distinct persona qualities
    if (speakerId === 'moderator') {
      // British or calm female voice
      const hostVoice = englishVoices.find(v => v.name.includes('Samantha') || v.name.includes('Victoria') || v.name.includes('Karen') || (v.name.includes('Female') && v.lang.includes('GB'))) || englishVoices[0];
      if (hostVoice) utterance.voice = hostVoice;
      utterance.pitch = 1.05;
    } else if (speakerId === 'optimist') {
      // Energetic male voice
      const maleVoice = englishVoices.find(v => v.name.includes('Daniel') || v.name.includes('Alex') || v.name.includes('David') || (v.name.includes('Male') && !v.name.includes('Female'))) || englishVoices[1] || englishVoices[0];
      if (maleVoice) utterance.voice = maleVoice;
      utterance.pitch = 0.95;
    } else if (speakerId === 'skeptic') {
      // Analytical crisp voice
      const skepticVoice = englishVoices.find(v => v.name.includes('Zira') || v.name.includes('Moira') || v.name.includes('Google UK English Female') || v.name.includes('Fiona')) || englishVoices[2] || englishVoices[0];
      if (skepticVoice) utterance.voice = skepticVoice;
      utterance.pitch = 1.15;
    }

    utterance.onstart = () => {
      this.isPlaying = true;
      if (onStart) onStart({ mode: 'browser' });
    };

    utterance.onend = () => {
      this.isPlaying = false;
      this.activeSpeakerId = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (event) => {
      // If cancelled intentionally by user interruption, ignore error
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
