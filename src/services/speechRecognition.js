// Browser Speech Recognition for Live Human Listener Interruptions

export class VoiceInputManager {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.isSupported = false;

    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
        this.isSupported = true;
      }
    }
  }

  startListening({ onResult, onInterim, onEnd, onError }) {
    if (!this.isSupported || !this.recognition) {
      if (onError) onError(new Error('Speech recognition not supported in this browser. You can type your interruption.'));
      return;
    }

    try {
      this.recognition.abort(); // clear any stale session
    } catch (_) {}

    this.recognition.onstart = () => {
      this.isListening = true;
    };

    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (interimTranscript && onInterim) {
        onInterim(interimTranscript);
      }

      if (finalTranscript && onResult) {
        onResult(finalTranscript);
      }
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      if (onError) onError(event);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (onEnd) onEnd();
    };

    try {
      this.recognition.start();
    } catch (err) {
      console.warn('Error starting speech recognition:', err);
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (_) {}
      this.isListening = false;
    }
  }
}

export const voiceInput = new VoiceInputManager();
