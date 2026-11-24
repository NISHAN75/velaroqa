import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
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
  const [reloadKey, setReloadKey] = useState(0);

  // "Try again" button calls this
  const reload = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null }));
    setReloadKey((k) => k + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    fetchProducts(controller.signal)
      .then((products) => {
        // 5 random featured products, picked once per load
        const featured = pickRandom(products, FEATURED_COUNT);
        setProductStore({ products, featured }); // for the chatbot helpers
        setState({ products, featured, loading: false, error: null });
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        console.error(err);
        setState((s) => ({ ...s, loading: false, error: err.message }));
      });

    return () => controller.abort();
  }, [reloadKey]);

  const value = useMemo(
    () => ({
      ...state,
      reload,
      getProductById: (id) => state.products.find((p) => p.id === Number(id)),
    }),
    [state, reload]
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used inside <ProductsProvider>");
  return ctx;
}