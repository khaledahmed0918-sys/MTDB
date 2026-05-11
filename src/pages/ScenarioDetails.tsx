import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Play, ShieldAlert, ArrowLeft, ArrowRight, Star, Bookmark, Plus } from "lucide-react";
import type { Scenario } from "@/types";
import { cn } from "@/lib/utils";
import { useI18n } from "@/contexts/I18nContext";
import { useScenarios } from "@/contexts/ScenariosContext";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { RatingBreakdown } from "@/components/RatingBreakdown";
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { VideoModal } from "@/components/VideoModal";
import { MovieCard, BookmarkButton } from "./Home";
import { LikeButton } from "@/components/LikeButton";

export function ScenarioDetails() {
  const { id } = useParams();
  const { scenarios, loading: scenariosLoading, toggleWatchlist, watchlist, setSearchQuery } = useScenarios();
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [ratingData, setRatingData] = useState<{ ratingsSum: number; votesCount: number; ratingsBreakdown: Record<string, number> } | null>(null);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [token, setToken] = useState<string>();
  const [refreshKey, setRefreshKey] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const turnstileRef = useRef<TurnstileInstance>(null);

  const { t, dir } = useI18n();
  const navigate = useNavigate();

  const isWatchlist = id ? watchlist.includes(id) : false;

  const similarScenarios = useMemo(() => {
    if (!scenario || !scenarios.length) return [];
    
    let matches = scenarios.filter(s => 
      s.id !== scenario.id && 
      s.tags?.some(tag => scenario.tags?.includes(tag))
    );

    if (matches.length === 0) {
      matches = scenarios.filter(s => s.id !== scenario.id && watchlist.includes(s.id));
    }

    if (matches.length === 0) {
      matches = [...scenarios]
        .filter(s => s.id !== scenario.id)
        .sort((a, b) => (b.overallRating || 0) - (a.overallRating || 0));
    }

    return matches.slice(0, 6);
  }, [scenario, scenarios, watchlist]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!scenariosLoading) {
      const found = scenarios.find(s => s.id === id);
      if (found) {
        setScenario(found);
        const existing = localStorage.getItem(`rating_${id}`);
        if (existing) setSelectedRating(Number(existing));
      }
    }
  }, [id, scenarios, scenariosLoading]);

  useEffect(() => {
    if (!id) return;
    const fetchRealtimeRatings = async () => {
      try {
        const url = `https://dolabriform-fascinatedly-lecia.ngrok-free.dev/api/ratings/${id}`;
        const response = await fetch(url, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        const data = await response.json();
        setRatingData(data);
      } catch (err) {
        console.error("Failed to fetch real-time ratings", err);
      }
    };
    fetchRealtimeRatings();
  }, [id, refreshKey]);

  const handleRate = async (stars: number) => {
    if (!token) {
      toast.error(t('completeVerification'));
      return;
    }
    
    const oldStars = Number(localStorage.getItem(`rating_${id}`)) || 0;
    setSelectedRating(stars);
    setIsSubmitting(true);
    
    try {
      const response = await fetch('https://dolabriform-fascinatedly-lecia.ngrok-free.dev/api/rate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ 
          scenarioId: id, 
          newStars: stars, 
          oldStars: oldStars, 
          cfToken: token 
        })
      });
      
      if (!response.ok) throw new Error('Network response was not ok');
      const result = await response.json();
      localStorage.setItem(`rating_${id}`, stars.toString());
      toast.success(t('ratingSuccess'));
      if (result.success) setRefreshKey(prev => prev + 1);
    } catch (e: any) {
      toast.error(`${t('ratingFailed')}: ${e.message || t('connectionFailed')}`);
      turnstileRef.current?.reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (scenariosLoading) {
    return (
      <div className="space-y-8 animate-pulse px-4 md:px-8">
        <Skeleton className="h-6 w-32 mb-10" />
        <div className="flex flex-col md:flex-row gap-8 lg:gap-16 mb-20 relative">
          <Skeleton className="w-full md:w-1/3 lg:w-1/4 shrink-0 aspect-[2/3] rounded-3xl" />
          <div className="flex flex-col justify-center flex-1 py-4">
            <Skeleton className="h-4 w-1/4 mb-6" />
            <Skeleton className="h-16 w-3/4 mb-8" />
            <Skeleton className="h-8 w-1/3 mb-10" />
            <div className="space-y-3 mb-12">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!scenario) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
        <ShieldAlert className="w-20 h-20 text-mt-primary mb-6 drop-shadow-[0_0_15px_rgba(245,197,24,0.5)]" />
        <h2 className="text-4xl font-black mb-6 font-display uppercase tracking-widest text-white">{t('scenarioNotFound')}</h2>
        <Link to="/" className="px-10 py-4 bg-mt-primary text-black font-black uppercase tracking-[0.2em] rounded-lg hover:scale-105 transition-all text-xs">{t('returnHome')}</Link>
      </div>
    );
  }

  return (
    <div className="pb-24 animate-in fade-in duration-700 ease-out fill-mode-both px-4 md:px-8 lg:px-12 max-w-[1600px] mx-auto mt-4 md:mt-8 overflow-x-hidden">
      {/* Back Link */}
      <Link to="/" className={cn("inline-flex items-center gap-2 text-[#888] hover:text-white transition-colors mb-4 md:mb-6 font-bold uppercase tracking-widest text-xs", dir === 'rtl' ? "mr-2" : "ml-2")}>
        {dir === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
        {t('returnHome')}
      </Link>

      {/* Header Info */}
      <div className="flex flex-col gap-8 mb-10">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
          <div className="flex-1">
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-white leading-tight mb-4 drop-shadow-2xl">
              {scenario.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 md:gap-6 text-[#aaa] text-xs md:text-base font-semibold">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 shadow-lg">
                <Star className="w-5 h-5 text-mt-primary fill-mt-primary" />
                <span className="text-white font-black text-xl">{(ratingData && ratingData.votesCount > 0 ? (ratingData.ratingsSum / ratingData.votesCount) : scenario.overallRating || 0).toFixed(1)}</span>
                <span className="text-white/40 text-xs">{t('perFive')}</span>
              </div>
              <span className="hidden sm:inline opacity-20">|</span>
              <span className="bg-white/5 px-4 py-2 rounded-full border border-white/10 shadow-md">
                {(ratingData?.votesCount || scenario.totalVotes || 0).toLocaleString()} {t('totalVotes')}
              </span>
              <span className="hidden md:inline opacity-20">|</span>
              <div className="flex flex-wrap gap-2 md:gap-4">
                {scenario.tags?.slice(0, 3).map((tag) => (
                  <span key={tag} className="hover:text-white transition-all cursor-pointer border border-white/10 bg-white/5 rounded-full px-4 py-2 hover:bg-white/10 hover:border-white/20 shadow-sm font-bold">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <button
              onClick={() => id && toggleWatchlist(id)}
              className={cn(
                "flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-5 rounded-2xl border transition-all duration-300 transform active:scale-95 shadow-2xl font-black uppercase tracking-[0.15em] text-xs md:text-sm whitespace-nowrap",
                isWatchlist 
                  ? "bg-[#f5c518] border-[#f5c518] text-black" 
                  : "bg-[#1c7ced]/10 border-[#1c7ced]/30 text-[#1c7ced] hover:bg-[#1c7ced] hover:text-white"
              )}
            >
              {isWatchlist ? <Bookmark className="w-5 h-5 fill-current" /> : <Plus className="w-6 h-6" />}
              {t(isWatchlist ? 'watchlistRemove' : 'watchlistAdd')}
            </button>
          </div>
        </div>

        {/* Visual Showcase */}
        {scenario.episodes && scenario.episodes.length > 0 ? (
          <div className="flex flex-col md:flex-row gap-6 h-auto md:h-[480px] lg:h-[600px]">
            <div className="w-full md:w-[320px] lg:w-[400px] shrink-0 aspect-[2/3] md:aspect-auto h-full rounded-[32px] overflow-hidden border border-white/10 shadow-2xl relative group/mainposter">
              <ProgressiveImage src={scenario.mainPosterUrl} alt={scenario.title} className="hover:scale-110 transition-transform duration-1000 h-full w-full object-cover" />
            </div>
            <div className="flex-1 rounded-[32px] overflow-hidden border border-white/10 shadow-2xl relative bg-[#050505] group">
              <ProgressiveImage src={scenario.episodes?.[0]?.posterUrl || scenario.mainPosterUrl} alt={scenario.title} className="opacity-40 group-hover:opacity-60 transition-all duration-1000 h-full w-full object-cover scale-105 group-hover:scale-100" />
              <div className="absolute inset-x-0 bottom-0 top-1/4 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
              
              <div className={cn("absolute bottom-10 flex items-center gap-8 z-10 w-full px-10", dir === 'rtl' ? "flex-row-reverse" : "flex-row")}>
                <div className="flex flex-col items-center gap-2 group/play-wrapper">
                  <button 
                    onClick={() => {
                      if (scenario.episodes && scenario.episodes.length > 0) {
                        setCurrentVideoUrl(scenario.episodes[0].videoLink);
                        setIsVideoModalOpen(true);
                      }
                    }}
                    className="flex items-center justify-center w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white/20 text-white hover:border-mt-primary hover:text-mt-primary transition-all group-hover/play-wrapper:scale-110 backdrop-blur-xl bg-white/5 shadow-2xl"
                  >
                    <Play className={cn("w-10 h-10 md:w-12 md:h-12 fill-current", dir === 'rtl' ? "mr-1 rotate-180" : "ml-1")} />
                  </button>
                  <LikeButton id={scenario.id} type="trailer" className="mt-2" />
                </div>
                <div className="flex flex-col items-start text-left">
                  <span className="font-black text-white text-3xl md:text-5xl tracking-tight mb-3 drop-shadow-2xl">{t('watchPromo')}</span>
                  <span className="text-white/60 text-sm md:text-xl font-medium hidden md:block drop-shadow-lg max-w-2xl">{t('watchPromoSub')?.replace('{title}', scenario.title) || `Watch the cinematic trailer for ${scenario.title}`}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-[350px] md:h-[500px] lg:h-[650px] rounded-[32px] overflow-hidden border border-white/10 shadow-2xl relative group bg-black">
            <ProgressiveImage src={scenario.mainPosterUrl} alt={scenario.title} className="opacity-50 group-hover:opacity-70 transition-all duration-1000 h-full w-full object-cover scale-105 group-hover:scale-100" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />
            <div className={cn("absolute bottom-10 z-10 max-w-3xl", dir === 'rtl' ? "right-10 md:right-16 text-right" : "left-10 md:left-16 text-left")}>
               <h2 className="text-4xl md:text-7xl font-black text-white mb-4 drop-shadow-2xl">{scenario.title}</h2>
               <div className="flex items-center gap-4 mb-4">
                 <p className="text-lg md:text-3xl text-white/70 font-black uppercase tracking-widest drop-shadow-lg">{scenario.category} • {scenario.releaseYear}</p>
                 <LikeButton id={scenario.id} type="trailer" />
               </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 md:gap-16 mt-16 px-2">
        <div className="lg:col-span-2 space-y-16">
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-2 h-8 bg-mt-primary rounded-full shadow-[0_0_15px_rgba(245,197,24,0.5)]"></div>
              <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">{t('synopsis')}</h2>
            </div>
            <p className="text-[#bbb] text-lg md:text-xl leading-relaxed font-medium">
              {scenario.description}
            </p>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-2 h-8 bg-mt-primary rounded-full shadow-[0_0_15px_rgba(245,197,24,0.5)]"></div>
              <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">{t('characters')}</h2>
            </div>
            
            {scenario.cast && scenario.cast.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                {scenario.cast.map(c => (
                  <div 
                    key={c.id} 
                    className="flex flex-col items-center text-center group"
                  >
                    <div 
                      onClick={() => {
                        if (c.playerName) {
                          setSearchQuery(c.playerName);
                          navigate("/");
                        }
                      }}
                      className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-mt-primary transition-all bg-[#111] shadow-xl cursor-pointer mb-3"
                    >
                      {c.isMystery ? (
                        <div className="w-full h-full flex items-center justify-center font-black text-2xl text-[#333]">?</div>
                      ) : (
                        <ProgressiveImage src={c.avatarUrl} alt={c.playerName} className="object-cover h-full w-full" />
                      )}
                    </div>
                    <div className="min-w-0 w-full">
                      <div 
                        onClick={() => {
                          if (c.playerName) {
                            setSearchQuery(c.playerName);
                            navigate("/");
                          }
                        }}
                        className="text-sm md:text-base font-black text-white truncate group-hover:text-mt-primary transition-colors cursor-pointer"
                      >
                        {c.isMystery ? t('unknown') : c.playerName}
                      </div>
                      <div className="text-[10px] md:text-xs text-[#777] font-bold truncate tracking-wide mb-3">{c.characterName}</div>
                      <LikeButton id={c.id} type="character" className="mx-auto" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="flex flex-col items-center text-center animate-pulse">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-white/5 mb-3" />
                    <div className="h-4 w-20 bg-white/5 rounded mb-2" />
                    <div className="h-3 w-16 bg-white/5 rounded" />
                  </div>
                ))}
              </div>
            )}
          </section>

          {scenario.episodes && scenario.episodes.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-2 h-8 bg-mt-primary rounded-full shadow-[0_0_15px_rgba(245,197,24,0.5)]"></div>
                <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">{t('episodes')}</h2>
              </div>
              
              <div className="space-y-6">
                {scenario.episodes.map((ep, idx) => (
                  <div key={ep.id} className="flex flex-col sm:flex-row gap-6 p-4 rounded-2xl border border-white/5 bg-white/[0.02] group hover:bg-white/5 transition-all cursor-pointer shadow-lg" onClick={() => {
                    setCurrentVideoUrl(ep.videoLink);
                    setIsVideoModalOpen(true);
                  }}>
                    <div className="w-full sm:w-64 aspect-video rounded-xl overflow-hidden shrink-0 relative bg-black shadow-2xl border border-white/10">
                      <ProgressiveImage src={ep.posterUrl} alt={ep.title} className="opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                        <Play className={cn("w-12 h-12 text-white fill-current drop-shadow-2xl", dir === 'rtl' ? "mr-1 rotate-180" : "ml-1")} />
                      </div>
                      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-black text-white border border-white/10">EP {idx + 1}</div>
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h3 className="text-white font-black text-lg md:text-xl leading-tight mb-2 group-hover:text-mt-primary transition-colors">
                        {t('episode')} {idx + 1}: {ep.title}
                      </h3>
                      <p className="text-[#888] text-sm md:text-base line-clamp-3 leading-relaxed font-medium">{ep.synopsis}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-10">
          <div className="bg-[#111] p-8 rounded-3xl border border-white/5 shadow-2xl sticky top-24">
            <h3 className="text-xl md:text-2xl font-black mb-8 flex items-center gap-3 text-white uppercase tracking-tight">
              <Star className="w-6 h-6 text-mt-primary fill-mt-primary" />
              {t('rateThis')}
            </h3>
            
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-3 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    disabled={isSubmitting || !token}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => handleRate(star)}
                    className={cn(
                      "transition-all duration-300 focus:outline-none disabled:opacity-30 p-1",
                      (hoverRating || selectedRating) >= star ? "text-mt-primary scale-125 drop-shadow-[0_0_10px_rgba(245,197,24,0.4)]" : "text-[#222] hover:text-mt-primary/40"
                    )}
                  >
                    <Star className={cn("w-10 h-10 md:w-12 md:h-12", (hoverRating || selectedRating) >= star && "fill-current")} />
                  </button>
                ))}
              </div>
              
              <div className="overflow-hidden rounded-xl border border-white/5">
                <Turnstile 
                  ref={turnstileRef}
                  siteKey="0x4AAAAAADMldK75x_4I7Qcx" 
                  onSuccess={setToken} 
                  style={{ width: '100%' }}
                />
              </div>

              <div key={refreshKey} className="pt-4 border-t border-white/5">
                <RatingBreakdown scenarioId={id || ''} totalVotes={ratingData?.votesCount || scenario.votesCount || 0} breakdownData={ratingData?.ratingsBreakdown} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Scenarios */}
      <section className="mt-24 pt-12 border-t border-white/5">
        <div className="flex items-center gap-4 mb-10 px-2">
          <div className="w-2 h-8 bg-mt-primary rounded-full shadow-[0_0_15px_rgba(245,197,24,0.5)]"></div>
          <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight">{t('moreToExplore')}</h2>
        </div>
        
        {similarScenarios.length > 0 ? (
          <div className="flex gap-6 overflow-x-auto no-scrollbar pb-10 px-2">
            {similarScenarios.map((s) => (
               <MovieCard key={s.id} scenario={s} watchlisted={watchlist.includes(s.id)} />
            ))}
          </div>
        ) : (
          <p className="text-[#333] font-black text-lg py-12 text-center border border-dashed border-white/5 rounded-3xl">
            {t('noSimilarScenarios')}
          </p>
        )}
      </section>

      <VideoModal 
        isOpen={isVideoModalOpen} 
        onClose={() => setIsVideoModalOpen(false)} 
        videoUrl={currentVideoUrl} 
      />
    </div>
  );
}
