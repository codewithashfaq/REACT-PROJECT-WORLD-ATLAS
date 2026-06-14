import { useState, useRef, useEffect, useCallback } from "react";
import { getAIResponse } from "../api/AskAi";
import {
  FaRobot,
  FaTimes,
  FaPaperPlane,
  FaSpinner,
  FaTrash,
  FaMinus,
  FaExpand,
  FaCopy,
  FaCheck,
  FaDownload,
  FaMicrophone,
  FaMicrophoneSlash,
  FaThumbsUp,
  FaThumbsDown,
} from "react-icons/fa";
import { useCountry } from "../context/CountryContext";

// ---------------------------------------------------------------------------
// inlineFormat — inline markdown: **bold**, *italic*, `code`
// Called by every block renderer below.
// ---------------------------------------------------------------------------
const inlineFormat = (text) => {
  if (!text) return "";
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, '<code class="ai-inline-code">$1</code>');
};

// ---------------------------------------------------------------------------
// getIndentLevel — counts leading spaces on a line.
// 2+ spaces = this line is a sub-item of the list entry above it.
// ---------------------------------------------------------------------------
const getIndentLevel = (line) => {
  const match = line.match(/^(\s+)/);
  return match ? match[1].length : 0;
};

// ---------------------------------------------------------------------------
// renderSubItems
// Converts indented lines following a list item into a nested sub-list.
//
// The AI produces this pattern:
//   1. **Section Title**
//      *Key:* Description.
//      *AnotherKey:* Value.
//
// *Key:* Value  →  styled key-value row (key accented, value normal weight)
// Any other indented line  →  plain sub-bullet
//
// This is what makes "Timing → Best months / Avoid" visually distinct
// instead of everything running at the same flat indent level.
// ---------------------------------------------------------------------------
const renderSubItems = (subLines) => {
  if (!subLines.length) return "";
  const items = subLines.map((line) => {
    const trimmed = line.trim();
    // Pattern: *Key:* value
    const kvMatch = trimmed.match(/^\*([^*]+):\*\s*(.*)/);
    if (kvMatch) {
      return `<li class="ai-subitem ai-kv">
        <span class="ai-kv-key">${kvMatch[1]}</span>
        <span class="ai-kv-sep">: </span>
        <span class="ai-kv-val">${inlineFormat(kvMatch[2])}</span>
      </li>`;
    }
    return `<li class="ai-subitem">${inlineFormat(trimmed)}</li>`;
  });
  return `<ul class="ai-sublist">${items.join("")}</ul>`;
};

