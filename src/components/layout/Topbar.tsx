import { Menu, Bookmark, Search, User, Globe, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useI18n } from "@/contexts/I18nContext";
import { useScenarios } from "@/contexts/ScenariosContext";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { SearchSection } from "./SearchSection";

export function Topbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const { t, language, setLanguage, dir } = useI18n();
  const { watchlist } = useScenarios();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="h-14 md:h-16 flex justify-center bg-black sticky top-0 z-40 border-b border-white/5 shadow-md">
        <div className="w-full max-w-[1600px] flex items-center px-3 md:px-8 gap-2 md:gap-4">
          
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            {/* Menu Button (Hamburger) */}
            <button 
              onClick={onOpenMenu}
              className="p-2 text-white hover:bg-white/10 rounded-md transition-colors"
            >
              <Menu className="w-6 h-6 md:w-7 md:h-7" />
            </button>

            {/* Logo (Yellow Rectangle) */}
            <Link to="/" className="flex shrink-0">
              <div className="bg-[#f5c518] px-2.5 py-1 rounded-sm font-black text-black text-lg md:text-xl tracking-tighter shadow-sm border border-black/5 active:scale-95 transition-transform uppercase">
                MTDb
              </div>
            </Link>
          </div>

          {/* Search Button (Mobile/Tablet style) */}
          <div className="flex-1 flex justify-end px-1 md:px-2">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-white hover:bg-white/10 rounded-md transition-all flex items-center justify-center"
            >
              <Search className="w-6 h-6 md:w-5 md:h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Language Toggle (Subtle) */}
            <button 
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="p-2 text-[#888] hover:text-white transition-colors text-sm font-black"
            >
              {language === 'en' ? 'العربية' : 'English'}
            </button>
          </div>
        </div>
      </header>

      {/* Global Search Overlay */}
      <SearchSection isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
