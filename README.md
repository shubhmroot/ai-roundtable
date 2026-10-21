# 🎙️ AI Roundtable: Real-Time Multi-Agent Voice Podcast
> **Built for the ElevenLabs Hackathon Track: Voice AI Integration, Speech Synthesis & Novel Audio-Driven Tools**

![AI Roundtable Banner](https://img.shields.io/badge/ElevenLabs-Voice%20AI-blueviolet?style=for-the-badge&logo=elevenlabs)
![React](https://img.shields.io/badge/React%2019-Vite-61dafb?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss)

---

## 🌟 What is AI Roundtable?

Imagine asking three autonomous AI experts to debate **"Will AI replace software developers by 2028?"** in an authentic, broadcast-grade podcast:

1. **Elena Vance (The Moderator & Host)**: Keeps tempo, balances flow, poses sharp dilemmas, and bridges listener questions.
2. **Dr. Marcus Sterling (The Tech Optimist)**: Argues for unprecedented developer leverage, exponential software demand, and economic abundance.
3. **Sophia Chen (The Critical Analyst & Skeptic)**: Highlights real-world liabilities, fragile hallucinations, legal ambiguity, and the collapse of the junior developer apprenticeship ladder.
4. **You (The Live Human Listener)**: You can jump in with your microphone or keyboard at any moment. The system halts current speech, injects your question into the shared context, and the moderator pivots the debate in real-time.

---

## ⚡ What Makes It Technically Compelling?

- **Real-Time Interruption Engine**: When the listener speaks, current audio playback stops immediately, the transcript marks the exact point of interruption, and the multi-agent orchestrator forces the next speaker to address the listener directly.
- **ElevenLabs Low-Latency Voice Synthesis**: Uses `eleven_turbo_v2_5` with curated voice profiles for distinct accents, emotional cadence, and vocal depth.
- **Fail-Safe Zero-Config Fallback**: If an ElevenLabs API key is omitted or quota is exceeded, the system automatically uses client Web Speech Synthesis with customized pitches and genders—ensuring your demo **never fails** on stage.
- **Shared Turn Orchestration**: Prevents repetitive monologues with conversational turn-taking heuristics, dynamic name-calling ("As Marcus just pointed out..."), and length constraints (2-4 sentences max).

---

## 🚀 Quick Start (Running in VS Code)

### 1. Open in VS Code
Open your terminal and type:
```powershell
code "C:\Users\shubh\.gemini\antigravity\scratch\ai-roundtable"
```
Or open VS Code, click **File > Open Folder...**, and select `ai-roundtable`.

### 2. Run the Application
In VS Code, open the integrated terminal (`Ctrl + \``) and run:
```bash
npm run dev
```
This runs both the backend Express server (port `3001`) and the Vite React frontend (port `5173`) concurrently.

### 3. Open in Browser
Open your browser to:
👉 **[http://localhost:5173](http://localhost:5173)**

---

## 🔑 Configuration & API Keys

You can enter keys directly in the **UI Settings Drawer** or create a `.env` file in the project root:

```env
# ElevenLabs API Key (Get free key from https://elevenlabs.io)
ELEVENLABS_API_KEY=your_elevenlabs_key_here

# LLM Providers (Optional - built-in smart dynamic engine runs automatically if omitted)
GEMINI_API_KEY=your_gemini_key_here
OPENAI_API_KEY=your_openai_key_here

PORT=3001
```

---

## 🎭 Agent Voices & Personalities

| Agent | Role | Default ElevenLabs Voice | Voice ID |
|---|---|---|---|
| **Elena Vance** | Moderator & Host | Rachel (Calm, Articulate) | `21m00Tcm4TlvDq8ikWAM` |
| **Dr. Marcus Sterling** | The Tech Optimist | Adam (Deep, Enthusiastic) | `pNInz6obpgDQGcFmaJgB` |
| **Sophia Chen** | The Critical Skeptic | Nicole (Sharp, Analytical) | `piTKgcLEGmPE4e6mEKli` |

*Voices can be reassigned on the fly in the Settings modal to Sarah, Antoni, Josh, George, or Alice.*

---

## 🎤 How to Demo for Hackathon Judges

1. **The Hook**: Click **"Start Podcast"**. Listen to Elena introduce the topic and bring in Marcus.
2. **The Debate**: Watch Marcus defend developer leverage and Sophia immediately counter with hallucination risk.
3. **The Interruption (The Climax)**: Click the **Microphone** button or click one of the quick chips:
   - *"Wait, what about the destruction of entry-level developer jobs?"*
4. **The Pivot**: Notice how the audio instantly halts, Elena acknowledges your question, and redirects the question to Marcus.
5. **Export**: Click the download button on the transcript to show the full multi-agent transcript generated live.

---

## 📁 Project Structure

```
ai-roundtable/
├── .vscode/                 # Preconfigured VS Code tasks & debug launcher
│   ├── launch.json
│   ├── settings.json
│   └── tasks.json
├── server/                  # Backend Agent & Audio Orchestration
│   ├── index.js             # Express API server
│   ├── orchestrator.js      # Multi-agent role prompting & turn choreography
│   └── elevenlabs.js        # ElevenLabs TTS streaming & voice models
├── src/                     # React Frontend
│   ├── components/
│   │   ├── StudioHeader.jsx     # On-air branding & topic banner
│   │   ├── PodcastTable.jsx     # Virtual roundtable studio desk visualizer
│   │   ├── InterruptionBar.jsx  # Microphone & human challenge deck
│   │   ├── LiveTranscript.jsx   # Synchronized live transcript & exports
│   │   ├── AudioControls.jsx    # Playback & speed controls
│   │   ├── SettingsModal.jsx    # Voice & API key management
│   │   └── TopicModal.jsx       # Preset & custom topic selector
│   ├── services/
│   │   ├── audioEngine.js       # ElevenLabs stream & Web Speech fallback
│   │   └── speechRecognition.js # Browser microphone STT
│   ├── App.jsx              # Main roundtable state coordinator
│   ├── index.css            # Tailwind CSS & equalizer animations
│   └── main.jsx             # React entry
├── package.json
├── tailwind.config.js
└── vite.config.js
```
