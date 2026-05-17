'use client';

import { Moon, Sun, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

export function Topics() {
    const t = useTranslations('Home');
    const router = useRouter();
    const artList = useMemo(() => [
        { title: t('a3'), desc: t('d3'), date: 'Process', icon: Sun, link: "philosophy"},
        { title: t('a1'), desc: t('d1'), date: 'Archive', icon: Sparkles, link: "homes" },
        { title: t('a2'), desc: t('d2'), date: 'Active', icon: Moon, link: "ruling-planets" }
    ], [t]);
    const loadTopic = (topic: string) => {
        router.push(`/${topic}`);
    }

    return (
        <>
            <div className="lg:col-span-4">
                <div className="bg-white border border-border-light p-4 lg:p-10 md:p-8 rounded-[20px] md:rounded-[40px] shadow-sm sticky top-32">
                    <h4 className="font-serif text-2xl mb-4 md:mb-8 text-dark">{t('articles')}</h4>
                    <div className="space-y-6">
                        {artList.map((item, i) => {
                            const IconComponent = item.icon;
                            return (
                                <div key={i} className="flex gap-2 md:gap-4 items-center group cursor-pointer" onClick={() =>loadTopic(item.link)}>
                                    <div className="w-6 min-w-6 h-6 md:w-10 md:min-w-10 md:h-10 rounded-full bg-secondary flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-colors">
                                        <IconComponent className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-text">{item.title}</div>
                                        <div className="text-[10px] uppercase tracking-ultra text-text-muted font-bold mt-1">{item.desc}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <p className="mt-12 text-[11px] italic text-text-muted leading-relaxed border-t border-border-light pt-8">
                        {t('descr')}
                    </p>
                </div>
            </div>
        </>
    )
}