// ---------------------------------------------------------------------------
// parseMarkdown — hierarchy-aware markdown → HTML parser
//
// Core fix for the flat-render problem: numbered list items now consume
// any immediately following indented lines as their own sub-list.
//
// Supported syntax:
//   Numbered lists with indented sub-items (*Key:* Value pattern)
//   Bullet lists with indented sub-items
//   Tables  |  # Headings  |  > Blockquotes  |  --- Dividers  |  Paragraphs
// ---------------------------------------------------------------------------
const parseMarkdown = (text) => {
  if (!text) return "";

  const lines = text.split("\n");
  const output = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // ── Table: consecutive "|" lines, second line is "|---" separator ──
    if (trimmed.startsWith("|") && lines[i + 1]?.trim().startsWith("|---")) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      const [headerRow, , ...bodyRows] = tableLines;
      const headers = headerRow
        .split("|")
        .filter((c) => c.trim())
        .map((c) => c.trim());
      const headerHtml = headers
        .map((h) => `<th>${inlineFormat(h)}</th>`)
        .join("");
      const bodyHtml = bodyRows
        .map((row) => {
          const cells = row
            .split("|")
            .filter((c) => c.trim())
            .map((c) => c.trim());
          return `<tr>${cells.map((c) => `<td>${inlineFormat(c)}</td>`).join("")}</tr>`;
        })
        .join("");
      output.push(
        `<div class="ai-table-wrapper"><table class="ai-table"><thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody></table></div>`,
      );
      continue;
    }

    // ── Headings: # / ## / ### ──
    const headingMatch = trimmed.match(/^(#{1,3})\s+(.*)/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      output.push(
        `<h${level} class="ai-heading ai-h${level}">${inlineFormat(headingMatch[2])}</h${level}>`,
      );
      i++;
      continue;
    }

    // ── Numbered list with indented sub-items ──
    // Reads the "N. item" line, then grabs all following lines with
    // 2+ leading spaces as that item's sub-items before moving to next entry.
    if (trimmed.match(/^\d+\.\s+/)) {
      const listHtml = [];
      while (i < lines.length && lines[i].trim().match(/^\d+\.\s+/)) {
        const itemText = lines[i].trim().replace(/^\d+\.\s+/, "");
        i++;
        // Collect indented sub-lines belonging to this item
        const subLines = [];
        while (
          i < lines.length &&
          getIndentLevel(lines[i]) >= 2 &&
          lines[i].trim() !== ""
        ) {
          subLines.push(lines[i]);
          i++;
        }
        listHtml.push(
          `<li class="ai-numbered-item">${inlineFormat(itemText)}${renderSubItems(subLines)}</li>`,
        );
      }
      output.push(
        `<ol class="ai-list ai-numbered-list">${listHtml.join("")}</ol>`,
      );
      continue;
    }

    // ── Unordered list with indented sub-items ──
    if (trimmed.match(/^[-*]\s+/)) {
      const listItems = [];
      while (i < lines.length && lines[i].trim().match(/^[-*]\s+/)) {
        const itemText = lines[i].trim().replace(/^[-*]\s+/, "");
        i++;
        const subLines = [];
        while (
          i < lines.length &&
          getIndentLevel(lines[i]) >= 2 &&
          lines[i].trim() !== ""
        ) {
          subLines.push(lines[i]);
          i++;
        }
        listItems.push(
          `<li class="ai-bullet-item">${inlineFormat(itemText)}${renderSubItems(subLines)}</li>`,
        );
      }
      output.push(`<ul class="ai-list">${listItems.join("")}</ul>`);
      continue;
    }

    // ── Blockquote ──
    if (trimmed.startsWith("> ")) {
      output.push(
        `<blockquote class="ai-blockquote">${inlineFormat(trimmed.slice(2))}</blockquote>`,
      );
      i++;
      continue;
    }

    // ── Horizontal rule ──
    if (trimmed === "---") {
      output.push(`<hr class="ai-divider" />`);
      i++;
      continue;
    }

    // ── Empty line ──
    if (trimmed === "") {
      output.push(`<div class="ai-spacer"></div>`);
      i++;
      continue;
    }

    // ── Default: paragraph ──
    output.push(`<p class="ai-para">${inlineFormat(trimmed)}</p>`);
    i++;
  }

  return output.join("");
};

