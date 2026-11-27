import { Link } from "react-router-dom";

export default function NotFound({
  title = "Page not found",
  message = "Sorry, we couldn't find the page you're looking for.",
}) {
  return (
    <section className="font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="text-sm font-bold tracking-[0.12em] text-primary">404</p>
        <h1 className="mt-2 text-2xl font-extrabold text-ink sm:text-3xl">{title}</h1>
        <p className="mt-2 max-w-md text-sm text-slate-500">{message}</p>
        <Link
          to="/"
          className="mt-6 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-white transition duration-200 hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          Back to Home
        </Link>
      </div>
    </section>
  );
}