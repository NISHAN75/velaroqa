// Edit products here. Images go in public/images/products/
// price          : normal price (number, taka)
// discountPrice  : OPTIONAL. If you add it, it shows as the main price
//                  and the normal price is shown with a line through it.
export const latestProducts = [
  {
    id: 1,
    name: "Nike Air Force 1 '07",
    description: "Classic leather low-top with all-day cushioning and a clean, timeless look.",
    price: 4500,
    isFeatured: true,
    isNew: false,
    image: "/images/products/products-01.png",
    href: "/shop/nike-air-force-1",
  },
  {
    id: 2,
    name: "Adidas Forum Low",
    description: "Retro basketball style with a padded collar and a secure ankle strap.",
    price: 5200,
    isFeatured: true,
    discountPrice: 4700,
    isNew: true,
    image: "/images/products/products-02.png",
    href: "/shop/adidas-forum-low",
  },
  {
    id: 3,
    name: "Nike Dunk Low",
    description: "Bold two-tone colour blocking on a durable, street-ready sole.",
    price: 5000,
    isFeatured: true,
    isNew: false,
    image: "/images/products/products-03.png",
    href: "/shop/nike-dunk-low",
  },
  {
    id: 4,
    name: "Puma Smash v2",
    description: "Minimal court-inspired sneaker, light and easy to wear every day.",
    price: 3800,
    discountPrice: 3400,
    isFeatured: true,
    isNew: false,
    image: "/images/products/products-04.png",
    href: "/shop/puma-smash-v2",
  },
  {
    id: 5,
    name: "Reebok Classic",
    description: "Soft, flexible upper with a retro silhouette for relaxed comfort.",
    price: 3500,
    isFeatured: true,
    isNew: false,
    image: "/images/products/products-05.png",
    href: "/shop/reebok-classic",
  },
  {
    id: 6,
    name: "New Balance 550",
    description: "Heritage basketball design with premium leather overlays.",
    price: 6000,
    isFeatured: true,
    discountPrice: 5500,
    isNew: false,
    image: "/images/products/products-06.png",
    href: "/shop/new-balance-550",
  },
  {
    id: 7,
    name: "Skechers Go Walk",
    description: "Ultra-light, breathable walking shoe with responsive cushioning.",
    price: 4200,
    isNew: false,
    image: "/images/products/products-07.png",
    href: "/shop/skechers-go-walk",
  },
  {
    id: 8,
    name: "Converse Chuck Taylor",
    description: "The iconic high-top canvas shoe that goes with everything.The iconic high-top canvas shoe that goes with everything.The iconic high-top canvas shoe that goes with everything.The iconic high-top canvas shoe that goes with everything.The iconic high-top canvas shoe that goes with everything.",
    price: 3900,
    isNew: false,
    image: "/images/products/products-08.png",
    href: "/shop/converse-chuck-taylor",
  },
];


// All products (shared product data)
export const products = latestProducts;

// Featured products
export const featuredProducts = products.filter(
  (product) => product.isFeatured
);

// Find a product by ID
export const getProductById = (id) => {
  return products.find((product) => product.id === Number(id));
};