'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';

type Theme = 'dark' | 'light';

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isChanging: boolean;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  setTheme: () => {},
  toggleTheme: () => {},
  isChanging: false,
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [isChanging, setIsChanging] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
      setThemeState(savedTheme);
    } else {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setThemeState(systemTheme);
    }
  }, []);
  
  useEffect(() => {
    if (!mounted) return;
    
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
    
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        theme === 'dark' ? '#0f172a' : '#f8fafc'
      );
    }
  }, [theme, mounted]);
  
  const setTheme = (newTheme: Theme) => {
    if (!mounted) return;
    
    setIsChanging(true);
    setTimeout(() => {
      setThemeState(newTheme);
      localStorage.setItem('theme', newTheme);
      setTimeout(() => {
        setIsChanging(false);
      }, 800);
    }, 100);
  };
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isChanging }}>
      <div className={theme}>
        <AnimatePresence>
          {isChanging && (
            <motion.div 
              className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="relative w-48 h-48"
                initial={{ scale: 0.2, opacity: 0 }}
                animate={{ 
                  scale: 30,
                  opacity: theme === 'dark' ? 0.9 : 0.95,
                  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
                }}
                exit={{ scale: 0.2, opacity: 0 }}
                style={{
                  backgroundColor: theme === 'dark' ? '#0f172a' : '#f8fafc',
                  borderRadius: '50%',
                }}
              />
              <div className="absolute">
                <motion.div
                  initial={{ scale: 1, rotate: 0 }}
                  animate={{ 
                    scale: [1, 1.2, 0],
                    rotate: [0, 180, 360],
                    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
                  }}
                >
                  {theme === 'dark' ? (
                    <Moon size={40} className="text-white" />
                  ) : (
                    <Sun size={40} className="text-yellow-500" />
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <motion.button
      className="relative w-10 h-10 rounded-full flex items-center justify-center bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={theme === 'dark' ? "Przełącz na jasny motyw" : "Przełącz na ciemny motyw"}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          initial={{ opacity: 0, rotate: -180, scale: 0.5 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 180, scale: 0.5 }}
          transition={{ duration: 0.3 }}
        >
          {theme === 'dark' ? (
            <Moon className="w-5 h-5 text-blue-400" />
          ) : (
            <Sun className="w-5 h-5 text-yellow-400" />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}