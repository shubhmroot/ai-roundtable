import pptxgen from "pptxgenjs";

const pptx = new pptxgen();

// Presentation 16:9 widescreen
pptx.layout = "LAYOUT_16x9";
pptx.author = "Shubham Raj, Rishabh Choudhary, Priyam Garg";
pptx.company = "ElevenLabs Hackathon";
pptx.title = "AI Roundtable: A Real-Time Multi-Agent Podcast";
pptx.subject = "Voice AI integration, speech synthesis workflows and novel audio-driven developer tools";

// Color Palette
const COLORS = {
  bg: "0A0D14",        // Deep Studio Dark
  cardBg: "141B2D",    // Elevated Dark Card
  border: "253252",    // Subtle Border
  purple: "8B5CF6",    // Moderator Elena
  emerald: "10B981",   // Optimist Marcus
  red: "EF4444",       // Skeptic Sophia
  cyan: "38BDF8",      // Human Listener / Tech
  white: "F8FAFC",     // Primary text
  gray: "94A3B8",      // Secondary text
  darkText: "0F172A",
  accent: "6366F1"
};

// Helper: Common Header for Content Slides
function addSlideHeader(slide, title, category = "ELEVENLABS HACKATHON · SPECIAL TRACK") {
  // Category Pill
  slide.addText(category.toUpperCase(), {
    x: 0.8,
    y: 0.45,
    w: 8.0,
    h: 0.3,
    fontSize: 10,
    fontFace: "Arial",
    color: COLORS.purple,
    bold: true
  });

  // Main Title
  slide.addText(title, {
    x: 0.8,
    y: 0.75,
    w: 11.5,
    h: 0.6,
    fontSize: 24,
    fontFace: "Arial",
    color: COLORS.white,
    bold: true
  });

  // Top decorative subtle line
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0.8,
    y: 1.4,
    w: 11.7,
    h: 0.02,
    fill: { color: COLORS.border }
  });

  // Footer team attribution
  slide.addText("AI Roundtable  |  Shubham Raj · Rishabh Choudhary · Priyam Garg", {
    x: 0.8,
    y: 7.0,
    w: 11.7,
    h: 0.3,
    fontSize: 9,
    fontFace: "Arial",
    color: COLORS.gray,
    align: "right"
  });
}

// ==========================================
// SLIDE 1: TITLE SLIDE
// ==========================================
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.bg };

  // Decorative glow box
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0.8,
    y: 1.2,
    w: 4.8,
    h: 0.4,
    fill: { color: "2E1065" },
    line: { color: COLORS.purple, width: 1 }
  });
  slide.addText("🎙️ ELEVENLABS HACKATHON · VOICE AI TRACK", {
    x: 0.9,
    y: 1.25,
    w: 4.6,
    h: 0.3,
    fontSize: 11,
    fontFace: "Arial",
    color: "DDD6FE",
    bold: true
  });

  // Main Title
  slide.addText("AI Roundtable", {
    x: 0.8,
    y: 1.8,
    w: 11.5,
    h: 1.1,
    fontSize: 48,
    fontFace: "Arial",
    color: COLORS.white,
    bold: true
  });

  // Subtitle
  slide.addText("A Real-Time Multi-Agent Podcast with Live Human Interruption", {
    x: 0.8,
    y: 2.9,
    w: 11.0,
    h: 0.6,
    fontSize: 20,
    fontFace: "Arial",
    color: COLORS.cyan
  });

  slide.addText("Where autonomous AI personas debate, clash, and respond to live audience challenges through low-latency ElevenLabs speech synthesis.", {
    x: 0.8,
    y: 3.5,
    w: 10.5,
    h: 0.8,
    fontSize: 13,
    fontFace: "Arial",
    color: COLORS.gray
  });

  // Feature Badges
  const badges = [
    { title: "Voice Synthesis", desc: "ElevenLabs Turbo v2.5 streaming", color: COLORS.purple },
    { title: "Dynamic Agents", desc: "Moderator, Optimist & Skeptic", color: COLORS.emerald },
    { title: "Live Interruption", desc: "Instant speech halt & context pivot", color: COLORS.cyan }
  ];

  badges.forEach((b, idx) => {
    const x = 0.8 + idx * 3.9;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x,
      y: 4.5,
      w: 3.7,
      h: 1.1,
      fill: { color: COLORS.cardBg },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.15
    });

    slide.addText(b.title, {
      x: x + 0.2,
      y: 4.65,
      w: 3.3,
      h: 0.3,
      fontSize: 13,
      fontFace: "Arial",
      color: b.color,
      bold: true
    });

    slide.addText(b.desc, {
      x: x + 0.2,
      y: 4.95,
      w: 3.3,
      h: 0.5,
      fontSize: 11,
      fontFace: "Arial",
      color: COLORS.gray
    });
  });

  // Team Members Footer Banner
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8,
    y: 5.9,
    w: 11.7,
    h: 0.9,
    fill: { color: "111827" },
    line: { color: "374151", width: 1 },
    rectRadius: 0.15
  });

  slide.addText("PROJECT TEAM:", {
    x: 1.1,
    y: 6.2,
    w: 2.0,
    h: 0.3,
    fontSize: 11,
    fontFace: "Arial",
    color: COLORS.purple,
    bold: true
  });

  slide.addText("Shubham Raj  ·  Rishabh Choudhary  ·  Priyam Garg", {
    x: 3.2,
    y: 6.18,
    w: 9.0,
    h: 0.35,
    fontSize: 14,
    fontFace: "Arial",
    color: COLORS.white,
    bold: true
  });
}

