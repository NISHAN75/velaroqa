import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// A router changes the page without a reload, so the browser keeps the old scroll
// position. This sends the user back to the top whenever the path changes.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
