'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Dane umiejętności
const skillCategories = [
  {
    id: 'frontend',
    name: 'Frontend',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
      </svg>
    ),
    color: 'blue',
    colorRgb: '59, 130, 246',
    skills: [
      { name: 'React', level: 92, description: 'Tworzenie zaawansowanych aplikacji i komponentów React z użyciem hooks i Context API' },
      { name: 'Next.js', level: 89, description: 'Budowanie aplikacji serwerowych i statycznych z wykorzystaniem najnowszych funkcji Next.js' },
      { name: 'TypeScript', level: 87, description: 'Implementacja typów dla lepszej niezawodności i dokumentacji kodu' },
      { name: 'CSS/SCSS', level: 90, description: 'Zaawansowane style, animacje i układy responsywne' },
      { name: 'Tailwind CSS', level: 95, description: 'Szybkie tworzenie interfejsów z wykorzystaniem utility-first CSS' },
      { name: 'Framer Motion', level: 80, description: 'Tworzenie płynnych animacji i interakcji dla interfejsów użytkownika' },
    ]
  },
  {
    id: 'backend',
    name: 'Backend',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path>
      </svg>
    ),
    color: 'emerald',
    colorRgb: '16, 185, 129',
    skills: [
      { name: 'Node.js', level: 88, description: 'Tworzenie skalowalnych API i mikrousług z Express.js i Fastify' },
      { name: 'Python', level: 85, description: 'Rozwój aplikacji backendowych z Django i FastAPI' },
      { name: 'SQL', level: 84, description: 'Projektowanie i optymalizacja baz danych relacyjnych' },
      { name: 'MongoDB', level: 82, description: 'Implementacja baz danych nierelacyjnych dla aplikacji webowych' },
      { name: 'GraphQL', level: 79, description: 'Budowanie elastycznych API z Apollo Server' },
      { name: 'REST API', level: 91, description: 'Projektowanie i implementacja RESTful API zgodnych z najlepszymi praktykami' },
    ]
  },
  {
    id: 'devops',
    name: 'DevOps & Cloud',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
      </svg>
    ),
    color: 'purple',
    colorRgb: '139, 92, 246',
    skills: [
      { name: 'Docker', level: 83, description: 'Konteneryzacja aplikacji i tworzenie środowisk deweloperskich' },
      { name: 'AWS', level: 78, description: 'Wdrażanie i zarządzanie aplikacjami na platformie Amazon Web Services' },
      { name: 'CI/CD', level: 85, description: 'Automatyzacja procesów deployment z GitHub Actions i Jenkins' },
      { name: 'Linux', level: 87, description: 'Administracja serwerami Linux i automatyzacja zadań' },
      { name: 'Kubernetes', level: 75, description: 'Orkiestracja kontenerów i zarządzanie klastrami' },
      { name: 'Terraform', level: 73, description: 'Infrastructure as Code dla automatyzacji infrastruktury' },
    ]
  },
  {
    id: 'other',
    name: 'Pozostałe',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
      </svg>
    ),
    color: 'orange',
    colorRgb: '249, 115, 22',
    skills: [
      { name: 'Git & GitHub', level: 94, description: 'Zarządzanie wersjami, workflow i współpraca z zespołem' },
      { name: 'Agile/Scrum', level: 89, description: 'Prowadzenie projektów zgodnie z metodykami zwinnymi' },
      { name: 'UX/UI Design', level: 82, description: 'Projektowanie interfejsów zorientowanych na użytkownika' },
      { name: 'AI/ML', level: 75, description: 'Budowanie modeli Machine Learning dla rozwiązań praktycznych' },
      { name: 'Data Science', level: 78, description: 'Analiza danych i tworzenie wizualizacji' },
      { name: 'Testing', level: 86, description: 'Testy jednostkowe, integracyjne i end-to-end' },
    ]
  }
];

// Mapowanie kolorów na klasy Tailwind
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

// Typ dla pojedynczej cząsteczki tła
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