// ==========================================
// SLIDE 2: THE PROBLEM & MOTIVATION
// ==========================================
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.bg };
  addSlideHeader(slide, "The Problem: Why Traditional AI Content Falls Flat");

  // Left Box: Current Pain Points
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8,
    y: 1.7,
    w: 5.6,
    h: 4.9,
    fill: { color: COLORS.cardBg },
    line: { color: "991B1B", width: 1.5 },
    rectRadius: 0.15
  });

  slide.addText("Current AI Voice Limitations", {
    x: 1.1,
    y: 1.9,
    w: 5.0,
    h: 0.4,
    fontSize: 16,
    fontFace: "Arial",
    color: COLORS.red,
    bold: true
  });

  const painPoints = [
    { bold: "Robotic Monologues: ", text: "Standard LLMs output large essays that sound repetitive and lifeless when read out loud." },
    { bold: "Zero Tension: ", text: "Single-agent outputs lack debate, intellectual friction, and authentic conversational cadence." },
    { bold: "Uninterruptible Playback: ", text: "When an AI voice plays audio, users are passive listeners who cannot interrupt or challenge claims." },
    { bold: "Uniform Timbre: ", text: "Conversations lack distinct vocal identities, emotional prosody, and natural podcast transitions." }
  ];

  painPoints.forEach((p, idx) => {
    slide.addText([
      { text: "✖  " + p.bold, options: { bold: true, color: COLORS.white, fontSize: 12 } },
      { text: p.text, options: { color: COLORS.gray, fontSize: 12 } }
    ], {
      x: 1.1,
      y: 2.5 + idx * 1.0,
      w: 5.0,
      h: 0.85
    });
  });

  // Right Box: The AI Roundtable Opportunity
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.9,
    y: 1.7,
    w: 5.6,
    h: 4.9,
    fill: { color: COLORS.cardBg },
    line: { color: "065F46", width: 1.5 },
    rectRadius: 0.15
  });

  slide.addText("Our Solution: Voice-Native Multi-Agent System", {
    x: 7.2,
    y: 1.9,
    w: 5.0,
    h: 0.4,
    fontSize: 16,
    fontFace: "Arial",
    color: COLORS.emerald,
    bold: true
  });

  const opportunities = [
    { bold: "Dialectical Banter: ", text: "Three autonomous personas clash dynamically—Optimist, Skeptic, and Moderator." },
    { bold: "ElevenLabs Voice Identity: ", text: "Each agent commands a dedicated, hyper-realistic voice profile (Rachel, Adam, Nicole)." },
    { bold: "Live Listener Interruption: ", text: "Audio halts instantly on user input, context updates, and the debate pivots in real-time." },
    { bold: "Snappy Turn Dynamics: ", text: "Concise 35-50 word turns with direct name-calling ('Marcus is missing Sophia's point')." }
  ];

  opportunities.forEach((o, idx) => {
    slide.addText([
      { text: "✔  " + o.bold, options: { bold: true, color: COLORS.white, fontSize: 12 } },
      { text: o.text, options: { color: COLORS.gray, fontSize: 12 } }
    ], {
      x: 7.2,
      y: 2.5 + idx * 1.0,
      w: 5.0,
      h: 0.85
    });
  });
}

