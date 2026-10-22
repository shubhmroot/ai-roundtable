import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateTurn, AGENT_PROFILES } from './orchestrator.js';
import { generateElevenLabsSpeech, DEFAULT_VOICES, POPULAR_VOICES } from './elevenlabs.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    elevenLabsConfigured: Boolean(process.env.ELEVENLABS_API_KEY),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    openaiConfigured: Boolean(process.env.OPENAI_API_KEY)
  });
});

// Voices metadata
app.get('/api/voices', (req, res) => {
  res.json({
    defaultVoices: DEFAULT_VOICES,
    popularVoices: POPULAR_VOICES,
    agents: AGENT_PROFILES
  });
});

// Generate next turn in roundtable
app.post('/api/roundtable/turn', async (req, res) => {
  try {
    const {
      topic = "Will AI replace software developers by 2028?",
      history = [],
      userInterruption = null,
      preferredSpeaker = null,
      apiKey: clientKey,
      apiProvider: clientProvider
    } = req.body;

    const apiKey = (clientKey && clientKey.trim()) || process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY || null;
    let apiProvider = clientProvider;
    if (!apiProvider) {
      if (apiKey && apiKey.startsWith('sk-')) {
        apiProvider = 'openai';
      } else if (apiKey && apiKey.startsWith('AIza')) {
        apiProvider = 'gemini';
      } else {
        apiProvider = 'fallback';
      }
    }

    const turn = await generateTurn({
      topic,
      history,
      userInterruption,
      preferredSpeaker,
      apiKey,
      apiProvider
    });

    res.json(turn);
  } catch (error) {
    console.error('Error generating turn:', error);
    res.status(500).json({ error: error.message || 'Failed to generate dialogue turn' });
  }
});

// ElevenLabs TTS endpoint
app.post('/api/tts', async (req, res) => {
  try {
    const { text, voiceId, apiKey: clientApiKey } = req.body;
    const apiKey = (clientApiKey && clientApiKey.trim()) || process.env.ELEVENLABS_API_KEY;

    if (!text) {
      return res.status(400).json({ error: 'Text is required for TTS' });
    }

    if (!apiKey) {
      return res.status(200).json({
        fallback: true,
        message: 'No ElevenLabs API key provided. Using browser speech synthesis.'
      });
    }

    const audioBuffer = await generateElevenLabsSpeech({
      text,
      voiceId: voiceId || DEFAULT_VOICES.moderator.id,
      apiKey,
      modelId: 'eleven_turbo_v2_5'
    });

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', audioBuffer.length);
    res.send(audioBuffer);
  } catch (error) {
    console.warn('ElevenLabs TTS error:', error.message);
    res.status(200).json({
      fallback: true,
      error: error.message,
      message: 'Falling back to browser speech synthesis.'
    });
  }
});

// Serve frontend build if dist exists
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('AI Roundtable API Server is running.');
    }
  });
});

app.listen(PORT, () => {
  console.log(`🎙️ AI Roundtable Server listening on http://localhost:${PORT}`);
});
