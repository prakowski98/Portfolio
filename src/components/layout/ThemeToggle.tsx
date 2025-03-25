'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  // Domyślnie dark mode
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Ta implementacja jest uproszczona - w pełnej wersji
  // należałoby zintegrować to z systemem motywów Tailwind
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Tu dodać logikę zmiany motywu
  };

  return (
    <motion.button
      className="relative w-10 h-10 rounded-full flex items-center justify-center"
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={isDarkMode ? "Przełącz na jasny motyw" : "Przełącz na ciemny motyw"}
    >
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: isDarkMode ? 0 : 180 }}
        transition={{ duration: 0.5 }}
      >
        {isDarkMode ? (
          <Moon className="w-5 h-5 text-blue-400" />
        ) : (
          <Sun className="w-5 h-5 text-yellow-400" />
        )}
      </motion.div>
    </motion.button>
  );
}