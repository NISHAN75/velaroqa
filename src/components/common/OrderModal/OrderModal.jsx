import { useEffect, useState } from "react";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { API_URL } from "../../../data/products"; // adjust the path to match your folder structure

// Match these options with the page's OverlayScrollbars (theme/autoHide)
const SCROLL_OPTIONS = {
  scrollbars: { theme: "os-theme-dark", autoHide: "leave", autoHideDelay: 300 },
};

const formatPrice = (value) =>
  `QR ${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const inputClass = (error) =>
  `mt-1 w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-primary-dark focus:ring-2 focus:ring-primary-100 ${
    error ? "border-red-400" : "border-line-strong"
  }`;

export default function OrderModal({
  open,
  onClose,
  product,
  unitPrice, // discount price if available, otherwise the regular price
  sizes, // [{ size, disabled }]
  initialSize,
  initialQuantity = 1,
}) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    size: initialSize ?? "",
    quantity: initialQuantity,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  // When the modal opens, use the size/quantity selected on the product page
  useEffect(() => {
    if (open) {
      setForm((f) => ({ ...f, size: initialSize ?? "", quantity: initialQuantity }));
      setErrors({});
      setServerError("");
      setSuccess(false);
    }
  }, [open, initialSize, initialQuantity]);

  // Close on Esc + lock background scroll
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && !submitting && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, submitting, onClose]);

  if (!open) return null;

  const quantity = Math.max(1, Number(form.quantity) || 1);
  const total = Number(unitPrice) * quantity;

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const validate = () => {
    const er = {};
    if (!form.name.trim()) er.name = "Full name is required";
    if (!/^[+\d][\d\s-]{6,}$/.test(form.phone.trim())) er.phone = "Please enter a valid phone number";
    if (form.email.trim() && !/^\S+@\S+\.\S+$/.test(form.email.trim()))
      er.email = "Please enter a valid email address";
    if (!form.address.trim()) er.address = "Delivery address is required";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting || !validate()) return;

    setSubmitting(true);
    setServerError("");
    try {
      const url = `${API_URL}/api/orders`;
      const payload = {
        product_id: product.id,
        name: form.name.trim(),
        email: form.email.trim() || null,
        phone: form.phone.trim(),
        delivery_address: form.address.trim(),
        quantity,
        size: form.size,
        total_price: total,
      };


      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });



      if (!res.ok) {
        let msg = `Order failed (${res.status})`;
        try {
          const data = await res.json();
          msg = data.message || data.error || msg;
        } catch {
          /* response is not JSON */
        }
        throw new Error(msg);
      }
      setSuccess(true);
    } catch (err) {
      setServerError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(e) => e.target === e.currentTarget && !submitting && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-title"
    >
      <div className="w-full max-w-lg overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
        <OverlayScrollbarsComponent
          data-lenis-prevent
          defer
          className="max-h-[95vh]"
          options={SCROLL_OPTIONS}
        >
          <div className="p-5 sm:p-6">
        {success ? (
          <div className="py-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <h2 className="mt-4 text-lg font-extrabold text-ink">Order placed!</h2>
            <p className="mt-1 text-sm text-slate-500">
              Thank you, {form.name.trim()}. We will contact you shortly.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 h-11 rounded-full bg-primary-dark px-8 text-sm font-bold text-white transition hover:bg-primary"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="rounded-md bg-primary-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-dark">
                  Express checkout
                </span>
                <h2 id="order-title" className="mt-2 text-lg font-extrabold text-ink">
                  Quick Checkout / Order Product
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                aria-label="Close"
                className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Product summary */}
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-primary-100 bg-surface-soft p-3">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-line bg-white">
                {product.image && (
                  <img src={product.image} alt={product.name} className="h-full w-full object-contain p-1" />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-ink">{product.name}</p>
                <p className="text-base font-extrabold text-primary-dark">{formatPrice(unitPrice)}</p>
                <p className="text-[11px] text-slate-400">Product ID: {product.id}</p>
              </div>
            </div>

            {/* Fields */}
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="block text-xs font-bold text-ink">
                Full Name <span className="text-red-500">*</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Jane Doe"
                  autoComplete="name"
                  className={inputClass(errors.name)}
                />
                {errors.name && <span className="mt-1 block text-[11px] font-medium text-red-500">{errors.name}</span>}
              </label>

              <label className="block text-xs font-bold text-ink">
                Phone Number <span className="text-red-500">*</span>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={set("phone")}
                  placeholder="+974 5555 0000"
                  autoComplete="tel"
                  className={inputClass(errors.phone)}
                />
                {errors.phone && <span className="mt-1 block text-[11px] font-medium text-red-500">{errors.phone}</span>}
              </label>
            </div>

            <label className="mt-3 block text-xs font-bold text-ink">
              Email <span className="font-normal text-slate-400">(for order updates)</span>
              <input
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="jane@example.com"
                autoComplete="email"
                className={inputClass(errors.email)}
              />
              {errors.email && <span className="mt-1 block text-[11px] font-medium text-red-500">{errors.email}</span>}
            </label>

            <label className="mt-3 block text-xs font-bold text-ink">
              Delivery Address <span className="text-red-500">*</span>
              <textarea
                rows={2}
                value={form.address}
                onChange={set("address")}
                placeholder="123 Main Street, Apt / Suite / House, City"
                autoComplete="street-address"
                className={`${inputClass(errors.address)} resize-none`}
              />
              {errors.address && <span className="mt-1 block text-[11px] font-medium text-red-500">{errors.address}</span>}
            </label>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="block text-xs font-bold text-ink">
                Size
                <select value={form.size} onChange={set("size")} className={inputClass(false)}>
                  {sizes.map(({ size, disabled }) => (
                    <option key={size} value={size} disabled={disabled}>
                      {size}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-xs font-bold text-ink">
                Quantity
                <input
                  type="number"
                  min={1}
                  value={form.quantity}
                  onChange={set("quantity")}
                  className={inputClass(false)}
                />
              </label>
            </div>

            {/* Payment */}
            <div className="mt-4">
              <p className="text-xs font-bold text-ink">Payment Method</p>
              <div className="mt-1 flex items-center gap-2 rounded-lg border-2 border-primary-dark bg-primary-50/50 px-3 py-2.5 text-sm font-semibold text-ink">
                <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-primary-dark">
                  <span className="h-2 w-2 rounded-full bg-primary-dark" />
                </span>
                Cash on Delivery
              </div>
            </div>

            {/* Summary */}
            <dl className="mt-4 space-y-1.5 rounded-xl bg-surface-soft p-3 text-xs">
              <div className="flex justify-between text-slate-500">
                <dt>Subtotal</dt>
                <dd className="font-semibold text-ink">{formatPrice(total)}</dd>
              </div>
              <div className="flex justify-between text-slate-500">
                <dt>Delivery Fee</dt>
                <dd className="font-semibold text-emerald-600">Free</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-2 text-sm font-extrabold text-ink">
                <dt>Total Payable</dt>
                <dd className="text-primary-dark">{formatPrice(total)}</dd>
              </div>
            </dl>

            {serverError && (
              <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                {serverError}
              </p>
            )}

            {/* Actions */}
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="h-11 rounded-full border border-line-strong bg-white px-6 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-11 min-w-[150px] items-center justify-center gap-2 rounded-full bg-primary-dark px-6 text-sm font-bold text-white shadow-md shadow-primary-200 transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Placing order..." : "Confirm Order"}
              </button>
            </div>
          </form>
        )}
          </div>
        </OverlayScrollbarsComponent>
      </div>
    </div>
  );
}