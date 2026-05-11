import { useState } from "react";
import { useScenarios } from "@/contexts/ScenariosContext";
import { useI18n } from "@/contexts/I18nContext";
import { Play, ChevronLeft, Star, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import { VideoModal } from "@/components/VideoModal";

export default function Trailers() {
  const { scenarios } = useScenarios();
  const { t, dir } = useI18n();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");

  const handlePlay = (videoUrl: string) => {
    setCurrentVideoUrl(videoUrl);
    setIsVideoModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-black pb-24 pt-4 px-4 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/" className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-95">
          <ChevronLeft className={cn("w-6 h-6 text-white", dir === 'rtl' ? "rotate-180" : "")} />
        </Link>
        <h1 className="text-2xl font-black text-white uppercase tracking-tight">{t('trailers')}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {scenarios.map((scenario) => (
          <div key={scenario.id} className="group flex flex-col bg-[#121212] rounded-md overflow-hidden border border-white/5 shadow-2xl transition-all active:scale-[0.98]">
            <div className="relative aspect-video bg-black overflow-hidden group/item cursor-pointer" onClick={() => handlePlay(scenario.episodes?.[0]?.videoLink || "")}>
              <ProgressiveImage 
                src={scenario.episodes?.[0]?.posterUrl || scenario.mainPosterUrl} 
                alt={scenario.title} 
                className="group-hover:scale-105 transition-transform duration-700 h-full w-full object-cover opacity-70 group-hover:opacity-100" 
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-md border border-white/30 text-white flex items-center justify-center hover:scale-110 hover:bg-[#f5c518] hover:text-black transition-all group-hover/item:border-[#f5c518] shadow-2xl">
                  <Play className={cn("w-8 h-8 fill-current", dir === 'rtl' ? "rotate-0 mr-1" : "ml-1")} />
                </div>
              </div>
              <div className="absolute bottom-3 right-3 bg-black/80 px-2.5 py-1 rounded text-xs font-black text-white border border-white/20 shadow-lg">{scenario.duration || '2:30'}</div>
            </div>
            
            <div className="p-4">
              <Link to={`/scenario/${scenario.id}`} className="block mb-2">
                <h3 className="text-white font-black text-lg group-hover:text-[#f5c518] transition-colors line-clamp-1">{scenario.title}</h3>
              </Link>
              <div className="flex items-center gap-4 text-[#888] text-xs font-bold uppercase tracking-widest">
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-[#f5c518] fill-[#f5c518]" />
                  {scenario.overallRating?.toFixed(1)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {scenario.releaseYear || '2024'}
                </span>
              </div>
              <p className="mt-3 text-[#666] text-xs line-clamp-2 leading-relaxed">
                {scenario.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <VideoModal 
        isOpen={isVideoModalOpen} 
        onClose={() => setIsVideoModalOpen(false)} 
        videoUrl={currentVideoUrl} 
      />
    </div>
  );
}
