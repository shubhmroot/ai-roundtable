// Multi-Agent Podcast Orchestrator

export const AGENT_PROFILES = {
  moderator: {
    id: "moderator",
    name: "Elena Vance",
    role: "The Moderator & Host",
    voiceId: "21m00Tcm4TlvDq8ikWAM",
    color: "#8b5cf6", // Purple
    tagline: "Frames dilemmas, maintains conversational cadence, bridges human interruptions.",
    systemPrompt: `You are Elena Vance, the host and moderator of the 'AI Roundtable' live podcast.
Your job is to:
1. Keep the debate focused, engaging, and fast-paced.
2. Pose sharp, provocative questions to both Marcus (the Optimist) and Sophia (the Skeptic).
3. If a human listener interrupts, acknowledge their exact question or objection warmly and immediately redirect it to the appropriate panelist.
4. Keep your turns concise and punchy (2-4 sentences max, around 35-50 words). Never lecture. Talk like a real podcast host on Joe Rogan, Hard Fork, or Lex Fridman.`
  },
  optimist: {
    id: "optimist",
    name: "Dr. Marcus Sterling",
    role: "The Tech Optimist",
    voiceId: "pNInz6obpgDQGcFmaJgB",
    color: "#10b981", // Emerald
    tagline: "Argues for rapid technological leaps, human amplification, and economic abundance.",
    systemPrompt: `You are Dr. Marcus Sterling, an enthusiastic tech entrepreneur, AI researcher, and visionary.
Your perspective:
1. You believe AI multiplies human capability rather than simply destroying value.
2. You argue from historical parallels (industrial revolution, compilers, internet) and emerging frontiers.
3. You address Sophia's skepticism respectfully but counter her risk-aversion with data and optimism.
4. Always refer to your co-panelists by their first names (Elena, Sophia).
5. If responding to a human listener's interruption, address their concern directly and explain why innovation will overcome it.
6. Keep your speech punchy, energetic, and concise (2-4 sentences max, 35-50 words).`
  },
  skeptic: {
    id: "skeptic",
    name: "Sophia Chen",
    role: "The Critical Analyst & Skeptic",
    voiceId: "piTKgcLEGmPE4e6mEKli",
    color: "#ef4444", // Red/Coral
    tagline: "Unpacks safety blind spots, hallucinations, labor displacement, and hype cycles.",
    systemPrompt: `You are Sophia Chen, a tech ethicist, former ML engineer, and critical analyst.
Your perspective:
1. You identify ungrounded hype, fragile edge cases, legal liability, and socioeconomic disruption.
2. You challenge Marcus's sunny assumptions with real-world bottlenecks, compute limits, and hallucination issues.
3. You respect innovation but insist on rigorous realism and accountability.
4. Always address co-panelists by their first names (Elena, Marcus).
5. If responding to a human listener's interruption, validate their grounded perspective against tech idealism.
6. Keep your speech punchy, sharp, and concise (2-4 sentences max, 35-50 words).`
  }
};

/**
 * Determine which agent should speak next based on conversation state
 */
export function determineNextSpeaker({ history = [], userInterruption = null, preferredSpeaker = null }) {
  if (preferredSpeaker && AGENT_PROFILES[preferredSpeaker]) {
    return preferredSpeaker;
  }

  // If there's an interruption, let's see if the user mentioned someone
  if (userInterruption) {
    const textLower = (userInterruption.text || "").toLowerCase();
    if (textLower.includes("marcus") || textLower.includes("optimist")) {
      return "optimist";
    }
    if (textLower.includes("sophia") || textLower.includes("skeptic") || textLower.includes("chen")) {
      return "skeptic";
    }
    // Otherwise, moderator Elena acknowledges the user first!
    return "moderator";
  }

  // If empty conversation, Moderator starts
  if (history.length === 0) {
    return "moderator";
  }

  const lastSpeaker = history[history.length - 1]?.speakerId;

  // Conversational choreography
  if (history.length === 1 && lastSpeaker === "moderator") {
    // Elena introduced topic -> Marcus opens
    return "optimist";
  }

  if (lastSpeaker === "moderator") {
    // Elena just spoke -> see who spoke before Elena
    const secondLast = history[history.length - 2]?.speakerId;
    return secondLast === "optimist" ? "skeptic" : "optimist";
  }

  if (lastSpeaker === "optimist") {
    // Marcus spoke -> 65% chance Sophia counters, 35% Elena moderates
    return Math.random() < 0.65 ? "skeptic" : "moderator";
  }

  if (lastSpeaker === "skeptic") {
    // Sophia spoke -> 65% chance Marcus defends, 35% Elena moderates
    return Math.random() < 0.65 ? "optimist" : "moderator";
  }

  return "moderator";
}

