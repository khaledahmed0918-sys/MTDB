import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Heart } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { useScenarios } from "@/contexts/ScenariosContext";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import { MovieCard } from "./Home";
import { cn } from "@/lib/utils";
import { LikeButton } from "@/components/LikeButton";

export function CharacterDetails() {
  const { id } = useParams();
  const { scenarios, watchlist, loading } = useScenarios();
  const { t, dir } = useI18n();
  const navigate = useNavigate();

  // Find the base character info
  const baseCharacter = useMemo(() => {
    for (const s of scenarios) {
      const c = s.cast?.find(cast => cast.id === id);
      if (c) return c;
    }
    return null;
  }, [scenarios, id]);

  const playerName = baseCharacter?.playerName;

  // Find all scenarios this player has participated in
  const participatedScenarios = useMemo(() => {
    if (!playerName) return [];
    return scenarios.filter(s => s.cast?.some(c => c.playerName === playerName));
  }, [scenarios, playerName]);

  const allCharacterRoles = useMemo(() => {
    if (!playerName) return [];
    const roles: string[] = [];
    scenarios.forEach(s => {
      s.cast?.forEach(c => {
        if (c.playerName === playerName && c.characterName && !roles.includes(c.characterName)) {
          roles.push(c.characterName);
        }
      });
    });
    return roles;
  }, [scenarios, playerName]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
        <div className="animate-pulse w-32 h-32 bg-white/10 rounded-full mb-4"></div>
        <div className="animate-pulse h-6 w-48 bg-white/10 rounded"></div>
      </div>
    );
  }

  if (!baseCharacter) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-3xl font-black mb-4 uppercase tracking-widest text-[#f5c518]">{t('characterNotFound')}</h2>
        <button onClick={() => navigate(-1)} className="text-white hover:text-[#f5c518] transition-colors">{t('return')}</button>
      </div>
    );
  }

  return (
    <div className="pb-24 animate-in fade-in duration-700 ease-out fill-mode-both px-4 md:px-8 lg:px-12 max-w-[1600px] mx-auto mt-4 md:mt-8">
      <button onClick={() => navigate(-1)} className={cn("inline-flex items-center gap-2 text-[#888] hover:text-white transition-colors mb-8 font-bold uppercase tracking-widest text-xs", dir === 'rtl' ? "mr-2" : "ml-2")}>
        {dir === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
        {t('return')}
      </button>

      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-16">
        <div className="w-48 h-48 md:w-64 md:h-64 shrink-0 rounded-full overflow-hidden border-4 border-mt-primary bg-[#111] shadow-2xl relative">
          <ProgressiveImage src={baseCharacter.avatarUrl} alt={baseCharacter.playerName} className="w-full h-full object-cover" />
        </div>
        
        <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1 min-w-0">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-2 drop-shadow-lg">{baseCharacter.playerName}</h1>
          <p className="text-xl text-[#f5c518] font-bold uppercase tracking-widest mb-6">
            {allCharacterRoles.join(' • ')}
          </p>
          
          <div className="flex bg-[#111] border border-white/10 rounded-2xl p-6 shadow-xl w-full max-w-md items-center justify-between">
             <div className="flex flex-col">
                <span className="text-[#888] text-xs font-black uppercase tracking-widest mb-1">{t('totalLikes') || 'TOTAL LIKES'}</span>
                <LikeButton id={baseCharacter.id} type="character" className="px-5 py-2 scale-110 origin-left" />
             </div>
             <div className="w-16 h-16 rounded-full bg-mt-primary/10 flex items-center justify-center">
                <Heart className="w-8 h-8 text-mt-primary fill-mt-primary" />
             </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-2 h-8 bg-mt-primary rounded-full shadow-[0_0_15px_rgba(245,197,24,0.5)]"></div>
          <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">{t('filmography') || 'FILMOGRAPHY'}</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {participatedScenarios.map(s => (
            <MovieCard key={s.id} scenario={s} watchlisted={watchlist.includes(s.id)} className="w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
