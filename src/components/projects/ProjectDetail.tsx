'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from './LanguageProvider';

interface ProjectStage {
  id: number;
  title: {
    pl: string;
    en: string;
  };
  description: {
    pl: string;
    en: string;
  };
  technologies: string[];
  challenges: {
    pl: string[];
    en: string[];
  };
  solutions: {
    pl: string[];
    en: string[];
  };
  image?: string;
}

interface ProjectData {
  id: number;
  title: {
    pl: string;
    en: string;
  };
  description: {
    pl: string;
    en: string;
  };
  overview: {
    pl: string;
    en: string;
  };
  technologies: string[];
  demoUrl: string;
  githubUrl: string;
  image: string;
  color: string;
  colorRgb: string;
  stages: ProjectStage[];
}

interface ProjectDetailProps {
  projectId: number;
}

const projects: ProjectData[] = [
  {
    id: 1,
    title: {
      pl: 'Inteligentny System Analizy Danych',
      en: 'Intelligent Data Analysis System'
    },
    description: {
      pl: 'Aplikacja wykorzystująca zaawansowane algorytmy uczenia maszynowego do analizy i wizualizacji dużych zbiorów danych, z intuicyjnym interfejsem użytkownika.',
      en: 'An application using advanced machine learning algorithms for analyzing and visualizing large datasets, with an intuitive user interface.'
    },
    overview: {
      pl: 'System został zaprojektowany z myślą o analitykach biznesowych, którzy potrzebują narzędzi do szybkiej analizy dużych ilości danych. Aplikacja automatycznie identyfikuje wzorce, anomalie i trendy, prezentując je w formie interaktywnych wizualizacji.',
      en: 'The system was designed for business analysts who need tools for quickly analyzing large amounts of data. The application automatically identifies patterns, anomalies, and trends, presenting them in the form of interactive visualizations.'
    },
    technologies: ['React', 'TensorFlow', 'Python', 'D3.js', 'Flask', 'PostgreSQL', 'Docker'],
    demoUrl: '#',
    githubUrl: '#',
    image: '/placeholder-image.jpg',
    color: 'blue',
    colorRgb: '59, 130, 246',
    stages: [
      {
        id: 1,
        title: {
          pl: 'Analiza wymagań i projektowanie',
          en: 'Requirements analysis and design'
        },
        description: {
          pl: 'Przeprowadzenie warsztatów z klientem w celu zdefiniowania funkcjonalności systemu oraz zaprojektowanie architektury aplikacji i interfejsu użytkownika.',
          en: 'Conducting workshops with the client to define system functionality and designing the application architecture and user interface.'
        },
        technologies: ['Figma', 'Draw.io', 'JIRA'],
        challenges: {
          pl: [
            'Zróżnicowane potrzeby różnych grup użytkowników',
            'Konieczność obsługi wielu formatów danych wejściowych',
            'Zapewnienie intuicyjnego interfejsu dla skomplikowanych funkcji analitycznych'
          ],
          en: [
            'Diverse needs of different user groups',
            'Need to support multiple input data formats',
            'Ensuring an intuitive interface for complex analytical functions'
          ]
        },
        solutions: {
          pl: [
            'Przeprowadzenie badań użytkowników i stworzenie person',
            'Zaprojektowanie elastycznego systemu importu danych',
            'Iteracyjne testy użyteczności prototypów interfejsu'
          ],
          en: [
            'Conducting user research and creating personas',
            'Designing a flexible data import system',
            'Iterative usability testing of interface prototypes'
          ]
        }
      },
      {
        id: 2,
        title: {
          pl: 'Rozwój algorytmów uczenia maszynowego',
          en: 'Development of machine learning algorithms'
        },
        description: {
          pl: 'Implementacja i optymalizacja algorytmów uczenia maszynowego do analizy danych i wykrywania wzorców.',
          en: 'Implementation and optimization of machine learning algorithms for data analysis and pattern detection.'
        },
        technologies: ['Python', 'TensorFlow', 'scikit-learn', 'Pandas', 'NumPy'],
        challenges: {
          pl: [
            'Wydajne przetwarzanie bardzo dużych zbiorów danych',
            'Balansowanie pomiędzy dokładnością a czasem przetwarzania',
            'Adaptacja do różnych typów danych i dziedzin biznesowych'
          ],
          en: [
            'Efficient processing of very large datasets',
            'Balancing between accuracy and processing time',
            'Adaptation to different data types and business domains'
          ]
        },
        solutions: {
          pl: [
            'Implementacja mechanizmów przetwarzania wsadowego i strumieniowego',
            'Opracowanie heurystyk do wstępnego filtrowania danych',
            'Stworzenie pluginów dla specyficznych branż i typów danych'
          ],
          en: [
            'Implementation of batch and stream processing mechanisms',
            'Development of heuristics for preliminary data filtering',
            'Creation of plugins for specific industries and data types'
          ]
        }
      },
      {
        id: 3,
        title: {
          pl: 'Rozwój interfejsu użytkownika',
          en: 'User interface development'
        },
        description: {
          pl: 'Budowa interaktywnego interfejsu użytkownika pozwalającego na intuicyjną eksplorację i wizualizację danych.',
          en: 'Building an interactive user interface allowing for intuitive data exploration and visualization.'
        },
        technologies: ['React', 'TypeScript', 'D3.js', 'Tailwind CSS', 'Framer Motion'],
        challenges: {
          pl: [
            'Prezentacja złożonych danych w przystępny sposób',
            'Zapewnienie responsywności przy dużych zbiorach danych',
            'Zachowanie spójności wizualnej przy różnych typach wizualizacji'
          ],
          en: [
            'Presenting complex data in an accessible way',
            'Ensuring responsiveness with large datasets',
            'Maintaining visual consistency across different types of visualizations'
          ]
        },
        solutions: {
          pl: [
            'Zastosowanie adaptacyjnych widoków i progresywnego ładowania danych',
            'Wirtualizacja list i komponentów dla poprawy wydajności',
            'Stworzenie systemu komponentów z spójnym designem'
          ],
          en: [
            'Using adaptive views and progressive data loading',
            'List and component virtualization for improved performance',
            'Creating a component system with consistent design'
          ]
        }
      },
      {
        id: 4,
        title: {
          pl: 'Integracja i testy',
          en: 'Integration and testing'
        },
        description: {
          pl: 'Integracja frontendu z backendem, końcowe testy i przygotowanie do wdrożenia produkcyjnego.',
          en: 'Frontend and backend integration, final testing, and preparation for production deployment.'
        },
        technologies: ['Jest', 'Cypress', 'GitHub Actions', 'Docker', 'Kubernetes'],
        challenges: {
          pl: [
            'Zapewnienie skalowalności systemu',
            'Obsługa dużej liczby równoczesnych użytkowników',
            'Optymalizacja przepływu danych między frontendem a backendem'
          ],
          en: [
            'Ensuring system scalability',
            'Handling a large number of simultaneous users',
            'Optimizing data flow between frontend and backend'
          ]
        },
        solutions: {
          pl: [
            'Wdrożenie architektury mikrousług',
            'Konfiguracja automatycznego skalowania w Kubernetes',
            'Implementacja systemu cacheowania i strategie lazy loading'
          ],
          en: [
            'Implementation of microservices architecture',
            'Configuration of automatic scaling in Kubernetes',
            'Implementation of caching system and lazy loading strategies'
          ]
        }
      }
    ]
  }
];

