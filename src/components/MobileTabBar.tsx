import { Link } from "@tanstack/react-router";
import { Home, Compass, Plus, Archive, User } from "lucide-react";

const tabs = [
  { to: "/", label: "首页", Icon: Home },
  { to: "/explore", label: "探索", Icon: Compass },
  { to: "/create", label: "创作", Icon: Plus, primary: true },
  { to: "/collections", label: "收藏集", Icon: Archive },
  { to: "/profile", label: "我的", Icon: User },
] as const;

export function MobileTabBar() {
  return (
    <nav
      aria-label="底部导航"
      className="md:hidden fixed inset-x-0 bottom-0 z-50 border-t border-charcoal/10 bg-cream/90 backdrop-blur-xl"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-5 h-16 max-w-md mx-auto">
        {tabs.map((t) => (
          <li key={t.to} className="min-w-0">
            <Link
              to={t.to}
              activeOptions={{ exact: t.to === "/" }}
              className="group flex h-full flex-col items-center justify-center gap-1 text-[10px] font-semibold tracking-[0.1em] text-charcoal/55 data-[status=active]:text-dusty"
            >
              {"primary" in t ? (
                <span className="-mt-6 grid size-12 place-items-center rounded-full bg-charcoal text-cream shadow-[0_8px_24px_-8px_rgba(34,34,34,0.6)] ring-4 ring-cream group-data-[status=active]:bg-dusty">
                  <t.Icon className="size-5" strokeWidth={2.2} />
                </span>
              ) : (
                <t.Icon className="size-5" strokeWidth={1.8} />
              )}
              <span className="truncate">{t.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
