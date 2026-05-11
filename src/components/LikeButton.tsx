import React, { useState, useEffect } from "react";
import { ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/contexts/I18nContext";
import { toast } from "sonner";

interface LikeButtonProps {
  id: string;
  type: 'trailer' | 'character' | 'scenario' | 'design';
  className?: string;
  showCount?: boolean;
  onLikeChange?: (count: number) => void;
}

export function LikeButton({ id, type, className, showCount = true, onLikeChange }: LikeButtonProps) {
  const [likes, setLikes] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { t } = useI18n();

  const storageKey = `liked_${type}_${id}`;

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await fetch(`https://dolabriform-fascinatedly-lecia.ngrok-free.dev/api/likes/${type}/${id}`, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        const data = await response.json();
        setLikes(data.likes || 0);
        if (onLikeChange) onLikeChange(data.likes || 0);
      } catch (err) {
        console.error(`Failed to fetch likes for ${type} ${id}:`, err);
      } finally {
        setIsLoading(false);
      }
    };

    setIsLiked(localStorage.getItem(storageKey) === 'true');
    fetchLikes();
  }, [id, type]);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikes(prev => newIsLiked ? prev + 1 : Math.max(0, prev - 1));
    localStorage.setItem(storageKey, newIsLiked.toString());

    try {
      const action = newIsLiked ? 'add' : 'remove';
      const response = await fetch(`https://dolabriform-fascinatedly-lecia.ngrok-free.dev/api/likes/${action}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ type, id })
      });
      
      if (!response.ok) throw new Error('Failed to update likes');
      const data = await response.json();
      setLikes(data.likes);
      if (onLikeChange) onLikeChange(data.likes);
    } catch (err) {
      // Revert if failed
      setIsLiked(!newIsLiked);
      setLikes(prev => !newIsLiked ? prev + 1 : Math.max(0, prev - 1));
      localStorage.setItem(storageKey, (!newIsLiked).toString());
      toast.error(t('connectionFailed'));
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full transition-all active:scale-95",
        isLiked 
          ? "bg-[#f5c518]/20 border border-[#f5c518]/50 text-[#f5c518]" 
          : "bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10",
        className
      )}
    >
      <ThumbsUp className={cn("w-4 h-4", isLiked && "fill-current")} />
      {showCount && (
        <span className="text-xs font-black">
          {likes.toLocaleString()}
        </span>
      )}
    </button>
  );
}
