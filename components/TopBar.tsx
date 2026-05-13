'use client';

import { useState, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Orbit, Globe, LogOut } from 'lucide-react';
import Link from 'next/link';

const locales = [
  { code: 'uk', label: 'UA', name: 'Українська' },
  { code: 'ru', label: 'RU', name: 'Русский' }
];

interface TopBarProps {
  onSignOut?: () => void;
  showSignOut?: boolean;
}

export function TopBar({ onSignOut, showSignOut = true }: TopBarProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const dropdownRefMenu = useRef<HTMLDivElement | null>(null);

  // Закрытие по клику вне компонента
  useEffect(() => {
    if (!isLangOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsLangOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLangOpen]);

  // Закрытие меню
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutsideMenu = (event: MouseEvent) => {
      if (
        dropdownRefMenu.current &&
        !dropdownRefMenu.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutsideMenu);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideMenu);
    };
  }, [isMenuOpen]);

  // Получаем путь без локали
  const getPathWithoutLocale = () => {
    const segments = pathname.split('/');
    if (locales.some(loc => loc.code === segments[1])) {
      segments.splice(1, 1);
    }
    return segments.join('/') || '/';
  };

  const handleLocaleChange = (newLocale: string) => {
    const pathWithoutLocale = getPathWithoutLocale();
    router.push(`/${newLocale}${pathWithoutLocale}`);
    setIsLangOpen(false);
  };

  const handleSignOut = async () => {
    setIsMenuOpen(false);

    if (onSignOut) {
      await onSignOut();
    }
  };

  const currentLocale = locales.find(loc => loc.code === locale) || locales[0];

  return (
    <nav className="px-12 py-4 flex justify-between items-center border-b border-border-light bg-white/50 backdrop-blur-sm sticky top-0 z-50">
      {/* Logo */}
      <Link href={`/${locale}`} className="flex items-center gap-3 group cursor-pointer">
        <Orbit className="absolute top-[20] w-34 h-34 text-gold" />
        <span className="tracking-ultra pl-10 text-[10px] uppercase font-bold text-text-muted group-hover:text-gold transition-colors">
          CELESTIAL SOUL
        </span>
      </Link>

      {/* Right side menu */}
      <div className="flex gap-8 items-center text-[11px] uppercase tracking-widest text-[#8D8478]">
        {/* Navigation links */}
        <Link href={`/${locale}`} className="hidden md:block hover:text-gold transition-colors">
          Philosophy
        </Link>
        <Link href={`/${locale}/archive`} className="hidden md:block hover:text-gold transition-colors">
          The Archive
        </Link>

        {/* Language Switcher */}
        <div className="relative">
          <div ref={dropdownRef}>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-2 p-2 border border-border rounded-full hover:bg-secondary transition-all"
            >
              <Globe className="w-4 h-4" />
              <span className="text-[10px] font-bold">{currentLocale.label}</span>
            </button>
          </div>
          <AnimatePresence>
            {isLangOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-40 bg-white rounded-2xl p-2 shadow-2xl border border-border z-50"
              >
                {locales.map((loc) => (
                  <button
                    key={loc.code}
                    onClick={() => handleLocaleChange(loc.code)}
                    className={`w-full text-left px-4 py-2 text-[10px] uppercase tracking-ultra rounded-xl transition-all ${locale === loc.code
                        ? 'bg-gold text-white font-bold'
                        : 'text-text hover:bg-secondary'
                      }`}
                  >
                    {loc.name}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User menu */}
        {showSignOut && (
          <div className="relative" ref={dropdownRefMenu}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 border border-border rounded-full hover:bg-secondary transition-all"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-4 w-48 bg-white rounded-2xl p-2 shadow-2xl border border-border z-50"
                >
                  <Link href={`/${locale}/dashboard`} className="w-full flex items-center gap-2 text-left px-4 py-2 text-[10px] uppercase cursor-pointer hover:bg-secondary rounded-xl transition-all font-bold">
                    <Orbit className=" w-[14px] h-[14px] text-gold" />
                    <span className="tracking-ultra pl-2 text-[10px] uppercase font-bold text-text-muted group-hover:text-gold transition-colors">
                      Dashboard
                    </span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 text-left px-4 py-2 text-[10px] uppercase tracking-ultra text-red-500 hover:bg-red-50 rounded-xl transition-all font-bold"
                  >
                    <LogOut className="w-3 h-3" />
                    Reset Journey
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </nav>
  );
}