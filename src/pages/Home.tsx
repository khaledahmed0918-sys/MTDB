import React, { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Play, Star, ChevronRight, Bookmark, Flame, ThumbsUp, Heart, ChevronUp, Plus, List as ListIcon, Users } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { useScenarios } from "@/contexts/ScenariosContext";
import { cn } from "@/lib/utils";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "motion/react";
import { VideoModal } from "@/components/VideoModal";
import { LikeButton } from "@/components/LikeButton";

const SectionDivider = () => <div className="mx-3 my-8 border-b border-white/5" />;

// Improved Section Header with Yellow Bar
function SectionHeader({ title, subTitle, link }: { title: string, subTitle?: string, link?: string }) {
  const { dir } = useI18n();
  return (
    <div className="mb-4 px-3 flex flex-col gap-1">
      <Link to={link || "#"} className="flex items-center gap-2 group/title w-fit">
        <div className="w-1 md:w-1.5 h-6 md:h-8 bg-[#f5c518]" />
        <h2 className="text-xl md:text-2xl font-black text-white group-hover:text-[#f5c518] transition-colors flex items-center gap-1 uppercase tracking-tight">
          {title}
          <ChevronRight className={cn("w-5 h-5 transition-transform group-hover/title:translate-x-1", dir === 'rtl' ? "rotate-180 group-hover/title:-translate-x-1" : "")} />
        </h2>
      </Link>
      {subTitle && (
        <p className="text-[#888] text-[10px] font-black uppercase tracking-[0.2em]">{subTitle}</p>
      )}
    </div>
  );
}

