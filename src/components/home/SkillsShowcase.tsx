'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const skillCategories = [
  {
    id: 'support',
    name: 'Wsparcie techniczne',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
      </svg>
    ),
    color: 'blue',
    colorRgb: '59, 130, 246',
    skills: [
      { 
        name: 'I linia wsparcia', 
        level: 'Doświadczenie zawodowe', 
        description: 'Diagnozowanie i rozwiązywanie problemów zgłaszanych przez użytkowników. Dokumentowanie rozwiązań i przekazywanie bardziej złożonych problemów do odpowiednich zespołów.' 
      },
      { 
        name: 'Mantis', 
        level: 'Praktyczne doświadczenie', 
        description: 'Praca z systemem Mantis do zarządzania zgłoszeniami, śledzenia błędów i obsługi ticketów.' 
      },
      { 
        name: 'Konserwacja sprzętu', 
        level: 'Doświadczenie zawodowe', 
        description: 'Regularna konserwacja komputerów i urządzeń peryferyjnych. Rozwiązywanie problemów sprzętowych i optymalizacja działania urządzeń.' 
      },
      { 
        name: 'Kosztorysy', 
        level: 'Praktyczne doświadczenie', 
        description: 'Przygotowywanie kosztorysów sprzętu komputerowego i oprogramowania według wymagań klientów.' 
      }
    ]
  },
  {
    id: 'systems',
    name: 'Systemy i sieci',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
      </svg>
    ),
    color: 'purple',
    colorRgb: '139, 92, 246',
    skills: [
      { 
        name: 'Active Directory', 
        level: 'Doświadczenie zawodowe', 
        description: 'Zarządzanie użytkownikami w Active Directory - tworzenie kont, modyfikacja uprawnień, zarządzanie grupami i usuwanie użytkowników.' 
      },
      { 
        name: 'Windows Server', 
        level: 'Podstawowe doświadczenie', 
        description: 'Podstawowa administracja usługami Windows Server, wsparcie użytkowników w środowisku opartym o infrastrukturę Microsoft.' 
      },
      { 
        name: 'Diagnostyka sieci', 
        level: 'Podstawowy poziom', 
        description: 'Podstawowa diagnostyka problemów sieciowych, używanie narzędzi takich jak ping, traceroute, sprawdzanie konfiguracji IP.' 
      }
    ]
  },
  {
    id: 'electronics',
    name: 'Elektronika',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
      </svg>
    ),
    color: 'emerald',
    colorRgb: '16, 185, 129',
    skills: [
      { 
        name: 'Raspberry Pi Pico',
        level: 'Praktyczne doświadczenie',
        description: 'Programowanie i wykorzystywanie mikrokontrolera Raspberry Pi Pico w projektach IoT i systemach wbudowanych.'
      },
      { 
        name: 'MicroPython', 
        level: 'Praktyczne doświadczenie', 
        description: 'Programowanie mikrokontrolerów z wykorzystaniem języka MicroPython, pisanie skryptów do obsługi czujników i modułów komunikacyjnych.' 
      },
      { 
        name: 'Projektowanie PCB', 
        level: 'Średniozaawansowany', 
        description: 'Tworzenie płytek PCB o średniej złożoności, projektowanie schematów elektronicznych i realizacja prototypów układów.' 
      },
      {
        name: 'STM32',
        level: 'W trakcie nauki',
        description: 'Aktualnie uczę się programowania mikrokontrolerów z rodziny STM32, poznając środowisko programistyczne i podstawy języka C w kontekście systemów wbudowanych.'
      }
    ]
  },
  {
    id: 'development',
    name: 'Web Development',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
      </svg>
    ),
    color: 'orange',
    colorRgb: '249, 115, 22',
    skills: [
      { 
        name: 'HTML/CSS',
        level: 'Podstawowy',
        description: 'Podstawy tworzenia stron internetowych z wykorzystaniem HTML5 i CSS3. Tworzenie prostych, responsywnych layoutów.'
      },
      { 
        name: 'JavaScript',
        level: 'Początkujący',
        description: 'Podstawy języka JavaScript, manipulacja elementami DOM, obsługa prostych interakcji z użytkownikiem.'
      },
      { 
        name: 'Git',
        level: 'Podstawowy',
        description: 'Podstawy kontroli wersji z wykorzystaniem Git - commit, push, pull, praca na gałęziach.'
      }
    ]
  }
];

