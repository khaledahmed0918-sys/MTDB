import { Link } from "react-router-dom";
import { TrendingUp, Star, Flame } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { useScenarios } from "@/contexts/ScenariosContext";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { MovieCard } from "./Home";

export function Trending() {
  const { scenarios, watchlist, loading } = useScenarios();
  const { t } = useI18n();

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <Skeleton className="h-10 w-48 mb-6 rounded" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => (
             <Skeleton key={i} className="aspect-[2/3] w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const sortedScenarios = [...scenarios].reverse();

  return (
    <div className="space-y-12 animate-in fade-in duration-700 ease-out fill-mode-both pb-20">
      <div className="flex items-center gap-3 mb-10">
        <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-mt-primary" />
        <h1 className="text-xl md:text-3xl font-black uppercase tracking-tight text-white flex items-center">
          {t('trending')}
        </h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {sortedScenarios.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center gap-4 bg-[#121212] rounded-xl border border-white/5">
             <TrendingUp className="w-16 h-16 text-[#333] mb-2" />
             <h3 className="text-2xl font-black text-white uppercase tracking-widest">{t('noScenarios')}</h3>
          </div>
        ) : (
          sortedScenarios.map((scenario, index) => (
             <MovieCard key={scenario.id} scenario={scenario} watchlisted={watchlist.includes(scenario.id)} rank={index + 1} className="w-full" />
          ))
        )}
      </div>

    </div>
  );
}
