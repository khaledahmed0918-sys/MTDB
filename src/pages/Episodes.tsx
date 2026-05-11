import { Tv, Play, PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Episode } from "@/types";
import { useI18n } from "@/contexts/I18nContext";
import { useScenarios } from "@/contexts/ScenariosContext";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import { Skeleton } from "@/components/ui/skeleton";

interface FlatEpisode extends Episode {
  scenarioTitle: string;
  scenarioId: string;
}

export function Episodes() {
  const { scenarios, loading } = useScenarios();
  const { t } = useI18n();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <Skeleton className="h-10 w-48 mb-6 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
             <Skeleton key={i} className="aspect-video w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const flat: FlatEpisode[] = [];
  scenarios.forEach(s => {
    if (s.episodes) {
      s.episodes.forEach(e => {
          flat.push({ ...e, scenarioTitle: s.title, scenarioId: s.id });
      });
    }
  });
  const episodes = flat.reverse();

  return (
    <div className="space-y-12 animate-in fade-in duration-700 ease-out fill-mode-both pb-20">
      <div className="flex items-center gap-3 mb-10">
        <Tv className="w-5 h-5 md:w-6 md:h-6 text-mt-primary" />
        <h1 className="text-xl md:text-3xl font-black uppercase tracking-tight text-white flex items-center">
          {t('episodes')}
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {episodes.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center gap-4 bg-[#121212] rounded-xl border border-white/5">
             <Tv className="w-16 h-16 text-[#333] mb-2" />
             <h3 className="text-2xl font-black text-white uppercase tracking-widest">{t('noEpisodes')}</h3>
          </div>
        ) : (
          episodes.map((ep) => (
            <div 
              key={ep.id} 
              onClick={() => navigate(`/scenario/${ep.scenarioId}`)}
              className="bg-transparent rounded-sm overflow-hidden group hover:bg-white/5 transition-all flex flex-col cursor-pointer"
            >
              <div className="aspect-video relative overflow-hidden bg-black border border-white/10 rounded-sm">
                <ProgressiveImage src={ep.posterUrl} alt={ep.title} className="group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex flex-col items-center justify-center transition-colors">
                  <Play className="w-12 h-12 text-white fill-current opacity-70 group-hover:opacity-100 group-hover:text-mt-primary transition-all ml-2" />
                </div>
              </div>
              <div className="pt-3 flex-1 flex flex-col">
                  <div className="text-xs font-semibold text-[#888] mb-1">{ep.scenarioTitle}</div>
                  <h3 className="font-bold text-white text-base transition-colors group-hover:underline leading-tight mb-2">{ep.title}</h3>
                  <p className="text-sm text-[#999] line-clamp-2 md:line-clamp-3 leading-relaxed">{ep.synopsis}</p>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