const projectItems = [
  {
    id: 'gps-tracker',
    title: 'GPS Tracker z aplikacją webową',
    description: 'Tracker GPS z interfejsem webowym do śledzenia lokalizacji w czasie rzeczywistym oraz możliwością odbierania aktualnej pozycji przez wiadomości SMS.',
    technologies: ['Raspberry Pi Pico', 'MicroPython', 'SIMCOM A7670C', 'GPS ATGM336H'],
    details: [
      'Zaprojektowanie i wykonanie własnej płytki PCB',
      'Integracja modułu GSM SIMCOM A7670C do komunikacji przez sieć komórkową',
      'Wykorzystanie modułu GPS ATGM336H do precyzyjnego śledzenia lokalizacji',
      'Zaprojektowanie i wydruk obudowy na drukarce 3D',
      'Implementacja funkcjonalności odpowiedzi SMS z aktualną lokalizacją',
      'Stworzenie interfejsu webowego do śledzenia urządzenia'
    ],
    image: null,
    color: 'emerald',
    colorRgb: '16, 185, 129',
    type: 'Projekt inżynierski'
  },
  {
    id: 'wsparcie-techniczne',
    title: 'Wsparcie IT dla przedsiębiorstwa',
    description: 'Zapewnienie kompleksowego wsparcia technicznego pierwszej linii dla firmy, obsługa i konserwacja sprzętu, zarządzanie użytkownikami.',
    technologies: ['Active Directory', 'Mantis', 'Windows Server', 'Diagnostyka sprzętu'],
    details: [
      'Obsługa zgłoszeń użytkowników przez system Mantis',
      'Regularna konserwacja sprzętu i peryferii komputerowych',
      'Zarządzanie kontami użytkowników w Active Directory',
      'Tworzenie kosztorysów dla nowego sprzętu i oprogramowania',
      'Podstawowa administracja systemami Windows Server'
    ],
    image: null,
    color: 'blue',
    colorRgb: '59, 130, 246',
    type: 'Doświadczenie zawodowe'
  }
];

const colorMap = {
  blue: {
    primary: 'text-blue-500',
    secondary: 'text-blue-400',
    bg: 'bg-blue-500',
    bgLight: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    fill: 'from-blue-600 to-blue-400',
    track: 'bg-blue-900/40',
  },
  emerald: {
    primary: 'text-emerald-500',
    secondary: 'text-emerald-400',
    bg: 'bg-emerald-500',
    bgLight: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    fill: 'from-emerald-600 to-emerald-400',
    track: 'bg-emerald-900/40',
  },
  purple: {
    primary: 'text-purple-500',
    secondary: 'text-purple-400',
    bg: 'bg-purple-500',
    bgLight: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    fill: 'from-purple-600 to-purple-400',
    track: 'bg-purple-900/40',
  },
  orange: {
    primary: 'text-orange-500',
    secondary: 'text-orange-400',
    bg: 'bg-orange-500',
    bgLight: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    fill: 'from-orange-600 to-orange-400',
    track: 'bg-orange-900/40',
  }
};

interface BackgroundDot {
  id: number;
  width: number;
  height: number;
  left: number;
  top: number;
  duration: number;
  delay: number;
  opacity: number;
}

interface ExplosionParticle {
  id: number;
  angle: number;
  speed: number;
  scale: number;
  opacity: number;
}

