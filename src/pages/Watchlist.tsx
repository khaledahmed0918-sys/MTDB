import { Bookmark, Search } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { useScenarios } from "@/contexts/ScenariosContext";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { MovieCard } from "./Home";

export function Watchlist() {
  const { t } = useI18n();
  const { scenarios, watchlist, loading } = useScenarios();

  const watchlistScenarios = scenarios.filter(s => watchlist.includes(s.id));

  return (
    <div className="space-y-12 animate-in fade-in duration-700 ease-out fill-mode-both pb-20">
      <div className="flex items-center gap-3 mb-10">
        <Bookmark className="w-5 h-5 md:w-6 md:h-6 text-mt-primary" />
        <h1 className="text-xl md:text-3xl font-black uppercase tracking-tight text-white flex items-center">
          {t('watchlist')}
        </h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="aspect-[2/3] rounded-xl bg-white/5" />
          ))}
        </div>
      ) : watchlistScenarios.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {watchlistScenarios.map((scenario, index) => (
             <MovieCard key={scenario.id} scenario={scenario} watchlisted={true} className="w-full" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-24 h-24 rounded-full bg-mt-primary flex items-center justify-center mb-6 shadow-xl">
             <span className="font-black text-black text-2xl tracking-tighter">MTDb</span>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-widest text-[#444] mb-2">{t('watchlistEmpty')}</h2>
          <p className="text-[#333] text-sm uppercase tracking-widest font-bold">{t('startExploring')}</p>
          <Link to="/" className="mt-8 px-10 py-4 bg-mt-primary text-black font-black uppercase tracking-widest rounded-lg hover:scale-105 active:scale-95 transition-all text-xs">
            {t('home')}
          </Link>
        </div>
      )}
    </div>
  );
}
