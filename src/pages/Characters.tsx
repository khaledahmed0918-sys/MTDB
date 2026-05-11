import { Users, Link as LinkIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import type { Character } from "@/types";
import { useI18n } from "@/contexts/I18nContext";
import { useScenarios } from "@/contexts/ScenariosContext";
import { cn } from "@/lib/utils";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import { Skeleton } from "@/components/ui/skeleton";

interface FlatCharacter extends Character {
  scenarioTitle: string;
  scenarioId: string;
}

export function Characters() {
  const { scenarios, loading, setSearchQuery } = useScenarios();
  const { t } = useI18n();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <Skeleton className="h-10 w-48 mb-6 rounded" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {[...Array(12)].map((_, i) => (
             <Skeleton key={i} className="aspect-square w-full rounded-full" />
          ))}
        </div>
      </div>
    );
  }

  const characters: FlatCharacter[] = [];
  scenarios.forEach(s => {
    if (s.cast) {
      s.cast.forEach(c => {
        characters.push({ ...c, scenarioTitle: s.title, scenarioId: s.id });
      });
    }
  });

  return (
    <div className="space-y-12 animate-in fade-in duration-700 ease-out fill-mode-both pb-20">
      <div className="flex items-center gap-3 mb-10">
        <Users className="w-5 h-5 md:w-6 md:h-6 text-mt-primary" />
        <h1 className="text-xl md:text-3xl font-black uppercase tracking-tight text-white flex items-center">
          {t('characters')}
        </h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {characters.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center gap-4 bg-[#121212] rounded-xl border border-white/5">
             <Users className="w-16 h-16 text-[#333] mb-2" />
             <h3 className="text-2xl font-black text-white uppercase tracking-widest">{t('noCharacters')}</h3>
          </div>
        ) : (
          characters.map((c, idx) => (
            <div 
              key={`${c.id}-${idx}`} 
              onClick={() => {
                if (c.playerName) {
                  setSearchQuery(c.playerName);
                  navigate("/");
                }
              }}
              className="bg-transparent rounded-sm overflow-hidden hover:bg-white/5 transition-all border border-transparent hover:border-white/10 flex flex-col items-center p-4 text-center group cursor-pointer"
            >
              <div className={cn(
                "w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden mb-3 border-2 transition-transform duration-500 group-hover:scale-105",
                c.isMystery ? "border-mt-primary shadow-lg" : "border-white/10 group-hover:border-mt-primary/50 bg-[#121212]"
              )}>
                {c.isMystery || !c.avatarUrl ? (
                    <div className="w-full h-full bg-[#121212] flex flex-col items-center justify-center relative">
                      <span className="text-4xl font-bold text-[#555]">?</span>
                    </div>
                ) : (
                    <ProgressiveImage src={c.avatarUrl} alt={c.playerName} className="object-cover" />
                )}
              </div>
              <h3 className="font-bold text-sm md:text-base text-white line-clamp-1 mb-1 group-hover:underline">{c.playerName || t('unknownActor')}</h3>
              <p className="text-xs text-[#888] mb-3">{c.characterName}</p>
              
              <Link to={`/scenario/${c.scenarioId}`} onClick={(e) => e.stopPropagation()} className="mt-auto pt-3 border-t border-white/10 w-full text-xs text-[#555] hover:text-white transition-colors flex items-center justify-center gap-1.5 line-clamp-1">
                <span className="truncate">{c.scenarioTitle}</span>
              </Link>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
