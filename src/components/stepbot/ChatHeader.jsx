import { Bot, Minus, ChevronUp, Trash2, X } from "lucide-react";
import { CHATBOT } from "../../data/chatbotConfig";

const headerBtn =
  "flex h-9 w-9 items-center justify-center rounded-full text-white/90 transition-colors duration-200 hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent";

export default function ChatHeader({ minimized, canClear, onClear, onToggleMinimize, onClose }) {
  return (
    <div className="flex h-[4.5rem] shrink-0 items-center gap-3 bg-[#1D4ED8] px-4 text-white">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
        <Bot className="h-5 w-5" strokeWidth={2.25} />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h2 className="truncate text-[15px] font-extrabold leading-none tracking-tight">
            {CHATBOT.name}
          </h2>
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4ADE80]" />
            {/* On very narrow phones only the green dot is shown */}
            <span className="max-[359px]:sr-only">Online</span>
          </span>
        </div>
        <p className="mt-1.5 truncate text-xs text-blue-100">{CHATBOT.subtitle}</p>
      </div>

      <div className="-mr-1 flex shrink-0 items-center">
        <button
          type="button"
          onClick={onClear}
          disabled={!canClear}
          aria-label="Clear conversation"
          title="Clear conversation"
          className={headerBtn}
        >
          <Trash2 className="h-[18px] w-[18px]" />
        </button>
        <button
          type="button"
          onClick={onToggleMinimize}
          aria-label={minimized ? "Restore chat" : "Minimize chat"}
          className={headerBtn}
        >
          {minimized ? <ChevronUp className="h-5 w-5" /> : <Minus className="h-5 w-5" />}
        </button>
        <button type="button" onClick={onClose} aria-label="Close chat" className={headerBtn}>
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}