// ---------------------------------------------------------------------------
// MessageBubble
// Renders a single chat message with markdown, timestamp, copy, and feedback.
// ---------------------------------------------------------------------------
const MessageBubble = ({ msg, onFeedback }) => {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState(null); // "up" | "down" | null

  const handleCopy = () => {
    navigator.clipboard
      .writeText(msg.text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
  };

  const handleFeedback = (type) => {
    setFeedback(type);
    onFeedback?.(msg.id, type);
  };

  const isUser = msg.sender === "user";

  return (
    <div
      className={`ai-message ${isUser ? "user-message" : "ai-message-bubble"}`}
    >
      {/* Render parsed markdown for AI; plain text for user */}
      {isUser ? (
        <div className="message-content">{msg.text}</div>
      ) : (
        <div
          className="message-content"
          dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.text) }}
        />
      )}

      <div className="message-footer">
        <span className="message-time">
          {msg.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>

        {/* AI-only actions: copy + thumbs feedback */}
        {!isUser && (
          <div className="ai-message-actions">
            <button
              className="ai-copy-btn"
              onClick={handleCopy}
              title={copied ? "Copied!" : "Copy response"}
              aria-label={copied ? "Response copied" : "Copy response"}
            >
              {copied ? <FaCheck size={9} /> : <FaCopy size={9} />}
            </button>
            <button
              className={`ai-feedback-btn ${feedback === "up" ? "active-positive" : ""}`}
              onClick={() => handleFeedback("up")}
              title="Good response"
              aria-label="Mark as helpful"
            >
              <FaThumbsUp size={9} />
            </button>
            <button
              className={`ai-feedback-btn ${feedback === "down" ? "active-negative" : ""}`}
              onClick={() => handleFeedback("down")}
              title="Poor response"
              aria-label="Mark as unhelpful"
            >
              <FaThumbsDown size={9} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// TypingIndicator
// Animated three-dot bubble shown while the AI is generating a response.
// ---------------------------------------------------------------------------
const TypingIndicator = () => (
  <div
    className="ai-message ai-message-bubble ai-typing-indicator"
    role="status"
    aria-label="AI is generating a response"
  >
    <span aria-hidden="true" />
    <span aria-hidden="true" />
    <span aria-hidden="true" />
  </div>
);

// ---------------------------------------------------------------------------
// AIChatBot (Main Export)
//
// Drop inside AppLayout (or any Router-wrapped wrapper) — works on all pages.
// Auto-detects /country/:name routes and injects country context into prompts.
//
// Features:
//   - Rich markdown rendering (tables, lists, headings, code, blockquotes)
//   - Voice input via Web Speech API
//   - Export chat history as .txt
//   - Thumbs up/down message feedback
//   - Conversation memory (last 10 exchanges sent to AI for context)
//   - Unread badge + context-switch announcements
//   - Fully accessible (ARIA roles, keyboard nav)
// ---------------------------------------------------------------------------
export const AIChatBot = () => {
  const MAX_CHARS = 300;

  const { activeCountry } = useCountry();

  // Core UI state
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Messages state — sessionStorage se load karo taaki refresh pe chat na jaaye
  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem("worldatlas-chat");
      if (saved) {
        const parsed = JSON.parse(saved);
        // timestamps strings hain, Date objects banana padega
        return parsed.map((m) => ({ ...m, timestamp: new Date(m.timestamp) }));
      }
    } catch {}
    return null; // null = fresh start, welcome message dikhao
  });

  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(false);
  const [charCount, setCharCount] = useState(0);

  // Voice input state
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported] = useState(
    () => "webkitSpeechRecognition" in window || "SpeechRecognition" in window,
  );
  const recognitionRef = useRef(null);

  // Refs
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  // undefined = not initialized yet, null = no country, string = country name
  const prevCountryName = useRef(undefined);

  // ---------------------------------------------------------------------------
  // Effect: Welcome message on mount — sirf tab jab koi saved history nahi
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (messages !== null) return; // history hai toh skip
    setMessages([
      {
        id: "welcome",
        sender: "ai",
        timestamp: new Date(),
        text: "Hi! I'm your **World Atlas AI Assistant**.\n\nAsk me anything about countries, cultures, travel, and geography! 🌍\n\n> Try asking me to compare two countries — I'll show you a table!",
      },
    ]);
  }, []);

  // ---------------------------------------------------------------------------
  // Effect: Messages change hone pe sessionStorage mein save karo
  // Refresh pe chat history wapas milegi
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (messages === null) return;
    try {
      sessionStorage.setItem("worldatlas-chat", JSON.stringify(messages));
    } catch (err) {
      console.warn("Chat didn't save:", err);
    }
  }, [messages]);

  // ---------------------------------------------------------------------------
  // Effect: Announce context switch when navigating to a new country page
  // prevCountryName ref se double fire aur mount pe fire hona band hota hai
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (messages === null) return; // welcome abhi load nahi hua, wait karo

    const name = activeCountry?.names?.common ?? null;

    // Mount pe pehli baar — sirf track karo, message mat dikhao
    if (prevCountryName.current === undefined) {
      prevCountryName.current = name;
      return;
    }

    // Same country — skip
    if (prevCountryName.current === name) return;
    prevCountryName.current = name;

    const newCtxMsg = {
      id: `ctx-${Date.now()}`,
      sender: "ai",
      timestamp: new Date(),
      text: name
        ? `🌍 Now exploring **${name}**! Ask me anything about this country's culture, travel, food, or history.`
        : `🌐 Back to explorer mode! Ask me about any country in the world.`,
    };

    setMessages((prev) => {
      const lastMsg = prev[prev.length - 1];
      const isLastCtx = lastMsg?.id?.startsWith("ctx-");
      // Bar bar switch ho toh replace karo, stack mat karo
      return isLastCtx
        ? [...prev.slice(0, -1), newCtxMsg]
        : [...prev, newCtxMsg];
    });
  }, [activeCountry?.names?.common, messages === null]);

  // Auto-scroll to the latest message whenever messages or loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Increment unread badge when chat is closed and AI replies
  useEffect(() => {
    if (isOpen || !messages || messages.length <= 1) return;
    const last = messages[messages.length - 1];
    if (last.sender === "ai") setUnreadCount((n) => n + 1);
  }, [messages]);

  // ---------------------------------------------------------------------------
  // Handler: Open chat
  // ---------------------------------------------------------------------------
  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setUnreadCount(0);
    setTimeout(() => inputRef.current?.focus(), 150);
  };

  // ---------------------------------------------------------------------------
  // Handler: Close chat
  // ---------------------------------------------------------------------------
  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
    stopListening();
  };

  // ---------------------------------------------------------------------------
  // Handler: Clear conversation
  // ---------------------------------------------------------------------------
  const handleClearChat = () => {
    // prevCountryName reset karo taaki next navigation pe context message aa sake
    prevCountryName.current = activeCountry?.names?.common ?? null;
    setMessages([
      {
        id: `clear-${Date.now()}`,
        sender: "ai",
        timestamp: new Date(),
        text: activeCountry
          ? `Chat cleared! Ask me anything about **${activeCountry.names?.common}**. 🌍`
          : "Chat cleared! Ask me anything about world geography. 🌍",
      },
    ]);
  };

  // ---------------------------------------------------------------------------
  // Handler: Export chat history as a .txt file
  // ---------------------------------------------------------------------------
  const handleExportChat = () => {
    const content = messages
      .map((m) => {
        const time = m.timestamp.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        const sender = m.sender === "user" ? "You" : "World Atlas AI";
        return `[${time}] ${sender}:\n${m.text}\n`;
      })
      .join("\n---\n\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `worldatlas-chat-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ---------------------------------------------------------------------------
  // Voice Input: Start / Stop using Web Speech API
  // ---------------------------------------------------------------------------
  const startListening = useCallback(() => {
    if (!voiceSupported) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage((prev) =>
        (prev + " " + transcript).trim().slice(0, MAX_CHARS),
      );
      setCharCount((prev) => Math.min(prev + transcript.length, MAX_CHARS));
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  }, [voiceSupported]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const toggleVoice = () => {
    isListening ? stopListening() : startListening();
  };

  // ---------------------------------------------------------------------------
  // Handler: Send message → get AI response
  // Passes last 10 messages as conversation history for better AI context.
  // ---------------------------------------------------------------------------
  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || isLoading) return;

    const text = inputMessage.trim();
    setInputMessage("");
    setCharCount(0);
    stopListening();

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: "user",
      timestamp: new Date(),
      text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Build last-10-messages history for multi-turn context
      const history = messages
        .slice(-10)
        .filter((m) => m.id !== "welcome")
        .map((m) => ({
          role: m.sender === "user" ? "user" : "assistant",
          content: m.text,
        }));

      const response = await getAIResponse(text, activeCountry, history);
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          sender: "ai",
          timestamp: new Date(),
          text: response,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "ai",
          timestamp: new Date(),
          text: "Sorry, something went wrong. Please try again! 🤖",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage, isLoading, activeCountry, messages, stopListening]);

  // Send on Enter (Shift+Enter is reserved for future multi-line support)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Enforce character limit on every keystroke
  const handleInputChange = (e) => {
    const val = e.target.value.slice(0, MAX_CHARS);
    setInputMessage(val);
    setCharCount(val.length);
  };

  // Quick prompt chip clicked — populate input and focus
  const handleQuickPrompt = (prompt) => {
    setInputMessage(prompt);
    setCharCount(prompt.length);
    inputRef.current?.focus();
  };

  // Feedback handler (extendable: could send to analytics)
  const handleFeedback = (msgId, type) => {
    console.info(`Feedback [${type}] on message ${msgId}`);
  };

  // Quick prompts adapt based on whether we have country context
  const quickPrompts = activeCountry
    ? [
        "Best time to visit?",
        "Famous foods?",
        "Travel tips",
        "Culture overview",
      ]
    : [
        "Most beautiful countries?",
        "Best for digital nomads?",
        "Hidden gems in Asia?",
        "Compare India and Japan",
      ];

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div
      className="ai-chatbot-container"
      role="complementary"
      aria-label="AI Chat Assistant"
    >
      {/* Floating trigger button (visible when chat is closed) */}
      {!isOpen && (
        <button
          className="ai-chatbot-button"
          onClick={handleOpen}
          aria-label="Open AI chat assistant"
          title="Ask AI about countries"
        >
          <FaRobot size={20} aria-hidden="true" />
          <span className="ai-chatbot-label">Ask AI</span>

          {/* Unread message badge */}
          {unreadCount > 0 && (
            <span
              className="ai-unread-badge"
              aria-label={`${unreadCount} unread message${unreadCount > 1 ? "s" : ""}`}
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div
          className={`ai-chatbot-window${isMinimized ? " ai-chatbot-minimized" : ""}`}
          role="dialog"
          aria-label="World Atlas AI Chat"
          aria-modal="false"
        >
          {/* Header — always visible */}
          <div className="ai-chatbot-header">
            <div className="ai-chatbot-title">
              <FaRobot className="ai-icon" aria-hidden="true" />
              <span>World Atlas AI</span>
              {activeCountry && (
                <span
                  className="ai-context-badge"
                  title={`Context: ${activeCountry.names?.common}`}
                >
                  {activeCountry.names?.common}
                </span>
              )}
            </div>

            <div className="ai-header-actions">
              {/* Export chat */}
              <button
                className="ai-icon-btn"
                onClick={handleExportChat}
                aria-label="Export chat history"
                title="Export chat"
              >
                <FaDownload size={11} />
              </button>

              {/* Clear chat */}
              <button
                className="ai-icon-btn"
                onClick={handleClearChat}
                aria-label="Clear chat history"
                title="Clear chat"
              >
                <FaTrash size={11} />
              </button>

              {/* Minimize / Restore */}
              <button
                className="ai-icon-btn"
                onClick={() => setIsMinimized((v) => !v)}
                aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
                title={isMinimized ? "Expand" : "Minimize"}
              >
                {isMinimized ? <FaExpand size={11} /> : <FaMinus size={11} />}
              </button>

              {/* Close */}
              <button
                className="ai-icon-btn"
                onClick={handleClose}
                aria-label="Close chat"
                title="Close"
              >
                <FaTimes size={13} />
              </button>
            </div>
          </div>

          {/* Body — hidden when minimized */}
          {!isMinimized && (
            <>
              {/* Scrollable message thread */}
              <div
                className="ai-messages-container"
                role="log"
                aria-live="polite"
                aria-label="Chat messages"
              >
                {messages.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    msg={msg}
                    onFeedback={handleFeedback}
                  />
                ))}

                {isLoading && <TypingIndicator />}

                {/* Invisible scroll anchor */}
                <div ref={messagesEndRef} aria-hidden="true" />
              </div>

              {/* Quick-prompt chips */}
              <div
                className="ai-quick-prompts"
                role="group"
                aria-label="Suggested questions"
              >
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    className="quick-prompt-btn"
                    onClick={() => handleQuickPrompt(prompt)}
                    aria-label={`Ask: ${prompt}`}
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Input row */}
              <div className="ai-input-area">
                {/* Voice input button (shown only if browser supports it) */}
                {voiceSupported && (
                  <button
                    className={`ai-voice-btn ${isListening ? "ai-voice-active" : ""}`}
                    onClick={toggleVoice}
                    aria-label={
                      isListening ? "Stop voice input" : "Start voice input"
                    }
                    title={
                      isListening ? "Stop listening" : "Speak your question"
                    }
                    disabled={isLoading}
                  >
                    {isListening ? (
                      <FaMicrophoneSlash size={14} />
                    ) : (
                      <FaMicrophone size={14} />
                    )}
                  </button>
                )}

                <div className="ai-input-wrapper">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      isListening
                        ? "Listening..."
                        : activeCountry
                          ? `Ask about ${activeCountry.names?.common}...`
                          : "Ask about any country..."
                    }
                    disabled={isLoading}
                    aria-label="Type your message"
                  />
                  {charCount > 0 && (
                    <span
                      className={`ai-char-count${charCount >= MAX_CHARS * 0.9 ? " ai-char-warn" : ""}`}
                      aria-live="polite"
                      aria-label={`${charCount} of ${MAX_CHARS} characters`}
                    >
                      {charCount}/{MAX_CHARS}
                    </span>
                  )}
                </div>

                {/* Send button */}
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="ai-send-button"
                  aria-label="Send message"
                  title="Send (Enter)"
                >
                  {isLoading ? (
                    <FaSpinner className="spinner" aria-hidden="true" />
                  ) : (
                    <FaPaperPlane aria-hidden="true" />
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
