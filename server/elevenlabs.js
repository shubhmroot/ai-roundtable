// ElevenLabs Voice Integration Service

export const DEFAULT_VOICES = {
  moderator: {
    id: "21m00Tcm4TlvDq8ikWAM", // Rachel
    name: "Rachel (Calm & Articulate)",
    gender: "female",
    accent: "American / Neutral",
    role: "moderator"
  },
  optimist: {
    id: "pNInz6obpgDQGcFmaJgB", // Adam
    name: "Adam (Energetic & Visionary)",
    gender: "male",
    accent: "American / Deep",
    role: "optimist"
  },
  skeptic: {
    id: "piTKgcLEGmPE4e6mEKli", // Nicole
    name: "Nicole (Sharp & Analytical)",
    gender: "female",
    accent: "American / Clear",
    role: "skeptic"
  }
};

export const POPULAR_VOICES = [
  { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel (Female, Calm/Host)" },
  { id: "pNInz6obpgDQGcFmaJgB", name: "Adam (Male, Deep/Visionary)" },
  { id: "piTKgcLEGmPE4e6mEKli", name: "Nicole (Female, Analytical/Sharp)" },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah (Female, Professional/Host)" },
  { id: "ErXwobaYiN019PkySvjV", name: "Antoni (Male, Conversational)" },
  { id: "TxGEqnHWrfWFTfGW9XjX", name: "Josh (Male, Bold & Engaging)" },
  { id: "JBFqnCBsd6RMkjVDRZzb", name: "George (Male, British & Intellectual)" },
  { id: "Xb7hH8MSUJpSbSDYk0k2", name: "Alice (Female, Confident & Crisp)" }
];

/**
 * Streams or generates TTS audio from ElevenLabs API
 * Uses eleven_turbo_v2_5 for ultra-low latency audio synthesis
 */
export async function generateElevenLabsSpeech({ text, voiceId, apiKey, modelId = "eleven_turbo_v2_5" }) {
  if (!apiKey) {
    throw new Error("ELEVENLABS_API_KEY_MISSING");
  }

  const endpoint = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Accept": "audio/mpeg",
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: text,
      model_id: modelId,
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.8,
        style: 0.25,
        use_speaker_boost: true
      }
    }),
  });

  if (!response.ok) {
    let errMessage = `ElevenLabs API error: ${response.status} ${response.statusText}`;
    try {
      const errJson = await response.json();
      if (errJson.detail && errJson.detail.message) {
        errMessage = errJson.detail.message;
      }
    } catch (_) {}
    throw new Error(errMessage);
  }

  // Return readable stream or buffer
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
