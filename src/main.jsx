import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ReactLenis } from "lenis/react";
import { OverlayScrollbars } from "overlayscrollbars";
import "overlayscrollbars/overlayscrollbars.css";
import "./index.css";
import App from "./App";
import { ProductsProvider } from "./context/ProductsContext";

// Page-er scrollbar overlay style-e (body-te apply)
OverlayScrollbars(document.body, {
  scrollbars: {
    theme: "os-theme-dark",
    autoHide: "scroll",      // scroll korle dekhabe, thamle hide hobe
    autoHideDelay: 800,
    clickScroll: true,       // track-e click korle oi jaygay jabe
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true, anchors: true }}>
        <ProductsProvider>
          <App />
        </ProductsProvider>
      </ReactLenis>
    </BrowserRouter>
  </StrictMode>
);