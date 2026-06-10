'use client';

import { motion } from 'framer-motion';
import { type PackageProps } from '@/lib/types/package';
import { Sparkles, Sun, Moon, Star, ArrowBigRightDash, Webhook } from 'lucide-react';
import { useTranslations } from 'next-intl';

const iconMap = {
    Sparkles: Sparkles,
    Sun: Sun,
    Moon: Moon,
    Star: Star,
    ArrowBigRightDash: ArrowBigRightDash,
    Webhook: Webhook
} as const;

type IconKey = keyof typeof iconMap;

function DynamicIcon({ name, className }: { name: string; className?: string }) {
    const IconComponent = iconMap[name as IconKey];

    if (!IconComponent) {
        console.warn(`Icon "${name}" not found`);
        return null;
    }

    return <IconComponent className={className} />;
}

export function PackageItem({ packageItem, index, onClick, isCutted = false }: PackageProps) {
    const t = useTranslations('packages');
    const packageKey = packageItem.slug;
    return (
        <>
            {!isCutted && (
                <motion.div
                    whileHover={{ y: -6, scale: 1.01 }}
                    onClick={onClick}
                    className="bg-white border border-border-light p-4 lg:p-10 md:p-8 rounded-[20px] md:rounded-[40px] hover:border-gold transition-all cursor-pointer group shadow-sm flex flex-col"
                >
                    <div className="flex flex-row items-center gap-4 mb-8">
                        <div className="w-6 min-w-6 h-6 md:w-10 md:min-w-10 md:h-10 rounded-full bg-secondary flex items-center text-gold justify-center group-hover:bg-gold group-hover:text-white transition-colors">
                            <DynamicIcon name={packageItem.icon} className="w-4 h-4" />
                        </div>
                        <h3 className="text-lg font-serif text-dark">
                            {t(`${packageKey}.name`)}
                        </h3>
                    </div>

                    <div className="flex flex-col flex-1">
                        <p className="text-sm text-text-muted leading-relaxed mb-8">
                            {t(`${packageKey}.description`)}
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-auto">
                            {packageItem.isFreePart && (
                                <>
                                    <div>
                                        {t(`short`)}
                                    </div><div className="text-lg font-bold text-dark font-sans">
                                        ₴0
                                    </div>
                                </>
                            )}
                            <div>
                                {t(`full`)}
                            </div>
                            <div className="text-lg font-bold text-dark font-sans">
                                ₴{packageItem.price}
                            </div>
                        </div>
                        <button
                            onClick={onClick}
                            className="mt-4 w-full p-4 md:p-6 border border-border rounded-full text-[10px] uppercase tracking-ultra font-extrabold bg-secondary text-gold group-hover:bg-gold group-hover:text-white transition-all"
                        >
                            {t(`select`)}
                        </button>
                    </div>
                </motion.div>
            )}
            {isCutted && (
                <motion.div
                    whileHover={{ y: -6, scale: 1.01 }}
                    onClick={onClick}
                    className="flex flex-row gap-3 justify-between items-center cursor-pointer border border-border-light p-4 lg:p-6 md:p-4 rounded-[10px] md:rounded-[20px] bg-secondary text-dark hover:bg-gold group-hover:text-white hover:text-white transition-all shadow-sm"
                >
                    <div className="text-md font-semibold hover:text-white">
                        {t(`${packageKey}.name`)}
                    </div>
                    <DynamicIcon name={'ArrowBigRightDash'} className="w-6 h-6" />
                </motion.div>
            )}
        </>
    );
}