export default function ProjectDetail({ projectId }: ProjectDetailProps) {
  const [activeStage, setActiveStage] = useState<number>(1);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const { language } = useLanguage();
  
  const project = projects.find(p => p.id === projectId) || projects[0];
  const currentStage = project.stages.find(s => s.id === activeStage) || project.stages[0];
  
  const colorMap: Record<string, string> = {
    blue: 'from-blue-600 to-blue-400',
    emerald: 'from-emerald-600 to-emerald-400',
    purple: 'from-purple-600 to-purple-400',
    orange: 'from-orange-600 to-orange-400',
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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
    <section className="py-20 bg-gray-950">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="mb-12"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          ref={ref}
        >
          <Link href="/projekty">
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center mb-6 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              {language === 'pl' ? 'Powrót do projektów' : 'Back to projects'}
            </motion.div>
          </Link>
          
          <motion.h1 
            variants={itemVariants}
            className="text-3xl md:text-5xl font-bold mb-4 text-white"
          >
            {language === 'pl' ? project.title.pl : project.title.en}
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-300 mb-8"
          >
            {language === 'pl' ? project.description.pl : project.description.en}
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap gap-3 mb-8"
          >
            {project.technologies.map(tech => (
              <span 
                key={tech}
                className={`inline-block px-3 py-1 text-sm rounded-full bg-${project.color}-500/10 text-${project.color}-300 border border-${project.color}-500/20`}
              >
                {tech}
              </span>
            ))}
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="flex space-x-4 mb-12"
          >
            <a 
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-6 py-3 rounded-lg bg-gradient-to-r ${colorMap[project.color]} text-white font-medium inline-flex items-center gap-2 shadow-lg hover:translate-y-[-2px] transition-all duration-300`}
            >
              {language === 'pl' ? 'Podgląd demo' : 'View demo'}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            </a>
            <a 
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-lg bg-gray-800 text-white font-medium inline-flex items-center gap-2 hover:bg-gray-700 hover:translate-y-[-2px] transition-all duration-300"
            >
              {language === 'pl' ? 'Kod źródłowy' : 'Source code'}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
              </svg>
            </a>
          </motion.div>
        </motion.div>
        
        {/* Project overview */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mb-16"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-2xl md:text-3xl font-bold mb-6 text-white"
          >
            {language === 'pl' ? 'Przegląd projektu' : 'Project overview'}
          </motion.h2>
          
          <div className="grid md:grid-cols-5 gap-8">
            <motion.div 
              variants={itemVariants}
              className="md:col-span-3"
            >
              <p className="text-gray-300 mb-4">
                {language === 'pl' ? project.overview.pl : project.overview.en}
              </p>
              
              <motion.button
                variants={itemVariants}
                className={`text-${project.color}-400 flex items-center gap-1 mt-2`}
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {language === 'pl' 
                  ? (isExpanded ? 'Pokaż mniej' : 'Czytaj więcej')
                  : (isExpanded ? 'Show less' : 'Read more')
                }
                <svg 
                  className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </motion.button>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4"
                  >
                    <p className="text-gray-300 mb-4">
                      {language === 'pl' 
                        ? 'System wykorzystuje zaawansowane algorytmy uczenia maszynowego do automatycznego wykrywania wzorców i anomalii w danych. Dzięki modułowej architekturze, możliwe jest dostosowanie systemu do różnych branż i typów danych. Intuicyjny interfejs użytkownika pozwala na łatwą eksplorację danych i tworzenie niestandardowych wizualizacji bez konieczności posiadania zaawansowanej wiedzy technicznej.'
                        : 'The system uses advanced machine learning algorithms to automatically detect patterns and anomalies in data. Thanks to its modular architecture, it is possible to adapt the system to different industries and data types. The intuitive user interface allows for easy data exploration and creation of custom visualizations without the need for advanced technical knowledge.'
                      }
                    </p>
                    <p className="text-gray-300">
                      {language === 'pl'
                        ? 'Aplikacja została zaprojektowana z myślą o skalowalności i wydajności, wykorzystując architekturę mikrousług oraz zaawansowane mechanizmy cacheowania i lazy loadingu. Dzięki temu system może obsługiwać duże ilości danych i wielu równoczesnych użytkowników, zachowując przy tym responsywność interfejsu.'
                        : 'The application was designed with scalability and performance in mind, using microservices architecture and advanced caching and lazy loading mechanisms. This allows the system to handle large amounts of data and many simultaneous users while maintaining interface responsiveness.'
                      }
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="md:col-span-2 bg-gray-800/30 rounded-xl overflow-hidden border border-gray-700"
            >
              <div className="p-4 bg-gray-800/50">
                <h3 className="text-white font-medium">
                  {language === 'pl' ? 'Najważniejsze funkcje' : 'Key features'}
                </h3>
              </div>
              <ul className="p-4 space-y-3">
                <li className="flex items-start">
                  <svg className={`w-5 h-5 text-${project.color}-400 mr-2 mt-0.5`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-300 text-sm">
                    {language === 'pl' 
                      ? 'Automatyczne wykrywanie wzorców i anomalii'
                      : 'Automatic pattern and anomaly detection'
                    }
                  </span>
                </li>
                <li className="flex items-start">
                  <svg className={`w-5 h-5 text-${project.color}-400 mr-2 mt-0.5`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-300 text-sm">
                    {language === 'pl' 
                      ? 'Interaktywne wizualizacje danych'
                      : 'Interactive data visualizations'
                    }
                  </span>
                </li>
                <li className="flex items-start">
                  <svg className={`w-5 h-5 text-${project.color}-400 mr-2 mt-0.5`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-300 text-sm">
                    {language === 'pl' 
                      ? 'Wsparcie dla różnych formatów danych'
                      : 'Support for various data formats'
                    }
                  </span>
                </li>
                <li className="flex items-start">
                  <svg className={`w-5 h-5 text-${project.color}-400 mr-2 mt-0.5`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-300 text-sm">
                    {language === 'pl' 
                      ? 'Możliwość tworzenia niestandardowych raportów'
                      : 'Ability to create custom reports'
                    }
                  </span>
                </li>
                <li className="flex items-start">
                  <svg className={`w-5 h-5 text-${project.color}-400 mr-2 mt-0.5`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-300 text-sm">
                    {language === 'pl' 
                      ? 'Skalowalność i wysoka wydajność'
                      : 'Scalability and high performance'
                    }
                  </span>
                </li>
              </ul>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Project journey */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-white">
            {language === 'pl' ? 'Proces realizacji' : 'Development process'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {project.stages.map((stage) => (
              <motion.div
                key={stage.id}
                className={`p-5 rounded-xl cursor-pointer transition-all duration-300 ${
                  activeStage === stage.id 
                    ? `bg-${project.color}-500/20 border border-${project.color}-500/30` 
                    : 'bg-gray-800/30 border border-gray-700 hover:bg-gray-800/50'
                }`}
                onClick={() => setActiveStage(stage.id)}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`text-lg font-medium ${
                    activeStage === stage.id ? `text-${project.color}-400` : 'text-white'
                  }`}>
                    {language === 'pl' ? stage.title.pl : stage.title.en}
                  </h3>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    activeStage === stage.id ? `bg-${project.color}-500/20 text-${project.color}-400` : 'bg-gray-700/50 text-gray-400'
                  }`}>
                    {stage.id}
                  </div>
                </div>
                
                <p className={`text-sm ${
                  activeStage === stage.id ? 'text-gray-200' : 'text-gray-400'
                }`}>
                  {(language === 'pl' ? stage.description.pl : stage.description.en).substring(0, 100)}...
                </p>
              </motion.div>
            ))}
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className={`p-8 rounded-xl bg-gray-800/30 border border-${project.color}-500/20`}
            >
              <h3 className={`text-xl font-semibold mb-4 text-${project.color}-400`}>
                {language === 'pl' ? currentStage.title.pl : currentStage.title.en}
              </h3>
              
              <p className="text-gray-300 mb-6">
                {language === 'pl' ? currentStage.description.pl : currentStage.description.en}
              </p>
              
              <div className="grid md:grid-cols-2 gap-8 mb-6">
                <div>
                  <h4 className="text-white font-medium mb-3">
                    {language === 'pl' ? 'Wyzwania' : 'Challenges'}
                  </h4>
                  <ul className="space-y-2">
                    {(language === 'pl' ? currentStage.challenges.pl : currentStage.challenges.en).map((challenge, index) => (
                      <li key={index} className="flex items-start">
                        <svg className={`w-5 h-5 text-${project.color}-400 mr-2 mt-0.5 flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span className="text-gray-300">{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-white font-medium mb-3">
                    {language === 'pl' ? 'Rozwiązania' : 'Solutions'}
                  </h4>
                  <ul className="space-y-2">
                    {(language === 'pl' ? currentStage.solutions.pl : currentStage.solutions.en).map((solution, index) => (
                      <li key={index} className="flex items-start">
                        <svg className={`w-5 h-5 text-${project.color}-400 mr-2 mt-0.5 flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                        </svg>
                        <span className="text-gray-300">{solution}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div>
                <h4 className="text-white font-medium mb-3">
                  {language === 'pl' ? 'Technologie' : 'Technologies'}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentStage.technologies.map((tech) => (
                    <span 
                      key={tech}
                      className={`inline-block px-3 py-1 text-sm rounded-full bg-${project.color}-500/10 text-${project.color}-300 border border-${project.color}-500/20`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}