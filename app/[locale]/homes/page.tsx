import { Topics } from '@/components/TopicsRight';
import { useTranslations } from 'next-intl';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from 'next-intl';

export default function HomesPage() {
    const t = useTranslations('Topics.homes');
    const locale = useLocale();
    return (
        <main className="min-h-screen p-8">
            <div className="flex-1 px-12 py-12 max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8 space-y-12">
                        <div className="lg:col-span-8 space-y-12">
                            <div className="bg-secondary p-10 rounded-[40px] relative overflow-hidden group border border-transparent">
                                <Sparkles className="absolute top-[-20px] right-[-20px] w-32 h-32 text-gold text-text-light/70 animate-pulse" />
                                <h3 className="text-3xl font-serif mt-2 mb-4 text-dark">{t.rich('title', {
                                    br: () => <br />
                                })}</h3>
                            </div>
                        </div>
                        <p className=" text-gray-600 font-sans">
                            {t.rich('p1', {
                                bold: (chunks) => <b>{chunks}</b>
                            })}
                        </p>
                        <p className=" text-gray-600 font-sans">
                            {t.rich('p2', {
                                bold: (chunks) => <b>{chunks}</b>
                            })}
                        </p>
                        <ul className="pl-2 text-gray-600 font-sans list-disc">
                            <li>{t.rich('list1.1', {
                                bold: (chunks) => <b>{chunks}</b>
                            })}</li>
                            <li>
                                <Link href={`/${locale}/ruling-planets`} className="flex items-center gap-3 group cursor-pointer inline-block-link">
                                <span className="font-bold text-text-muted group-hover:text-gold transition-colors">
                                    {t.rich('list1.linked', {
                                        bold: (chunks) => <b>{chunks}</b>
                                    })}
                                </span>
                            </Link>
                            &nbsp;
                            <span>
                                {t.rich('list1.2', {
                                bold: (chunks) => <b>{chunks}</b>
                            })}</span></li>
                            <li>{t.rich('list1.3', {
                                bold: (chunks) => <b>{chunks}</b>
                            })}</li>
                        </ul>
                        <p className=" text-gray-600 font-sans">
                            {t.rich('p3', {
                                bold: (chunks) => <b>{chunks}</b>
                            })}
                        </p>
                        <ul className="pl-2 text-gray-600 font-sans list-disc">
                            <li>{t.rich('list2.1', {
                                bold: (chunks) => <b>{chunks}</b>
                            })}</li>
                            <li>{t.rich('list2.2', {
                                bold: (chunks) => <b>{chunks}</b>
                            })}</li>
                            <li>{t.rich('list2.3', {
                                bold: (chunks) => <b>{chunks}</b>
                            })}</li>
                            <li>{t.rich('list2.4', {
                                bold: (chunks) => <b>{chunks}</b>
                            })}</li>
                        </ul>
                        <p className=" text-gray-600 font-sans">
                            {t.rich('p4', {
                                bold: (chunks) => <b>{chunks}</b>
                            })}
                        </p>
                        <p className=" text-gray-600 font-sans">
                            {t.rich('p5', {
                                bold: (chunks) => <b>{chunks}</b>
                            })}
                        </p>
                    </div>
                    <Topics />
                </div>
            </div>
        </main>
    );
}