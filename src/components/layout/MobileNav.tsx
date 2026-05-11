import { Link, useLocation } from "react-router-dom";
import { Home, Film, TrendingUp, Users, Tv } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/contexts/I18nContext";

const NAV_ITEMS = [
  { translationKey: "home", icon: Home, path: "/" },
  { translationKey: "scenarios", icon: Film, path: "/scenarios" },
  { translationKey: "trending", icon: TrendingUp, path: "/trending" },
  { translationKey: "episodes", icon: Tv, path: "/episodes" },
  { translationKey: "characters", icon: Users, path: "/characters" },
];

export function MobileNav() {
  const location = useLocation();
  const { t } = useI18n();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-mt-surface/90 backdrop-blur-xl border-t border-mt-surface-hover/50 z-50 px-2 sm:px-6 safe-area-bottom">
      <div className="flex h-full items-center justify-between">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path || 
                           (item.path !== "/" && location.pathname.startsWith(item.path));
          
          return (
            <Link
              key={item.translationKey}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors duration-200",
                isActive 
                  ? "text-mt-primary" 
                  : "text-[#888] hover:text-white"
              )}
            >
              <item.icon className={cn("w-5 h-5 transition-transform", isActive ? "scale-110 drop-shadow-[0_0_8px_rgba(245,197,24,0.6)]" : "")} />
              <span className={cn("text-[10px] font-black uppercase tracking-tight transition-all", isActive ? "scale-105" : "")}>
                {t(item.translationKey)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