/**
 * Generate turn via Gemini API
 */
async function generateWithGemini({ apiKey, prompt, systemInstruction }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemInstruction }] },
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 150,
        temperature: 0.85,
      }
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${err}`);
  }

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
}

/**
 * Generate turn via OpenAI API
 */
async function generateWithOpenAI({ apiKey, prompt, systemInstruction }) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: prompt }
      ],
      max_tokens: 150,
      temperature: 0.85
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${err}`);
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content?.trim();
}

/**
 * High-fidelity fallback dialogue engine when no LLM API key is entered
 * Ensures zero-breakage demo experience during hackathons!
 */
function generateFallbackTurn({ topic, speakerId, history, userInterruption }) {
  const turnIndex = history.length;
  const isInterruption = Boolean(userInterruption);
  const userText = userInterruption?.text || "What about the unforeseen consequences?";

  if (speakerId === "moderator") {
    if (turnIndex === 0) {
      return `Welcome everyone to the AI Roundtable. Today, we're tackling a question on everyone's mind: "${topic}". Marcus, you've been vocal about how this technology will transform human capability. Start us off—what's your core thesis?`;
    }
    if (isInterruption) {
      return `Hold that thought, everyone. A listener in the audience just jumped in with a crucial point: "${userText}". Marcus, Sophia—how do we square that reality with what we've been discussing?`;
    }
    const prompts = [
      `That touches on a fundamental tension here. Sophia raises the fragility of real-world systems, but Marcus points to undeniable productivity metrics. Sophia, what's the fatal flaw in Marcus's optimism?`,
      `Let's pivot slightly. Even if the technology delivers on its promise, what happens to the social contract? Marcus, are we moving faster than human institutions can adapt?`,
      `We're seeing both sides of the coin clearly. Before we go deeper, Marcus, how do you answer the liability question when autonomous code causes catastrophic failures?`
    ];
    return prompts[turnIndex % prompts.length];
  }

  if (speakerId === "optimist") {
    if (turnIndex <= 1) {
      return `Thanks, Elena. My thesis on "${topic}" is simple: throughout history, every tool that elevated human abstraction created vastly more value than it replaced. We're not automating intelligence away; we are giving every single person the leverage of a world-class engineering team.`;
    }
    if (isInterruption) {
      return `That's an important pushback from our listener: "${userText}". But look at the history of technology—every time we feared displacement, we opened up entirely new industries that couldn't have existed before. The leverage we gain far outweighs the friction.`;
    }
    const optimistPoints = [
      `Sophia, with respect, you're focusing entirely on the downside risks while ignoring the velocity of progress. When compilers were invented, people thought assembly programmers were finished. Instead, software ate the world and created tens of millions of high-paying jobs!`,
      `Elena, the economic reality is that demand for software and intelligent problem solving is effectively infinite. If AI makes developing ten times cheaper, companies won't build ten times less—they'll build a thousand times more!`,
      `I completely disagree with the notion that safety requires stagnation. The safest way to navigate "${topic}" is to build better, self-correcting autonomous systems with robust verification layers, not hide from innovation.`
    ];
    return optimistPoints[turnIndex % optimistPoints.length];
  }

  if (speakerId === "skeptic") {
    if (isInterruption) {
      return `I'm really glad our listener pointed that out: "${userText}". Marcus keeps appealing to historical analogies, but compilers never hallucinated false code, nor did they destabilize entry-level apprenticeship models in six months. We need to confront that friction now.`;
    }
    const skepticPoints = [
      `Marcus, that compiler analogy is dangerously seductive. Compilers are deterministic; modern foundation models are probabilistic and hallucination-prone. When you deploy agents into critical production workflows, the debugging and security liabilities don't vanish—they compound.`,
      `Elena, look at what's happening on the ground with "${topic}". Senior developers might move faster, but we are effectively gutting junior roles and the apprenticeship ladder. Who trains the senior engineers of 2030 if entry-level work is completely automated?`,
      `We cannot just wave a magic wand and assume economic abundance solves governance. When an autonomous agent causes a multi-million dollar outage or a security breach, who is legally accountable? Marcus's optimism doesn't answer the legal and ethical liability.`
    ];
    return skepticPoints[turnIndex % skepticPoints.length];
  }

  return `That is a compelling aspect of "${topic}" that demands our close attention.`;
}