// ==========================================
// SLIDE 3: THE CAST OF CHARACTERS
// ==========================================
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.bg };
  addSlideHeader(slide, "The Autonomous Cast: Distinct Personalities & Voices");

  const agents = [
    {
      name: "Elena Vance",
      role: "The Moderator & Host",
      voice: "ElevenLabs Rachel (21m00...)",
      color: COLORS.purple,
      border: "6D28D9",
      initials: "EV",
      desc: "Keeps tempo, frames dilemmas, asks provocative follow-ups, and warmly invites listener interruptions into the debate."
    },
    {
      name: "Dr. Marcus Sterling",
      role: "The Tech Optimist",
      voice: "ElevenLabs Adam (pNInz6...)",
      color: COLORS.emerald,
      border: "059669",
      initials: "MS",
      desc: "Champions developer leverage, historical parallels (compilers, industrial scale), and infinite demand for intelligent software."
    },
    {
      name: "Sophia Chen",
      role: "The Critical Analyst & Skeptic",
      voice: "ElevenLabs Nicole (piTKgc...)",
      color: COLORS.red,
      border: "B91C1C",
      initials: "SC",
      desc: "Unpacks legal liability, hallucinations in production, fragile dependencies, and the destruction of junior developer apprenticeship."
    }
  ];

  agents.forEach((agent, idx) => {
    const x = 0.8 + idx * 3.9;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x,
      y: 1.7,
      w: 3.7,
      h: 4.8,
      fill: { color: COLORS.cardBg },
      line: { color: agent.border, width: 2 },
      rectRadius: 0.15
    });

    // Avatar Circle
    slide.addShape(pptx.shapes.OVAL, {
      x: x + 1.25,
      y: 2.0,
      w: 1.2,
      h: 1.2,
      fill: { color: agent.color }
    });
    slide.addText(agent.initials, {
      x: x + 1.25,
      y: 2.3,
      w: 1.2,
      h: 0.6,
      fontSize: 18,
      fontFace: "Arial",
      color: COLORS.white,
      bold: true,
      align: "center"
    });

    // Name & Role
    slide.addText(agent.name, {
      x: x + 0.2,
      y: 3.4,
      w: 3.3,
      h: 0.4,
      fontSize: 16,
      fontFace: "Arial",
      color: COLORS.white,
      bold: true,
      align: "center"
    });

    slide.addText(agent.role, {
      x: x + 0.2,
      y: 3.8,
      w: 3.3,
      h: 0.3,
      fontSize: 11,
      fontFace: "Arial",
      color: agent.color,
      bold: true,
      align: "center"
    });

    // Voice Info
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: x + 0.4,
      y: 4.2,
      w: 2.9,
      h: 0.4,
      fill: { color: "0A0D14" },
      line: { color: COLORS.border, width: 1 }
    });
    slide.addText("🎙️ " + agent.voice, {
      x: x + 0.4,
      y: 4.25,
      w: 2.9,
      h: 0.3,
      fontSize: 9,
      fontFace: "Arial",
      color: COLORS.cyan,
      align: "center"
    });

    // Persona Description
    slide.addText(agent.desc, {
      x: x + 0.3,
      y: 4.75,
      w: 3.1,
      h: 1.5,
      fontSize: 11,
      fontFace: "Arial",
      color: COLORS.gray,
      align: "center"
    });
  });
}

