import { Link } from "@tanstack/react-router";

const links = [
  { to: "/", label: "首页" },
  { to: "/explore", label: "探索" },
  { to: "/create", label: "创作" },
  { to: "/calendar", label: "日历" },
  { to: "/collections", label: "收藏集" },
  { to: "/profile", label: "我的" },
] as const;

export function SiteNav() {
  return (
    <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-5xl">
      <div className="bg-cream/70 backdrop-blur-xl border border-charcoal/10 px-6 py-3 rounded-full flex items-center justify-between shadow-[0_10px_40px_-20px_rgba(34,34,34,0.35)]">
        <Link to="/" className="font-serif text-2xl font-semibold tracking-tight italic">
          Fragmented<span className="text-pinkv">.</span>
        </Link>
        <div className="hidden md:flex items-center gap-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-charcoal/80">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="hover:text-dusty transition-colors"
              activeProps={{ className: "text-dusty" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <Link
          to="/create"
          className="bg-charcoal text-cream px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-charcoal/85 hover:scale-[1.02] transition"
        >
          开始记录
        </Link>
      </div>
    </nav>
  );
}