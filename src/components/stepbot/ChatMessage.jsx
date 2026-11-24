import { BotAvatar } from "./TypingIndicator";

const formatTime = (date) =>
  date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

export default function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`chatbot-msg flex items-end gap-2 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && <BotAvatar />}

      <div
        className={`flex min-w-0 max-w-[82%] flex-col ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm leading-relaxed [overflow-wrap:anywhere] ${
            isUser
              ? "rounded-br-md bg-[#1D4ED8] text-white"
              : "rounded-bl-md bg-[#E8ECFF] text-[#0F172A]"
          }`}
        >
          {message.text}
        </div>
        <span className="mt-1 px-1 text-[10px] text-slate-400">
          {formatTime(message.time)}
        </span>
      </div>
    </div>
  );
}
