'use client';

import { useState, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Orbit, Globe, LogOut, Stone, GalleryHorizontalEnd } from 'lucide-react';
import Link from 'next/link';

interface FooterProps {
    onSignOut?: () => void;
    showSignOut?: boolean;
}

export function Footer({ onSignOut, showSignOut = true }: FooterProps) {
    const locale = useLocale();

    return (
        <footer className="px--8 md:px-12 py-8 border-t border-border-light flex flex-col md:flex-row justify-between items-start md:items-center text-[10px] uppercase tracking-ultra text-text-light">
            <div className="flex gap-8 items-start md:items-center text-[11px] uppercase tracking-widest text-[#8D8478]">
                {/* User menu */}
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="flex flex-row mt-4 w-auto p-2">
                        {showSignOut && (
                            <Link
                                href={`/${locale}/dashboard`}
                                className="w-full flex items-center gap-2 text-left px-4 py-2 text-[10px] uppercase cursor-pointer hover:bg-secondary rounded-xl transition-all font-bold">
                                <Orbit className=" w-[24px] h-[24px] text-gold" />
                                <span className="tracking-ultra pl-2 text-[10px] uppercase font-bold text-text-muted group-hover:text-gold transition-colors">
                                    Dashboard
                                </span>
                            </Link>
                        )}
                        <Link
                            href={`/${locale}/philosophy`}
                            className="w-full flex items-center gap-2 text-left px-4 py-2 text-[10px] uppercase cursor-pointer hover:bg-secondary rounded-xl transition-all font-bold">
                            <Stone className=" w-[24px] h-[24px] text-gold" />
                            <span className="tracking-ultra pl-2 text-[10px] uppercase font-bold text-text-muted group-hover:text-gold transition-colors">
                                Philosophy
                            </span>
                        </Link>
                    </motion.div>
                </AnimatePresence>
            </div>
            <div className="flex flex-col md:flex-row gap-2 items-start md:items-center px-6">
                <Link href={`/${locale}`} className="flex items-center gap-3 group cursor-pointer">
                    <Orbit className="absolute top-[20] w-34 h-34 text-gold" />
                    <span className="tracking-ultra pl-10 text-[10px] uppercase font-bold text-text-muted group-hover:text-gold transition-colors">
                        CELESTIAL SOUL
                    </span>
                </Link>
                <span className='ml-10'>CELESTIAL SOUL © 2026</span>
            </div>
        </footer>

    );
}