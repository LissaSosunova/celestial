import { Topics } from '@/components/TopicsRight';
import { useTranslations } from 'next-intl';
import { Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from 'next-intl';

export default function PhilosophyPage() {
    const t = useTranslations('Philosophy');
    const locale = useLocale();
    return (
        <main className="min-h-screen p-4 md:p-8">
            <div className="flex-1 px-4 py-4 md:px-12 md:py-12 max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8 space-y-12">
                        <div className="lg:col-span-8 space-y-12">
                            <div className="bg-secondary p-4 md:p-10 pl-12 rounded-[40px] relative overflow-hidden group border border-transparent">
                                <Moon className="absolute top-[-10px] right-[-10px] md:top-[-20px] md:right-[-20px] w-12 h-12 md:w-32 md:h-32 text-gold text-text-light/70 animate-pulse" />
                                <h3 className="text-2xl md:text-3xl font-serif mt-2 mb-4 text-dark">
                                    {t.rich('title', {
                                        br: () => <br />
                                    })}
                                </h3>
                            </div>
                        </div>
                        <p className="text-gray-600 font-sans">
                            {t.rich('p1', {
                                bold: (chunks) => <b>{chunks}</b>,
                                br: () => <br />
                            })}
                        </p>
                        <p className="text-gray-600 font-sans">
                            {t.rich('p2', {
                                bold: (chunks) => <b>{chunks}</b>,
                                br: () => <br />
                            })}
                        </p>
                        <p className="text-gray-600 font-sans">
                            {t.rich('p3', {
                                bold: (chunks) => <b>{chunks}</b>,
                                br: () => <br />
                            })}
                        </p>
                        <div className="bg-secondary p-4 md:p-10 pl-12 rounded-[40px] relative overflow-hidden group border border-transparent">
                            <Sun className="absolute top-[-10px] right-[-10px] md:top-[-20px] md:right-[-20px] w-12 h-12 md:w-32 md:h-32 text-gold text-text-light/70 animate-pulse" />
                            <h3 className="text-2xl md:text-3xl font-serif mt-2 mb-4 text-dark">
                                {t.rich('title2', {
                                    br: () => <br />
                                })}
                            </h3>
                        </div>
                        <p className="text-gray-600 font-sans">
                            {t.rich('p4', {
                                bold: (chunks) => <b>{chunks}</b>,
                                br: () => <br />
                            })}
                        </p>
                        <p className="text-gray-600 font-sans">
                            {t.rich('p5', {
                                bold: (chunks) => <b>{chunks}</b>,
                                br: () => <br />
                            })}
                        </p>
                        <p className="text-gray-600 font-sans">
                            {t.rich('p6', {
                                bold: (chunks) => <b>{chunks}</b>,
                                br: () => <br />
                            })}
                        </p>
                        <p className="text-gray-600 font-sans">
                            {t.rich('p7', {
                                bold: (chunks) => <b>{chunks}</b>,
                                br: () => <br />
                            })}
                        </p>
                    </div>
                    <Topics />
                </div>
            </div>
        </main>
    );
}