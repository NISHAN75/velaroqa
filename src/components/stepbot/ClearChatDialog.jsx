import { useEffect, useRef } from "react";
import { Trash2 } from "lucide-react";
import { CLEAR_CHAT } from "../../data/chatbotConfig";

// Confirmation overlay shown inside the chat window, below the header.
export default function ClearChatDialog({ onCancel, onConfirm }) {
  const cancelRef = useRef(null);

  // Focus the safe option first
  useEffect(() => {
    cancelRef.current?.focus();
  }, []);

  return (
    <div
      className="absolute inset-x-0 bottom-0 top-[4.5rem] z-10 flex items-center justify-center bg-[#0F172A]/45 p-5"
      onClick={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="Velaroqa-clear-title"
        aria-describedby="Velaroqa-clear-desc"
        onClick={(e) => e.stopPropagation()}
        className="chatbot-msg w-full max-w-[17rem] rounded-2xl bg-white p-5 text-center shadow-2xl"
      >
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600">
          <Trash2 className="h-5 w-5" />
        </span>
        <h3 id="Velaroqa-clear-title" className="mt-3 text-[15px] font-extrabold text-[#0F172A]">
          {CLEAR_CHAT.title}
        </h3>
        <p id="Velaroqa-clear-desc" className="mt-1.5 text-[13px] leading-relaxed text-slate-500">
          {CLEAR_CHAT.description}
        </p>

        <div className="mt-5 flex gap-2">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-[#0F172A] transition-colors duration-200 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
          >
            {CLEAR_CHAT.cancel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-full bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
          >
            {CLEAR_CHAT.confirm}
          </button>
        </div>
      </div>
    </div>
  );
}
