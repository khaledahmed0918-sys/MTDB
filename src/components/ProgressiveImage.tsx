import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  skipPulse?: boolean;
}

export const ProgressiveImage = ({ src, alt, className, skipPulse }: ProgressiveImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { t } = useI18n();

  return (
    <div className={cn("relative overflow-hidden w-full h-full bg-mt-surface-hover/30", className, skipPulse || isLoaded || hasError ? "" : "animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]")}>
      {/* Loading animation layer */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-tr from-mt-surface to-mt-surface-hover">
          <div className="w-8 h-8 rounded-full border-2 border-mt-primary/20 border-t-mt-primary animate-spin"></div>
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-mt-surface-hover text-[#555]">
          <span className="text-xs font-bold uppercase tracking-widest text-[#666]">{t('offline')}</span>
        </div>
      )}
      
      {!hasError && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-1000",
            className,
            isLoaded ? "opacity-100" : "opacity-0"
          )}
        />
      )}
    </div>
  );
};