/**
 * Main turn generation function
 */
export async function generateTurn({
  topic,
  history = [],
  userInterruption = null,
  preferredSpeaker = null,
  apiKey = null,
  apiProvider = "gemini", // "gemini" | "openai" | "fallback"
}) {
  const speakerId = determineNextSpeaker({ history, userInterruption, preferredSpeaker });
  const agent = AGENT_PROFILES[speakerId];

  // Build conversational context
  const recentTurns = history.slice(-6).map(t => `${t.speakerName} (${t.role}): "${t.text}"`).join("\n\n");

  let interruptionContext = "";
  if (userInterruption) {
    interruptionContext = `\n\nCRITICAL EVENT - HUMAN INTERRUPTION:
A live human listener just interrupted the podcast and said:
"${userInterruption.text}"
You MUST explicitly acknowledge this human interruption directly in your first sentence and respond to their point!`;
  }

  const prompt = `Topic of the Podcast: "${topic}"

Recent Conversation:
${recentTurns || "(This is the very beginning of the podcast episode.)"}
${interruptionContext}

Now generate the NEXT turn for ${agent.name} (${agent.role}).
Guidelines:
- Length: 2 to 4 sentences maximum (approx 35-55 words).
- Make it sound natural, fast-paced, and authentic for an audio podcast.
- Refer to co-panelists by their first names (Elena, Marcus, Sophia).
- Output ONLY the spoken text. Do not include prefixes like '${agent.name}:' or markdown asterisks.`;

  let responseText = null;

  if (apiKey) {
    try {
      if (apiProvider === "gemini" || (!apiProvider && apiKey.startsWith("AIza"))) {
        responseText = await generateWithGemini({
          apiKey,
          prompt,
          systemInstruction: agent.systemPrompt
        });
      } else if (apiProvider === "openai" || apiKey.startsWith("sk-")) {
        responseText = await generateWithOpenAI({
          apiKey,
          prompt,
          systemInstruction: agent.systemPrompt
        });
      }
    } catch (err) {
      console.warn("LLM API call failed, falling back to smart dynamic generator:", err.message);
    }
  }

  if (!responseText) {
    responseText = generateFallbackTurn({
      topic,
      speakerId,
      history,
      userInterruption
    });
  }

  // Clean any accidental "Name: " prefixes
  responseText = responseText.replace(/^(Elena Vance|Dr\. Marcus Sterling|Sophia Chen|Elena|Marcus|Sophia):\s*/i, '');
  responseText = responseText.replace(/^"|"$/g, '').trim();

  return {
    speakerId: agent.id,
    speakerName: agent.name,
    role: agent.role,
    color: agent.color,
    voiceId: agent.voiceId,
    text: responseText,
    timestamp: new Date().toISOString(),
    isInterruptionResponse: Boolean(userInterruption)
  };
}
