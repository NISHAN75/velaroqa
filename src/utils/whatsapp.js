
import { siteConfig } from "../data/siteConfig";

// Format product price
const formatPrice = (n) =>
  `QR ${Number(n).toLocaleString("en-US")}`;

/**
 * Builds a WhatsApp order link with product details.
 *
 * product: Product information
 * options: size, quantity, url
 */
export function buildOrderLink(
  product,
  { size, quantity = 1, url } = {}
) {
  const {
    id,
    name,
    brand,
    category,
    description,
    price,
    discountPrice,
  } = product;

  // Get WhatsApp number
  const whatsappNumber = String(
    siteConfig.whatsappNumber || siteConfig.phone || ""
  ).replace(/\D/g, "");

  if (!whatsappNumber) {
    throw new Error("WhatsApp number is missing in siteConfig.js");
  }

  // Calculate discount
  const hasDiscount =
    typeof discountPrice === "number" &&
    discountPrice < price;

  const unit = hasDiscount ? discountPrice : price;

  const percent = hasDiscount
    ? Math.round(
        ((price - discountPrice) / price) * 100
      )
    : 0;

  // Prepare WhatsApp message
  const lines = [
    `Hello ${siteConfig.name}! I want to place an order.`,
    "",
    "*Product Details*",
    `Product: ${name}`,
    brand ? `Brand: ${brand}` : null,
    category ? `Category: ${category}` : null,
    id != null ? `Product ID: ${id}` : null,
    description ? `Details: ${description}` : null,

    hasDiscount
      ? `Price: ${formatPrice(unit)} (Regular: ${formatPrice(price)}, ${percent}% off)`
      : `Price: ${formatPrice(unit)}`,

    size
      ? `Size: ${size}`
      : "Size: (Please confirm your size)",

    `Quantity: ${quantity}`,
    `Total: ${formatPrice(unit * quantity)}`,
    `Product Link: ${url || window.location.href}`,

    "",
    "*Customer Details*",
    "Name:",
    "Phone:",
    "Delivery Address:",
  ].filter((line) => line !== null);

  // Encode message
  const message = encodeURIComponent(
    lines.join("\n")
  );

  // Return WhatsApp URL
  return `https://wa.me/${whatsappNumber}?text=${message}`;
}
