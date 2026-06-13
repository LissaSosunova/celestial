'use client';

import { useState, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Orbit, Globe, LogOut, LogIn, User, Package, BookOpen, Library } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/lib/contexts/UserProfileProvider';
import { useTranslations } from 'next-intl';

const locales = [
  { code: 'uk', label: 'UA', name: 'Українська' },
  { code: 'ru', label: 'RU', name: 'Русский' },
  { code: 'en', label: 'EN', name: 'English' }
];

interface MenuItem {
  href: string;
  icon: React.ReactNode;
  label: string;
  showWhenAuthenticated?: boolean;
  showWhenPublic?: boolean;
}

export function TopBar() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, signOut } = useUser();
  const t = useTranslations('topBar');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const dropdownRefMenu = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isLangOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isLangOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutsideMenu = (event: MouseEvent) => {
      if (dropdownRefMenu.current && !dropdownRefMenu.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutsideMenu);
    return () => document.removeEventListener('mousedown', handleClickOutsideMenu);
  }, [isMenuOpen]);

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
    await signOut();
  };

  const currentLocale = locales.find(loc => loc.code === locale) || locales[0];

  const mainMenuItems: MenuItem[] = [
    {
      href: `/${locale}/philosophy`,
      icon: <BookOpen className="w-[14px] h-[14px]" />,
      label: t('Philosophy'),
      showWhenPublic: true,
    },
    {
      href: `/${locale}/packages`,
      icon: <Package className="w-[14px] h-[14px]" />,
      label: t('Packages'),
      showWhenPublic: true,
    },
    {
      href: `/${locale}/dashboard`,
      icon: <User className="w-[14px] h-[14px]" />,
      label: t('Dashboard'),
      showWhenAuthenticated: true,
    },
    {
      href: `/${locale}/archive`,
      icon: <Library className="w-[14px] h-[14px]" />,
      label: t('The Archive'),
      showWhenAuthenticated: true,
    },
  ];

  const filteredMenuItems = mainMenuItems.filter(item => {
    if (isAuthenticated) {
      return true;
    } else {
      return item.showWhenPublic === true;
    }
  });

  return (
    <nav className="px-4 md:px-12 py-4 flex justify-between items-center border-b border-border-light bg-white/50 backdrop-blur-sm sticky top-0 z-50">
      {/* Logo */}
      <Link href={`/${locale}`} className="flex items-center group cursor-pointer">
        <Orbit className="absolute w-8 h-8 md:w-10 md:h-10 text-gold" />
        <span className="tracking-ultra pl-12 md:pl-14 text-[8px] md:text-[10px] uppercase font-extrabold text-link group-hover:text-gold transition-colors">
          CELESTIAL
        </span>
        &nbsp;
        <span className="tracking-ultra text-[8px] md:text-[10px] uppercase text-link group-hover:text-gold transition-colors">
          SOUL
        </span>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-6 items-center text-[10px] uppercase tracking-widest text-[#8D8478]">
        {/* Desktop Menu Items */}
        <div className="flex gap-4">
          {filteredMenuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-secondary transition-all font-bold"
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

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

        {/* Auth Button */}
        {!isAuthenticated ? (
          <Link
            href={`/${locale}/onboarding`}
            className="flex items-center gap-2 px-4 py-2 bg-gold text-white rounded-full hover:bg-gold/80 transition-all font-bold"
          >
            <LogIn className="w-3 h-3" />
            <span>{t('Sign In')}</span>
          </Link>
        ) : (
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all font-bold"
          >
            <LogOut className="w-3 h-3" />
            <span>{t('Sign Out')}</span>
          </button>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="flex md:hidden gap-4 items-center">
        {/* Mobile Auth Button (icon only) */}
        {!isAuthenticated ? (
          <Link
            href={`/${locale}/onboarding`}
            className="p-2 border border-border rounded-full hover:bg-secondary transition-all"
          >
            <LogIn className="w-4 h-4" />
          </Link>
        ) : (
          <button
            onClick={handleSignOut}
            className="p-2 border border-border rounded-full hover:bg-red-50 transition-all"
          >
            <LogOut className="w-4 h-4 text-red-500" />
          </button>
        )}

        {/* Mobile Menu Toggle */}
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
                className="absolute right-0 mt-4 w-56 bg-white rounded-2xl p-2 shadow-2xl border border-border z-50"
              >
                {/* Mobile Language Switcher */}
                <div className="mb-2 pb-2 border-b border-border-light">
                  <div className="px-3 py-2 text-[10px] font-bold text-text-muted">Language</div>
                  {locales.map((loc) => (
                    <button
                      key={loc.code}
                      onClick={() => handleLocaleChange(loc.code)}
                      className={`w-full text-left px-3 py-2 text-[10px] uppercase tracking-ultra rounded-xl transition-all ${locale === loc.code
                        ? 'bg-gold text-white font-bold'
                        : 'text-text hover:bg-secondary'
                        }`}
                    >
                      {loc.name}
                    </button>
                  ))}
                </div>

                {/* Mobile Menu Items */}
                {filteredMenuItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="w-full flex items-center gap-3 px-3 py-2 text-[10px] uppercase cursor-pointer hover:bg-secondary rounded-xl transition-all font-bold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}