// ==========================================
// SLIDE 4: SYSTEM ARCHITECTURE FLOWCHART
// ==========================================
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.bg };
  addSlideHeader(slide, "System Architecture: End-to-End Voice AI Flow");

  // Flowchart Nodes (Horizontal pipeline)
  const pipeline = [
    { step: "01", title: "Human Listener / Topic", desc: "User inputs debate topic or triggers voice interruption via Web Speech STT", color: COLORS.cyan },
    { step: "02", title: "Agent Orchestrator", desc: "Determines speaker turn, applies persona prompts & integrates conversational history", color: COLORS.purple },
    { step: "03", title: "LLM Generation", desc: "Generates punchy 35-50 word turns with conversational interjections", color: COLORS.emerald },
    { step: "04", title: "ElevenLabs Voice AI", desc: "Low-latency streaming TTS using eleven_turbo_v2_5 with custom prosody", color: COLORS.purple },
    { step: "05", title: "Virtual Studio Desk", desc: "Audio playback, animated equalizer rings & live auto-scrolling transcript", color: COLORS.cyan }
  ];

  pipeline.forEach((item, idx) => {
    const x = 0.8 + idx * 2.38;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x,
      y: 2.1,
      w: 2.15,
      h: 3.8,
      fill: { color: COLORS.cardBg },
      line: { color: item.color, width: 1.5 },
      rectRadius: 0.15
    });

    // Step Number Badge
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: x + 0.2,
      y: 2.3,
      w: 0.6,
      h: 0.3,
      fill: { color: item.color }
    });
    slide.addText(item.step, {
      x: x + 0.2,
      y: 2.32,
      w: 0.6,
      h: 0.25,
      fontSize: 10,
      fontFace: "Arial",
      color: COLORS.darkText,
      bold: true,
      align: "center"
    });

    slide.addText(item.title, {
      x: x + 0.15,
      y: 2.8,
      w: 1.85,
      h: 0.7,
      fontSize: 13,
      fontFace: "Arial",
      color: COLORS.white,
      bold: true
    });

    slide.addText(item.desc, {
      x: x + 0.15,
      y: 3.6,
      w: 1.85,
      h: 2.0,
      fontSize: 11,
      fontFace: "Arial",
      color: COLORS.gray
    });

    // Connector Arrow
    if (idx < pipeline.length - 1) {
      slide.addText("➔", {
        x: x + 2.15,
        y: 3.6,
        w: 0.25,
        h: 0.4,
        fontSize: 14,
        fontFace: "Arial",
        color: COLORS.gray,
        align: "center"
      });
    }
  });

  // Technical Highlights Bottom Bar
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0.8,
    y: 6.1,
    w: 11.7,
    h: 0.65,
    fill: { color: "1E293B" }
  });
  slide.addText("TECH STACK: Node.js / Express (Backend Orchestrator) · ElevenLabs Turbo v2.5 · React 19 / Vite · Web Speech API · Tailwind CSS", {
    x: 1.0,
    y: 6.25,
    w: 11.3,
    h: 0.35,
    fontSize: 11,
    fontFace: "Arial",
    color: COLORS.cyan,
    bold: true
  });
}