const SkillCard = ({ skill, index, color }: { skill: any, index: number, color: string }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.2 });
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);
  
  const colorClasses = colorMap[color as keyof typeof colorMap];
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        delay: index * 0.1 
      }
    }
  };
  
  return (
    <motion.div 
      ref={ref}
      className={`p-3 md:p-4 rounded-xl border ${colorClasses.border} bg-gray-800/30 backdrop-blur-sm relative overflow-hidden`}
      initial="hidden"
      animate={controls}
      variants={cardVariants}
      whileHover={{ 
        y: -3,
        boxShadow: `0 10px 25px -5px rgba(${color === 'blue' ? '59, 130, 246' : color === 'emerald' ? '16, 185, 129' : color === 'purple' ? '139, 92, 246' : '249, 115, 22'}, 0.2)` 
      }}
      transition={{ duration: 0.3 }}
      onClick={() => setIsTooltipVisible(!isTooltipVisible)}
    >
      <div className={`absolute top-0 left-0 w-full h-1 ${colorClasses.bg} opacity-50`}></div>
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full ${colorClasses.bgLight} blur-xl opacity-20`}></div>
      </div>
      
      <div className="flex flex-col h-full relative z-10">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-2">
          <h3 className={`font-medium text-sm sm:text-base ${colorClasses.secondary}`}>{skill.name}</h3>
          <span className={`self-start px-2 py-0.5 text-xs rounded-full bg-gray-700/50 ${colorClasses.primary}`}>
            {skill.level}
          </span>
        </div>
        
        <p className="text-gray-300 text-xs sm:text-sm mt-1 line-clamp-2">
          {skill.description}
        </p>
        
        <AnimatePresence>
          {isTooltipVisible && skill.description.length > 75 && (
            <motion.div 
              className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => {
                e.stopPropagation();
                setIsTooltipVisible(false);
              }}
            >
              <motion.div
                className="bg-gray-800 rounded-xl p-4 max-w-sm m-auto relative"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h4 className={`font-medium text-lg mb-2 ${colorClasses.secondary}`}>{skill.name}</h4>
                <p className="text-sm text-gray-300 mb-4">{skill.description}</p>
                <button 
                  className={`px-4 py-2 rounded-lg ${colorClasses.bgLight} ${colorClasses.secondary} w-full`}
                  onClick={() => setIsTooltipVisible(false)}
                >
                  Zamknij
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const ProjectCard = ({ project, index }: { project: any, index: number }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.2 });
  const [isExpanded, setIsExpanded] = useState(false);
  
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);
  
  const colorClasses = colorMap[project.color as keyof typeof colorMap];
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        delay: index * 0.2 
      }
    }
  };
  
  return (
    <motion.div 
      ref={ref}
      className={`mb-6 md:mb-8 p-4 md:p-6 rounded-xl border ${colorClasses.border} bg-gray-800/30 backdrop-blur-sm relative overflow-hidden`}
      initial="hidden"
      animate={controls}
      variants={cardVariants}
      whileHover={{ 
        y: -3,
        boxShadow: `0 15px 30px -5px rgba(${project.colorRgb}, 0.2)` 
      }}
      transition={{ duration: 0.3 }}
    >
      <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${colorClasses.fill} opacity-70`}></div>
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full ${colorClasses.bgLight} blur-3xl opacity-10`}></div>
      </div>
      
      <div className="flex flex-col h-full relative z-10">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
          <h3 className={`font-medium text-lg sm:text-xl ${colorClasses.secondary}`}>{project.title}</h3>
          <span className={`self-start px-2 py-1 text-xs rounded-full bg-gray-700/50 ${colorClasses.primary}`}>
            {project.type}
          </span>
        </div>
        
        <p className="text-gray-300 text-sm mb-4">{project.description}</p>
        
        <div className="mb-4 flex flex-wrap gap-2">
          {project.technologies.map((tech: string) => (
            <span 
              key={tech} 
              className={`inline-block px-2 py-1 text-xs rounded-full ${colorClasses.bgLight} ${colorClasses.secondary}`}
            >
              {tech}
            </span>
          ))}
        </div>
        
        <motion.div 
          className="mb-1"
          initial={{ height: isExpanded ? "auto" : "0", opacity: isExpanded ? 1 : 0, overflow: "hidden" }}
          animate={{ height: isExpanded ? "auto" : "0", opacity: isExpanded ? 1 : 0, overflow: "hidden" }}
          transition={{ duration: 0.4 }}
        >
          <ul className="space-y-1 text-gray-300 text-sm list-disc pl-5 mt-2">
            {project.details.map((detail: string, i: number) => (
              <motion.li 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
              >
                {detail}
              </motion.li>
            ))}
          </ul>
        </motion.div>
        
        <button 
          className={`mt-2 text-sm ${colorClasses.secondary} self-start flex items-center touch-manipulation`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Pokaż mniej' : 'Pokaż więcej'}
          <svg 
            className={`w-4 h-4 ml-1 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
      </div>
    </motion.div>
  );
};

