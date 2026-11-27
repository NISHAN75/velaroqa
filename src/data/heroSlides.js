// Media rule (Hero.jsx e):
//   bgVideo: "..."  -> poorto slide er background e video autoplay (poster = video load howar age)
//   image: "..."    -> normal slide (dan e image)
// Path: public/ folder er file "images/slider/x.mp4" likhle hoy.
//       Backend theke ashle "/uploads/x.mp4" ba full "https://..." dile hoy.

export const heroSlides = [
  {
    id: 1,
    badge: "Performance Series",
    subtitle: "New Season • Up to 30% Off",
    title: ["STEP UP YOUR", "STYLE", "WITH velaro"],
    primaryCta: { label: "Shop Now", href: "/shop" },
    secondaryCta: { label: "Categories", href: "#categories" },
    bgVideo: "images/slider/videoplayback.mp4", // <-- background video
    poster: "images/slider/file_00000000c0a081faa3abd3db240d97d3.webp",
    imageAlt: "Blue velaro performance running shoe",
  },
  {
    id: 2,
    badge: "Street Edition",
    subtitle: "Fresh Drops • On all orders, always free",
    title: ["BUILT FOR", "EVERYDAY", "CONFIDENCE"],
    primaryCta: { label: "Shop Now", href: "/shop" },
    secondaryCta: { label: "Categories", href: "#categories" },
    bgVideo: "images/slider/street-edition.mp4", // <-- tomar 2nd video er path dao
    poster: "images/slider/file_0000000057f481fa89485f6c41b7ea03.png",
    imageAlt: "velaro street edition shoe",
  },
  {
    id: 3,
    badge: "Athlete Collection",
    subtitle: "Limited Stock • Up to 30% Off",
    title: ["WALK BETTER.", "LIVE", "BOLDER."],
    primaryCta: { label: "Shop Now", href: "/shop" },
    secondaryCta: { label: "Categories", href: "#categories" },
    image: "images/slider/file_0000000089dc81fab853b783098a8cc5.webp", // normal slide
    imageAlt: "velaro athlete collection shoe",
  },
];