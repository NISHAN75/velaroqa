import { Bot } from "lucide-react";

export function BotAvatar() {
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#1D4ED8] text-white">
      <Bot className="h-4 w-4" strokeWidth={2.25} />
    </span>
  );
}

export default function TypingIndicator() {
  return (
    <div
      className="chatbot-msg flex items-end gap-2"
      role="status"
      aria-label="StepNova AI is typing"
    >
      <BotAvatar />
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-[#E8ECFF] px-4 py-3.5">
        <span className="chatbot-dot" />
        <span className="chatbot-dot" />
        <span className="chatbot-dot" />
      </div>
    </div>
  );
}
