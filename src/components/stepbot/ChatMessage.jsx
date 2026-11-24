import { BotAvatar } from "./TypingIndicator";
import ChatProductCard from "./ChatProductCard";
import { useProducts } from "../../context/ProductsContext";

const formatTime = (date) =>
  date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

export default function ChatMessage({ message, onProductClick }) {
  const isUser = message.role === "user";
  const { getProductById } = useProducts();

  // Saved ids that no longer exist in the API are skipped safely
  const products = (message.productIds || [])
    .map((id) => getProductById(id))
    .filter(Boolean);
  const hasProducts = products.length > 0;

  return (
    <div
      className={`chatbot-msg flex items-end gap-2 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && <BotAvatar />}

      <div
        className={`flex min-w-0 flex-col ${
          hasProducts ? "w-full max-w-[calc(100%-2.25rem)]" : "max-w-[82%]"
        } ${isUser ? "items-end" : "items-start"}`}
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

        {hasProducts && (
          <div className="mt-2 flex w-full flex-col gap-2">
            {products.map((product) => (
              <ChatProductCard
                key={product.id}
                product={product}
                onNavigate={onProductClick}
              />
            ))}
          </div>
        )}

        <span className="mt-1 px-1 text-[10px] text-slate-400">
          {formatTime(message.time)}
        </span>
      </div>
    </div>
  );
}