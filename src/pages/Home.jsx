import Hero from "../components/home/Hero/Hero";
import Features from "../components/home/Features/Features";
import Categories from "../components/home/Categories/Categories";
import FeaturedProducts from "../components/home/FeaturedProducts/FeaturedProducts";
import LatestProducts from "../components/home/LatestProducts/LatestProducts";
import PromoBanner from "../components/common/PromoBanner/PromoBanner";
import Testimonials from "../components/common/Testimonials/Testimonials";






export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Categories />
      <FeaturedProducts />
      <PromoBanner />
      <LatestProducts />
      <Testimonials />

      {/* Categories, FeaturedProducts, LatestProducts, PromotionalBanner pore ekhane boshbe */}
    </>
  );
}