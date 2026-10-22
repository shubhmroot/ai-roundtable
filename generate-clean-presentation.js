import fs from 'fs';
import path from 'path';
import pptxgen from 'pptxgenjs';

// -------------------------------------------------------------
// PART 1: GENERATE ULTRA-CLEAN HTML PRESENTATION WITH INLINE SVG FLOWCHARTS
// -------------------------------------------------------------

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Roundtable | Executive Hackathon Presentation</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background-color: #080b13;
      color: #f1f5f9;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .slide-page {
      width: 100vw;
      height: 100vh;
      min-height: 100vh;
      max-height: 100vh;
      padding: 2.8rem 3.5rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      background-color: #080b13;
      background-image: radial-gradient(at 0% 0%, rgba(139, 92, 246, 0.08) 0px, transparent 50%),
                        radial-gradient(at 100% 100%, rgba(16, 185, 129, 0.05) 0px, transparent 50%);
      border-bottom: 1px solid #1e293b;
      page-break-after: always !important;
      page-break-inside: avoid !important;
      break-after: page !important;
      overflow: hidden;
    }
    @media print {
      @page {
        size: 16in 9in;
        margin: 0;
      }
      body {
        background-color: #080b13 !important;
      }
      .slide-page {
        border-bottom: none !important;
      }
      .no-print {
        display: none !important;
      }
    }
    .mono { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body>

  <!-- ========================================================
       SLIDE 1: EXECUTIVE TITLE & OVERVIEW
       ======================================================== -->
  <section class="slide-page">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold">
        <span>🎙️ ELEVENLABS HACKATHON · SPECIAL TRACK</span>
        <span class="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
        <span>VOICE AI INTEGRATION</span>
      </div>
      <span class="text-xs text-slate-400 font-mono">SLIDE 01 / 08</span>
    </div>

    <!-- Main Hero -->
    <div class="my-auto">
      <h1 class="text-6xl font-extrabold tracking-tight text-white mb-3">
        AI Roundtable
      </h1>
      <h2 class="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-emerald-400 mb-4">
        A Real-Time Multi-Agent Podcast with Live Human Interruption
      </h2>
      <p class="text-slate-300 text-base max-w-3xl leading-relaxed mb-8">
        A voice-native system where autonomous AI experts collaborate, debate, and exchange sharp perspectives on any topic—while allowing a human listener to interrupt and steer individual agents in real time.
      </p>

      <!-- 3 Key Pillars -->
      <div class="grid grid-cols-3 gap-5">
        <div class="p-4 rounded-xl bg-slate-900/70 border border-purple-500/30">
          <span class="text-[11px] font-bold text-purple-400 uppercase tracking-wider block mb-1">Autonomous Debate</span>
          <h4 class="text-sm font-bold text-white mb-1">Role-Based Prompting</h4>
          <p class="text-xs text-slate-400">Moderator, Optimist, and Skeptic clash with dynamic friction, avoiding boring monologues.</p>
        </div>

        <div class="p-4 rounded-xl bg-slate-900/70 border border-emerald-500/30">
          <span class="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">Voice AI Synthesis</span>
          <h4 class="text-sm font-bold text-white mb-1">ElevenLabs Turbo v2.5</h4>
          <p class="text-xs text-slate-400">Low-latency streaming speech with distinct vocal profiles (Rachel, Adam, Nicole).</p>
        </div>

        <div class="p-4 rounded-xl bg-slate-900/70 border border-sky-500/30">
          <span class="text-[11px] font-bold text-sky-400 uppercase tracking-wider block mb-1">Core Innovation</span>
          <h4 class="text-sm font-bold text-white mb-1">Real-Time Interruption</h4>
          <p class="text-xs text-slate-400">Instant 0ms audio cancellation; context memory updates; agents immediately pivot to listener.</p>
        </div>
      </div>
    </div>

    <!-- Footer Attribution -->
    <div class="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
      <div class="flex items-center gap-6 font-semibold text-slate-200">
        <span class="text-slate-400 font-bold uppercase tracking-wider">Team:</span>
        <span class="text-purple-300">Shubham Raj</span>
        <span class="text-emerald-300">Rishabh Choudhary</span>
        <span class="text-sky-300">Priyam Garg</span>
      </div>
      <span class="text-slate-500 font-mono">github.com/shubhmroot/ai-roundtable</span>
    </div>
  </section>

  <!-- ========================================================
       SLIDE 2: THE PROBLEM & WHY IT'S TECHNICALLY INTERESTING
       ======================================================== -->
  <section class="slide-page">
    <div class="flex items-center justify-between">
      <span class="text-xs font-bold text-purple-400 uppercase tracking-wider">Problem Statement & Vision</span>
      <span class="text-xs text-slate-400 font-mono">SLIDE 02 / 08</span>
    </div>

    <div class="my-auto space-y-6">
      <div>
        <h2 class="text-3xl font-bold text-white mb-2">The Hard Part: Beyond Generating Three AI Responses</h2>
        <p class="text-sm text-slate-300 max-w-4xl leading-relaxed">
          The challenge isn't simply querying an LLM three times. The hard part is coordinating agents so the podcast sounds coherent, doesn't repeat itself, feels intellectually lively, and reacts immediately to interruptions.
        </p>
      </div>

      <div class="grid grid-cols-2 gap-6">
        <!-- Left: Status Quo -->
        <div class="p-5 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-3">
          <h3 class="text-base font-bold text-red-400 flex items-center gap-2">
            <span>✖</span> Current AI Voice Limitations
          </h3>
          <ul class="space-y-2.5 text-xs text-slate-300">
            <li class="flex items-start gap-2">
              <span class="text-red-400 font-bold">•</span>
              <span><strong>Exhaustive Monologues:</strong> Standard LLMs generate 200-word blocks of text that ruin audio podcast cadence.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-red-400 font-bold">•</span>
              <span><strong>Zero Organic Friction:</strong> Without structured dialectical prompting, models politely agree with each other.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-red-400 font-bold">•</span>
              <span><strong>Uninterruptible Playback:</strong> Users are passive listeners locked into pre-rendered audio files.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-red-400 font-bold">•</span>
              <span><strong>Uniform Tone:</strong> Single-voice readers lack distinct emotional prosody, gender diversity, and host presence.</span>
            </li>
          </ul>
        </div>

        <!-- Right: AI Roundtable Solution -->
        <div class="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
          <h3 class="text-base font-bold text-emerald-400 flex items-center gap-2">
            <span>✔</span> The AI Roundtable Solution
          </h3>
          <ul class="space-y-2.5 text-xs text-slate-300">
            <li class="flex items-start gap-2">
              <span class="text-emerald-400 font-bold">•</span>
              <span><strong>Snappy 35-50 Word Turns:</strong> Enforces natural spoken cadence with direct name-calling ("Sophia is missing Marcus's point").</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-emerald-400 font-bold">•</span>
              <span><strong>Dialectical Triad:</strong> Moderator steers the flow; Optimist drives forward thesis; Skeptic stresses edge cases.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-emerald-400 font-bold">•</span>
              <span><strong>Live Human Interruption:</strong> Halts streaming audio at 0ms, updates context, and forces agents to address the listener.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-emerald-400 font-bold">•</span>
              <span><strong>ElevenLabs Low-Latency Streaming:</strong> Uses Turbo v2.5 to stream natural audio chunks with distinct personalities.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
      <span>AI Roundtable — Real-Time Multi-Agent Voice Podcast</span>
      <span>Shubham Raj · Rishabh Choudhary · Priyam Garg</span>
    </div>
  </section>

  <!-- ========================================================
       SLIDE 3: COMPLETE TECHNOLOGIES USED SPECIFICATION TABLE
       ======================================================== -->
  <section class="slide-page">
    <div class="flex items-center justify-between">
      <span class="text-xs font-bold text-purple-400 uppercase tracking-wider">Technology Stack & Architecture</span>
      <span class="text-xs text-slate-400 font-mono">SLIDE 03 / 08</span>
    </div>

    <div class="my-auto space-y-4">
      <div>
        <h2 class="text-3xl font-bold text-white mb-1">Technologies Used & Their Purpose</h2>
        <p class="text-xs text-slate-300">Engineered precisely according to hackathon voice-native specifications.</p>
      </div>

      <!-- Modern Glassmorphism Table -->
      <div class="rounded-xl border border-slate-700/80 overflow-hidden bg-slate-900/60 shadow-xl">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-800/80 border-b border-slate-700 text-xs font-bold text-slate-200">
              <th class="py-2.5 px-4 w-1/4 uppercase tracking-wider text-purple-400">Technology</th>
              <th class="py-2.5 px-4 w-1/2 uppercase tracking-wider text-slate-300">Purpose in AI Roundtable</th>
              <th class="py-2.5 px-4 w-1/4 uppercase tracking-wider text-emerald-400">Implementation Details</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60 text-xs text-slate-300">
            <tr class="hover:bg-slate-850/50">
              <td class="py-2.5 px-4 font-bold text-white">Python or Node.js</td>
              <td class="py-2.5 px-4">Backend logic and multi-agent orchestration</td>
              <td class="py-2.5 px-4 mono text-[11px] text-purple-300">Node.js Express / orchestrator.js</td>
            </tr>
            <tr class="hover:bg-slate-850/50">
              <td class="py-2.5 px-4 font-bold text-white">LLM API</td>
              <td class="py-2.5 px-4">Generates each agent's arguments, counterpoints, and banter</td>
              <td class="py-2.5 px-4 mono text-[11px] text-purple-300">Gemini 2.0 Flash / OpenAI / Dynamic</td>
            </tr>
            <tr class="hover:bg-slate-850/50">
              <td class="py-2.5 px-4 font-bold text-white">ElevenLabs Text-to-Speech</td>
              <td class="py-2.5 px-4">Gives each agent a distinct voice with low-latency streaming</td>
              <td class="py-2.5 px-4 mono text-[11px] text-purple-300">eleven_turbo_v2_5 (Rachel, Adam, Nicole)</td>
            </tr>
            <tr class="hover:bg-slate-850/50">
              <td class="py-2.5 px-4 font-bold text-white">WebSockets or HTTP Streams</td>
              <td class="py-2.5 px-4">Supports real-time audio chunk delivery and instant event signaling</td>
              <td class="py-2.5 px-4 mono text-[11px] text-purple-300">Binary chunk stream / SSE / REST</td>
            </tr>
            <tr class="hover:bg-slate-850/50">
              <td class="py-2.5 px-4 font-bold text-white">React / Next.js</td>
              <td class="py-2.5 px-4">Frontend, circular studio desk, playback controls and transcript</td>
              <td class="py-2.5 px-4 mono text-[11px] text-purple-300">React 19, Vite, Tailwind CSS</td>
            </tr>
            <tr class="hover:bg-slate-850/50">
              <td class="py-2.5 px-4 font-bold text-white">Speech-to-Text</td>
              <td class="py-2.5 px-4">Converts the user's spoken questions into text in real time</td>
              <td class="py-2.5 px-4 mono text-[11px] text-purple-300">Web Speech API (webkitSpeechRecognition)</td>
            </tr>
            <tr class="hover:bg-slate-850/50">
              <td class="py-2.5 px-4 font-bold text-white">In-Memory State / History</td>
              <td class="py-2.5 px-4">Tracks conversation history, active speaker queue, and whose turn it is</td>
              <td class="py-2.5 px-4 mono text-[11px] text-purple-300">Turn Memory Window & Interruption Stack</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Footer -->
    <div class="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
      <span>AI Roundtable — Real-Time Multi-Agent Voice Podcast</span>
      <span>Shubham Raj · Rishabh Choudhary · Priyam Garg</span>
    </div>
  </section>

  <!-- ========================================================
       SLIDE 4: END-TO-END ARCHITECTURE FLOWCHART
       ======================================================== -->
  <section class="slide-page">
    <div class="flex items-center justify-between">
      <span class="text-xs font-bold text-purple-400 uppercase tracking-wider">System Flowchart</span>
      <span class="text-xs text-slate-400 font-mono">SLIDE 04 / 08</span>
    </div>

    <div class="my-auto space-y-4">
      <div>
        <h2 class="text-3xl font-bold text-white mb-1">End-to-End Voice AI Architecture</h2>
        <p class="text-xs text-slate-300">From topic initiation & human interruption to low-latency audio rendering.</p>
      </div>

      <!-- Vector SVG Architecture Flowchart -->
      <div class="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center">
        <svg viewBox="0 0 920 280" class="w-full max-h-[260px]">
          <defs>
            <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#8b5cf6" />
              <stop offset="100%" stop-color="#6d28d9" />
            </linearGradient>
            <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#10b981" />
              <stop offset="100%" stop-color="#059669" />
            </linearGradient>
            <linearGradient id="skyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#0284c7" />
              <stop offset="100%" stop-color="#0369a1" />
            </linearGradient>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
            </marker>
          </defs>

          <!-- Node 1: Input -->
          <rect x="20" y="40" width="150" height="180" rx="12" fill="#141b2d" stroke="#38bdf8" stroke-width="2" />
          <text x="95" y="70" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">1. INPUT LAYER</text>
          <rect x="35" y="90" width="120" height="40" rx="6" fill="#0c4a6e" />
          <text x="95" y="115" fill="#ffffff" font-size="10" text-anchor="middle">Debate Topic</text>
          <rect x="35" y="145" width="120" height="50" rx="6" fill="#0c4a6e" />
          <text x="95" y="167" fill="#ffffff" font-size="10" text-anchor="middle">Live Mic Interruption</text>
          <text x="95" y="182" fill="#7dd3fc" font-size="9" text-anchor="middle">(Web Speech STT)</text>

          <!-- Arrow 1 to 2 -->
          <line x1="170" y1="130" x2="225" y2="130" stroke="#94a3b8" stroke-width="2" marker-end="url(#arrow)" />

          <!-- Node 2: Orchestration Brain -->
          <rect x="230" y="20" width="220" height="230" rx="12" fill="#141b2d" stroke="#8b5cf6" stroke-width="2" />
          <text x="340" y="45" fill="#a78bfa" font-size="12" font-weight="bold" text-anchor="middle">2. AGENT ORCHESTRATOR</text>
          <rect x="245" y="60" width="190" height="35" rx="6" fill="#2e1065" />
          <text x="340" y="82" fill="#ffffff" font-size="10" text-anchor="middle">Turn Taking Choreographer</text>
          <!-- 3 Agents -->
          <rect x="245" y="105" width="58" height="60" rx="6" fill="#4c1d95" />
          <text x="274" y="130" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">Elena</text>
          <text x="274" y="145" fill="#c084fc" font-size="8" text-anchor="middle">Moderator</text>

          <rect x="311" y="105" width="58" height="60" rx="6" fill="#064e3b" />
          <text x="340" y="130" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">Marcus</text>
          <text x="340" y="145" fill="#34d399" font-size="8" text-anchor="middle">Optimist</text>

          <rect x="377" y="105" width="58" height="60" rx="6" fill="#7f1d1d" />
          <text x="406" y="130" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">Sophia</text>
          <text x="406" y="145" fill="#f87171" font-size="8" text-anchor="middle">Skeptic</text>

          <rect x="245" y="175" width="190" height="55" rx="6" fill="#1e1b4b" />
          <text x="340" y="198" fill="#c7d2fe" font-size="9" font-weight="bold" text-anchor="middle">Context Memory Window</text>
          <text x="340" y="215" fill="#94a3b8" font-size="8" text-anchor="middle">Maintains history & addresses interruptions</text>

          <!-- Arrow 2 to 3 -->
          <line x1="450" y1="130" x2="505" y2="130" stroke="#94a3b8" stroke-width="2" marker-end="url(#arrow)" />

          <!-- Node 3: ElevenLabs Voice AI -->
          <rect x="510" y="40" width="180" height="180" rx="12" fill="#141b2d" stroke="#10b981" stroke-width="2" />
          <text x="600" y="68" fill="#34d399" font-size="12" font-weight="bold" text-anchor="middle">3. ELEVENLABS VOICE AI</text>
          <rect x="525" y="85" width="150" height="45" rx="6" fill="#064e3b" />
          <text x="600" y="106" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">eleven_turbo_v2_5</text>
          <text x="600" y="120" fill="#a7f3d0" font-size="8" text-anchor="middle">Low-Latency Streaming</text>

          <rect x="525" y="140" width="150" height="60" rx="6" fill="#134e4a" />
          <text x="600" y="160" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">Voice Personas:</text>
          <text x="600" y="175" fill="#ccfbf1" font-size="8" text-anchor="middle">• Rachel (Host) • Adam (Optimist)</text>
          <text x="600" y="188" fill="#ccfbf1" font-size="8" text-anchor="middle">• Nicole (Skeptic)</text>

          <!-- Arrow 3 to 4 -->
          <line x1="690" y1="130" x2="745" y2="130" stroke="#94a3b8" stroke-width="2" marker-end="url(#arrow)" />

          <!-- Node 4: Frontend UI -->
          <rect x="750" y="40" width="150" height="180" rx="12" fill="#141b2d" stroke="#a78bfa" stroke-width="2" />
          <text x="825" y="70" fill="#c084fc" font-size="12" font-weight="bold" text-anchor="middle">4. STUDIO DESK UI</text>
          <rect x="765" y="90" width="120" height="35" rx="6" fill="#312e81" />
          <text x="825" y="112" fill="#ffffff" font-size="9" text-anchor="middle">Equalizer Waveforms</text>
          <rect x="765" y="132" width="120" height="35" rx="6" fill="#312e81" />
          <text x="825" y="154" fill="#ffffff" font-size="9" text-anchor="middle">Live Sync Transcript</text>
          <rect x="765" y="174" width="120" height="35" rx="6" fill="#047857" />
          <text x="825" y="196" fill="#ffffff" font-size="9" text-anchor="middle">Audio Controls & Speed</text>
        </svg>
      </div>
    </div>

    <!-- Footer -->
    <div class="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
      <span>AI Roundtable — Real-Time Multi-Agent Voice Podcast</span>
      <span>Shubham Raj · Rishabh Choudhary · Priyam Garg</span>
    </div>
  </section>

  <!-- ========================================================
       SLIDE 5: MULTI-AGENT PERSONALITIES & BANTER CHOREOGRAPHY
       ======================================================== -->
  <section class="slide-page">
    <div class="flex items-center justify-between">
      <span class="text-xs font-bold text-purple-400 uppercase tracking-wider">Multi-Agent System</span>
      <span class="text-xs text-slate-400 font-mono">SLIDE 05 / 08</span>
    </div>

    <div class="my-auto space-y-5">
      <div>
        <h2 class="text-3xl font-bold text-white mb-1">Autonomous Cast & Banter Dynamics</h2>
        <p class="text-xs text-slate-300">Role-based prompting creates authentic debate without training separate models.</p>
      </div>

      <!-- 3 Agent Cards -->
      <div class="grid grid-cols-3 gap-5">
        <!-- Elena -->
        <div class="p-5 rounded-2xl bg-purple-950/20 border border-purple-500/40 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-3">
              <div class="w-12 h-12 rounded-xl bg-purple-600 text-white font-bold flex items-center justify-center text-base">
                EV
              </div>
              <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Moderator
              </span>
            </div>
            <h3 class="text-base font-bold text-white">Elena Vance</h3>
            <p class="text-[11px] font-mono text-purple-400 mb-2">ElevenLabs: Rachel (21m00...)</p>
            <p class="text-xs text-slate-300 leading-relaxed">
              Maintains conversational pace, frames intellectual dilemmas, challenges weak claims, and gracefully transitions when the listener interrupts.
            </p>
          </div>
          <div class="mt-4 pt-3 border-t border-purple-500/20 text-[11px] text-slate-400">
            <strong>Prompt Rule:</strong> "Keep turns punchy (35-50 words). Address co-panelists by name."
          </div>
        </div>

        <!-- Marcus -->
        <div class="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-3">
              <div class="w-12 h-12 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-base">
                MS
              </div>
              <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                The Optimist
              </span>
            </div>
            <h3 class="text-base font-bold text-white">Dr. Marcus Sterling</h3>
            <p class="text-[11px] font-mono text-emerald-400 mb-2">ElevenLabs: Adam (pNInz6...)</p>
            <p class="text-xs text-slate-300 leading-relaxed">
              Champions developer leverage, historical parallels (compilers, industrial scale), and infinite demand for intelligent software.
            </p>
          </div>
          <div class="mt-4 pt-3 border-t border-emerald-500/20 text-[11px] text-slate-400">
            <strong>Prompt Rule:</strong> "Present the strongest thesis in favor; counter risks with progress data."
          </div>
        </div>

        <!-- Sophia -->
        <div class="p-5 rounded-2xl bg-red-950/20 border border-red-500/40 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-3">
              <div class="w-12 h-12 rounded-xl bg-red-600 text-white font-bold flex items-center justify-center text-base">
                SC
              </div>
              <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                The Skeptic
              </span>
            </div>
            <h3 class="text-base font-bold text-white">Sophia Chen</h3>
            <p class="text-[11px] font-mono text-red-400 mb-2">ElevenLabs: Nicole (piTKgc...)</p>
            <p class="text-xs text-slate-300 leading-relaxed">
              Unpacks hallucination edge cases, legal liability, compute constraints, and the collapse of the junior developer apprenticeship ladder.
            </p>
          </div>
          <div class="mt-4 pt-3 border-t border-red-500/20 text-[11px] text-slate-400">
            <strong>Prompt Rule:</strong> "Challenge ungrounded hype; insist on accountability and real-world failure modes."
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
      <span>AI Roundtable — Real-Time Multi-Agent Voice Podcast</span>
      <span>Shubham Raj · Rishabh Choudhary · Priyam Garg</span>
    </div>
  </section>

  <!-- ========================================================
       SLIDE 6: REAL-TIME INTERRUPTION FLOWCHART (THE CLIMAX)
       ======================================================== -->
  <section class="slide-page">
    <div class="flex items-center justify-between">
      <span class="text-xs font-bold text-sky-400 uppercase tracking-wider">The Technical Climax</span>
      <span class="text-xs text-slate-400 font-mono">SLIDE 06 / 08</span>
    </div>

    <div class="my-auto space-y-4">
      <div>
        <h2 class="text-3xl font-bold text-white mb-1">Real-Time Human Interruption Lifecycle</h2>
        <p class="text-xs text-slate-300">How the system stops streaming speech in 0ms and pivots the debate without repeating itself.</p>
      </div>

      <!-- Vector Interruption Flowchart -->
      <div class="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center">
        <svg viewBox="0 0 920 250" class="w-full max-h-[240px]">
          <defs>
            <marker id="arrow2" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
            </marker>
          </defs>

          <!-- Step 1 -->
          <rect x="10" y="30" width="165" height="190" rx="10" fill="#141b2d" stroke="#ef4444" stroke-width="2" />
          <text x="92" y="55" fill="#f87171" font-size="11" font-weight="bold" text-anchor="middle">1. USER INTERRUPTS</text>
          <rect x="25" y="70" width="135" height="40" rx="6" fill="#7f1d1d" />
          <text x="92" y="94" fill="#ffffff" font-size="9" text-anchor="middle">Microphone STT /</text>
          <text x="92" y="106" fill="#ffffff" font-size="9" text-anchor="middle">Quick Challenge Chip</text>
          <rect x="25" y="125" width="135" height="75" rx="6" fill="#991b1b" />
          <text x="92" y="145" fill="#fef2f2" font-size="9" font-weight="bold" text-anchor="middle">audioEngine.stop()</text>
          <text x="92" y="162" fill="#fee2e2" font-size="8" text-anchor="middle">• 0ms playback abort</text>
          <text x="92" y="175" fill="#fee2e2" font-size="8" text-anchor="middle">• HTML5 buffer cleared</text>
          <text x="92" y="188" fill="#fee2e2" font-size="8" text-anchor="middle">• [Interrupted] marked</text>

          <!-- Arrow 1 to 2 -->
          <line x1="175" y1="125" x2="225" y2="125" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow2)" />

          <!-- Step 2 -->
          <rect x="230" y="30" width="195" height="190" rx="10" fill="#141b2d" stroke="#f59e0b" stroke-width="2" />
          <text x="327" y="55" fill="#fbbf24" font-size="11" font-weight="bold" text-anchor="middle">2. CONTEXT INJECTION</text>
          <rect x="245" y="75" width="165" height="60" rx="6" fill="#78350f" />
          <text x="327" y="98" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">Payload Extraction</text>
          <text x="327" y="115" fill="#fef3c7" font-size="8" text-anchor="middle">userText: "What about juniors?"</text>
          <text x="327" y="127" fill="#fef3c7" font-size="8" text-anchor="middle">interruptedAgent: "Marcus"</text>

          <rect x="245" y="145" width="165" height="55" rx="6" fill="#451a03" />
          <text x="327" y="168" fill="#fde68a" font-size="9" font-weight="bold" text-anchor="middle">History Window Update</text>
          <text x="327" y="184" fill="#fef3c7" font-size="8" text-anchor="middle">Priority interruption event injected</text>

          <!-- Arrow 2 to 3 -->
          <line x1="425" y1="125" x2="475" y2="125" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow2)" />

          <!-- Step 3 -->
          <rect x="480" y="30" width="205" height="190" rx="10" fill="#141b2d" stroke="#8b5cf6" stroke-width="2" />
          <text x="582" y="55" fill="#c084fc" font-size="11" font-weight="bold" text-anchor="middle">3. CONTEXTUAL PIVOT</text>
          <rect x="495" y="75" width="175" height="50" rx="6" fill="#4c1d95" />
          <text x="582" y="96" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">Dynamic Turn Routing</text>
          <text x="582" y="112" fill="#e9d5ff" font-size="8" text-anchor="middle">Target agent chosen (Elena or Marcus)</text>

          <rect x="495" y="135" width="175" height="65" rx="6" fill="#2e1065" />
          <text x="582" y="155" fill="#f3e8ff" font-size="9" font-weight="bold" text-anchor="middle">Mandatory Rule:</text>
          <text x="582" y="172" fill="#e9d5ff" font-size="8" text-anchor="middle">"First sentence MUST directly acknowledge</text>
          <text x="582" y="185" fill="#e9d5ff" font-size="8" text-anchor="middle">listener question by name."</text>

          <!-- Arrow 3 to 4 -->
          <line x1="685" y1="125" x2="735" y2="125" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow2)" />

          <!-- Step 4 -->
          <rect x="740" y="30" width="170" height="190" rx="10" fill="#141b2d" stroke="#10b981" stroke-width="2" />
          <text x="825" y="55" fill="#34d399" font-size="11" font-weight="bold" text-anchor="middle">4. SEAMLESS RESUME</text>
          <rect x="755" y="75" width="140" height="60" rx="6" fill="#064e3b" />
          <text x="825" y="98" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">ElevenLabs Stream</text>
          <text x="825" y="114" fill="#a7f3d0" font-size="8" text-anchor="middle">Streaming response audio</text>
          <text x="825" y="126" fill="#a7f3d0" font-size="8" text-anchor="middle">begins playing immediately</text>

          <rect x="755" y="145" width="140" height="55" rx="6" fill="#047857" />
          <text x="825" y="168" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">Continuous Flow</text>
          <text x="825" y="184" fill="#d1fae5" font-size="8" text-anchor="middle">Podcast continues with updated</text>
          <text x="825" y="196" fill="#d1fae5" font-size="8" text-anchor="middle">perspectives incorporated</text>
        </svg>
      </div>
    </div>

    <!-- Footer -->
    <div class="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
      <span>AI Roundtable — Real-Time Multi-Agent Voice Podcast</span>
      <span>Shubham Raj · Rishabh Choudhary · Priyam Garg</span>
    </div>
  </section>

  <!-- ========================================================
       SLIDE 7: LIVE DEMO & JUDGE WALKTHROUGH
       ======================================================== -->
  <section class="slide-page">
    <div class="flex items-center justify-between">
      <span class="text-xs font-bold text-purple-400 uppercase tracking-wider">Live Proof of Concept</span>
      <span class="text-xs text-slate-400 font-mono">SLIDE 07 / 08</span>
    </div>

    <div class="my-auto space-y-4">
      <div>
        <h2 class="text-3xl font-bold text-white mb-1">Live Demo: Turn-by-Turn Script</h2>
        <p class="text-xs text-slate-300">Topic: "Will AI replace software developers by 2028?"</p>
      </div>

      <div class="space-y-2 text-xs">
        <div class="p-3 rounded-xl bg-purple-950/30 border border-purple-500/40 flex items-start gap-3">
          <span class="px-2 py-0.5 rounded bg-purple-600 font-bold text-white text-[10px] shrink-0">Elena (Host)</span>
          <p class="text-slate-200 italic">"Welcome to AI Roundtable. Today's question: 'Will AI replace software developers by 2028?'. Marcus, you claim this multiplies developer leverage. Start us off—what is your core thesis?"</p>
        </div>

        <div class="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex items-start gap-3">
          <span class="px-2 py-0.5 rounded bg-emerald-600 font-bold text-white text-[10px] shrink-0">Marcus (Optimist)</span>
          <p class="text-slate-200 italic">"Thanks Elena. Throughout history, every abstraction layer created more value. Compilers didn't eliminate coders; they allowed software to eat the world. Every engineer now commands a 10x leverage team!"</p>
        </div>

        <div class="p-3 rounded-xl bg-red-950/30 border border-red-500/40 flex items-start gap-3">
          <span class="px-2 py-0.5 rounded bg-red-600 font-bold text-white text-[10px] shrink-0">Sophia (Skeptic)</span>
          <p class="text-slate-200 italic">"Compilers were deterministic, Marcus. LLMs hallucinate false code. And if companies automate away junior roles, who trains the senior software architects of 2030?"</p>
        </div>

        <div class="p-3 rounded-xl bg-sky-950/40 border border-sky-400/60 flex items-start gap-3 shadow-md">
          <span class="px-2 py-0.5 rounded bg-sky-600 font-bold text-white text-[10px] shrink-0">Audience Interrupt</span>
          <p class="text-sky-200 font-semibold">[INTERRUPTS MARCUS] "Wait Marcus, what about the college grads who can't even get an entry-level interview today because companies expect 5 years of senior experience?"</p>
        </div>

        <div class="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex items-start gap-3">
          <span class="px-2 py-0.5 rounded bg-emerald-600 font-bold text-white text-[10px] shrink-0">Marcus (Pivot)</span>
          <p class="text-slate-200 italic">"Crucial point from our listener. While traditional junior tasks are shifting, software demand is effectively infinite. Apprenticeship will evolve into verification, system architecture, and domain modeling."</p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
      <span>AI Roundtable — Real-Time Multi-Agent Voice Podcast</span>
      <span>Shubham Raj · Rishabh Choudhary · Priyam Garg</span>
    </div>
  </section>

  <!-- ========================================================
       SLIDE 8: FUTURE ROADMAP & TEAM CONCLUSION
       ======================================================== -->
  <section class="slide-page">
    <div class="flex items-center justify-between">
      <span class="text-xs font-bold text-purple-400 uppercase tracking-wider">Conclusion & Roadmap</span>
      <span class="text-xs text-slate-400 font-mono">SLIDE 08 / 08</span>
    </div>

    <div class="my-auto space-y-6">
      <div>
        <h2 class="text-4xl font-extrabold text-white mb-2">The Future of Voice-Native AI</h2>
        <p class="text-sm text-slate-300">Shifting from passive, one-way AI speech to interactive, participatory conversational media.</p>
      </div>

      <!-- Roadmap 3 Cards -->
      <div class="grid grid-cols-3 gap-5">
        <div class="p-4 rounded-xl bg-slate-900/60 border border-purple-500/30">
          <h4 class="text-sm font-bold text-purple-400 mb-1">Interactive Education</h4>
          <p class="text-xs text-slate-400">Students step into historical roundtables (e.g. Einstein vs Bohr) and challenge historical figures directly.</p>
        </div>
        <div class="p-4 rounded-xl bg-slate-900/60 border border-emerald-500/30">
          <h4 class="text-sm font-bold text-emerald-400 mb-1">Corporate & Market Intel</h4>
          <p class="text-xs text-slate-400">Autonomous bull/bear agent debates analyzing earnings calls, regulatory filings, and market competitors.</p>
        </div>
        <div class="p-4 rounded-xl bg-slate-900/60 border border-sky-500/30">
          <h4 class="text-sm font-bold text-sky-400 mb-1">WebRTC Full-Duplex Audio</h4>
          <p class="text-xs text-slate-400">Sub-150ms bi-directional voice streaming with acoustic echo cancellation and acoustic voice activity detection.</p>
        </div>
      </div>

      <!-- Team Members -->
      <div class="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
        <div>
          <span class="text-[11px] font-bold uppercase tracking-wider text-purple-400 block mb-1">Project Authors</span>
          <div class="flex items-center gap-8 text-sm font-bold text-white">
            <div>Shubham Raj <span class="text-xs font-normal text-slate-400 block">Full-Stack & Voice AI</span></div>
            <div>Rishabh Choudhary <span class="text-xs font-normal text-slate-400 block">Multi-Agent Prompting</span></div>
            <div>Priyam Garg <span class="text-xs font-normal text-slate-400 block">Studio UI & Audio Engine</span></div>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <a href="https://github.com/shubhmroot/ai-roundtable" target="_blank" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-all">
            GitHub Repo ↗
          </a>
          <a href="http://localhost:5173" target="_blank" class="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all">
            Launch Studio 🎙️
          </a>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
      <span>AI Roundtable — Real-Time Multi-Agent Voice Podcast</span>
      <span>Thank you! Questions & Q&A</span>
    </div>
  </section>