// Top Characters Section Component
function TopCharacters() {
  const { scenarios } = useScenarios();
  const { t, dir } = useI18n();
  const [characterLikes, setCharacterLikes] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const allCharacters = useMemo(() => {
    const chars = scenarios.flatMap(s => s.cast || []);
    // Unique by playerName
    return Array.from(new Map(chars.filter(c => !c.isMystery).map(item => [item.playerName, item])).values());
  }, [scenarios]);

  useEffect(() => {
    const fetchAllLikes = async () => {
      try {
        const likes: Record<string, number> = {};
        await Promise.all(allCharacters.map(async (char) => {
          try {
            const res = await fetch(`https://dolabriform-fascinatedly-lecia.ngrok-free.dev/api/likes/character/${char.id}`, {
              headers: { 'ngrok-skip-browser-warning': 'true' }
            });
            const data = await res.json();
            likes[char.id] = data.likes || 0;
          } catch (e) {
            likes[char.id] = 0;
          }
        }));
        setCharacterLikes(likes);
      } catch (err) {
        console.error("Failed to fetch character likes:", err);
      } finally {
        setLoading(false);
      }
    };

    if (allCharacters.length > 0) fetchAllLikes();
  }, [allCharacters]);

  const topChars = useMemo(() => {
    return allCharacters
      .map(c => ({ ...c, likes: characterLikes[c.id] || 0 }))
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 5);
  }, [allCharacters, characterLikes]);

  if (topChars.length === 0 && !loading) return null;

  return (
    <section className="mb-10 px-3">
      <SectionHeader title={t('topCharacters')} />
      <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4 px-2">
        {topChars.map((char, idx) => (
          <Link to={`/character/${char.id}`} key={char.id} className="flex flex-col items-center gap-3 shrink-0 w-32 group cursor-pointer active:scale-95 transition-transform">
            <div className="relative">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-[#f5c518] transition-all bg-[#111] shadow-xl">
                <ProgressiveImage src={char.avatarUrl} alt={char.playerName} className="w-full h-full object-cover" />
              </div>
              <div className="absolute -top-1 -right-1 w-7 h-7 bg-[#f5c518] text-black font-black text-xs flex items-center justify-center rounded-full border-2 border-black shadow-lg">
                #{idx + 1}
              </div>
            </div>
            <div className="text-center w-full">
              <h4 className="text-white font-black text-xs md:text-sm mb-0.5 line-clamp-1 group-hover:text-[#f5c518] transition-colors">{char.playerName}</h4>
              <p className="text-[#666] text-[9px] font-bold uppercase tracking-wider mb-2 line-clamp-1">{char.characterName}</p>
              <div className="flex items-center justify-center gap-1.5 text-[#f5c518] bg-[#f5c518]/10 py-1 rounded-full border border-[#f5c518]/20">
                <ThumbsUp className="w-3 h-3 fill-current" />
                <span className="text-[10px] font-black">{char.likes}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// Dynamic Bookmark Ribbon that fills the corner
export function BookmarkButton({ active, onClick, className }: { active: boolean, onClick: () => void, className?: string }) {
  const { dir } = useI18n();
  return (
    <button 
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClick(); }}
      className={cn(
        "absolute top-0 z-30 transition-all active:scale-95 group/bookmark",
        dir === 'rtl' ? "right-0" : "left-0",
        className
      )}
    >
      <div className="relative">
        {/* Ribbon Shape SVG */}
        <svg 
          width="48" 
          height="64" 
          viewBox="0 0 48 64" 
          className={cn(
            "drop-shadow-md transition-colors",
            active ? "fill-[#f5c518]" : "fill-gray-600/95 hover:fill-gray-500/100 backdrop-blur-sm"
          )}
        >
          <path d="M0 0h48v64l-24-12L0 64z" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center -translate-y-[15%]">
          {active ? (
            <Bookmark className="w-5 h-5 text-black fill-current" />
          ) : (
            <Plus className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          )}
        </div>
      </div>
    </button>
  );
}

interface MovieCardProps {
  scenario: any;
  watchlisted: boolean;
  rank?: number;
  className?: string;
  key?: React.Key;
}

// 7. Top 10 Item (Horizontal Card)
export function MovieCard({ scenario, watchlisted, rank, className }: MovieCardProps) {
  const { dir, t } = useI18n();
  const { toggleWatchlist } = useScenarios();

  return (
    <div className={cn(
      "group flex flex-col shrink-0 bg-[#0f0f0f] rounded-xl overflow-hidden border border-white/[0.03] active:scale-[0.98] transition-all hover:bg-[#161616] shadow-xl hover:border-white/10",
      className || "w-[150px] sm:w-[165px] md:w-[200px]"
    )}>
      {/* Poster */}
      <Link to={`/scenario/${scenario.id}`} className="relative aspect-[2/3] bg-black overflow-hidden group/poster">
        <ProgressiveImage 
          src={scenario.mainPosterUrl} 
          alt={scenario.title} 
          className="group-hover:scale-110 transition-transform duration-700 h-full w-full object-cover" 
        />
        {/* Only show yellow bookmark if active */}
        {watchlisted && (
          <BookmarkButton active={watchlisted} onClick={() => toggleWatchlist(scenario.id)} className="scale-[0.75] -translate-x-[5px] -translate-y-[8px]" />
        )}
        
        {/* Rating Overlay on Mobile/Tablet */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-black text-[#f5c518] border border-white/10">
          <Star className="w-2.5 h-2.5 fill-current" />
          {scenario.overallRating?.toFixed(1) || '0.0'}
        </div>
      </Link>
      
      {/* Info */}
      <div className="p-3 flex flex-col flex-1 min-w-0">
        <Link to={`/scenario/${scenario.id}`}>
          <h3 className="text-white font-bold text-xs md:text-sm line-clamp-2 leading-snug group-hover:text-[#f5c518] transition-colors mb-3 min-h-[2.5rem]">
            {rank !== undefined && <span className="text-[#666] mr-1">{rank}.</span>}
            {scenario.title}
          </h3>
        </Link>
        
        <div className="mt-auto flex items-center gap-2">
          <button 
            onClick={() => toggleWatchlist(scenario.id)}
            className={cn(
              "flex-1 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 border",
              watchlisted 
                ? "bg-[#f5c518]/10 text-[#f5c518] border-[#f5c518]/20" 
                : "bg-white/5 text-[#1c7ced] border-transparent hover:bg-white/10"
            )}
          >
            {watchlisted ? <Bookmark className="w-3 h-3 fill-current" /> : <Plus className="w-3 h-3" />}
            {t(watchlisted ? 'watchlistRemove' : 'watchlistAdd')}
          </button>
        </div>
      </div>
    </div>
  );
}

interface Top10CardProps {
  scenario: any;
  rank: number;
  key?: React.Key;
}

function Top10Card({ scenario, rank }: Top10CardProps) {
  const { t, dir, language } = useI18n();
  const { watchlist, toggleWatchlist } = useScenarios();
  const isWatchlisted = watchlist.includes(scenario.id);
  const voteCount = useMemo(() => scenario.totalVotes || 0, [scenario.totalVotes]);

  return (
    <div className="flex gap-3 bg-[#121212] rounded-xl overflow-hidden border border-white/5 shadow-2xl group hover:bg-[#1a1a1a] transition-all hover:shadow-[#f5c518]/5">
      {/* Poster Left */}
      <Link to={`/scenario/${scenario.id}`} className="relative w-28 sm:w-36 aspect-[2/3] shrink-0 bg-black overflow-hidden rounded-l-xl">
        <ProgressiveImage src={scenario.mainPosterUrl} alt={scenario.title} className="group-hover:scale-105 transition-transform duration-500 h-full w-full object-cover" />
        <BookmarkButton active={isWatchlisted} onClick={() => toggleWatchlist(scenario.id)} className="scale-[0.7] -translate-x-[10px] -translate-y-[15px]" />
      </Link>

      {/* Content Right */}
      <div className="flex flex-col flex-1 py-3 px-2 min-w-0 pr-4">
        <div className="flex justify-between items-start mb-1.5 gap-2">
          <Link to={`/scenario/${scenario.id}`} className="flex-1 text-balance">
            <h3 className="text-white font-bold text-base md:text-lg line-clamp-2 leading-tight group-hover:text-[#f5c518] transition-colors">{scenario.title}</h3>
          </Link>
          <div className="bg-[#1a2b4b] text-[#1c7ced] font-black text-[10px] md:text-xs px-2 py-1 rounded-md shrink-0 border border-[#1c7ced]/20">#{rank}</div>
        </div>
        
        <div className="text-[#888] text-[10px] flex flex-wrap items-center gap-1.5 mb-2.5 font-medium">
          <span className="bg-white/5 px-2 py-0.5 rounded-sm">{scenario.releaseYear || '2024'}</span>
          <span className="bg-white/5 px-2 py-0.5 rounded-sm">{scenario.duration || '2h 15m'}</span>
          <span className="border border-[#444] px-1.5 rounded-sm text-[9px] uppercase">{scenario.ratingLabel || 'PG-13'}</span>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-3">
          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-[#f5c518] fill-[#f5c518]" />
            <span className="text-white text-sm font-bold">{scenario.overallRating?.toFixed(1) || '0.0'}</span>
            <span className="text-[#555] text-[10px]">({voteCount.toLocaleString()})</span>
          </div>
          <button className="flex items-center gap-1 text-[#1c7ced] font-bold text-xs hover:bg-[#1c7ced]/10 px-2.5 py-1 rounded-md transition-colors uppercase tracking-tight bg-white/5">
            <Star className="w-3.5 h-3.5" />
            {t('rate')}
          </button>
        </div>

        <button 
          onClick={() => toggleWatchlist(scenario.id)}
          className={cn(
            "mt-auto flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-tight transition-all active:scale-95 w-fit border",
            isWatchlisted 
              ? "bg-[#f5c518]/10 text-[#f5c518] border-[#f5c518]/20" 
              : "bg-white/5 text-[#1c7ced] border-transparent hover:bg-white/10"
          )}
        >
          {isWatchlisted ? <Bookmark className="w-3.5 h-3.5 fill-current" /> : <Plus className="w-3.5 h-3.5" />}
          {t(isWatchlisted ? 'watchlistRemove' : 'watchlistAdd')}
        </button>
      </div>
    </div>
  );
}

interface SmallMovieCardProps {
  scenario: any;
  watchlisted: boolean;
  key?: React.Key;
}

// Smaller card for Watchlist specifically
export function SmallMovieCard({ scenario, watchlisted }: SmallMovieCardProps) {
  const { dir, t } = useI18n();
  const { toggleWatchlist } = useScenarios();

  return (
    <div className="group flex flex-col shrink-0 w-[135px] sm:w-[150px] bg-[#121212] rounded-xl overflow-hidden border border-white/5 active:scale-95 transition-all hover:bg-[#1a1a1a] shadow-lg">
      <Link to={`/scenario/${scenario.id}`} className="relative aspect-[2/3] bg-black overflow-hidden rounded-t-xl group/poster">
        <ProgressiveImage src={scenario.mainPosterUrl} alt={scenario.title} className="group-hover:scale-110 transition-transform duration-700 h-full w-full object-cover" />
        <BookmarkButton active={watchlisted} onClick={() => toggleWatchlist(scenario.id)} className="scale-[0.7] -translate-x-[8px] -translate-y-[12px]" />
      </Link>
      <div className="p-2.5 pt-1.5 flex flex-col flex-1 min-w-0">
        <div className="flex items-center gap-1 mb-1.5">
          <Star className="w-3 h-3 text-[#f5c518] fill-[#f5c518]" />
          <span className="text-white text-[10px] font-bold">{scenario.overallRating?.toFixed(1) || '0.0'}</span>
        </div>
        <Link to={`/scenario/${scenario.id}`}>
          <h3 className="text-white font-bold text-[11px] line-clamp-1 group-hover:text-[#f5c518] transition-colors mb-2 leading-tight">
            {scenario.title}
          </h3>
        </Link>
        <button 
          onClick={() => toggleWatchlist(scenario.id)}
          className={cn(
            "mt-auto w-full py-2 rounded-lg text-[9px] font-black uppercase tracking-tight transition-all flex items-center justify-center gap-1.5 border",
            watchlisted 
              ? "bg-[#f5c518]/10 text-[#f5c518] border-[#f5c518]/20" 
              : "bg-white/5 text-[#1c7ced] border-transparent hover:bg-white/10"
          )}
        >
          {watchlisted ? <Bookmark className="w-2.5 h-2.5 fill-current" /> : <Plus className="w-2.5 h-2.5" />}
          {t(watchlisted ? 'watchlistRemove' : 'watchlistAdd')}
        </button>
      </div>
    </div>
  );
}

export function Home() {
  const { scenarios, watchlist, loading, toggleWatchlist, edits } = useScenarios();
  const { t, dir, language } = useI18n();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentTrailerIndex, setCurrentTrailerIndex] = useState(0);
  const [ratingCounts, setRatingCounts] = useState<Record<string, number>>({});

  // Scroll listener for "Back to top"
  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 1000);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const trailerScenarios = useMemo(() => scenarios.slice(0, 5), [scenarios]);

  // Fetch real rating counts for trailers
  useEffect(() => {
    const fetchRatings = async () => {
      const counts: Record<string, number> = {};
      
      try {
        await Promise.all(trailerScenarios.map(async (scenario) => {
          try {
            const response = await fetch(`https://dolabriform-fascinatedly-lecia.ngrok-free.dev/api/ratings/${scenario.id}`, {
              headers: { 'ngrok-skip-browser-warning': 'true' }
            });
            const data = await response.json();
            counts[scenario.id] = data.votesCount || 0;
          } catch (e) {
            // Fallback to 0 if API fails
            counts[scenario.id] = 0;
          }
        }));
        setRatingCounts(counts);
      } catch (err) {
        console.error("Failed to fetch trailer ratings:", err);
      }
    };
    
    if (trailerScenarios.length > 0) {
      fetchRatings();
    }
  }, [trailerScenarios]);

  const watchlistScenarios = useMemo(() => scenarios.filter(s => watchlist.includes(s.id)), [scenarios, watchlist]);
  const celebrities = useMemo(() => {
    const chars = scenarios.flatMap(s => s.cast || []);
    return Array.from(new Map(chars.filter(c => !c.isMystery).map(item => [item.playerName, item])).values()).slice(0, 10);
  }, [scenarios]);

  if (loading) return (
    <div className="space-y-12 pb-20 pt-4 px-3">
      <Skeleton className="w-full aspect-[4/5] bg-mt-surface rounded-xl" />
      <div className="flex gap-4 overflow-hidden py-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="aspect-[2/3] min-w-[150px] rounded-md bg-mt-surface/50" />)}
      </div>
    </div>
  );

  return (
    <div className="pb-24 min-h-screen bg-black overflow-x-hidden">
      
      {/* 2. Hero Carousel (Mobile Style) */}
      <section className="relative mb-2">
        <div className="relative aspect-[4/5] sm:aspect-[16/9] md:aspect-[21/9] bg-[#0c0b00] overflow-hidden group">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentTrailerIndex}
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <ProgressiveImage 
                src={trailerScenarios[currentTrailerIndex]?.episodes?.[0]?.posterUrl || trailerScenarios[currentTrailerIndex]?.mainPosterUrl} 
                alt="Trailer Background" 
                className="w-full h-full object-cover opacity-60"
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Overlay */}
          <div className="absolute inset-0 z-20 flex justify-between px-2 items-center pointer-events-none">
            <button 
              onClick={() => setCurrentTrailerIndex((prev) => (prev === 0 ? trailerScenarios.length - 1 : prev - 1))}
              className="p-3 bg-black/40 backdrop-blur-md rounded-full text-white pointer-events-auto hover:bg-[#f5c518] hover:text-black transition-all active:scale-95"
            >
              <ChevronRight className={cn("w-6 h-6", dir === 'rtl' ? "" : "rotate-180")} />
            </button>
            <button 
              onClick={() => setCurrentTrailerIndex((prev) => (prev === trailerScenarios.length - 1 ? 0 : prev + 1))}
              className="p-3 bg-black/40 backdrop-blur-md rounded-full text-white pointer-events-auto hover:bg-[#f5c518] hover:text-black transition-all active:scale-95"
            >
              <ChevronRight className={cn("w-6 h-6", dir === 'rtl' ? "rotate-180" : "")} />
            </button>
          </div>

          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <div className="flex items-center gap-4 pointer-events-auto">
               <button 
                onClick={() => setIsVideoModalOpen(true)}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-white/50 text-white flex items-center justify-center hover:scale-110 hover:bg-white/10 active:scale-95 transition-all bg-black/20 backdrop-blur-sm group/play"
               >
                 <Play className={cn("w-8 h-8 md:w-10 md:h-10 fill-current", dir === 'rtl' ? "rotate-0 mr-1" : "ml-1")} />
               </button>
               <span className="text-white text-lg font-black tracking-tight drop-shadow-lg p-2 bg-black/40 backdrop-blur-md rounded-md border border-white/5">
                 {trailerScenarios[currentTrailerIndex]?.duration || '2:30'}
               </span>
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10" />

          {/* Bottom Info Section */}
          <div className={cn("absolute bottom-6 z-20 flex gap-4 items-end w-full px-4", dir === 'rtl' ? "right-0" : "left-0")}>
             {/* Thumbnail Poster - RADIUS 20 and STUCK */}
             <div className="w-24 md:w-32 aspect-[2/3] shrink-0 rounded-[20px] overflow-hidden border border-white/20 shadow-2xl relative bg-black self-end mb-[-2px]">
                <ProgressiveImage src={trailerScenarios[currentTrailerIndex]?.mainPosterUrl} alt="Thumbnail" className="h-full w-full object-cover" />
                <BookmarkButton active={watchlist.includes(trailerScenarios[currentTrailerIndex]?.id)} onClick={() => toggleWatchlist(trailerScenarios[currentTrailerIndex]?.id)} className="scale-[0.8] -translate-x-[5px] -translate-y-[10px]" />
             </div>

             <div className="flex-1 min-w-0 pr-4">
               <Link to={`/scenario/${trailerScenarios[currentTrailerIndex]?.id}`}>
                 <h1 className="text-xl md:text-3xl font-black text-white leading-tight tracking-tight mb-0.5 drop-shadow-xl line-clamp-2 hover:text-[#f5c518] transition-colors">
                   {trailerScenarios[currentTrailerIndex]?.title}
                 </h1>
               </Link>
               <p className="text-[#aaa] text-sm md:text-base mb-3 font-medium">{t('watchTheTrailer')}</p>
               
               {/* Engagement - Real Data */}
               <div className="flex items-center gap-6 mb-4">
                  <LikeButton 
                    id={trailerScenarios[currentTrailerIndex]?.id} 
                    type="trailer" 
                    className="backdrop-blur-md px-4 py-2"
                  />
               </div>

               <Link to="/trailers" className="flex items-center gap-2 text-white font-black text-xs md:text-base uppercase tracking-widest hover:underline group/browse">
                 {t('browseTrailers')}
                 <ChevronRight className={cn("w-4 h-4", dir === 'rtl' ? "rotate-180" : "")} />
               </Link>
             </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* 3. Category Pills */}
      <section className="mb-4 px-3 overflow-x-auto no-scrollbar flex gap-2">
        {['baftaTVAwards', 'starWarsDay', 'aapiHeritageMonth', 'cannesFestival'].map((key) => (
          <Link to="/trailers" key={key} className="shrink-0 flex items-center gap-1.5 px-4 py-2 border border-white/20 rounded-full bg-black hover:bg-[#f5c518] hover:text-black hover:border-[#f5c518] transition-all group">
            <span className="text-white group-hover:text-black text-sm font-bold whitespace-nowrap">{t(key)}</span>
            <ChevronRight className={cn("w-4 h-4 text-white/40 group-hover:text-black", dir === 'rtl' ? "rotate-180" : "")} />
          </Link>
        ))}
      </section>

      <SectionDivider />

      <TopCharacters />

      <SectionDivider />
      <section className="mb-10">
        <SectionHeader title={t('edits')} link="/edits" />
        <div className="flex gap-4 overflow-x-auto no-scrollbar px-3 pb-6">
          {edits.slice(0, 6).map((edit) => (
            <div key={edit.id} className="group flex flex-col shrink-0 w-[180px] sm:w-[220px] bg-[#0f0f0f] rounded-xl overflow-hidden border border-white/5 active:scale-95 transition-all shadow-xl">
               <div className="relative aspect-square overflow-hidden cursor-pointer" onClick={() => window.location.href = '/edits'}>
                  <ProgressiveImage src={edit.thumbnailUrl || edit.url} alt={edit.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-2 right-2">
                     <LikeButton id={edit.id} type="design" showCount={true} className="backdrop-blur-md" />
                  </div>
                  {edit.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                       </div>
                    </div>
                  )}
               </div>
               <div className="p-3">
                  <h3 className="text-white font-bold text-xs md:text-sm line-clamp-1 group-hover:text-[#f5c518] transition-colors">{edit.title}</h3>
                  <p className="text-[#666] text-[10px] font-black uppercase tracking-widest mt-1">{edit.type}</p>
               </div>
            </div>
          ))}
        </div>
      </section>

      <SectionDivider />
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4 px-3">
          <h2 className="text-[#f5c518] text-xl font-black uppercase tracking-tight">{t('featuredToday')}</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar px-3 pb-2">
           {/* Card 1: Guide */}
           <Link to="/scenarios" className="w-[85vw] sm:w-[400px] shrink-0 bg-[#121212] rounded-md overflow-hidden border border-white/5 group active:scale-[0.98] transition-all">
             <div className="grid grid-cols-2 aspect-[16/9] overflow-hidden">
                <div className="grid grid-rows-2">
                   <ProgressiveImage src={scenarios[0]?.mainPosterUrl} alt="1" />
                   <ProgressiveImage src={scenarios[1]?.mainPosterUrl} alt="2" />
                </div>
                <div className="grid grid-rows-2">
                   <ProgressiveImage src={scenarios[2]?.mainPosterUrl} alt="3" />
                   <ProgressiveImage src={scenarios[3]?.mainPosterUrl} alt="4" />
                </div>
             </div>
             <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                   <ListIcon className="w-4 h-4 text-[#888]" />
                   <span className="text-white text-xs font-bold uppercase tracking-widest">{t('list')}</span>
                </div>
                <h3 className="text-white font-bold text-lg mb-1 leading-tight group-hover:text-[#f5c518] transition-colors">{t('ourSummerGuide')}</h3>
                <p className="text-[#1c7ced] font-bold text-sm">{t('browseGuide')}</p>
             </div>
           </Link>
           {/* Card 2: Rankings */}
           <Link to="/top-rated" className="w-[85vw] sm:w-[400px] shrink-0 bg-[#121212] rounded-md overflow-hidden border border-white/5 group active:scale-[0.98] transition-all">
             <div className="aspect-[16/9] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                <ProgressiveImage src={scenarios[4]?.mainPosterUrl} alt="Ranking" />
             </div>
             <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                   <ListIcon className="w-4 h-4 text-[#888]" />
                   <span className="text-white text-xs font-bold uppercase tracking-widest">{t('list')}</span>
                </div>
                <h3 className="text-white font-bold text-lg mb-1 leading-tight group-hover:text-[#f5c518] transition-colors">{t('top25Adaptations')}</h3>
                <p className="text-[#1c7ced] font-bold text-sm">{t('seeRankings')}</p>
             </div>
           </Link>
        </div>
      </section>

      <SectionDivider />

      {/* Fan Favorites Section */}
      <section className="mb-10">
        <SectionHeader title={t('fanFavorites')} subTitle={t('fanFavoritesDesc')} link="/trending" />
        <div className="flex gap-4 overflow-x-auto no-scrollbar px-3 pb-4">
          {scenarios.slice(0, 10).map((scenario) => (
            <MovieCard key={scenario.id} scenario={scenario} watchlisted={watchlist.includes(scenario.id)} />
          ))}
        </div>
      </section>

      {/* 5. Most Popular Celebrities */}
      {celebrities.length > 0 && (
         <section className="mb-10">
           <SectionHeader title={t('popularCelebrities')} link="/characters" />
           <div className="px-3 flex gap-8 mb-4">
              <span className="text-[#f5c518] text-[10px] font-black uppercase tracking-[0.2em]">{t('topRising')}</span>
              <span className="text-[#888] text-[10px] font-black uppercase tracking-[0.2em] ml-auto">{t('byRanking')}</span>
           </div>
           <div className="flex gap-4 md:gap-8 overflow-x-auto no-scrollbar px-3 pb-6">
             {celebrities.map((celeb, idx) => (
                <Link to={`/character/${celeb.id}`} key={celeb.id} className="flex flex-col items-center gap-3 shrink-0 w-28 group cursor-pointer active:scale-95 transition-transform">
                  <div className="relative w-24 h-24 md:w-28 md:h-28">
                    <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/10 group-hover:border-[#f5c518] transition-all bg-[#222] shadow-xl">
                      <div className="w-full h-full flex items-center justify-center text-4xl font-black text-white/10 uppercase">
                        {celeb.playerName?.charAt(0)}
                      </div>
                    </div>
                    {/* Heart Icon in circle */}
                    <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:text-[#f5c518] transition-colors active:scale-90 cursor-pointer">
                      <Heart className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <h4 className="text-white font-bold text-sm group-hover:text-[#f5c518] transition-colors line-clamp-2">{celeb.playerName}</h4>
                  </div>
                </Link>
             ))}
           </div>
         </section>
      )}

      {/* 6. What to watch */}
      <section className="mb-10">
        <div className="px-3 mb-4">
           <h2 className="text-[#f5c518] text-xl font-black uppercase tracking-tight mb-0.5">{t('whatToWatch')}</h2>
           <Link to="/trailers" className="text-[#1c7ced] font-bold text-xs flex items-center gap-1 uppercase tracking-tight hover:underline">
              {t('moreRecommendations')}
              <ChevronRight className={cn("w-3.5 h-3.5", dir === 'rtl' ? "rotate-180" : "")} />
           </Link>
        </div>
        <SectionHeader title={t('fromWatchlist')} link="/watchlist" />
        <div className="px-3">
          {watchlistScenarios.length > 0 ? (
             <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
                {watchlistScenarios.map((scenario) => (
                  <SmallMovieCard key={scenario.id} scenario={scenario} watchlisted={true} />
                ))}
             </div>
          ) : (
            <div className="bg-[#121212] rounded-md border border-dashed border-white/10 p-10 flex flex-col items-center justify-center text-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-[#555]">
                 <Plus className="w-6 h-6" />
              </div>
              <p className="text-white font-bold text-sm leading-tight max-w-[200px]">{t('startExploring')}</p>
            </div>
          )}
        </div>
      </section>

      <SectionDivider />

      {/* 7. Top 10 on MTDb this week */}
      <section className="mb-10">
        <SectionHeader title={t('top10ThisWeek')} link="/trending" />
        <div className="px-3 flex flex-col gap-3">
           {scenarios.slice(0, 3).map((scenario, idx) => (
              <Top10Card key={scenario.id} scenario={scenario} rank={idx + 1} />
           ))}
           <Link to="/top-rated" className="block w-full mt-4">
              <button className="w-full bg-[#121212] py-3.5 rounded-full text-[#1c7ced] font-black uppercase tracking-widest text-xs hover:bg-white/5 transition-colors active:scale-95 shadow-lg border border-white/5">
                {t('seeAll')}
              </button>
           </Link>
        </div>
      </section>

      <SectionDivider />

      {/* 8. Extra sections placeholder like Born Today, News */}
      <section className="mb-20">
         <SectionHeader title={t('topNews')} link="/scenarios" />
         <div className="px-3 flex flex-col gap-6">
            {[1, 2, 3].map(i => (
              <Link to="/scenarios" key={i} className="flex gap-4 group cursor-pointer active:scale-95 transition-all">
                 <div className="w-20 h-20 md:w-32 md:h-32 shrink-0 bg-[#222] rounded-md overflow-hidden relative border border-white/5 shadow-inner">
                    <ProgressiveImage src={scenarios[i+5]?.mainPosterUrl} alt="News" className="opacity-40 group-hover:opacity-60 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center text-white/10 text-xl font-black italic">{t('news')}</div>
                 </div>
                 <div className="flex flex-col">
                    <h3 className="text-white font-bold text-sm md:text-lg group-hover:text-[#f5c518] mb-1 line-clamp-2 transition-colors">
                      {scenarios[i+6]?.title}: {t('storyDetailsRevealed')}
                    </h3>
                    <p className="text-[#888] text-xs md:text-sm mb-2 line-clamp-2 md:line-clamp-3">
                      {scenarios[i+6]?.description || t('latestIndustryInsights')}
                    </p>
                    <div className="mt-auto flex items-center gap-3 text-[10px] text-[#555] font-black uppercase tracking-widest">
                       <span>{new Date().toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric' })}</span>
                       <span className="w-1 h-1 bg-[#444] rounded-full" />
                       <span>{t('variety')}</span>
                    </div>
                 </div>
              </Link>
            ))}
         </div>
      </section>

      {/* 9. Floating Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button 
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-white text-black px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-2 active:scale-95 transition-transform"
          >
            <ChevronUp className="w-4 h-4" />
            {t('backToTop')}
          </motion.button>
        )}
      </AnimatePresence>

      <VideoModal 
        isOpen={isVideoModalOpen} 
        onClose={() => setIsVideoModalOpen(false)} 
        videoUrl="https://cdn.pixabay.com/video/2021/04/12/70851-537380903_large.mp4" 
      />
    </div>
  );
}

