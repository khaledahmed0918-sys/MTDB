import { X, Home, TrendingUp, Users, Tv, Bookmark, Globe, Star, Film, MonitorPlay } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useI18n } from "@/contexts/I18nContext";
import { useScenarios } from "@/contexts/ScenariosContext";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { t, language, setLanguage, dir } = useI18n();
  const { watchlist } = useScenarios();
  const location = useLocation();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
          />
          
          {/* Drawer */}
          <motion.div 
            initial={{ x: dir === 'rtl' ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: dir === 'rtl' ? '100%' : '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn(
              "fixed top-0 bottom-0 w-[85%] max-w-sm bg-[#121212] z-[70] shadow-2xl flex flex-col p-6",
              dir === 'rtl' ? "right-0" : "left-0"
            )}
          >
            <div className="flex items-center justify-between mb-10">
                <Link to="/" onClick={onClose} className="flex flex-row items-center gap-2 group">
                  <div className="bg-mt-primary px-3 py-1 rounded-sm font-black text-black transform group-hover:scale-105 transition-transform tracking-tight">
                    MTDb
                  </div>
                </Link>
               <button onClick={onClose} className="p-2 text-[#888] hover:text-white bg-white/5 rounded-full transition-all">
                 <X className="w-6 h-6" />
               </button>
            </div>

            <nav className={cn("flex flex-col gap-1.5 flex-1 overflow-y-auto", dir === 'rtl' ? "pl-2" : "pr-2")}>
              {[
                { label: t('home'), path: '/', icon: Home },
                { label: t('allScenarios'), path: '/scenarios', icon: MonitorPlay },
                { label: t('trending'), path: '/trending', icon: TrendingUp },
                { label: t('topRated'), path: '/top-rated', icon: Star },
                { label: t('episodes'), path: '/episodes', icon: Tv },
                { label: t('characters'), path: '/characters', icon: Users },
                { label: t('edits'), path: '/edits', icon: Film },
              ].map((item) => (
                <Link 
                  key={item.path}
                  to={item.path} 
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl font-bold uppercase tracking-widest transition-all",
                    location.pathname === item.path 
                      ? "bg-mt-primary/10 text-mt-primary scale-[1.02]" 
                      : "text-white hover:bg-white/5 active:bg-white/10"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", location.pathname === item.path ? "text-mt-primary" : "text-[#555]")} />
                  <span>{item.label}</span>
                </Link>
              ))}

              <div className="my-2 border-t border-white/5" />

              <Link 
                to="/watchlist" 
                onClick={onClose}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl font-bold uppercase tracking-widest transition-all",
                  location.pathname === '/watchlist'
                    ? "bg-mt-primary/10 text-mt-primary"
                    : "text-white hover:bg-white/5"
                )}
              >
                <Bookmark className={cn("w-5 h-5", watchlist.length > 0 ? "text-mt-primary fill-mt-primary" : "text-[#555]")} />
                <span>{t('watchlist')}</span>
                {watchlist.length > 0 && <span className={cn("bg-mt-primary text-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center", dir === 'rtl' ? "mr-auto" : "ml-auto")}>{watchlist.length}</span>}
              </Link>
            </nav>

            <div className="mt-auto pt-6 border-t border-white/5">
               <button 
                onClick={toggleLanguage}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 text-sm font-black uppercase tracking-widest text-white border border-white/5 active:scale-95 transition-transform"
               >
                 <div className="flex items-center gap-3">
                   <Globe className="w-5 h-5 text-mt-primary" />
                   <span>{language === 'en' ? 'العربية' : 'English'}</span>
                 </div>
                 <span className="text-[#666]">{language === 'en' ? 'AR' : 'EN'}</span>
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
