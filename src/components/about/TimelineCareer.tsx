'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useLanguage } from './LanguageProvider';

interface TimelineEvent {
  id: number;
  year: string;
  title: {
    pl: string;
    en: string;
  };
  description: {
    pl: string;
    en: string;
  };
  company: {
    pl: string;
    en: string;
  };
  icon?: React.ReactNode;
  color: string;
  colorRgb: string;
  skills: string[];
}

const timelineData: TimelineEvent[] = [
  {
    id: 1,
    year: '2023',
    title: {
      pl: 'Senior Full Stack Developer',
      en: 'Senior Full Stack Developer'
    },
    description: {
      pl: 'Prowadzenie zespołu odpowiedzialnego za rozwój platformy e-commerce z wykorzystaniem nowoczesnych technologii.',
      en: 'Leading a team responsible for developing an e-commerce platform using modern technologies.'
    },
    company: {
      pl: 'TechMaster Sp. z o.o.',
      en: 'TechMaster Inc.'
    },
    color: 'blue',
    colorRgb: '59, 130, 246',
    skills: ['React', 'Next.js', 'Node.js', 'TypeScript', 'MongoDB']
  },
  {
    id: 2,
    year: '2021',
    title: {
      pl: 'Full Stack Developer',
      en: 'Full Stack Developer'
    },
    description: {
      pl: 'Projektowanie i implementacja aplikacji webowych dla klientów korporacyjnych, integracja z systemami płatności.',
      en: 'Designing and implementing web applications for corporate clients, integration with payment systems.'
    },
    company: {
      pl: 'DataFlow Systems',
      en: 'DataFlow Systems'
    },
    color: 'emerald',
    colorRgb: '16, 185, 129',
    skills: ['React', 'Express.js', 'PostgreSQL', 'Redis', 'Docker']
  },
  {
    id: 3,
    year: '2019',
    title: {
      pl: 'Frontend Developer',
      en: 'Frontend Developer'
    },
    description: {
      pl: 'Rozwój interfejsów użytkownika dla aplikacji SaaS, optymalizacja wydajności i poprawa doświadczenia użytkownika.',
      en: 'Developing user interfaces for SaaS applications, performance optimization and improving user experience.'
    },
    company: {
      pl: 'WebSolutions',
      en: 'WebSolutions'
    },
    color: 'purple',
    colorRgb: '139, 92, 246',
    skills: ['React', 'SCSS', 'JavaScript', 'Webpack', 'Jest']
  },
  {
    id: 4,
    year: '2017',
    title: {
      pl: 'Junior Web Developer',
      en: 'Junior Web Developer'
    },
    description: {
      pl: 'Tworzenie responsywnych stron internetowych oraz wsparcie w rozwoju aplikacji webowych.',
      en: 'Creating responsive websites and supporting web application development.'
    },
    company: {
      pl: 'Studio Graficzne "Pixel"',
      en: 'Graphic Studio "Pixel"'
    },
    color: 'orange',
    colorRgb: '249, 115, 22',
    skills: ['HTML', 'CSS', 'JavaScript', 'PHP', 'WordPress']
  },
  {
    id: 5,
    year: '2016',
    title: {
      pl: 'Inżynier Informatyki - Dyplom',
      en: 'Computer Engineering - Degree'
    },
    description: {
      pl: 'Ukończenie studiów inżynierskich z wyróżnieniem, specjalizacja: programowanie aplikacji.',
      en: 'Graduated with honors, specialization: application programming.'
    },
    company: {
      pl: 'Politechnika Warszawska',
      en: 'Warsaw University of Technology'
    },
    color: 'rose',
    colorRgb: '244, 63, 94',
    skills: ['Algorytmy', 'C++', 'Java', 'Bazy danych', 'Sieci komputerowe']
  }
];

const colorMap: {[key: string]: string} = {
  blue: 'from-blue-600 to-blue-400',
  emerald: 'from-emerald-600 to-emerald-400',
  purple: 'from-purple-600 to-purple-400',
  orange: 'from-orange-600 to-orange-400',
  rose: 'from-rose-600 to-rose-400',
};