// ==========================================
// SLIDE 5: REAL-TIME INTERRUPTION FLOWCHART (THE CLIMAX)
// ==========================================
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.bg };
  addSlideHeader(slide, "The Core Innovation: Real-Time Human Interruption");

  slide.addText("What makes this technically challenging? Halting streaming speech instantly and seamlessly pivoting the debate context.", {
    x: 0.8,
    y: 1.6,
    w: 11.5,
    h: 0.4,
    fontSize: 13,
    fontFace: "Arial",
    color: COLORS.gray
  });

  const steps = [
    {
      title: "1. Speech Cancellation",
      subtitle: "audioEngine.stop()",
      desc: "Instantaneous cancellation of active HTML5 Audio stream / buffer. Zero audio lag.",
      color: COLORS.red
    },
    {
      title: "2. State Marking",
      subtitle: "[Interrupted by Listener]",
      desc: "Active agent statement is cut off at the interruption timestamp with visual badge.",
      color: "F59E0B"
    },
    {
      title: "3. Input Capture",
      subtitle: "Web Speech STT / Text",
      desc: "Captures audience microphone query (e.g. 'Wait, what about junior developer jobs?').",
      color: COLORS.cyan
    },
    {
      title: "4. Context Injection",
      subtitle: "Shared History Update",
      desc: "Interruption payload injected into conversation memory as priority event.",
      color: COLORS.purple
    },
    {
      title: "5. Contextual Pivot",
      subtitle: "Targeted Counter-Turn",
      desc: "Moderator or challenged speaker immediately addresses listener by name.",
      color: COLORS.emerald
    }
  ];

  steps.forEach((s, idx) => {
    const x = 0.8 + idx * 2.38;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x,
      y: 2.2,
      w: 2.2,
      h: 4.3,
      fill: { color: COLORS.cardBg },
      line: { color: s.color, width: 2 },
      rectRadius: 0.15
    });

    slide.addText(s.title, {
      x: x + 0.15,
      y: 2.4,
      w: 1.9,
      h: 0.6,
      fontSize: 13,
      fontFace: "Arial",
      color: s.color,
      bold: true
    });

    slide.addShape(pptx.shapes.RECTANGLE, {
      x: x + 0.15,
      y: 3.1,
      w: 1.9,
      h: 0.35,
      fill: { color: "0F172A" }
    });
    slide.addText(s.subtitle, {
      x: x + 0.15,
      y: 3.15,
      w: 1.9,
      h: 0.25,
      fontSize: 9,
      fontFace: "Arial",
      color: COLORS.white,
      bold: true,
      align: "center"
    });

    slide.addText(s.desc, {
      x: x + 0.15,
      y: 3.65,
      w: 1.9,
      h: 2.4,
      fontSize: 11,
      fontFace: "Arial",
      color: COLORS.gray
    });
  });
}

// ==========================================
// SLIDE 6: ELEVENLABS INTEGRATION & AUDIO RESILIENCE
// ==========================================
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.bg };
  addSlideHeader(slide, "Voice AI Mastery: ElevenLabs Architecture & Resilience");

  const cards = [
    {
      title: "Turbo v2.5 Low-Latency Streaming",
      points: [
        "Uses 'eleven_turbo_v2_5' model endpoint for sub-second speech synthesis.",
        "Server streams binary audio/mpeg chunks directly to browser AudioContext.",
        "Dramatically reduces conversational latency between debate turns."
      ],
      color: COLORS.purple
    },
    {
      title: "Persona-Specific Voice Profiles",
      points: [
        "Rachel (Moderator): British/neutral cadence, high stability for clear governance.",
        "Adam (Optimist): Resonant, bold American voice with enhanced style boost.",
        "Nicole (Skeptic): Crisp, analytical pitch suited for probing technical dilemmas."
      ],
      color: COLORS.emerald
    },
    {
      title: "Fail-Safe Zero-Breakage Engine",
      points: [
        "Automatic fallback to Web Speech Synthesis API if API quota is reached.",
        "Distinct browser voices mapped by gender and pitch to preserve agent roles.",
        "Guarantees the hackathon demo NEVER crashes on stage due to API limits."
      ],
      color: COLORS.cyan
    }
  ];

  cards.forEach((c, idx) => {
    const y = 1.7 + idx * 1.65;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8,
      y,
      w: 11.7,
      h: 1.45,
      fill: { color: COLORS.cardBg },
      line: { color: c.color, width: 1.5 },
      rectRadius: 0.12
    });

    slide.addText(c.title, {
      x: 1.1,
      y: y + 0.15,
      w: 11.0,
      h: 0.35,
      fontSize: 14,
      fontFace: "Arial",
      color: c.color,
      bold: true
    });

    c.points.forEach((pt, pIdx) => {
      slide.addText("•  " + pt, {
        x: 1.2,
        y: y + 0.5 + pIdx * 0.28,
        w: 11.0,
        h: 0.28,
        fontSize: 11,
        fontFace: "Arial",
        color: COLORS.white
      });
    });
  });
}

