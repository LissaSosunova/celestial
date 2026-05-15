import { Topics } from '@/components/TopicsRight';
import { useTranslations } from 'next-intl';
import { Sun } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from 'next-intl';

export default function PhilosophyPage() {
    const t = useTranslations('Philosophy');
    const locale = useLocale();
    return (
        <main className="min-h-screen p-4 md:p-8">
            <div className="flex-1 px-4 py-4 md:px-12 md:py-12 max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8 space-y-4">
                        <div className="lg:col-span-8 space-y-3 mb-5">
                            <div className="shadow-sm bg-secondary p-4 md:p-10 pl-12 rounded-[20px] md:rounded-[40px] relative overflow-hidden group border border-transparent">
                                <Sun className="absolute top-[-10px] right-[-10px] md:top-[-20px] md:right-[-20px] w-12 h-12 md:w-32 md:h-32 text-gold text-text-light/70 animate-pulse" />
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
                        <div className="shadow-sm bg-secondary mb-5 mt-5 p-2 md:p-5 pl-12 rounded-[10px] md:rounded-[20px] relative overflow-hidden group border border-transparent">
                            <h3 className="text-md md:text-xl font-serif text-dark italic">
                                {t.rich('title2', {
                                    bold: (chunks) => <b>{chunks}</b>,
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
                        <ul className="pl-4 text-gray-600 font-sans list-disc">
                            <li>{t.rich('list1.1', {
                                bold: (chunks) => <b>{chunks}</b>
                            })}</li>
                            <li>{t.rich('list1.2', {
                                bold: (chunks) => <b>{chunks}</b>
                            })}</li>
                            <li>{t.rich('list1.3', {
                                bold: (chunks) => <b>{chunks}</b>
                            })}</li>
                            <li>{t.rich('list1.4', {
                                bold: (chunks) => <b>{chunks}</b>
                            })}</li>
                        </ul>
                        <p className="text-gray-600 font-sans">
                            {t.rich('p71', {
                                bold: (chunks) => <b>{chunks}</b>,
                                br: () => <br />
                            })}
                        </p>
                        <div className="shadow-sm bg-secondary mb-5 mt-5 p-2 md:p-5 pl-12 rounded-[10px] md:rounded-[20px] relative overflow-hidden group border border-transparent">
                            <h3 className="text-md md:text-xl font-serif text-dark italic">
                                {t.rich('title3', {
                                    bold: (chunks) => <b>{chunks}</b>,
                                    br: () => <br />
                                })}
                            </h3>
                        </div>
                        <p className="text-gray-600 font-sans">
                            {t.rich('p8', {
                                bold: (chunks) => <b>{chunks}</b>,
                                br: () => <br />
                            })}
                        </p>
                        <p className="text-gray-600 font-sans">
                            {t.rich('p9', {
                                bold: (chunks) => <b>{chunks}</b>,
                                br: () => <br />
                            })}
                        </p>
                        <p className="text-gray-600 font-sans">
                            {t.rich('p10', {
                                bold: (chunks) => <b>{chunks}</b>,
                                br: () => <br />
                            })}
                        </p>
                        <p className="text-gray-600 font-sans">
                            {t.rich('p11', {
                                bold: (chunks) => <b>{chunks}</b>,
                                br: () => <br />
                            })}
                        </p>
                        <p className="text-gray-600 font-sans">
                            {t.rich('p12', {
                                bold: (chunks) => <b>{chunks}</b>,
                                br: () => <br />
                            })}
                        </p>
                        <div className="shadow-sm bg-secondary mb-5 mt-5 p-2 md:p-5 pl-12 rounded-[10px] md:rounded-[20px] relative overflow-hidden group border border-transparent">
                            <h3 className="text-md md:text-xl font-serif text-dark italic">
                                {t.rich('title4', {
                                    bold: (chunks) => <b>{chunks}</b>,
                                    br: () => <br />
                                })}
                            </h3>
                        </div>
                        <p className="text-gray-600 font-sans">
                            {t.rich('p13', {
                                bold: (chunks) => <b>{chunks}</b>,
                                br: () => <br />
                            })}
                        </p>
                        <div className="shadow-sm bg-secondary mb-5 mt-5 p-2 md:p-5 pl-12 rounded-[10px] md:rounded-[20px] relative overflow-hidden group border border-transparent">
                            <h3 className="text-md md:text-xl font-serif text-dark italic">
                                {t.rich('title5', {
                                    bold: (chunks) => <b>{chunks}</b>,
                                    br: () => <br />
                                })}
                            </h3>
                        </div>
                        <ul className="pl-4 text-gray-600 font-sans list-disc">
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
                            <li>{t.rich('list2.5', {
                                bold: (chunks) => <b>{chunks}</b>
                            })}</li>
                        </ul>
                        <div className="shadow-sm bg-secondary mb-5 mt-5 p-2 md:p-5 pl-12 rounded-[10px] md:rounded-[20px] relative overflow-hidden group border border-transparent">
                            <h3 className="text-md md:text-xl font-serif text-dark italic">
                                {t.rich('title6', {
                                    bold: (chunks) => <b>{chunks}</b>,
                                    br: () => <br />
                                })}
                            </h3>
                        </div>
                        <ul className="pl-4 text-gray-600 font-sans">
                            <li>❌ {t.rich('list3.1', {
                                bold: (chunks) => <b>{chunks}</b>
                            })}</li>
                            <li>❌ {t.rich('list3.2', {
                                bold: (chunks) => <b>{chunks}</b>
                            })}</li>
                            <li>❌ {t.rich('list3.3', {
                                bold: (chunks) => <b>{chunks}</b>
                            })}</li>
                        </ul>
                        <p className="text-gray-600 font-sans">
                            {t.rich('p14', {
                                bold: (chunks) => <b>{chunks}</b>,
                                br: () => <br />
                            })}
                        </p>
                        <div className="shadow-sm bg-secondary mb-5 mt-5 p-2 md:p-5 pl-12 rounded-[10px] md:rounded-[20px] relative overflow-hidden group border border-transparent">
                            <h3 className="text-md md:text-xl font-serif text-dark italic">
                                {t.rich('title7', {
                                    bold: (chunks) => <b>{chunks}</b>,
                                    br: () => <br />
                                })}
                            </h3>
                        </div>
                        <ul className="pl-4 text-gray-600 font-sans">
                            <li>✅ {t.rich('list4.1', {
                                bold: (chunks) => <b>{chunks}</b>
                            })}</li>
                            <li>✅ {t.rich('list4.2', {
                                bold: (chunks) => <b>{chunks}</b>
                            })}</li>
                            <li>✅ {t.rich('list4.3', {
                                bold: (chunks) => <b>{chunks}</b>
                            })}</li>
                            <li>✅ {t.rich('list4.4', {
                                bold: (chunks) => <b>{chunks}</b>
                            })}</li>
                            <li>✅ {t.rich('list4.5', {
                                bold: (chunks) => <b>{chunks}</b>
                            })}</li>
                        </ul>
                        <div className="shadow-sm bg-secondary mb-5 mt-5 p-2 md:p-5 pl-12 rounded-[10px] md:rounded-[20px] relative overflow-hidden group border border-transparent">
                            <h3 className="text-md md:text-xl font-serif text-dark italic">
                                {t.rich('title8', {
                                    bold: (chunks) => <b>{chunks}</b>,
                                    br: () => <br />
                                })}
                            </h3>
                        </div>
                        <p className="text-gray-600 font-sans">
                            {t.rich('p15', {
                                bold: (chunks) => <b>{chunks}</b>,
                                br: () => <br />
                            })}
                        </p>
                        <p className="text-gray-600 font-sans">
                            {t.rich('p16', {
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