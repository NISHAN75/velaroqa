import { useCallback, useEffect, useRef, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import {
  CHATBOT,
  QUICK_SUGGESTIONS,
  FALLBACK_REPLY,
  AI,
} from "../../data/chatbotConfig";
import { getBotReply } from "../../utils/botReply";
import { askAI } from "../../utils/aiClient";
import { createMessage, loadMessages, saveMessages, clearMessages } from "../../utils/chatHistory";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import QuickSuggestions from "./QuickSuggestions";
import ChatInput from "./ChatInput";
import ClearChatDialog from "./ClearChatDialog";
import "./ChatBot.css";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  // Saved conversation is loaded once, when the website starts
  const [messages, setMessages] = useState(loadMessages);
  const [pending, setPending] = useState(0); // replies still "typing"
  const [greeting, setGreeting] = useState(false); // welcome message still "typing"
  const [conversationKey, setConversationKey] = useState(0); // changes on "clear chat"
  const [unread, setUnread] = useState(true); // dot on the button

  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const timers = useRef(new Set());
  // A restored conversation already has its welcome message
  const greeted = useRef(messages.length > 0);
  const visibleRef = useRef(false);
  const messagesRef = useRef(messages); // latest messages, for the AI history
  const busyRef = useRef(false); // true while a reply is on its way (blocks duplicates)
  const conversationRef = useRef(0); // late replies from a cleared chat are ignored
  const controllers = useRef(new Set()); // running AI requests, cancelled on clear/unmount

  const isVisible = isOpen && !isMinimized;
  visibleRef.current = isVisible;
  messagesRef.current = messages;
  const isTyping = pending > 0 || greeting;

  /* Save every change to localStorage (an empty list removes the saved entry) */
  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  /* Welcome message: on first open of a new conversation (also after "clear chat") */
  useEffect(() => {
    if (!isOpen || greeted.current) return;
    setGreeting(true);
    const t = setTimeout(() => {
      greeted.current = true;
      setMessages((m) => [createMessage("assistant", CHATBOT.welcome), ...m]);
      setGreeting(false);
    }, CHATBOT.greetingDelayMs);
    return () => {
      clearTimeout(t);
      setGreeting(false);
    };
  }, [isOpen, conversationKey]);

  /* Keep the newest message in view */
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping, isVisible]);

  /* Escape: closes the confirmation first, otherwise the window */
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (confirmClear) setConfirmClear(false);
      else setIsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, confirmClear]);

  /* A closed window never keeps a confirmation open */
  useEffect(() => {
    if (!isOpen) setConfirmClear(false);
  }, [isOpen]);

  /* Focus the input on desktop only (on phones it would pop the keyboard) */
  useEffect(() => {
    if (!isVisible) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const t = setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 250);
    return () => clearTimeout(t);
  }, [isVisible]);

  /* Clear pending timers and cancel AI requests on unmount */
  useEffect(() => {
    const set = timers.current;
    const requests = controllers.current;
    return () => {
      set.forEach(clearTimeout);
      requests.forEach((c) => c.abort());
    };
  }, []);

  /* Shows the assistant's answer and frees the chat for the next message */
  const deliver = useCallback((convo, answer) => {
    if (convo !== conversationRef.current) return; // the chat was cleared meanwhile
    setMessages((m) => [...m, createMessage("assistant", answer.text, answer.productIds)]);
    setPending((p) => Math.max(0, p - 1));
    busyRef.current = false;
    if (!visibleRef.current) setUnread(true);
  }, []);

  /* Local reply (quick buttons, and the safety net when the AI is unavailable) */
  const localAnswer = (text, intent) => {
    try {
      return getBotReply(text, intent);
    } catch {
      return { text: FALLBACK_REPLY, productIds: [] };
    }
  };

  /*
    Sending a message:
    - quick buttons  -> instant local answer (real product data, no AI cost)
    - typed messages -> Gemini through /api/chat; if that fails, the local answer is used
  */
  const send = useCallback(
    (text, intent) => {
      const clean = text.trim();
      if (!clean || busyRef.current) return; // empty, or a reply is still pending

      const userMessage = createMessage("user", clean);
      const history = [...messagesRef.current, userMessage];
      const convo = conversationRef.current;

      busyRef.current = true;
      setMessages((m) => [...m, userMessage]);
      setPending((p) => p + 1);

      if (intent) {
        const t = setTimeout(() => {
          timers.current.delete(t);
          deliver(convo, localAnswer(clean, intent));
        }, CHATBOT.replyDelayMs);
        timers.current.add(t);
        return;
      }

      const controller = new AbortController();
      controllers.current.add(controller);
      (async () => {
        let answer;
        try {
          answer = await askAI(history, controller.signal);
        } catch (error) {
          if (error.kind === "aborted") return; // chat cleared or closed: nothing to show
          answer =
            error.kind === "rate_limited"
              ? { text: AI.rateLimitedReply, productIds: [] }
              : localAnswer(clean); // AI down / no key / timeout: still be useful
        } finally {
          controllers.current.delete(controller);
        }
        deliver(convo, answer);
      })();
    },
    [deliver]
  );

  const handleSuggestion = (item) => send(`${item.emoji} ${item.label}`, item.intent);

  /* On phones the chat covers the page, so minimize it when a product is opened */
  const handleProductClick = () => {
    if (window.matchMedia("(max-width: 639px)").matches) setIsMinimized(true);
  };

  const toggleOpen = () => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
      setIsMinimized(false);
      setUnread(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized((v) => !v);
    setUnread(false);
  };

  /* Clear chat: ask first, then wipe state + saved history and greet again */
  const askToClear = () => {
    setIsMinimized(false); // the confirmation needs the full window
    setConfirmClear(true);
  };

  const clearConversation = () => {
    timers.current.forEach(clearTimeout); // late replies must not land in the new chat
    timers.current.clear();
    controllers.current.forEach((c) => c.abort());
    controllers.current.clear();
    conversationRef.current += 1;
    busyRef.current = false;
    setPending(0);
    clearMessages();
    setMessages([]);
    greeted.current = false;
    setConfirmClear(false);
    setConversationKey((k) => k + 1); // re-runs the welcome message effect
  };

  const showWelcomeChips = messages.length === 1; // only the welcome so far
  const showStrip = messages.length > 1;

  return (
    <>
      {/* ---------- Chat window ---------- */}
      <section
        id="stepnova-chat"
        role="dialog"
        aria-label={`${CHATBOT.name} chat`}
        data-open={isOpen}
        data-minimized={isMinimized}
        className="chatbot-window font-['Plus_Jakarta_Sans',sans-serif]"
      >
        <ChatHeader
          minimized={isMinimized}
          canClear={messages.length > 0}
          onClear={askToClear}
          onToggleMinimize={toggleMinimize}
          onClose={() => setIsOpen(false)}
        />

        <div
          ref={scrollRef}
          role="log"
          aria-live="polite"
          data-lenis-prevent
          className="chatbot-scroll flex flex-1 flex-col gap-3 overflow-y-auto overflow-x-hidden bg-white px-4 py-4"
        >
          {messages.map((m) => (
            <ChatMessage key={m.id} message={m} onProductClick={handleProductClick} />
          ))}

          {showWelcomeChips && (
            <QuickSuggestions items={QUICK_SUGGESTIONS} onSelect={handleSuggestion} />
          )}

          {isTyping && <TypingIndicator />}
        </div>

        {showStrip && (
          <QuickSuggestions
            variant="strip"
            items={QUICK_SUGGESTIONS}
            onSelect={handleSuggestion}
          />
        )}

        <ChatInput ref={inputRef} busy={pending > 0} onSend={(text) => send(text)} />
        <p className="shrink-0 bg-white pb-2 text-center text-[10px] text-slate-400">
          {AI.disclaimer}
        </p>

        {confirmClear && (
          <ClearChatDialog
            onCancel={() => setConfirmClear(false)}
            onConfirm={clearConversation}
          />
        )}
      </section>

      {/* ---------- Floating button ---------- */}
      <button
        type="button"
        onClick={toggleOpen}
        aria-label={isOpen ? "Close Velaroqa AI chat" : "Open Velaroqa AI chat"}
        aria-expanded={isOpen}
        aria-controls="stepnova-chat"
        className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] right-4 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-[#1D4ED8] text-white shadow-lg shadow-blue-900/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2563EB] hover:shadow-xl hover:shadow-blue-900/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 active:scale-95 sm:bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] sm:right-6"
      >
        <MessageCircle
          className={`absolute h-6 w-6 transition-all duration-200 ${
            isOpen ? "rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100"
          }`}
        />
        <X
          className={`absolute h-6 w-6 transition-all duration-200 ${
            isOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0"
          }`}
        />

        {unread && !isOpen && (
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#38BDF8] opacity-70 motion-reduce:animate-none" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-[#38BDF8]" />
          </span>
        )}
      </button>
    </>
  );
}