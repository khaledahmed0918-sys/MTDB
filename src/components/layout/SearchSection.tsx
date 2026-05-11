import { Search, X, Star } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { useScenarios } from "@/contexts/ScenariosContext";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { ProgressiveImage } from "../ProgressiveImage";

export function SearchSection({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const { t, dir } = useI18n();
  const { scenarios, searchQuery, setSearchQuery } = useScenarios();
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredScenarios = searchQuery
    ? scenarios.filter(s => 
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      inputRef.current?.focus();
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col items-center bg-black/90 backdrop-blur-xl p-4 md:p-20"
        >
          <div className="w-full max-w-3xl flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black uppercase tracking-widest text-mt-primary">{t('search')}</h2>
              <button 
                onClick={onClose}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-[#888] hover:text-white transition-all transform hover:rotate-90"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
 
            <div className="relative group">
              <div className={cn(
                "absolute inset-y-0 flex items-center pointer-events-none",
                dir === 'rtl' ? "right-6" : "left-6"
              )}>
                <Search className="h-6 w-6 text-mt-primary" />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className={cn(
                  "block w-full bg-white/5 border border-white/10 rounded-2xl py-6 text-xl text-white placeholder:text-[#555] focus:outline-none focus:border-mt-primary/50 focus:bg-white/10 transition-all font-bold shadow-2xl",
                  dir === 'rtl' ? "pr-16 pl-6 text-right" : "pl-16 pr-6 text-left"
                )}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className={cn(
                    "absolute inset-y-0 flex items-center px-6 text-[#888] hover:text-white transition-colors",
                    dir === 'rtl' ? "left-0" : "right-0"
                  )}
                >
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>
 
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchQuery ? (
                <div className="col-span-full items-start overflow-y-auto w-full max-h-[60vh] pr-2 no-scrollbar">
                  {filteredScenarios.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredScenarios.map(scenario => (
                        <Link 
                          key={scenario.id} 
                          to={`/scenario/${scenario.id}`} 
                          onClick={onClose}
                          className={cn("flex gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all", dir === 'rtl' ? "text-right" : "text-left")}
                        >
                          <div className="w-16 h-24 shrink-0 rounded-md overflow-hidden relative">
                            <ProgressiveImage src={scenario.mainPosterUrl} alt={scenario.title} />
                          </div>
                          <div className="flex flex-col flex-1 py-1">
                            <h3 className="text-xl font-bold text-white mb-1">{scenario.title}</h3>
                            <p className="text-sm text-[#888] line-clamp-2">{scenario.description}</p>
                            {scenario.category && (
                              <span className="text-xs font-bold text-mt-primary mt-auto uppercase tracking-widest">{t(scenario.category) || scenario.category || t('scenario')}</span>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-[#888]">{t('noResults')}</div>
                  )}
                </div>
              ) : (
                <>
                  <div className="p-6 rounded-xl bg-white/5 border border-white/5 shadow-inner">
                   <h3 className="text-xs font-black uppercase tracking-widest text-[#555] mb-4">{t('quickLinks')}</h3>
                   <div className="flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-widest">
                      <button onClick={() => setSearchQuery('Crime')} className="px-3 py-2 bg-white/5 hover:bg-mt-primary hover:text-black border border-white/10 rounded-md transition-all">#{t('crime')}</button>
                      <button onClick={() => setSearchQuery('Heist')} className="px-3 py-2 bg-white/5 hover:bg-mt-primary hover:text-black border border-white/10 rounded-md transition-all">#{t('heist')}</button>
                      <button onClick={() => setSearchQuery('Racing')} className="px-3 py-2 bg-white/5 hover:bg-mt-primary hover:text-black border border-white/10 rounded-md transition-all">#{t('racing')}</button>
                      <button onClick={() => setSearchQuery('Mystery')} className="px-3 py-2 bg-white/5 hover:bg-mt-primary hover:text-black border border-white/10 rounded-md transition-all">#{t('mystery')}</button>
                   </div>
                 </div>
                 <div className="p-6 rounded-xl bg-white/5 border border-white/5 flex flex-col justify-center items-center text-center shadow-inner">
                   <div className="mb-2 text-mt-primary">
                      <Star className="w-4 h-4 fill-current animate-pulse" />
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#555] italic">
                     {t('tip')}: {t('searchTip')}
                   </p>
                 </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
