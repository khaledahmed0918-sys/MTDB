import { Film, Download, Image as ImageIcon, Video, X, Filter, ThumbsUp, Heart } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { useScenarios } from "@/contexts/ScenariosContext";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { Edit } from "@/types";
import { LikeButton } from "@/components/LikeButton";

export function Edits() {
  const { t, dir } = useI18n();
  const { edits } = useScenarios();
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');
  const [selectedEdit, setSelectedEdit] = useState<Edit | null>(null);

  const filteredEdits = edits.filter(e => filter === 'all' || e.type === filter);

  const handleDownload = (url: string, title: string) => {
    // Basic download helper
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${title.replace(/\s+/g, '_').toLowerCase()}`;
    anchor.target = '_blank';
    anchor.click();
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 ease-out fill-mode-both pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 px-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 group/title w-fit">
            <div className="w-1 md:w-1.5 h-6 md:h-8 bg-[#f5c518]" />
            <h1 className="text-xl md:text-3xl font-black text-white uppercase tracking-tight">
              {t('edits')}
            </h1>
          </div>
          <p className="text-[#888] text-[10px] font-black uppercase tracking-[0.2em]">{t('communityCreations') || 'Explore community-made cinematic content'}</p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-white/5 rounded-xl border border-white/5 overflow-x-auto no-scrollbar shadow-inner">
          {(['all', 'image', 'video'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
                filter === f ? "bg-[#f5c518] text-black" : "text-[#888] hover:text-white"
              )}
            >
              {f === 'all' ? t('all') : f === 'image' ? t('images') : t('videos')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 px-3">
        {filteredEdits.map((edit, index) => (
          <motion.div
            key={edit.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group flex flex-col bg-[#0f0f0f] rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-all shadow-2xl active:scale-[0.98]"
          >
            <div 
              onClick={() => setSelectedEdit(edit)}
              className="relative aspect-square cursor-pointer overflow-hidden group/media"
            >
              <ProgressiveImage 
                src={edit.thumbnailUrl || edit.url} 
                alt={edit.title} 
                className="group-hover/media:scale-110 transition-transform duration-700 h-full w-full object-cover" 
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/media:opacity-100 transition-opacity flex items-center justify-center">
                 <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <Film className="w-6 h-6 text-white" />
                 </div>
              </div>
              <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[8px] font-black uppercase tracking-widest border border-white/10 text-white flex items-center gap-1.5 shadow-xl">
                 {edit.type === 'video' ? <Video className="w-2.5 h-2.5" /> : <ImageIcon className="w-2.5 h-2.5" />}
                 {edit.type}
              </div>
            </div>
            
            <div className="p-4 pt-3 flex flex-col gap-3">
              <h3 className="text-sm font-black text-white line-clamp-1 group-hover:text-[#f5c518] transition-colors">{edit.title}</h3>
              <div className="flex items-center justify-between">
                <LikeButton id={edit.id} type="design" />
                <button className="text-[#888] hover:text-white transition-colors" onClick={() => handleDownload(edit.url, edit.title)}>
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal Popup */}
      <AnimatePresence>
        {selectedEdit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-black/95 backdrop-blur-2xl"
            onClick={() => setSelectedEdit(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl max-h-full bg-[#121212] rounded-3xl overflow-hidden border border-white/10 flex flex-col md:flex-row shadow-[0_0_100px_rgba(245,197,24,0.15)]"
            >
              {/* Media Container */}
              <div className="flex-1 bg-black flex items-center justify-center relative min-h-[300px]">
                {selectedEdit.type === 'video' ? (
                  <video 
                    src={selectedEdit.url} 
                    controls 
                    autoPlay 
                    className="max-w-full max-h-full"
                  />
                ) : (
                  <img 
                    src={selectedEdit.url} 
                    alt={selectedEdit.title} 
                    className="max-w-full max-h-full object-contain" 
                  />
                )}
                
                <button 
                  onClick={() => setSelectedEdit(null)}
                  className="absolute top-6 right-6 p-3 bg-black/60 hover:bg-mt-primary rounded-full text-white transition-all z-10"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Info Container */}
              <div className="w-full md:w-80 p-8 flex flex-col border-l border-white/10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="px-2.5 py-1 bg-mt-primary/10 text-mt-primary rounded text-[10px] font-black uppercase tracking-widest border border-mt-primary/20 flex items-center gap-1.5">
                    {selectedEdit.type === 'video' ? <Video className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                    {selectedEdit.type}
                  </div>
                  {selectedEdit.category && (
                    <div className="px-2.5 py-1 bg-white/5 text-[#888] rounded text-[10px] font-black uppercase tracking-widest border border-white/10">
                      {selectedEdit.category}
                    </div>
                  )}
                </div>

                <h2 className="text-2xl font-black text-white leading-tight mb-2 uppercase tracking-tighter">{selectedEdit.title}</h2>
                <div className="flex items-center gap-3 mb-6">
                   <LikeButton id={selectedEdit.id} type="design" className="px-6 py-2" />
                </div>

                <div className="mt-auto flex flex-col gap-3">
                  <button
                    onClick={() => handleDownload(selectedEdit.url, selectedEdit.title)}
                    className="flex items-center justify-center gap-3 w-full bg-mt-primary border border-mt-primary hover:bg-transparent hover:text-mt-primary text-black font-black uppercase tracking-widest py-4 rounded-xl transition-all active:scale-95 shadow-xl"
                  >
                    <Download className="w-5 h-5" />
                    {selectedEdit.type === 'video' ? t('downloadVideo') : t('downloadImage')}
                  </button>
                  
                  {selectedEdit.projectUrl && (
                    <button
                      onClick={() => handleDownload(selectedEdit.projectUrl!, `${selectedEdit.title}_project`)}
                      className="flex items-center justify-center gap-3 w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black uppercase tracking-widest py-4 rounded-xl transition-all active:scale-95"
                    >
                      <Download className="w-5 h-5 text-mt-primary" />
                      {t('downloadProject')}
                    </button>
                  )}

                  <p className="text-[10px] text-center text-[#555] font-bold uppercase tracking-widest mt-2">
                    {t('freeForPersonalUse')}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