// ==========================================
// SLIDE 7: LIVE DEMO SCRIPT & RESULTS
// ==========================================
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.bg };
  addSlideHeader(slide, "Live Demo: A Real Multi-Agent Exchange");

  const dialogs = [
    {
      speaker: "Elena Vance (Host)",
      color: COLORS.purple,
      text: "\"Welcome everyone to AI Roundtable. Today's question: 'Will AI replace software developers by 2028?'. Marcus, start us off—what is your core thesis?\""
    },
    {
      speaker: "Dr. Marcus Sterling (Optimist)",
      color: COLORS.emerald,
      text: "\"Thanks Elena. Throughout history, every abstraction layer created more value. Compilers didn't kill developers; they made software eat the world! Every engineer now commands a 10x team.\""
    },
    {
      speaker: "Sophia Chen (Skeptic)",
      color: COLORS.red,
      text: "\"Compilers were deterministic, Marcus. LLMs hallucinate false code. And if companies automate juniors away, who trains the senior architects of 2030?\""
    },
    {
      speaker: "Live Audience (Shubham / Listener)",
      color: COLORS.cyan,
      text: "[INTERRUPT] \"Hold on Marcus, what about the junior engineers who can't get entry-level jobs right now?\""
    },
    {
      speaker: "Dr. Marcus Sterling (Pivot Response)",
      color: COLORS.emerald,
      text: "\"Crucial point from our listener. While entry-level rote tasks shift, apprenticeship will evolve into agent steering and verification. The leverage will create millions of new high-value roles.\""
    }
  ];

  dialogs.forEach((d, idx) => {
    const y = 1.7 + idx * 0.98;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8,
      y,
      w: 11.7,
      h: 0.85,
      fill: { color: COLORS.cardBg },
      line: { color: d.color, width: 1 },
      rectRadius: 0.1
    });

    slide.addText(d.speaker, {
      x: 1.1,
      y: y + 0.1,
      w: 3.5,
      h: 0.3,
      fontSize: 11,
      fontFace: "Arial",
      color: d.color,
      bold: true
    });

    slide.addText(d.text, {
      x: 4.6,
      y: y + 0.1,
      w: 7.7,
      h: 0.65,
      fontSize: 10.5,
      fontFace: "Arial",
      color: COLORS.white,
      italic: true
    });
  });
}

// ==========================================
// SLIDE 8: FUTURE ROADMAP & USE CASES
// ==========================================
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.bg };
  addSlideHeader(slide, "Beyond the Hackathon: Future Roadmap");

  const roadmaps = [
    {
      title: "Interactive Education",
      desc: "Students can step into historical roundtables (e.g., Einstein vs Bohr on Quantum Mechanics) and ask questions directly to AI historical figures.",
      color: COLORS.purple
    },
    {
      title: "Market Intelligence",
      desc: "Autonomous panels debate corporate earnings, tech trends, and geopolitical developments with synthetic bull/bear analysis.",
      color: COLORS.emerald
    },
    {
      title: "WebRTC Full-Duplex Voice",
      desc: "Direct browser-to-server WebRTC audio stream with sub-200ms latency and continuous acoustic interruption detection.",
      color: COLORS.cyan
    },
    {
      title: "Multi-Listener Town Halls",
      desc: "Scaling from a single listener to virtual live audiences with upvoting, queueing, and live audience sentiment reactions.",
      color: COLORS.red
    }
  ];

  roadmaps.forEach((r, idx) => {
    const x = idx % 2 === 0 ? 0.8 : 6.8;
    const y = idx < 2 ? 1.8 : 4.3;

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x,
      y,
      w: 5.7,
      h: 2.2,
      fill: { color: COLORS.cardBg },
      line: { color: r.color, width: 1.5 },
      rectRadius: 0.15
    });

    slide.addText(r.title, {
      x: x + 0.3,
      y: y + 0.2,
      w: 5.1,
      h: 0.4,
      fontSize: 16,
      fontFace: "Arial",
      color: r.color,
      bold: true
    });

    slide.addText(r.desc, {
      x: x + 0.3,
      y: y + 0.7,
      w: 5.1,
      h: 1.2,
      fontSize: 12,
      fontFace: "Arial",
      color: COLORS.gray
    });
  });
}

