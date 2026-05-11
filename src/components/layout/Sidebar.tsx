import { Link, useLocation } from "react-router-dom";
import { Home, Film, Users, Tv, TrendingUp, Settings, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/contexts/I18nContext";

const NAV_ITEMS = [
  { translationKey: "home", icon: Home, path: "/" },
  { translationKey: "scenarios", icon: Film, path: "/scenarios" },
  { translationKey: "topRated", icon: Star, path: "/top-rated" },
  { translationKey: "trending", icon: TrendingUp, path: "/trending" },
  { translationKey: "characters", icon: Users, path: "/characters" },
  { translationKey: "episodes", icon: Tv, path: "/episodes" },
];

export function Sidebar() {
  const location = useLocation();
  const { t, dir } = useI18n();

  return (
    <aside className={cn(
      "hidden lg:flex flex-col h-full w-64 bg-mt-surface border-mt-surface-hover z-50 shadow-2xl",
      dir === 'rtl' ? "border-l lg:border-l" : "border-r lg:border-r"
    )}>
      {/* Branding */}
      <div className="h-16 flex items-center px-6 border-b border-mt-surface-hover/50">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-mt-primary px-3 py-1 rounded-sm font-black text-black text-xl lg:text-2xl transform group-hover:scale-105 transition-transform tracking-tight">
            MTDb
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1">
        <div className="px-3 mb-2 text-xs font-semibold text-[#888] uppercase tracking-wider">
          {t('menu')}
        </div>
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path || 
                           (item.path !== "/" && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.translationKey}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-mt-primary/10 text-mt-primary font-bold border border-mt-primary/20" 
                  : "text-[#B3B3B3] hover:text-white hover:bg-mt-surface-hover"
              )}
            >
              <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-mt-primary")} />
              {t(item.translationKey)}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
