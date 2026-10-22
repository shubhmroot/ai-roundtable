import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import { generateTurn, AGENT_PROFILES } from '../../server/orchestrator.js';
import { generateElevenLabsSpeech, DEFAULT_VOICES, POPULAR_VOICES } from '../../server/elevenlabs.js';

const app = express();

app.use(cors());
app.use(express.json());

// Support both /api/... and /.netlify/functions/api/...
const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    elevenLabsConfigured: Boolean(process.env.ELEVENLABS_API_KEY),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    openaiConfigured: Boolean(process.env.OPENAI_API_KEY)
  });
});

router.get('/voices', (req, res) => {
  res.json({
    defaultVoices: DEFAULT_VOICES,
    popularVoices: POPULAR_VOICES,
    agents: AGENT_PROFILES
  });
});

router.post('/roundtable/turn', async (req, res) => {
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

router.post('/tts', async (req, res) => {
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

app.use('/api', router);
app.use('/.netlify/functions/api', router);

export const handler = serverless(app);
