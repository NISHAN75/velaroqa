import { forwardRef, useState } from "react";
import { Send } from "lucide-react";
import { CHATBOT } from "../../data/chatbotConfig";

const ChatInput = forwardRef(function ChatInput({ onSend, busy = false }, inputRef) {
  const [value, setValue] = useState("");
  const canSend = value.trim().length > 0 && !busy; // no new message while a reply is on its way

  const submit = (e) => {
    e.preventDefault(); // Enter key submits the form too
    if (!canSend) return;
    onSend(value);
    setValue("");
  };

  return (
    <form
      onSubmit={submit}
      className="flex shrink-0 items-center gap-2 border-t border-slate-100 bg-white px-3 py-3"
    >
      <label className="flex min-w-0 flex-1 items-center rounded-full bg-tint px-4 py-2.5 transition-shadow duration-200 focus-within:ring-2 focus-within:ring-primary">
        <span className="sr-only">Type your message</span>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={CHATBOT.placeholder}
          maxLength={CHATBOT.maxLength}
          autoComplete="off"
          enterKeyHint="send"
          /* 16px on mobile stops iOS Safari from zooming in on focus */
          className="w-full min-w-0 bg-transparent text-base text-ink outline-none placeholder:text-slate-500 sm:text-sm"
        />
      </label>

      <button
        type="submit"
        disabled={!canSend}
        aria-label="Send message"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-dark text-white transition-all duration-200 hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 enabled:active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
      >
        <Send className="h-[18px] w-[18px]" />
      </button>
    </form>
  );
});

export default ChatInput;