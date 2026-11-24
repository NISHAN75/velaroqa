import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  fetchProducts,
  pickRandom,
  setProductStore,
  FEATURED_COUNT,
} from "../data/products";

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const [state, setState] = useState({
    products: [],
    featured: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    fetchProducts(controller.signal)
      .then((products) => {
        // 5 random featured products, picked once per page load
        const featured = pickRandom(products, FEATURED_COUNT);
        setProductStore({ products, featured }); // for the chatbot helpers
        setState({ products, featured, loading: false, error: null });
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        console.error(err);
        setState((s) => ({ ...s, loading: false, error: err.message }));
      });

    return () => controller.abort();
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      getProductById: (id) => state.products.find((p) => p.id === Number(id)),
    }),
    [state]
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used inside <ProductsProvider>");
  return ctx;
}