</body>
</html>
`;

// Save the HTML file
const htmlPath = path.resolve('C:\\Users\\shubh\\Desktop\\AI_Roundtable_Executive_Deck.html');
fs.writeFileSync(htmlPath, htmlContent, 'utf-8');
console.log(`✅ Clean HTML deck created at: ${htmlPath}`);

// -------------------------------------------------------------
// PART 2: GENERATE EXECUTIVE POWERPOINT (.PPTX)
// -------------------------------------------------------------

const pptx = new pptxgen();
pptx.layout = "LAYOUT_16x9";
pptx.author = "Shubham Raj, Rishabh Choudhary, Priyam Garg";
pptx.company = "ElevenLabs Hackathon";
pptx.title = "AI Roundtable: A Real-Time Multi-Agent Podcast";

const C = {
  bg: "080B13",
  card: "141B2D",
  border: "253252",
  purple: "8B5CF6",
  emerald: "10B981",
  red: "EF4444",
  sky: "38BDF8",
  white: "F8FAFC",
  gray: "94A3B8"
};

function addHeader(slide, title, category = "ELEVENLABS HACKATHON · SPECIAL TRACK") {
  slide.addText(category.toUpperCase(), {
    x: 0.8, y: 0.45, w: 8.0, h: 0.3,
    fontSize: 10, fontFace: "Arial", color: C.purple, bold: true
  });
  slide.addText(title, {
    x: 0.8, y: 0.75, w: 11.5, h: 0.6,
    fontSize: 24, fontFace: "Arial", color: C.white, bold: true
  });
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0.8, y: 1.4, w: 11.7, h: 0.02,
    fill: { color: C.border }
  });
  slide.addText("AI Roundtable  |  Shubham Raj · Rishabh Choudhary · Priyam Garg", {
    x: 0.8, y: 7.0, w: 11.7, h: 0.3,
    fontSize: 9, fontFace: "Arial", color: C.gray, align: "right"
  });
}

// SLIDE 1
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.8, y: 1.2, w: 4.8, h: 0.4, fill: { color: "2E1065" }, line: { color: C.purple, width: 1 } });
  s.addText("🎙️ ELEVENLABS HACKATHON · VOICE AI TRACK", { x: 0.9, y: 1.25, w: 4.6, h: 0.3, fontSize: 11, fontFace: "Arial", color: "DDD6FE", bold: true });
  s.addText("AI Roundtable", { x: 0.8, y: 1.8, w: 11.5, h: 1.1, fontSize: 48, fontFace: "Arial", color: C.white, bold: true });
  s.addText("A Real-Time Multi-Agent Podcast with Live Human Interruption", { x: 0.8, y: 2.9, w: 11.0, h: 0.6, fontSize: 20, fontFace: "Arial", color: C.sky });
  s.addText("Autonomous AI experts debate, clash, and respond to live audience challenges through low-latency ElevenLabs speech synthesis.", { x: 0.8, y: 3.5, w: 10.5, h: 0.8, fontSize: 13, fontFace: "Arial", color: C.gray });

  const badges = [
    { title: "Autonomous Debate", desc: "Moderator, Optimist & Skeptic", color: C.purple },
    { title: "Voice AI Engine", desc: "ElevenLabs Turbo v2.5 streaming", color: C.emerald },
    { title: "Instant Interruption", desc: "0ms speech halt & dynamic pivot", color: C.sky }
  ];
  badges.forEach((b, idx) => {
    const x = 0.8 + idx * 3.9;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x, y: 4.5, w: 3.7, h: 1.1, fill: { color: C.card }, line: { color: C.border, width: 1 }, rectRadius: 0.15 });
    s.addText(b.title, { x: x + 0.2, y: 4.65, w: 3.3, h: 0.3, fontSize: 13, fontFace: "Arial", color: b.color, bold: true });
    s.addText(b.desc, { x: x + 0.2, y: 4.95, w: 3.3, h: 0.5, fontSize: 11, fontFace: "Arial", color: C.gray });
  });

  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.8, y: 5.9, w: 11.7, h: 0.9, fill: { color: "111827" }, line: { color: "374151", width: 1 }, rectRadius: 0.15 });
  s.addText("PROJECT TEAM:  Shubham Raj  ·  Rishabh Choudhary  ·  Priyam Garg", { x: 1.1, y: 6.2, w: 11.0, h: 0.35, fontSize: 13, fontFace: "Arial", color: C.white, bold: true });
}

// SLIDE 2: PROBLEM
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  addHeader(s, "The Hard Part: Beyond Generating Three AI Responses");

  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.8, y: 1.7, w: 5.6, h: 4.9, fill: { color: C.card }, line: { color: "991B1B", width: 1.5 }, rectRadius: 0.15 });
  s.addText("Current AI Voice Limitations", { x: 1.1, y: 1.9, w: 5.0, h: 0.4, fontSize: 16, fontFace: "Arial", color: C.red, bold: true });
  const pains = [
    { b: "Robotic Monologues: ", t: "Standard LLMs output large essays that sound repetitive and lifeless when read out loud." },
    { b: "Zero Tension: ", t: "Single-agent outputs lack debate, intellectual friction, and authentic conversational cadence." },
    { b: "Uninterruptible Playback: ", t: "When an AI voice plays audio, users are passive listeners who cannot interrupt." },
    { b: "Uniform Timbre: ", t: "Conversations lack distinct vocal identities, emotional prosody, and natural transitions." }
  ];
  pains.forEach((p, idx) => {
    s.addText([{ text: "✖  " + p.b, options: { bold: true, color: C.white, fontSize: 11 } }, { text: p.t, options: { color: C.gray, fontSize: 11 } }], { x: 1.1, y: 2.5 + idx * 1.0, w: 5.0, h: 0.85 });
  });

  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 6.9, y: 1.7, w: 5.6, h: 4.9, fill: { color: C.card }, line: { color: "065F46", width: 1.5 }, rectRadius: 0.15 });
  s.addText("Our Solution: Voice-Native Multi-Agent System", { x: 7.2, y: 1.9, w: 5.0, h: 0.4, fontSize: 16, fontFace: "Arial", color: C.emerald, bold: true });
  const sol = [
    { b: "Dialectical Banter: ", t: "Three autonomous personas clash dynamically—Optimist, Skeptic, and Moderator." },
    { b: "ElevenLabs Voice Identity: ", t: "Each agent commands a dedicated, hyper-realistic voice profile (Rachel, Adam, Nicole)." },
    { b: "Live Listener Interruption: ", t: "Audio halts instantly on user input, context updates, and the debate pivots in real time." },
    { b: "Snappy Turn Dynamics: ", t: "Concise 35-50 word turns with direct name-calling ('Marcus is missing Sophia's point')." }
  ];
  sol.forEach((o, idx) => {
    s.addText([{ text: "✔  " + o.b, options: { bold: true, color: C.white, fontSize: 11 } }, { text: o.t, options: { color: C.gray, fontSize: 11 } }], { x: 7.2, y: 2.5 + idx * 1.0, w: 5.0, h: 0.85 });
  });
}

// SLIDE 3: TECH SPEC TABLE
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  addHeader(s, "Technologies Used & Their Purpose (Specification Table)");

  const tableData = [
    [
      { text: "Technology", options: { bold: true, color: C.purple, fill: { color: "1E293B" }, fontSize: 11 } },
      { text: "Purpose in AI Roundtable", options: { bold: true, color: C.white, fill: { color: "1E293B" }, fontSize: 11 } },
      { text: "Implementation Details", options: { bold: true, color: C.emerald, fill: { color: "1E293B" }, fontSize: 11 } }
    ],
    [
      { text: "Python or Node.js", options: { bold: true, color: C.white, fontSize: 10 } },
      { text: "Backend logic and agent orchestration", options: { color: C.gray, fontSize: 10 } },
      { text: "Node.js Express / orchestrator.js", options: { color: C.sky, fontSize: 9 } }
    ],
    [
      { text: "LLM API", options: { bold: true, color: C.white, fontSize: 10 } },
      { text: "Generates each agent's arguments and responses", options: { color: C.gray, fontSize: 10 } },
      { text: "Gemini 2.0 Flash / OpenAI / Dynamic Generator", options: { color: C.sky, fontSize: 9 } }
    ],
    [
      { text: "ElevenLabs Text-to-Speech", options: { bold: true, color: C.white, fontSize: 10 } },
      { text: "Gives each agent a distinct voice with low latency", options: { color: C.gray, fontSize: 10 } },
      { text: "eleven_turbo_v2_5 streaming (Rachel, Adam, Nicole)", options: { color: C.sky, fontSize: 9 } }
    ],
    [
      { text: "WebSockets or HTTP Streams", options: { bold: true, color: C.white, fontSize: 10 } },
      { text: "Supports real-time audio chunk delivery & signaling", options: { color: C.gray, fontSize: 10 } },
      { text: "Low-latency binary chunk stream & event bus", options: { color: C.sky, fontSize: 9 } }
    ],
    [
      { text: "React / Next.js", options: { bold: true, color: C.white, fontSize: 10 } },
      { text: "Frontend, playback controls and synchronized transcript", options: { color: C.gray, fontSize: 10 } },
      { text: "React 19, Vite, Tailwind CSS Studio Desk UI", options: { color: C.sky, fontSize: 9 } }
    ],
    [
      { text: "Speech-to-Text", options: { bold: true, color: C.white, fontSize: 10 } },
      { text: "Converts the user's spoken questions into text", options: { color: C.gray, fontSize: 10 } },
      { text: "Web Speech API (webkitSpeechRecognition)", options: { color: C.sky, fontSize: 9 } }
    ],
    [
      { text: "In-Memory State / History", options: { bold: true, color: C.white, fontSize: 10 } },
      { text: "Tracks conversation history, queue, and whose turn it is", options: { color: C.gray, fontSize: 10 } },
      { text: "Dynamic Turn Memory & Interruption Stack", options: { color: C.sky, fontSize: 9 } }
    ]
  ];

  s.addTable(tableData, {
    x: 0.8, y: 1.8, w: 11.7, h: 4.8,
    fill: { color: C.card },
    border: { color: C.border, pt: 1 },
    margin: [6, 8, 6, 8]
  });
}

// SLIDE 4: ARCHITECTURE FLOWCHART
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  addHeader(s, "System Architecture: End-to-End Voice AI Flow");

  const nodes = [
    { title: "1. INPUT LAYER", desc: "User Topic + Live Microphone / Quick Chips", color: C.sky },
    { title: "2. ORCHESTRATOR", desc: "Turn Choreography, Persona Prompts & Memory", color: C.purple },
    { title: "3. LLM ENGINE", desc: "Generates punchy 35-word banter", color: C.emerald },
    { title: "4. ELEVENLABS AI", desc: "Turbo v2.5 streaming speech (Rachel, Adam, Nicole)", color: C.purple },
    { title: "5. STUDIO UI", desc: "Equalizer waveforms, sync transcript & audio scrubber", color: C.sky }
  ];

  nodes.forEach((n, idx) => {
    const x = 0.8 + idx * 2.38;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x, y: 2.0, w: 2.15, h: 4.2, fill: { color: C.card }, line: { color: n.color, width: 2 }, rectRadius: 0.15 });
    s.addText(n.title, { x: x + 0.15, y: 2.3, w: 1.85, h: 0.6, fontSize: 12, fontFace: "Arial", color: n.color, bold: true });
    s.addText(n.desc, { x: x + 0.15, y: 3.1, w: 1.85, h: 2.5, fontSize: 11, fontFace: "Arial", color: C.gray });
    if (idx < nodes.length - 1) {
      s.addText("➔", { x: x + 2.15, y: 3.8, w: 0.25, h: 0.4, fontSize: 14, fontFace: "Arial", color: C.gray, align: "center" });
    }
  });
}

// SLIDE 5: INTERRUPTION FLOWCHART
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  addHeader(s, "The Core Innovation: Real-Time Human Interruption Lifecycle");

  const steps = [
    { t: "1. Speech Cancellation", sub: "audioEngine.stop()", d: "0ms immediate termination of active stream. Zero audio lag.", color: C.red },
    { t: "2. State Marking", sub: "[Interrupted by Listener]", d: "Transcript cuts off active speaker at exact interrupt timestamp.", color: "F59E0B" },
    { t: "3. Input Capture", sub: "Web Speech STT / Text", d: "Captures audience microphone query (e.g. 'What about junior jobs?').", color: C.sky },
    { t: "4. Context Injection", sub: "Shared History Update", d: "User question injected into prompt window as priority event.", color: C.purple },
    { t: "5. Contextual Pivot", sub: "Direct Agent Response", d: "Moderator or challenged agent immediately addresses listener by name.", color: C.emerald }
  ];

  steps.forEach((st, idx) => {
    const x = 0.8 + idx * 2.38;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x, y: 2.0, w: 2.2, h: 4.3, fill: { color: C.card }, line: { color: st.color, width: 2 }, rectRadius: 0.15 });
    s.addText(st.t, { x: x + 0.15, y: 2.2, w: 1.9, h: 0.5, fontSize: 12, fontFace: "Arial", color: st.color, bold: true });
    s.addShape(pptx.shapes.RECTANGLE, { x: x + 0.15, y: 2.8, w: 1.9, h: 0.35, fill: { color: "0F172A" } });
    s.addText(st.sub, { x: x + 0.15, y: 2.85, w: 1.9, h: 0.25, fontSize: 9, fontFace: "Arial", color: C.white, bold: true, align: "center" });
    s.addText(st.d, { x: x + 0.15, y: 3.3, w: 1.9, h: 2.5, fontSize: 11, fontFace: "Arial", color: C.gray });
  });
}

// SLIDE 6: DEMO
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  addHeader(s, "Live Demo: Broadcast-Quality Dialogue Exchange");

  const dialogs = [
    { spk: "Elena Vance (Host)", c: C.purple, t: "\"Welcome to AI Roundtable. Today's question: 'Will AI replace software developers by 2028?'. Marcus, start us off—what is your core thesis?\"" },
    { spk: "Dr. Marcus Sterling (Optimist)", c: C.emerald, t: "\"Thanks Elena. Throughout history, every abstraction layer created more value. Compilers didn't eliminate coders; they allowed software to eat the world! Every engineer now commands a 10x team.\"" },
    { spk: "Sophia Chen (Skeptic)", c: C.red, t: "\"Compilers were deterministic, Marcus. LLMs hallucinate false code. And if companies automate juniors away, who trains the senior architects of 2030?\"" },
    { spk: "Audience Interruption (Live Mic)", c: C.sky, t: "[INTERRUPTS MARCUS] \"Wait Marcus, what about the junior engineers who can't get entry-level jobs right now?\"" },
    { spk: "Dr. Marcus Sterling (Pivot)", c: C.emerald, t: "\"Crucial point from our listener. While entry-level rote tasks shift, apprenticeship will evolve into verification and domain modeling. Leverage will create millions of new high-value roles.\"" }
  ];

  dialogs.forEach((d, idx) => {
    const y = 1.8 + idx * 0.98;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.8, y, w: 11.7, h: 0.85, fill: { color: C.card }, line: { color: d.c, width: 1 }, rectRadius: 0.1 });
    s.addText(d.spk, { x: 1.1, y: y + 0.1, w: 3.5, h: 0.3, fontSize: 11, fontFace: "Arial", color: d.c, bold: true });
    s.addText(d.t, { x: 4.6, y: y + 0.1, w: 7.7, h: 0.65, fontSize: 10, fontFace: "Arial", color: C.white, italic: true });
  });
}

// SLIDE 7: ROADMAP
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  addHeader(s, "Beyond the Hackathon: Future Roadmap");

  const road = [
    { t: "Interactive Education", d: "Students step into historical roundtables (Einstein vs Bohr on Quantum Physics) and ask questions directly to AI historical figures.", c: C.purple },
    { t: "Automated Market Intel", d: "Autonomous panels debate corporate earnings, tech trends, and geopolitical developments with synthetic bull/bear analysis.", c: C.emerald },
    { t: "Full-Duplex WebRTC Voice", d: "Sub-150ms bi-directional audio streaming with acoustic echo cancellation and acoustic voice activity detection.", c: C.sky },
    { t: "Multi-Listener Town Halls", d: "Scaling from a single listener to virtual live audiences with question upvoting, sentiment polling, and live audio queues.", c: C.red }
  ];

  road.forEach((r, idx) => {
    const x = idx % 2 === 0 ? 0.8 : 6.8;
    const y = idx < 2 ? 1.8 : 4.3;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x, y, w: 5.7, h: 2.2, fill: { color: C.card }, line: { color: r.c, width: 1.5 }, rectRadius: 0.15 });
    s.addText(r.t, { x: x + 0.3, y: y + 0.2, w: 5.1, h: 0.4, fontSize: 16, fontFace: "Arial", color: r.c, bold: true });
    s.addText(r.d, { x: x + 0.3, y: y + 0.7, w: 5.1, h: 1.2, fontSize: 12, fontFace: "Arial", color: C.gray });
  });
}

// SLIDE 8: CONCLUSION
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };
  s.addText("ELEVENLABS HACKATHON · FINAL PITCH", { x: 0.8, y: 0.8, w: 8.0, h: 0.3, fontSize: 12, fontFace: "Arial", color: C.purple, bold: true });
  s.addText("Thank You! Ready for Judging & Q&A", { x: 0.8, y: 1.2, w: 11.5, h: 0.8, fontSize: 36, fontFace: "Arial", color: C.white, bold: true });
  s.addText("AI Roundtable demonstrates the next frontier of audio AI: shifting from passive one-way speech to dynamic multi-agent conversational ecosystems.", { x: 0.8, y: 2.1, w: 11.5, h: 0.7, fontSize: 14, fontFace: "Arial", color: C.gray });

  const team = [
    { name: "Shubham Raj", role: "Voice AI Architecture & Full-Stack Orchestration", color: C.purple },
    { name: "Rishabh Choudhary", role: "Multi-Agent Prompts & Interruption Pipeline", color: C.emerald },
    { name: "Priyam Garg", role: "Studio UI/UX & Real-Time Audio Engine", color: C.sky }
  ];
  team.forEach((m, idx) => {
    const x = 0.8 + idx * 3.9;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x, y: 3.1, w: 3.7, h: 2.2, fill: { color: C.card }, line: { color: m.color, width: 2 }, rectRadius: 0.15 });
    s.addText(m.name, { x: x + 0.2, y: 3.4, w: 3.3, h: 0.4, fontSize: 18, fontFace: "Arial", color: C.white, bold: true, align: "center" });
    s.addText("Team Member", { x: x + 0.2, y: 3.85, w: 3.3, h: 0.25, fontSize: 11, fontFace: "Arial", color: m.color, bold: true, align: "center" });
    s.addText(m.role, { x: x + 0.3, y: 4.25, w: 3.1, h: 0.8, fontSize: 11, fontFace: "Arial", color: C.gray, align: "center" });
  });

  s.addShape(pptx.shapes.RECTANGLE, { x: 0.8, y: 5.7, w: 11.7, h: 1.0, fill: { color: "111827" }, line: { color: C.border, width: 1 } });
  s.addText("🔗 GitHub Repository:  https://github.com/shubhmroot/ai-roundtable", { x: 1.1, y: 5.85, w: 11.0, h: 0.3, fontSize: 12, fontFace: "Arial", color: C.sky, bold: true });
  s.addText("🎙️ Live Demo:  http://localhost:5173  |  Built with ElevenLabs Turbo v2.5", { x: 1.1, y: 6.2, w: 11.0, h: 0.3, fontSize: 11, fontFace: "Arial", color: C.white });
}

const pptxPath = "C:\\Users\\shubh\\Desktop\\AI_Roundtable_Executive_Presentation.pptx";
pptx.writeFile({ fileName: pptxPath })
  .then(f => console.log(`✅ Clean PPTX created at: ${f}`))
  .catch(e => console.error(e));
