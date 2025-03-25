'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Language = 'pl' | 'en';

type Translations = {
  [key: string]: {
    [key: string]: string;
  };
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isChanging: boolean;
};

const translations: Translations = {
  'navigation.home': {
    pl: 'Strona główna',
    en: 'Home',
  },
  'navigation.projects': {
    pl: 'Projekty',
    en: 'Projects',
  },
  'navigation.blog': {
    pl: 'Blog',
    en: 'Blog',
  },
  'navigation.skills': {
    pl: 'Umiejętności',
    en: 'Skills',
  },
  'navigation.about': {
    pl: 'O mnie',
    en: 'About me',
  },
  'navigation.contact': {
    pl: 'Kontakt',
    en: 'Contact',
  },
  'hero.title': {
    pl: 'Tworzę nowoczesne rozwiązania cyfrowe',
    en: 'I create modern digital solutions',
  },
  'hero.description': {
    pl: 'Witaj w moim cyfrowym portfolio. Jestem pasjonatem technologii specjalizującym się w tworzeniu innowacyjnych projektów informatycznych. Moja misja to przekształcanie złożonych problemów w eleganckie rozwiązania.',
    en: 'Welcome to my digital portfolio. I am a technology enthusiast specializing in creating innovative IT projects. My mission is to transform complex problems into elegant solutions.'
  },
  'hero.cta.projects': {
    pl: 'Zobacz projekty',
    en: 'View projects',
  },
  'hero.cta.contact': {
    pl: 'Kontakt',
    en: 'Contact',
  },
  'projects.heading': {
    pl: 'Wyróżnione projekty',
    en: 'Featured projects',
  },
  'projects.subheading': {
    pl: 'Moje prace',
    en: 'My work',
  },
  'projects.description': {
    pl: 'Odkryj moje najlepsze realizacje. Każdy projekt to unikalne wyzwania i innowacyjne rozwiązania techniczne.',
    en: 'Discover my best work. Each project represents unique challenges and innovative technical solutions.',
  },
  'projects.cta': {
    pl: 'Zobacz wszystkie projekty',
    en: 'View all projects',
  },
  'skills.heading': {
    pl: 'Umiejętności techniczne',
    en: 'Technical skills',
  },
  'skills.subheading': {
    pl: 'Moje kompetencje',
    en: 'My expertise',
  },
  'skills.description': {
    pl: 'Stale rozwijam swoje kompetencje w różnych obszarach inżynierii oprogramowania. Odkryj moje kluczowe umiejętności techniczne.',
    en: 'I continuously develop my competencies in various areas of software engineering. Discover my key technical skills.',
  },
  'skills.cta': {
    pl: 'Zobacz pełne CV',
    en: 'View full resume',
  },
  'blog.heading': {
    pl: 'Najnowsze artykuły',
    en: 'Latest articles',
  },
  'blog.subheading': {
    pl: 'Blog',
    en: 'Blog',
  },
  'blog.description': {
    pl: 'Dzielę się swoją wiedzą i przemyśleniami na temat najnowszych trendów w technologii, programowaniu i inżynierii oprogramowania.',
    en: 'I share my knowledge and thoughts on the latest trends in technology, programming, and software engineering.',
  },
  'blog.cta': {
    pl: 'Zobacz wszystkie artykuły',
    en: 'View all articles',
  },
  'contact.heading': {
    pl: 'Porozmawiajmy',
    en: "Let's talk",
  },
  'contact.subheading': {
    pl: 'Kontakt',
    en: 'Contact',
  },
  'contact.description': {
    pl: 'Masz ciekawy projekt lub propozycję współpracy? Jeśli jesteś zainteresowany(a) współpracą lub masz pytania, śmiało napisz do mnie. Postaram się odpowiedzieć najszybciej jak to możliwe.',
    en: 'Do you have an interesting project or collaboration proposal? If you are interested in working together or have questions, feel free to write to me. I will try to respond as soon as possible.',
  },
  'contact.form.name': {
    pl: 'Imię i nazwisko',
    en: 'Full name',
  },
  'contact.form.email': {
    pl: 'Adres email',
    en: 'Email address',
  },
  'contact.form.message': {
    pl: 'Wiadomość',
    en: 'Message',
  },
  'contact.form.submit': {
    pl: 'Wyślij wiadomość',
    en: 'Send message',
  },
  'contact.form.success': {
    pl: 'Wiadomość wysłana!',
    en: 'Message sent!',
  },
  'contact.form.success.description': {
    pl: 'Dziękuję za kontakt. Odpowiem na Twoją wiadomość najszybciej jak to możliwe.',
    en: 'Thank you for reaching out. I will respond to your message as soon as possible.',
  },
  'contact.form.sending': {
    pl: 'Wysyłanie...',
    en: 'Sending...',
  },
  'contact.form.new': {
    pl: 'Wyślij kolejną wiadomość',
    en: 'Send another message',
  },
  'footer.copyright': {
    pl: 'Wszelkie prawa zastrzeżone',
    en: 'All rights reserved',
  },
  'footer.role': {
    pl: 'Inżynier Informatyki | Programista | Pasjonat technologii',
    en: 'Computer Engineer | Developer | Technology Enthusiast',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'pl',
  setLanguage: () => {},
  t: (key) => key,
  isChanging: false,
});

export const useLanguage = () => useContext(LanguageContext);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('pl');
  const [isChanging, setIsChanging] = useState(false);
  
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'pl' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
    } else {
      const browserLanguage = navigator.language.startsWith('pl') ? 'pl' : 'en';
      setLanguageState(browserLanguage);
    }
  }, []);
  
  const setLanguage = (lang: Language) => {
    setIsChanging(true);
    setTimeout(() => {
      setLanguageState(lang);
      localStorage.setItem('language', lang);
      setTimeout(() => {
        setIsChanging(false);
      }, 300);
    }, 300);
  };
  
  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isChanging }}>
      <AnimatePresence>
        {isChanging && (
          <motion.div 
            className="fixed inset-0 bg-gray-950 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              animate={{ 
                rotate: 360,
                transition: { duration: 2, repeat: Infinity, ease: "linear" }
              }}
            >
              <div className="w-16 h-16 border-t-2 border-blue-500 rounded-full" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </LanguageContext.Provider>
  );
}

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  
  return (
    <button
      onClick={() => setLanguage(language === 'pl' ? 'en' : 'pl')}
      className="flex items-center justify-center rounded-full w-10 h-10 bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
      aria-label={language === 'pl' ? 'Switch to English' : 'Przełącz na polski'}
    >
      <motion.span 
        key={language}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.2 }}
        className="text-sm font-medium"
      >
        {language === 'pl' ? 'EN' : 'PL'}
      </motion.span>
    </button>
  );
}