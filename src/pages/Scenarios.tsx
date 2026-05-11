import { useScenarios } from "@/contexts/ScenariosContext";
import { useI18n } from "@/contexts/I18nContext";
import { MovieCard } from "./Home";
import { Link } from "react-router-dom";
import { Calendar, Play, Star } from "lucide-react";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import { cn } from "@/lib/utils";

export function Scenarios() {
  const { scenarios, watchlist, loading } = useScenarios();
  const { t, dir } = useI18n();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mt-primary"></div>
      </div>
    );
  }

  // Sort scenarios by rating for the hero section
  const sortedScenarios = [...scenarios].sort((a, b) => (b.overallRating || 0) - (a.overallRating || 0));
  const heroScenario = sortedScenarios[0];
  const otherScenarios = sortedScenarios.slice(1);

  return (
    <div className="pb-24">
      {/* Hero Section */}
      {heroScenario && (
        <div className="relative w-full aspect-[4/5] sm:aspect-[16/9] md:aspect-[21/9] bg-[#0c0b00] rounded-lg overflow-hidden group shadow-lg border border-white/5 mb-12">
          {/* <video ... /> could go here, for now poster */}
          <div className="absolute inset-0">
            <ProgressiveImage src={heroScenario.episodes?.[0]?.posterUrl || heroScenario.mainPosterUrl} alt={heroScenario.title} className="opacity-80 group-hover:opacity-100 transition-opacity duration-1000 object-cover w-full h-full" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b00] via-[#0c0b00]/60 to-transparent z-10" />
          
          <div className={cn("absolute bottom-6 md:bottom-12 z-20 flex gap-4 md:gap-8 items-end max-w-4xl px-4 md:px-0 w-full", dir === 'rtl' ? "right-0 md:right-12" : "left-0 md:left-12")}>
             <div className="w-24 md:w-48 aspect-[2/3] shrink-0 rounded-md overflow-hidden border border-white/20 hidden sm:block shadow-2xl">
                <ProgressiveImage src={heroScenario.mainPosterUrl} alt="Poster" />
             </div>
             
             <div className="flex-1 min-w-0 pr-4 md:pr-0">
               <div className="flex flex-wrap items-center gap-2 mb-3 lg:mb-4">
                 <div className="bg-mt-primary text-black text-xs font-bold px-2 py-0.5 rounded shadow-lg">{t('highestRated')}</div>
                 <div className="flex items-center gap-1 text-white bg-black/50 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
                   <Star className="w-3.5 h-3.5 text-mt-primary fill-mt-primary" />
                   <span className="text-xs font-bold">{heroScenario.overallRating?.toFixed(1) || '0.0'}</span>
                 </div>
               </div>
               <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-white leading-tight tracking-tight mb-2 md:mb-4 drop-shadow-lg line-clamp-2 md:line-clamp-none">
                 {heroScenario.title}
               </h1>
               <p className="text-[#ccc] text-sm md:text-lg font-medium line-clamp-3 md:line-clamp-3 mb-4 md:mb-6 max-w-2xl text-shadow">
                 {heroScenario.description}
               </p>
               <div className="flex gap-4">
                 <Link to={`/scenario/${heroScenario.id}`} className="flex items-center justify-center gap-2 bg-mt-primary text-black px-6 md:px-8 py-3 md:py-3 rounded-md font-bold text-sm md:text-base hover:bg-white hover:text-black transition-colors active:scale-95 w-full md:w-auto">
                   <Play className={cn("w-4 h-4 md:w-5 md:h-5 fill-current", dir === 'rtl' ? "rotate-180" : "")} />
                   {t('viewDetails')}
                 </Link>
               </div>
             </div>
          </div>
        </div>
      )}

      {/* All Scenarios Grid */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className={cn("text-2xl md:text-3xl font-bold text-white", dir === 'rtl' ? "border-r-4 border-mt-primary pr-3" : "border-l-4 border-mt-primary pl-3")}>{t('allScenarios')}</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {scenarios.map((scenario) => (
           <MovieCard key={scenario.id} scenario={scenario} watchlisted={watchlist.includes(scenario.id)} className="w-full" />
        ))}
      </div>
    </div>
  );
}