export default function SkillsShowcase() {
  const [activeCategory, setActiveCategory] = useState('support');
  const [backgroundDots, setBackgroundDots] = useState<BackgroundDot[]>([]);
  const [explosionParticles, setExplosionParticles] = useState<ExplosionParticle[]>([]);
  const [isExploding, setIsExploding] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [activeSection, setActiveSection] = useState('skills');
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const controls = useAnimation();
  const skillsRef = useRef(null);
  const projectsRef = useRef(null);
  const isSkillsInView = useInView(skillsRef, { once: true, amount: 0.2 });
  const isProjectsInView = useInView(projectsRef, { once: true, amount: 0.2 });
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    if (!isMounted) return;
    
    const isMobile = window.innerWidth < 768;
    
    const dots = Array.from({ length: isMobile ? 10 : 20 }).map((_, i) => ({
      id: i,
      width: 3 + Math.random() * (isMobile ? 4 : 6),
      height: 3 + Math.random() * (isMobile ? 4 : 6),
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 10,
      opacity: 0.05 + Math.random() * (isMobile ? 0.08 : 0.12)
    }));
    
    setBackgroundDots(dots);
  }, [isMounted]);
  
  useEffect(() => {
    if (!isMounted) return;
    
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 10 : 20;
    
    const particles = Array.from({ length: particleCount }).map((_, i) => {
      const angle = (i / particleCount) * Math.PI * 2;
      const speed = 1 + Math.random() * 1.5;
      return {
        id: i,
        angle,
        speed,
        scale: 0.4 + Math.random() * 0.4,
        opacity: 0.5 + Math.random() * 0.3
      };
    });
    
    setExplosionParticles(particles);
  }, [isMounted]);
  
  useEffect(() => {
    if (isSkillsInView || isProjectsInView) {
      controls.start('visible');
    }
  }, [controls, isSkillsInView, isProjectsInView]);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const selectedCategory = skillCategories.find(cat => cat.id === activeCategory) || skillCategories[0];
  const colorClasses = colorMap[selectedCategory.color as keyof typeof colorMap];
  
  useEffect(() => {
    if (!isMounted) return;
    
    setIsExploding(true);
    const timer = setTimeout(() => setIsExploding(false), 500);
    return () => clearTimeout(timer);
  }, [activeCategory, isMounted]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  if (!isMounted) {
    return (
      <section className="py-12 md:py-20 bg-gray-950 overflow-hidden relative">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="mb-20">
            <div className="mb-8 md:mb-12 text-center">
              <div className="inline-block mb-3 px-3 py-1 rounded-full border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm">
                Moje doświadczenie
              </div>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">
                Umiejętności
              </h2>
              
              <p className="max-w-2xl mx-auto text-sm md:text-base text-gray-400">
                Jestem na początku swojej drogi zawodowej i stale rozwijam swoje kompetencje.
                Oto obszary, w których zdobyłem doświadczenie.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
              {skillCategories.map((category) => {
                const catColorClasses = colorMap[category.color as keyof typeof colorMap];
                return (
                  <button
                    key={category.id}
                    className={`p-3 md:p-4 rounded-xl text-center ${
                      activeCategory === category.id
                        ? `bg-gradient-to-b ${catColorClasses.bgLight} ${catColorClasses.border}`
                        : 'bg-gray-800/50'
                    } backdrop-blur-sm`}
                  >
                    <div className={`mx-auto w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full ${
                      activeCategory === category.id
                        ? `${catColorClasses.bgLight} ${catColorClasses.primary}`
                        : 'bg-gray-700/50 text-gray-400'
                    } mb-2 md:mb-3`}>
                      {category.icon}
                    </div>
                    
                    <h3 className={`text-sm md:text-base font-medium ${
                      activeCategory === category.id ? catColorClasses.secondary : 'text-gray-200'
                    }`}>
                      {category.name}
                    </h3>
                  </button>
                );
              })}
            </div>
            
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-4 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {selectedCategory.skills.map((skill) => (
                  <div key={skill.name} className="p-3 md:p-4 rounded-xl border border-gray-700 bg-gray-800/30">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-2">
                      <h3 className="font-medium text-sm sm:text-base text-blue-400">{skill.name}</h3>
                      <span className="self-start px-2 py-0.5 text-xs rounded-full bg-gray-700/50 text-blue-400">
                        {skill.level}
                      </span>
                    </div>
                    <p className="text-gray-300 text-xs sm:text-sm line-clamp-2">{skill.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <div className="mb-8 md:mb-12 text-center">
              <div className="inline-block mb-3 px-3 py-1 rounded-full border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm">
                Moje projekty
              </div>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">
                Projekty
              </h2>
              
              <p className="max-w-2xl mx-auto text-sm md:text-base text-gray-400">
                Najważniejsze projekty i doświadczenia, które ukształtowały moje kompetencje.
              </p>
            </div>
            
            <div className="space-y-4 md:space-y-6">
              {projectItems.map((project) => {
                const projColorClasses = colorMap[project.color as keyof typeof colorMap];
                return (
                  <div 
                    key={project.id} 
                    className={`p-4 md:p-6 rounded-xl border ${projColorClasses.border} bg-gray-800/30 backdrop-blur-sm`}
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                      <h3 className={`font-medium text-lg sm:text-xl ${projColorClasses.secondary}`}>{project.title}</h3>
                      <span className={`self-start px-2 py-1 text-xs rounded-full bg-gray-700/50 ${projColorClasses.primary}`}>
                        {project.type}
                      </span>
                    </div>
                    
                    <p className="text-gray-300 text-sm mb-4">{project.description}</p>
                    
                    <div className="mb-4 flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span 
                          key={tech} 
                          className={`inline-block px-2 py-1 text-xs rounded-full ${projColorClasses.bgLight} ${projColorClasses.secondary}`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-12 md:py-20 bg-gray-950 overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden">
        {backgroundDots.map((dot) => (
          <motion.div
            key={dot.id}
            className="absolute rounded-full bg-gray-700/20"
            style={{
              width: `${dot.width}px`,
              height: `${dot.height}px`,
              left: `${dot.left}%`,
              top: `${dot.top}%`,
            }}
            animate={{
              y: [0, -60, 0],
              opacity: [dot.opacity, dot.opacity * 1.5, dot.opacity]
            }}
            transition={{
              repeat: Infinity,
              duration: dot.duration,
              ease: "easeInOut",
              delay: dot.delay
            }}
          />
        ))}
      </div>
      
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-${selectedCategory.color}-500/5 blur-3xl transition-colors duration-700`} />
        <div className={`absolute bottom-1/4 right-1/3 w-72 h-72 rounded-full bg-emerald-500/5 blur-3xl transition-colors duration-700`} />
        <motion.div 
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-30"
          style={{
            backgroundColor: `rgba(${selectedCategory.colorRgb}, 0.03)`,
            top: '40%',
            left: '60%',
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.03, 0.05, 0.03]
          }}
          transition={{
            repeat: Infinity,
            duration: 10,
            ease: "easeInOut"
          }}
        />
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex justify-center mb-8 md:mb-12">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-full p-1 flex w-full max-w-xs">
            <button
              className={`flex-1 px-3 py-2 md:px-6 md:py-2 text-sm rounded-full transition-all duration-300 ${
                activeSection === 'skills'
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveSection('skills')}
            >
              Umiejętności
            </button>
            <button
              className={`flex-1 px-3 py-2 md:px-6 md:py-2 text-sm rounded-full transition-all duration-300 ${
                activeSection === 'projects'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveSection('projects')}
            >
              Projekty
            </button>
          </div>
        </div>
        
        <AnimatePresence mode="wait">
          {activeSection === 'skills' && (
            <motion.div 
              ref={skillsRef}
              key="skills-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="mb-6 md:mb-10 text-center"
                variants={containerVariants}
                initial="hidden"
                animate={controls}
              >
                <motion.div variants={itemVariants} className="inline-block mb-3 px-3 py-1 rounded-full border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm transition-colors duration-500">
                  Moje doświadczenie
                </motion.div>
                
                <motion.h2 variants={itemVariants} className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">
                  Umiejętności
                </motion.h2>
                
                <motion.p variants={itemVariants} className="max-w-2xl mx-auto text-sm md:text-base text-gray-400">
                  Jestem na początku swojej drogi zawodowej i stale rozwijam swoje kompetencje.
                  Oto obszary, w których zdobyłem doświadczenie.
                </motion.p>
              </motion.div>
              
              <div className="flex flex-wrap justify-center gap-3 md:gap-6 mb-6 md:mb-8">
                {skillCategories.map((category) => {
                  const catColorClasses = colorMap[category.color as keyof typeof colorMap];
                  return (
                    <motion.button
                      key={category.id}
                      className={`p-3 md:p-4 rounded-xl text-center ${
                        activeCategory === category.id
                          ? `bg-gradient-to-b ${catColorClasses.bgLight} ${catColorClasses.border}`
                          : 'bg-gray-800/50 hover:bg-gray-800/80'
                      } backdrop-blur-sm transition-all duration-300 relative overflow-hidden min-w-[120px] sm:min-w-[140px] touch-manipulation`}
                      onClick={() => setActiveCategory(category.id)}
                      variants={itemVariants}
                      whileHover={{ 
                        scale: 1.02,
                        boxShadow: activeCategory === category.id 
                          ? `0 0 20px 5px rgba(${category.colorRgb}, 0.15)` 
                          : '0 0 0 rgba(0, 0, 0, 0)' 
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {activeCategory === category.id && (
                        <motion.div 
                          className="absolute inset-0 opacity-20"
                          animate={{ 
                            boxShadow: [
                              `inset 0 0 15px 0 rgba(${category.colorRgb}, 0.3)`,
                              `inset 0 0 30px 0 rgba(${category.colorRgb}, 0.6)`,
                              `inset 0 0 15px 0 rgba(${category.colorRgb}, 0.3)`,
                            ]
                          }}
                          transition={{ 
                            repeat: Infinity,
                            duration: 3,
                          }}
                        />
                      )}
                      
                      <div className={`mx-auto w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full ${
                        activeCategory === category.id
                          ? `${catColorClasses.bgLight} ${catColorClasses.primary}`
                          : 'bg-gray-700/50 text-gray-400'
                      } mb-2 md:mb-3 transition-colors duration-300`}>
                        {category.icon}
                      </div>
                      
                      <h3 className={`text-sm md:text-base font-medium ${
                        activeCategory === category.id ? catColorClasses.secondary : 'text-gray-200'
                      } transition-colors duration-300`}>
                        {category.name}
                      </h3>
                      
                      {isExploding && activeCategory === category.id && (
                        <AnimatePresence>
                          {explosionParticles.map(particle => (
                            <motion.div
                              key={particle.id}
                              className={`absolute top-1/2 left-1/2 w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${catColorClasses.bg}`}
                              initial={{ x: 0, y: 0, opacity: 0.8 }}
                              animate={{
                                x: Math.cos(particle.angle) * 60 * particle.speed,
                                y: Math.sin(particle.angle) * 60 * particle.speed,
                                opacity: 0,
                                scale: particle.scale
                              }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                            />
                          ))}
                        </AnimatePresence>
                      )}
                    </motion.button>
                  );
                })}
              </div>
              
              <motion.div
                className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-4 md:p-6"
                variants={itemVariants}
                key={activeCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  {selectedCategory.skills.map((skill, index) => (
                    <SkillCard 
                      key={skill.name} 
                      skill={skill} 
                      index={index} 
                      color={selectedCategory.color} 
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
          
          {activeSection === 'projects' && (
            <motion.div 
              ref={projectsRef}
              key="projects-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="mb-6 md:mb-10 text-center"
                variants={containerVariants}
                initial="hidden"
                animate={controls}
              >
                <motion.div variants={itemVariants} className="inline-block mb-3 px-3 py-1 rounded-full border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm transition-colors duration-500">
                  Moje projekty
                </motion.div>
                
                <motion.h2 variants={itemVariants} className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">
                  Projekty
                </motion.h2>
                
                <motion.p variants={itemVariants} className="max-w-2xl mx-auto text-sm md:text-base text-gray-400">
                  Najważniejsze projekty i doświadczenia, które ukształtowały moje kompetencje.
                </motion.p>
              </motion.div>
              
              <div className="space-y-4 md:space-y-6">
                {projectItems.map((project, index) => (
                  <ProjectCard 
                    key={project.id} 
                    project={project} 
                    index={index} 
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.div 
          className="mt-10 md:mt-16 text-center"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <Link href="/umiejetnosci">
            <motion.button
              variants={itemVariants}
              className="px-6 py-3 border-blue-500/30 bg-blue-500/10 rounded-lg text-blue-400 font-medium inline-flex items-center gap-2 hover:translate-y-[-2px] transition-all duration-300 touch-manipulation"
              whileHover={{ 
                scale: 1.03, 
                boxShadow: "0 8px 20px -5px rgba(59, 130, 246, 0.15)" 
              }}
              whileTap={{ scale: 0.98 }}
            >
              Zobacz pełne CV
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </motion.button>
          </Link>
        </motion.div>
      </div>
      
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            className="fixed right-4 bottom-4 p-3 rounded-full bg-gray-800/70 backdrop-blur-sm text-gray-300 z-50 border border-gray-700 touch-manipulation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
}