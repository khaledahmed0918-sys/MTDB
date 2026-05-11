import { Link } from "react-router-dom";
import { Trophy, Play, Star } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { useScenarios } from "@/contexts/ScenariosContext";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function TopRated() {
  const { scenarios, loading } = useScenarios();
  const { t, dir } = useI18n();

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="w-16 h-16 rounded-2xl" />
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="flex flex-col gap-6">
          {[...Array(5)].map((_, i) => (
             <div key={i} className="flex flex-col md:flex-row gap-6 p-4 rounded-2xl border border-mt-surface-hover/50">
               <Skeleton className="w-full md:w-56 aspect-[2/3] rounded-xl" />
               <div className="flex flex-col justify-center flex-1 py-2 gap-4">
                 <Skeleton className="h-8 w-1/2" />
                 <Skeleton className="h-4 w-1/4 mb-4" />
                 <Skeleton className="h-24 w-full" />
                 <div className="flex gap-2">
                   <Skeleton className="h-6 w-16" />
                   <Skeleton className="h-6 w-16" />
                 </div>
               </div>
             </div>
          ))}
        </div>
      </div>
    );
  }

  const sortedScenarios = [...scenarios];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">
      <div className="flex items-center gap-3 mb-10">
        <Trophy className="w-5 h-5 md:w-6 md:h-6 text-mt-primary" />
        <h1 className="text-xl md:text-3xl font-black uppercase tracking-tight text-white flex items-center">
            {t('hallOfFame')}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {sortedScenarios.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4 glass-effect rounded-2xl border border-mt-surface-hover/20">
             <Trophy className="w-16 h-16 text-[#444] mb-2" />
             <h3 className="text-2xl font-black text-white uppercase tracking-widest">{t('noScenarios')}</h3>
             <p className="text-[#888] font-medium max-w-md">{t('legendaryScenarios')}</p>
          </div>
        ) : (
          sortedScenarios.map((scenario, index) => (
            <Link 
              key={scenario.id} 
              to={`/scenario/${scenario.id}`} 
              className="group flex flex-col md:flex-row gap-5 bg-[#121212] p-4 rounded-xl hover:bg-[#1a1a1a] border border-white/5 hover:border-white/10 transition-all shadow-2xl hover:shadow-[#f5c518]/5"
            >
              <div className="relative w-full md:w-[200px] lg:w-[240px] aspect-[2/3] md:aspect-auto shrink-0 rounded-xl overflow-hidden shadow-2xl border border-white/10 group-hover:border-white/20 transition-all">
                  <ProgressiveImage src={scenario.mainPosterUrl} alt={scenario.title} className="group-hover:scale-110 transition-transform duration-700 h-full w-full object-cover" />
                  <div className={cn(
                    "absolute top-0 w-12 h-12 flex items-center justify-center text-lg font-black text-black bg-mt-primary shadow-2xl z-10", 
                    dir === 'rtl' ? "right-0 rounded-bl-2xl px-2" : "left-0 rounded-br-2xl px-2"
                  )}>
                    #{index + 1}
                  </div>
                  {/* Subtle overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors pointer-events-none" />
              </div>
              
              <div className="flex flex-col justify-center flex-1 py-1 md:py-2 px-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <h3 className="font-black text-2xl md:text-3xl lg:text-4xl text-white group-hover:text-mt-primary transition-colors leading-tight tracking-tight">{scenario.title}</h3>
                    <div className="flex items-center gap-2 bg-mt-primary/10 px-4 py-2 rounded-full border border-mt-primary/30 w-fit">
                      <Star className="w-5 h-5 text-mt-primary fill-mt-primary" />
                      <span className="text-lg md:text-xl font-black text-mt-primary">{(scenario.overallRating || 0).toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 mb-5">
                    <span className="text-[10px] md:text-xs text-[#aaa] font-black uppercase tracking-[0.2em] bg-white/5 px-4 py-1.5 rounded-full border border-white/10">{t(scenario.category) || scenario.category}</span>
                    <span className="text-[#555] opacity-50">•</span>
                    <span className="text-xs text-[#888] font-bold">{scenario.releaseYear || '2024'}</span>
                    <span className="text-[#555] opacity-50">•</span>
                    <span className="text-xs text-[#888] font-bold">{scenario.duration || '2h 15m'}</span>
                  </div>
  
                  <p className="text-[#aaa] text-sm md:text-base lg:text-lg line-clamp-2 md:line-clamp-3 mb-6 leading-relaxed max-w-4xl font-medium">
                    {scenario.description}
                  </p>
  
                  <div className="flex flex-wrap gap-2.5 mt-auto">
                    {scenario.tags?.slice(0, 5).map(tag => (
                      <span key={tag} className="px-4 py-1.5 text-[9px] md:text-[10px] font-black uppercase tracking-widest bg-white/5 border border-white/10 rounded-full text-[#777] group-hover:text-white group-hover:border-white/20 transition-all hover:bg-white/10">
                        #{tag}
                      </span>
                    ))}
                  </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
