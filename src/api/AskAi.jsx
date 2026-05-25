import axios from "axios";

// ============================================
// Configuration
// ============================================

// API key loaded from .env — never hardcode this to avoid key exposure.
const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

// OpenRouter chat completions endpoint
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

// ============================================
// System Prompt Builder
//
// Constructs the AI's base system prompt.
// When country context is available, the AI gets structured facts
// (capital, population, etc.) to answer precisely.
//
// KEY DESIGN DECISION — No formatting instructions are given here.
// The AI is told to judge format entirely from the question's nature:
//   - Casual question → conversational paragraph
//   - Comparison → table
//   - Steps / tips → numbered list
//   - Mixed content → mix of formats
// Forcing a format (e.g. "always use bullets") causes the AI to
// apply it even when it hurts readability.
// ============================================
const buildSystemPrompt = (countryData) => {
  // Base persona shared by both branches
  const persona = `You are World Atlas AI, a knowledgeable and friendly geography assistant.

FORMATTING RULES — read carefully:
You must choose the format that best serves the specific question. Do not default to any one style.

- Simple factual question (e.g. "What is the capital?") → one or two plain sentences. No lists, no table.
- Conversational or opinion question (e.g. "Is Japan worth visiting?") → natural paragraph prose.
- Enumerable items with no clear ranking (e.g. "What foods is Italy known for?") → bullet list.
- Sequential steps or tips (e.g. "Travel tips for Morocco") → numbered list.
- Side-by-side comparison of 2+ subjects (e.g. "Compare India and Japan") → markdown table.
- Long answer covering multiple distinct topics → use ## headings to separate sections, then choose the right format per section.
- Mixed content → mix formats freely within one response. A response can start with a paragraph, then a table, then bullets — whatever the content demands.

Never force a format. Let the question decide. Keep responses under 220 words.`;

  if (!countryData) return persona;

  // Flatten nested objects so the AI receives plain strings, not "[object Object]"
  const currencies = Object.keys(countryData.currencies || {})
    .map((key) => countryData.currencies[key].name)
    .join(", ");

  const languages = Object.keys(countryData.languages || {})
    .map((key) => countryData.languages[key])
    .join(", ");

  return `${persona}

CURRENT PAGE CONTEXT — ${countryData.name?.common || "Unknown"}:
- Official Name: ${countryData.name?.official || "N/A"}
- Capital: ${countryData.capital?.[0] || "N/A"}
- Region: ${countryData.region || "Unknown"} / ${countryData.subregion || ""}
- Population: ${countryData.population?.toLocaleString() || "Unknown"}
- Area: ${countryData.area?.toLocaleString() || "N/A"} km²
- Currencies: ${currencies || "N/A"}
- Languages: ${languages || "N/A"}
- Timezones: ${countryData.timezones?.join(", ") || "N/A"}
- Borders: ${countryData.borders?.join(", ") || "None / Island nation"}

Use this data to give accurate, specific answers about ${countryData.name?.common}. If the user asks something outside this data, draw from your general knowledge but stay on topic.`;
};

// ============================================
// getAIResponse
//
// Main function called by the chatbot to get an AI reply.
//
// @param {string} message       - The user's latest message
// @param {object} countryContext - Country data object from the REST Countries API (optional)
// @param {Array}  history        - Previous [{role, content}] messages for multi-turn context (optional)
// @returns {Promise<string>}     - The AI's plain-text response
// ============================================
export const getAIResponse = async (
  message,
  countryContext = null,
  history = [],
) => {
  try {
    const systemPrompt = buildSystemPrompt(countryContext);

    // Build message array: system prompt + conversation history + new user message
    const messages = [
      { role: "system", content: systemPrompt },
      ...history, // Previous turns give the AI conversational context
      { role: "user", content: message },
    ];

    const response = await axios.post(
      API_URL,
      {
        model: "openai/gpt-oss-20b:free",
        messages,
        temperature: 0.7, // Slightly creative but still factual
        max_tokens: 1024,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    // Extract the assistant's text from the response
    const aiText = response.data?.choices?.[0]?.message?.content;
    return aiText?.trim() || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    // Log details in development for easier debugging
    console.error("AI Service Error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    // Return user-friendly error messages based on HTTP status
    if (error.response?.status === 429) {
      return "I'm a bit overwhelmed right now. Please try again in a moment! 😅";
    }

    if ([400, 401, 403].includes(error.response?.status)) {
      return "Access denied. Please check your API key in the .env file.";
    }

    return "Oops! Something went wrong with the AI. Please try again later. 🤖";
  }
};