export default function TimelineCareer() {
  const [activeEvent, setActiveEvent] = useState<number | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { language } = useLanguage();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
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
  
  return (
    <section 
      ref={ref} 
      className="py-20 bg-gray-950 overflow-hidden relative"
    >
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div 
          className="mb-16 text-center"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div variants={itemVariants} className="inline-block mb-3 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm">
            {language === 'pl' ? 'Moja ścieżka' : 'My path'}
          </motion.div>
          
          <motion.h2 variants={itemVariants} className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">
            {language === 'pl' ? 'Doświadczenie zawodowe' : 'Professional experience'}
          </motion.h2>
          
          <motion.p variants={itemVariants} className="max-w-2xl mx-auto text-gray-400">
            {language === 'pl' 
              ? 'Poznaj moją ścieżkę kariery i najważniejsze etapy rozwoju zawodowego.'
              : 'Explore my career path and the most important stages of professional development.'}
          </motion.p>
        </motion.div>
        
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <motion.div 
              className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-700/50"
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              style={{ transformOrigin: 'top' }}
            />
            
            {/* Timeline events */}
            <div className="relative">
              {timelineData.map((event, index) => {
                const isRight = index % 2 === 0;
                
                return (
                  <div 
                    key={event.id}
                    className={`flex flex-col md:flex-row items-center md:items-start mb-12 ${
                      isRight ? 'md:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Timeline dot */}
                    <motion.div 
                      className={`absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-6 h-6 rounded-full border-2 border-${event.color}-500 bg-gray-900 z-10`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                      transition={{ delay: 0.5 + index * 0.2, duration: 0.4 }}
                      style={{ top: `calc(${index * 100}% + ${index * 48}px)` }}
                    />
                    
                    {/* Year bubble */}
                    <motion.div 
                      className={`absolute left-8 md:left-1/2 transform md:translate-x-8 md:-translate-y-1/2 bg-${event.color}-500/10 border border-${event.color}-500/30 text-${event.color}-400 px-3 py-1 rounded-full text-sm font-medium z-20`}
                      initial={{ x: isRight ? 20 : -20, opacity: 0 }}
                      animate={isInView ? { x: 0, opacity: 1 } : { x: isRight ? 20 : -20, opacity: 0 }}
                      transition={{ delay: 0.7 + index * 0.2, duration: 0.4 }}
                      style={{ top: `calc(${index * 100}% + ${index * 48}px)` }}
                    >
                      {event.year}
                    </motion.div>
                    
                    {/* Content card */}
                    <motion.div 
                      className={`ml-10 md:ml-0 w-full md:w-5/12 ${isRight ? 'md:mr-auto md:pr-16' : 'md:ml-auto md:pl-16'}`}
                      initial={{ 
                        x: isRight ? -30 : 30, 
                        opacity: 0,
                        filter: 'blur(5px)'
                      }}
                      animate={isInView ? { 
                        x: 0, 
                        opacity: 1,
                        filter: 'blur(0px)',
                      } : { 
                        x: isRight ? -30 : 30, 
                        opacity: 0,
                        filter: 'blur(5px)',
                      }}
                      transition={{ delay: 0.9 + index * 0.2, duration: 0.5 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setActiveEvent(activeEvent === event.id ? null : event.id)}
                    >
                      <div className={`p-5 bg-gray-800/30 backdrop-blur-sm border border-${event.color}-500/20 rounded-xl h-full cursor-pointer transition-all duration-300 hover:bg-gray-800/50 hover:shadow-lg hover:shadow-${event.color}-500/5`}>
                        <h3 className={`text-xl font-semibold mb-2 text-${event.color}-400`}>
                          {language === 'pl' ? event.title.pl : event.title.en}
                        </h3>
                        
                        <p className="text-gray-300 text-sm mb-3">
                          {language === 'pl' ? event.company.pl : event.company.en}
                        </p>
                        
                        <p className="text-gray-400 mb-4 text-sm">
                          {language === 'pl' ? event.description.pl : event.description.en}
                        </p>
                        
                        <div className="flex flex-wrap gap-2">
                          {event.skills.slice(0, activeEvent === event.id ? event.skills.length : 3).map((skill) => (
                            <span 
                              key={skill}
                              className={`inline-block px-2 py-1 text-xs rounded-full bg-${event.color}-500/10 text-${event.color}-300`}
                            >
                              {skill}
                            </span>
                          ))}
                          {activeEvent !== event.id && event.skills.length > 3 && (
                            <span 
                              className={`inline-block px-2 py-1 text-xs rounded-full bg-${event.color}-500/10 text-${event.color}-300`}
                            >
                              +{event.skills.length - 3}
                            </span>
                          )}
                        </div>
                        
                        <AnimatePresence>
                          {activeEvent === event.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="mt-4 pt-4 border-t border-gray-700/50"
                            >
                              <div className="text-sm text-gray-400">
                                <p>{language === 'pl' ? 'Kluczowe osiągnięcia:' : 'Key achievements:'}</p>
                                <ul className="mt-2 list-disc pl-5 space-y-1">
                                  <li>{language === 'pl' ? 'Zwiększenie wydajności aplikacji o 40%' : 'Improved application performance by 40%'}</li>
                                  <li>{language === 'pl' ? 'Wdrożenie nowej architektury mikrousług' : 'Implemented new microservices architecture'}</li>
                                  <li>{language === 'pl' ? 'Prowadzenie zespołu 5 programistów' : 'Leading a team of 5 developers'}</li>
                                </ul>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}