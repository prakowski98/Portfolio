'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/providers/ThemeProvider';
import { LanguageToggle, useLanguage } from '@/providers/LanguageProvider';

interface NavItemProps {
  href: string;
  label: string;
  isMobile?: boolean;
  closeMenu?: () => void;
  isActive: boolean;
}

const NavItem = ({ href, label, isMobile, closeMenu, isActive }: NavItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const tooltipRef = useRef<HTMLDivElement>(null);
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (closeMenu) closeMenu();
    
    window.history.pushState({}, '', href);
    router.push(href);
  };
  
  return (
    <motion.div 
      className="relative"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link 
        href={href} 
        onClick={handleClick}
        className={`relative group ${
          isActive
            ? 'text-blue-400 font-medium' 
            : 'text-gray-300 hover:text-white transition-colors'
        } ${isMobile ? 'text-xl py-2' : ''}`}
      >
        {label}
        <span 
          className={`absolute -bottom-1 left-0 w-full h-0.5 bg-blue-400 transform origin-left transition-transform duration-300 ${
            isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
          }`}
        />
      </Link>
      
      {!isMobile && isHovered && (
        <AnimatePresence>
          <motion.div
            ref={tooltipRef}
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50 pointer-events-none"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-gray-800 text-white text-sm py-2 px-3 rounded-lg shadow-lg whitespace-nowrap">
              {href === '/' && (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                  <span>Strona główna</span>
                </div>
              )}
              {href === '/projekty' && (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
                  <span>Przeglądaj projekty</span>
                </div>
              )}
              {href === '/blog' && (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                  <span>Czytaj artykuły</span>
                </div>
              )}
              {href === '/umiejetnosci' && (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                  <span>Zobacz umiejętności</span>
                </div>
              )}
              {href === '/o-mnie' && (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                  <span>Poznaj mnie</span>
                </div>
              )}
              {href === '/kontakt' && (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <span>Skontaktuj się</span>
                </div>
              )}
            </div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default function ImprovedHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();
  
  const navItems = [
    { path: '/', label: t('navigation.home') },
    { path: '/projekty', label: t('navigation.projects') },
    { path: '/blog', label: t('navigation.blog') },
    { path: '/umiejetnosci', label: t('navigation.skills') },
    { path: '/o-mnie', label: t('navigation.about') },
    { path: '/kontakt', label: t('navigation.contact') },
  ];
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    const handleInteraction = () => {
      setUserInteracted(true);
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
    
    window.addEventListener('scroll', handleInteraction);
    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, []);
  
  // Easter egg - sequence detection
  const [sequence, setSequence] = useState<string[]>([]);
  const secretSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setSequence(prev => {
        const newSequence = [...prev, e.key];
        if (newSequence.length > secretSequence.length) {
          newSequence.shift();
        }
        
        // Check if sequence matches
        if (newSequence.join('') === secretSequence.join('')) {
          setShowEasterEgg(true);
          setTimeout(() => setShowEasterEgg(false), 5000);
        }
        
        return newSequence;
      });
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  const headerVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  
  return (
    <>
      <motion.header 
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-black/80 backdrop-blur-md py-3' : 'bg-transparent py-6'
        }`}
        variants={headerVariants}
        initial="initial"
        animate="animate"
      >
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          {/* Logo */}
          <Link href="/">
            <motion.div 
              className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Patryk<span className="text-white">Rakowski</span>
            </motion.div>
          </Link>

          {/* Navigation - desktop */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <NavItem
                key={item.path}
                href={item.path}
                label={item.label}
                isActive={pathname === item.path}
              />
            ))}
          </div>

          {/* UI Controls */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageToggle />
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-4">
            <LanguageToggle />
            <ThemeToggle />
            <button 
              className="focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Zamknij menu" : "Otwórz menu"}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isMenuOpen ? 'close' : 'menu'}
                  initial={{ opacity: 0, rotate: isMenuOpen ? -90 : 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: isMenuOpen ? 90 : -90 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMenuOpen ? (
                    <X className="h-6 w-6 text-white" />
                  ) : (
                    <Menu className="h-6 w-6 text-white" />
                  )}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="fixed inset-0 bg-gray-900/95 backdrop-blur-md z-40 md:hidden pt-24"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: '100vh' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="container mx-auto px-4 flex flex-col items-center">
                <motion.div 
                  className="flex flex-col items-center space-y-6 w-full"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1,
                      },
                    },
                  }}
                  initial="hidden"
                  animate="visible"
                >
                  {navItems.map((item) => (
                    <motion.div
                      key={item.path}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                      }}
                    >
                      <NavItem
                        href={item.path}
                        label={item.label}
                        isMobile
                        closeMenu={() => setIsMenuOpen(false)}
                        isActive={pathname === item.path}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
      
      {/* Automatic header hint animation for first-time users */}
      {!userInteracted && (
        <motion.div
          className="fixed left-1/2 bottom-24 transform -translate-x-1/2 z-50 bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm flex items-center shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3, duration: 0.5 }}
        >
          <span>Przewiń, aby odkryć więcej</span>
          <motion.div
            className="ml-2"
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            ↓
          </motion.div>
        </motion.div>
      )}
      
      {/* Easter Egg */}
      <AnimatePresence>
        {showEasterEgg && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-blue-500/30 backdrop-blur-md p-8 rounded-xl text-center max-w-md"
              initial={{ scale: 0.8, rotate: -5 }}
              animate={{ 
                scale: 1, 
                rotate: [5, -5, 5, -5, 0],
                transition: { duration: 0.8 }
              }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <motion.h2 
                className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-pink-500 mb-4"
                animate={{ 
                  textShadow: [
                    "0 0 5px rgba(255,255,255,0.5)",
                    "0 0 20px rgba(255,255,255,0.8)",
                    "0 0 5px rgba(255,255,255,0.5)"
                  ]
                }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                Sekretny Kod Aktywowany!
              </motion.h2>
              <p className="text-white">Jesteś prawdziwym odkrywcą! Możesz teraz kliknąć dowolny element na stronie, aby zobaczyć ukrytą animację.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}