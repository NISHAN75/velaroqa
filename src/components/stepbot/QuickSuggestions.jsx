const chipClass =
  "rounded-full border border-tint-border bg-white px-3.5 py-2 text-left text-[13px] font-semibold text-primary-dark transition-colors duration-200 hover:border-primary hover:bg-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.97]";

/**
 * variant="grid"  -> wrapped chips shown under the welcome message
 * variant="strip" -> one compact scrolling row above the input
 */
export default function QuickSuggestions({ items, onSelect, variant = "grid" }) {
  if (variant === "strip") {
    return (
      <div
        className="chatbot-strip flex gap-2 overflow-x-auto border-t border-slate-100 px-3 py-2"
        aria-label="Quick suggestions"
      >
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item)}
            className={`${chipClass} shrink-0 whitespace-nowrap py-1.5 text-xs`}
          >
            {item.emoji} {item.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="chatbot-msg flex flex-wrap gap-2 pl-9" aria-label="Quick suggestions">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect(item)}
          className={chipClass}
        >
          {item.emoji} {item.label}
        </button>
      ))}
    </div>
  );
}