// ==========================================
// SLIDE 9: SUMMARY & TEAM ATTRIBUTION
// ==========================================
{
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.bg };

  slide.addText("ELEVENLABS HACKATHON · FINAL PITCH", {
    x: 0.8,
    y: 0.8,
    w: 8.0,
    h: 0.3,
    fontSize: 12,
    fontFace: "Arial",
    color: COLORS.purple,
    bold: true
  });

  slide.addText("Thank You! Questions & Demo", {
    x: 0.8,
    y: 1.2,
    w: 11.5,
    h: 0.8,
    fontSize: 36,
    fontFace: "Arial",
    color: COLORS.white,
    bold: true
  });

  slide.addText("AI Roundtable demonstrates the next frontier of audio AI: shifting from passive one-way speech to dynamic multi-agent conversational ecosystems.", {
    x: 0.8,
    y: 2.1,
    w: 11.5,
    h: 0.7,
    fontSize: 14,
    fontFace: "Arial",
    color: COLORS.gray
  });

  // Team Cards
  const team = [
    { name: "Shubham Raj", role: "Voice AI Architecture & Full-Stack Orchestration", color: COLORS.purple },
    { name: "Rishabh Choudhary", role: "Multi-Agent Prompts & Interruption Pipeline", color: COLORS.emerald },
    { name: "Priyam Garg", role: "Studio UI/UX & Real-Time Audio Engine", color: COLORS.cyan }
  ];

  team.forEach((m, idx) => {
    const x = 0.8 + idx * 3.9;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x,
      y: 3.1,
      w: 3.7,
      h: 2.2,
      fill: { color: COLORS.cardBg },
      line: { color: m.color, width: 2 },
      rectRadius: 0.15
    });

    slide.addText(m.name, {
      x: x + 0.2,
      y: 3.4,
      w: 3.3,
      h: 0.4,
      fontSize: 18,
      fontFace: "Arial",
      color: COLORS.white,
      bold: true,
      align: "center"
    });

    slide.addText("Team Member", {
      x: x + 0.2,
      y: 3.85,
      w: 3.3,
      h: 0.25,
      fontSize: 11,
      fontFace: "Arial",
      color: m.color,
      bold: true,
      align: "center"
    });

    slide.addText(m.role, {
      x: x + 0.3,
      y: 4.25,
      w: 3.1,
      h: 0.8,
      fontSize: 11,
      fontFace: "Arial",
      color: COLORS.gray,
      align: "center"
    });
  });

  // Links Box
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0.8,
    y: 5.7,
    w: 11.7,
    h: 1.0,
    fill: { color: "111827" },
    line: { color: COLORS.border, width: 1 }
  });

  slide.addText("🔗 GitHub Repository:  https://github.com/shubhmroot/ai-roundtable", {
    x: 1.1,
    y: 5.85,
    w: 11.0,
    h: 0.3,
    fontSize: 12,
    fontFace: "Arial",
    color: COLORS.cyan,
    bold: true
  });

  slide.addText("🎙️ Live Demo:  http://localhost:5173  |  Built with ElevenLabs Turbo v2.5", {
    x: 1.1,
    y: 6.2,
    w: 11.0,
    h: 0.3,
    fontSize: 11,
    fontFace: "Arial",
    color: COLORS.white
  });
}

// Generate the PPTX File
const outputPath = "C:\\Users\\shubh\\Desktop\\AI_Roundtable_Hackathon_Presentation.pptx";
pptx.writeFile({ fileName: outputPath })
  .then(fileName => {
    console.log(`✅ PowerPoint Presentation successfully created at: ${fileName}`);
  })
  .catch(err => {
    console.error("❌ Error generating presentation:", err);
  });
