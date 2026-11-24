import { Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header/Header";
import Footer from "./components/layout/Footer/Footer";
import ScrollToTop from "./components/common/ScrollToTop/ScrollToTop";
import ChatBot from "./components/stepbot/ChatBot";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import NotFound from "./pages/NotFound";
import Shop from "./pages/Shop";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <ChatBot />
      <Footer />
    </div>
  );
}