// Typ dla cząsteczki wybuchu
interface ExplosionParticle {
  id: number;
  angle: number;
  speed: number;
  scale: number;
  opacity: number;
}

// Komponent dla pojedynczej umiejętności z animowanym paskiem postępu
const SkillBar = ({ skill, index, color }: { skill: any, index: number, color: string }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    if (isInView) {
      controls.start({
        width: `${skill.level}%`,
        transition: { 
          duration: 1.2,
          delay: index * 0.1,
          ease: [0.4, 0, 0.2, 1]
        }
      });
    }
  }, [controls, isInView, skill.level, index]);
  
  const colorClasses = colorMap[color as keyof typeof colorMap];
  
  return (
    <div 
      ref={ref}
      className="mb-6 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between mb-2">
        <span className={`font-medium ${colorClasses.secondary}`}>{skill.name}</span>
        <span className="text-gray-400">{skill.level}%</span>
      </div>

      <div className={`h-3 w-full rounded-full overflow-hidden ${colorClasses.track}`}>
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${colorClasses.fill}`}
          initial={{ width: 0 }}
          animate={controls}
        />
      </div>
      
      {/* Tooltip z opisem umiejętności */}
      <AnimatePresence>
        {isHovered && (
          <motion.div 
            className="absolute z-10 mt-2 p-3 bg-gray-800 rounded-lg shadow-lg max-w-xs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-sm text-gray-300">{skill.description}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function SkillsShowcase() {
  const [activeCategory, setActiveCategory] = useState('frontend');
  const [backgroundDots, setBackgroundDots] = useState<BackgroundDot[]>([]);
  const [explosionParticles, setExplosionParticles] = useState<ExplosionParticle[]>([]);
  const [isExploding, setIsExploding] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  // Oznaczamy komponent jako zamontowany w przeglądarce
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Inicjalizacja kropek tła po załadowaniu strony
  useEffect(() => {
    if (!isMounted) return;
    
    // Generujemy kropki tła tylko po stronie klienta
    const dots = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      width: 5 + Math.random() * 10,
      height: 5 + Math.random() * 10,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 10 + Math.random() * 20,
      delay: Math.random() * 10,
      opacity: 0.1 + Math.random() * 0.2
    }));
    
    setBackgroundDots(dots);
  }, [isMounted]);
  
  // Generowanie cząsteczek wybuchu przy zmianie kategorii
  useEffect(() => {
    if (!isMounted) return;
    
    const particleCount = 30;
    const particles = Array.from({ length: particleCount }).map((_, i) => {
      const angle = (i / particleCount) * Math.PI * 2;
      const speed = 1 + Math.random() * 2;
      return {
        id: i,
        angle,
        speed,
        scale: 0.5 + Math.random() * 0.5,
        opacity: 0.7 + Math.random() * 0.3
      };
    });
    
    setExplosionParticles(particles);
  }, [isMounted]);
  
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);
  
  const selectedCategory = skillCategories.find(cat => cat.id === activeCategory) || skillCategories[0];
  const colorClasses = colorMap[selectedCategory.color as keyof typeof colorMap];
  
  // Efekt "wybuchu" - animacja przy zmianie kategorii
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
        delayChildren: 0.3
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
  
  // Renderowanie zawartości SSR (bez losowych elementów)
  if (!isMounted) {
    return (
      <section 
        ref={ref} 
        className="py-20 bg-gray-950 overflow-hidden relative"
      >
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="mb-12 text-center">
            <div className={`inline-block mb-3 px-3 py-1 rounded-full ${colorClasses.bgLight} ${colorClasses.border} ${colorClasses.secondary} text-sm`}>
              Moje kompetencje
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">
              Umiejętności techniczne
            </h2>
            
            <p className="max-w-2xl mx-auto text-gray-400">
              Stale rozwijam swoje kompetencje w różnych obszarach inżynierii oprogramowania.
              Odkryj moje kluczowe umiejętności techniczne.
            </p>
          </div>
          
          {/* Uproszczona wersja dla SSR */}
          <div className="grid md:grid-cols-4 gap-8 lg:gap-12 mb-12">
            {skillCategories.map((category) => {
              const catColorClasses = colorMap[category.color as keyof typeof colorMap];
              return (
                <button
                  key={category.id}
                  className={`p-6 rounded-xl text-center ${
                    activeCategory === category.id
                      ? `bg-gradient-to-b ${catColorClasses.bgLight} ${catColorClasses.border}`
                      : 'bg-gray-800/50'
                  } backdrop-blur-sm`}
                >
                  <div className={`mx-auto w-12 h-12 flex items-center justify-center rounded-full ${
                    activeCategory === category.id
                      ? `${catColorClasses.bgLight} ${catColorClasses.primary}`
                      : 'bg-gray-700/50 text-gray-400'
                  } mb-4`}>
                    {category.icon}
                  </div>
                  
                  <h3 className={`text-lg font-medium ${
                    activeCategory === category.id ? catColorClasses.secondary : 'text-gray-200'
                  }`}>
                    {category.name}
                  </h3>
                  
                  <p className="text-sm text-gray-400 mt-2">
                    {category.skills.length} umiejętności
                  </p>
                </button>
              );
            })}
          </div>
          
          {/* Uproszczona wersja pasków umiejętności dla SSR */}
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-4">
              {selectedCategory.skills.map((skill) => (
                <div key={skill.name} className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className={`font-medium ${colorClasses.secondary}`}>{skill.name}</span>
                    <span className="text-gray-400">{skill.level}%</span>
                  </div>
                  <div className={`h-3 w-full rounded-full overflow-hidden ${colorClasses.track}`}>
                    <div className={`h-full rounded-full bg-gradient-to-r ${colorClasses.fill}`} style={{ width: '0%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/umiejetnosci">
              <button
                className={`px-6 py-3 ${colorClasses.bgLight} ${colorClasses.border} rounded-lg ${colorClasses.secondary} font-medium inline-flex items-center gap-2`}
              >
                Zobacz pełne CV
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </button>
            </Link>
          </div>
        </div>
      </section>
    );
  }
  
  // Renderowanie wersji klienta z pełnymi efektami
  return (
    <section 
      ref={ref} 
      className="py-20 bg-gray-950 overflow-hidden relative"
    >
      {/* Animowane kropki w tle - generowane po stronie klienta */}
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
              y: [0, -100, 0],
              opacity: [dot.opacity, dot.opacity * 3, dot.opacity]
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
      
      {/* Interaktywne efekty tła */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-${selectedCategory.color}-500/5 blur-3xl transition-colors duration-700`} />
        <div className={`absolute bottom-1/4 right-1/3 w-72 h-72 rounded-full bg-${selectedCategory.color}-500/5 blur-3xl transition-colors duration-700`} />
        <motion.div 
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-50"
          style={{
            backgroundColor: `rgba(${selectedCategory.colorRgb}, 0.03)`,
            top: '40%',
            left: '60%',
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.03, 0.06, 0.03]
          }}
          transition={{
            repeat: Infinity,
            duration: 8,
            ease: "easeInOut"
          }}
        />
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div 
          className="mb-12 text-center"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <motion.div variants={itemVariants} className={`inline-block mb-3 px-3 py-1 rounded-full ${colorClasses.bgLight} ${colorClasses.border} ${colorClasses.secondary} text-sm transition-colors duration-500`}>
            Moje kompetencje
          </motion.div>
          
          <motion.h2 variants={itemVariants} className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">
            Umiejętności techniczne
          </motion.h2>
          
          <motion.p variants={itemVariants} className="max-w-2xl mx-auto text-gray-400">
            Stale rozwijam swoje kompetencje w różnych obszarach inżynierii oprogramowania.
            Odkryj moje kluczowe umiejętności techniczne.
          </motion.p>
        </motion.div>
        
        {/* Kategorie umiejętności */}
        <div className="grid md:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {skillCategories.map((category) => {
            const catColorClasses = colorMap[category.color as keyof typeof colorMap];
            return (
              <motion.button
                key={category.id}
                className={`p-6 rounded-xl text-center ${
                  activeCategory === category.id
                    ? `bg-gradient-to-b ${catColorClasses.bgLight} ${catColorClasses.border}`
                    : 'bg-gray-800/50 hover:bg-gray-800/80'
                } backdrop-blur-sm transition-all duration-300 relative overflow-hidden`}
                onClick={() => setActiveCategory(category.id)}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: activeCategory === category.id 
                    ? `0 0 30px 5px rgba(${category.colorRgb}, 0.2)` 
                    : '0 0 0 rgba(0, 0, 0, 0)' 
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Efekt świecenia dla aktywnej kategorii */}
                {activeCategory === category.id && (
                  <motion.div 
                    className="absolute inset-0 opacity-30"
                    animate={{ 
                      boxShadow: [
                        `inset 0 0 20px 0 rgba(${category.colorRgb}, 0.5)`,
                        `inset 0 0 40px 0 rgba(${category.colorRgb}, 0.8)`,
                        `inset 0 0 20px 0 rgba(${category.colorRgb}, 0.5)`,
                      ]
                    }}
                    transition={{ 
                      repeat: Infinity,
                      duration: 3,
                    }}
                  />
                )}
                
                {/* Ikonka */}
                <div className={`mx-auto w-12 h-12 flex items-center justify-center rounded-full ${
                  activeCategory === category.id
                    ? `${catColorClasses.bgLight} ${catColorClasses.primary}`
                    : 'bg-gray-700/50 text-gray-400'
                } mb-4 transition-colors duration-300`}>
                  {category.icon}
                </div>
                
                {/* Nazwa kategorii */}
                <h3 className={`text-lg font-medium ${
                  activeCategory === category.id ? catColorClasses.secondary : 'text-gray-200'
                } transition-colors duration-300`}>
                  {category.name}
                </h3>
                
                {/* Liczba umiejętności */}
                <p className="text-sm text-gray-400 mt-2">
                  {category.skills.length} umiejętności
                </p>
                
                {/* Eksplodujące cząsteczki przy zmianie kategorii */}
                {isExploding && activeCategory === category.id && (
                  <AnimatePresence>
                    {explosionParticles.map(particle => (
                      <motion.div
                        key={particle.id}
                        className={`absolute top-1/2 left-1/2 w-2 h-2 rounded-full ${catColorClasses.bg}`}
                        initial={{ x: 0, y: 0, opacity: 1 }}
                        animate={{
                          x: Math.cos(particle.angle) * 100 * particle.speed,
                          y: Math.sin(particle.angle) * 100 * particle.speed,
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
        
        {/* Paski umiejętności dla wybranej kategorii */}
        <motion.div
          className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-8"
          variants={itemVariants}
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-4">
            {selectedCategory.skills.map((skill, index) => (
              <SkillBar 
                key={skill.name} 
                skill={skill} 
                index={index} 
                color={selectedCategory.color} 
              />
            ))}
          </div>
          
          {/* Efekty świecenia w tle dla karty umiejętności */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div 
              className="absolute rounded-full opacity-20 blur-3xl"
              style={{
                backgroundColor: `rgba(${selectedCategory.colorRgb}, 0.2)`,
                width: '200px',
                height: '200px',
                top: '20%',
                right: '10%',
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                repeat: Infinity,
                duration: 8,
                ease: "easeInOut"
              }}
            />
          </div>
        </motion.div>
        
        {/* Link do pełnego CV */}
        <motion.div 
          className="mt-12 text-center"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <Link href="/umiejetnosci">
            <motion.button
              variants={itemVariants}
              className={`px-6 py-3 ${colorClasses.bgLight} ${colorClasses.border} rounded-lg ${colorClasses.secondary} font-medium inline-flex items-center gap-2 hover:translate-y-[-2px] transition-all duration-300`}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: `0 10px 25px -5px rgba(${selectedCategory.colorRgb}, 0.2)` 
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
    </section>
  );
}