import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { useI18n } from '@/contexts/I18nContext';

interface RatingBreakdownProps {
    scenarioId: string;
    totalVotes: number;
    breakdownData?: Record<string, number> | null;
}

export function RatingBreakdown({ scenarioId, totalVotes, breakdownData }: RatingBreakdownProps) {
    const [breakdown, setBreakdown] = useState<Record<string, number> | null>(breakdownData || null);
    const { t } = useI18n();

    useEffect(() => {
        if (breakdownData) {
            setBreakdown(breakdownData);
        } else {
            // Fallback: If not passed, fetch it, but this should be rare now
            const fetchBreakdown = async () => {
                try {
                    const response = await fetch(`https://dolabriform-fascinatedly-lecia.ngrok-free.dev/api/ratings/${scenarioId}`, {
                        headers: { 'ngrok-skip-browser-warning': 'true' }
                    });
                    const data = await response.json();
                    setBreakdown(data.ratingsBreakdown);
                } catch (err) {
                    console.error("Failed to fetch breakdown", err);
                }
            };
            fetchBreakdown();
        }
    }, [breakdownData, scenarioId]);

    if (!breakdown) return null;

    const values = Object.values(breakdown);
    const maxCount = Math.max(...(values as number[]), 1);

    return (
        <div className="flex flex-col gap-2 p-6 bg-mt-surface/30 rounded-3xl border border-mt-surface-hover/50 shadow-inner">
            <h3 className="text-xs font-black text-[#888] uppercase tracking-widest mb-2">{t('ratingDistribution')}</h3>
            { [5, 4, 3, 2, 1].map((stars) => {
                const count = breakdown[stars.toString()] || 0;
                const percentage = (count / (totalVotes || 1)) * 100;
                
                return (
                    <div key={stars} className="flex items-center gap-3 text-xs">
                        <span className="font-black text-white w-3">{stars}</span>
                        <div className="flex-1 h-3 bg-black/30 rounded-full overflow-hidden border border-mt-surface-hover">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-mt-primary"
                            />
                        </div>
                        <span className="font-bold text-[#AAA] w-12 text-right">{count}</span>
                    </div>
                );
            })}
            <div className="text-center mt-2 text-xs font-bold text-[#666]">
                {totalVotes} {t('totalVotes')}
            </div>
        </div>
    );
}
