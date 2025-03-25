'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Dane projektów
const projects = [
  {
    id: 1,
    title: 'Inteligentny System Analizy Danych',
    description: 'Aplikacja wykorzystująca zaawansowane algorytmy uczenia maszynowego do analizy i wizualizacji dużych zbiorów danych, z intuicyjnym interfejsem użytkownika.',
    technologies: ['React', 'TensorFlow', 'Python', 'D3.js'],
    image: '/placeholder-image.jpg', // w późniejszym etapie dodamy prawdziwe obrazy
    color: 'from-blue-500 to-cyan-400',
    colorRgb: '59, 130, 246',
    demoUrl: '#',
    githubUrl: '#'
  },
  {
    id: 2,
    title: 'Aplikacja do Zarządzania Projektami',
    description: 'System workflow umożliwiający efektywną współpracę zespołów programistycznych, śledzenie postępów prac i automatyzację procesów CI/CD.',
    technologies: ['Next.js', 'TypeScript', 'MongoDB', 'Docker'],
    image: '/placeholder-image.jpg',
    color: 'from-emerald-500 to-green-400',
    colorRgb: '16, 185, 129',
    demoUrl: '#',
    githubUrl: '#'
  },
  {
    id: 3,
    title: 'Platforma IoT Smart Home',
    description: 'Zaawansowana platforma do zarządzania urządzeniami inteligentnego domu, z funkcjami automatyzacji, rozpoznawania głosu i uczenia się preferencji użytkownika.',
    technologies: ['React Native', 'Node.js', 'MQTT', 'Firebase'],
    image: '/placeholder-image.jpg',
    color: 'from-purple-500 to-indigo-400',
    colorRgb: '139, 92, 246',
    demoUrl: '#',
    githubUrl: '#'
  },
  {
    id: 4,
    title: 'System Rekomendacji AI',
    description: 'Algorytm rekomendacji oparty na uczeniu maszynowym, analizujący zachowania użytkowników i dostarczający spersonalizowane sugestie w czasie rzeczywistym.',
    technologies: ['Python', 'PyTorch', 'FastAPI', 'Redis'],
    image: '/placeholder-image.jpg',
    color: 'from-rose-500 to-red-400',
    colorRgb: '244, 63, 94',
    demoUrl: '#',
    githubUrl: '#'
  }
];

interface ProjectCardProps {
  project: typeof projects[0];
  index: number;
  isSelected: boolean;
  onSelect: (id: number) => void;
}

interface Particle {
  id: number;
  initialX: number;
  initialY: number;
  finalX: number;
  finalY: number;
  scale: number;
  duration: number;
  delay: number;
}

// Komponent karty projektu z efektem 3D - ZNACZNIE SPOWOLNIONE ANIMACJE
const ProjectCard = ({ project, index, isSelected, onSelect }: ProjectCardProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [mouseEnter, setMouseEnter] = useState(false);
  const [clickEffect, setClickEffect] = useState<{x: number, y: number, time: number} | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Oznaczamy komponent jako zamontowany w przeglądarce
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Generowanie cząsteczek efektu holograficznego - ZREDUKOWANE
  useEffect(() => {
    if (!isMounted) return;
    
    // Znacznie mniej cząsteczek
    const newParticles = Array.from({ length: isSelected ? 3 : 0 }, (_, i) => ({
      id: i,
      initialX: Math.random() * 100,
      initialY: Math.random() * 100,
      finalX: Math.random() * 100,
      finalY: Math.random() * 100,
      scale: 0.5 + Math.random() * 0.5,
      duration: 20 + i * 4 + Math.random() * 10, // Znacznie wolniejsze (było 10 + i * 2)
      delay: i * 1.0 // Większe opóźnienie (było 0.5)
    }));
    
    setParticles(newParticles);
  }, [isMounted, isSelected]);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    
    // Obliczamy pozycję, ale aplikujemy ją wolniej przez useEffect
    const newPosition = {
      x: (e.clientX - rect.left) / rect.width - 0.5,  // -0.5 to 0.5
      y: (e.clientY - rect.top) / rect.height - 0.5   // -0.5 to 0.5
    };
    
    // Wolniejsze śledzenie ruchu myszy
    setMousePosition(prev => ({
      x: prev.x + (newPosition.x - prev.x) * 0.1, // Wygładzenie ruchu
      y: prev.y + (newPosition.y - prev.y) * 0.1  // Wygładzenie ruchu
    }));
  };
  
  const handleMouseEnter = () => {
    setMouseEnter(true);
  };
  
  const handleMouseLeave = () => {
    // Płynny powrót do pozycji początkowej
    setMousePosition({ x: 0, y: 0 });
    setMouseEnter(false);
  };
  
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setClickEffect({
      x: x,
      y: y,
      time: Date.now()
    });
    
    onSelect(project.id);
  };
  
  // Obliczenie rotacji 3D - DRASTYCZNIE ZMNIEJSZONA
  const rotateX = mousePosition.y * 3; // Zmniejszone z 15 do 3 stopni
  const rotateY = mousePosition.x * -3; // Zmniejszone z 15 do 3 stopni
  
  // Sprawdzenie czy mamy efekt kliknięcia
  const hasClickEffect = clickEffect && Date.now() - clickEffect.time < 2000; // Wydłużony czas efektu (było 800ms)
  
  // Renderujemy efekty tylko po stronie klienta
  if (!isMounted) {
    return (
      <motion.div
        className="relative overflow-hidden rounded-xl cursor-pointer"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, delay: index * 0.2 }} // Wolniejsza animacja (było 0.5, delay * 0.1)
      >
        {/* Podstawowa zawartość dla SSR */}
        <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-80`} />
        <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" />
        <div className="relative z-10 p-6 h-full flex flex-col justify-between">
          {/* Minimalny interfejs dla SSR */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-white">{project.title}</h3>
            <p className="text-sm text-gray-200 line-clamp-2">{project.description}</p>
          </div>
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      ref={cardRef}
      className={`relative overflow-hidden rounded-xl cursor-pointer transition-all duration-700 ${
        isSelected ? 'ring-2 ring-offset-4 ring-offset-gray-900' : ''
      }`}
      style={{
        transformStyle: 'preserve-3d',
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isSelected ? 1.01 : 1})`,
        transition: 'transform 0.8s linear', // Dodane wolne przejście
        boxShadow: isSelected 
          ? `0 25px 50px -12px rgba(0, 0, 0, 0.3), 
             0 0 20px 2px rgba(${project.colorRgb}, 0.2)` // Mniejsza intensywność
          : '0 10px 30px -15px rgba(0, 0, 0, 0.2)',
      }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 1.0, // Wolniejsza animacja (było 0.5)
        delay: index * 0.2, // Większe opóźnienie (było * 0.1)
      }}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="transition-transform duration-700 hover:scale-[1.01]" // Mniejsza skala, wolniejsza animacja
    >
      {/* Gradientowe tło */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-${isSelected ? '100' : '80'} transition-opacity duration-700`}
      />
      
      {/* Półprzezroczysta nakładka dla lepszej czytelności tekstu */}
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" />
      
      {/* Świecące krawędzie (tylko dla wybranego projektu) - SPOWOLNIONE */}
      {isSelected && (
        <motion.div 
          className="absolute inset-0 z-0 opacity-50" // Zmniejszona nieprzezroczystość
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.2, 0.3, 0.2], // Mniejszy zakres
            boxShadow: [
              `0 0 10px 1px rgba(${project.colorRgb}, 0.2)`, // Mniejsza intensywność
              `0 0 15px 2px rgba(${project.colorRgb}, 0.3)`,
              `0 0 10px 1px rgba(${project.colorRgb}, 0.2)`
            ]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 5, // Wolniejsza animacja (było 3s)
          }}
        />
      )}
      
      {/* Efekt kliknięcia - fala rozchodząca się od miejsca kliknięcia - SPOWOLNIONA */}
      <AnimatePresence>
        {hasClickEffect && (
          <>
            <motion.div
              className="absolute rounded-full bg-white/20" // Mniejsza intensywność
              style={{
                top: clickEffect.y,
                left: clickEffect.x,
                transformOrigin: 'center center',
              }}
              initial={{ width: 0, height: 0, opacity: 0.5 }}
              animate={{ 
                width: 500, 
                height: 500, 
                opacity: 0,
                x: -250,
                y: -250,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.0, ease: "linear" }} // Wolniejsza animacja (było 0.8, ease: "easeOut")
            />
            <motion.div
              className={`absolute rounded-full`}
              style={{
                top: clickEffect.y,
                left: clickEffect.x,
                backgroundColor: `rgba(${project.colorRgb}, 0.2)`, // Mniejsza intensywność
                transformOrigin: 'center center',
              }}
              initial={{ width: 0, height: 0, opacity: 0.5 }}
              animate={{ 
                width: 300, 
                height: 300, 
                opacity: 0,
                x: -150,
                y: -150,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.0, ease: "linear", delay: 0.2 }} // Wolniejsza animacja (było 0.6, ease: "easeOut")
            />
          </>
        )}
      </AnimatePresence>
      
      {/* Zawartość karty */}
      <div className="relative z-10 p-6 h-full flex flex-col justify-between">
        <div>
          <div className="mb-2">
            {project.technologies.slice(0, 3).map(tech => (
              <span 
                key={tech} 
                className="inline-block px-2 py-1 text-xs mr-2 mb-2 rounded-full bg-white/20 backdrop-blur-sm transition-colors duration-500 hover:bg-white/25"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span 
                className="inline-block px-2 py-1 text-xs rounded-full bg-white/20 backdrop-blur-sm transition-colors duration-500 hover:bg-white/25"
              >
                +{project.technologies.length - 3}
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold mb-3 text-white">{project.title}</h3>
          <p className={`text-sm text-gray-200 ${isSelected ? 'line-clamp-none' : 'line-clamp-2'}`}>
            {project.description}
          </p>
        </div>
        
        <AnimatePresence>
          {isSelected && (
            <motion.div 
              className="mt-4 flex space-x-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 1.0 }} // Wolniejsza animacja (było 0.3)
            >
              <a 
                href={project.demoUrl} 
                className="px-3 py-1.5 text-sm bg-white/90 text-gray-900 rounded-lg font-medium transition-all duration-500 hover:bg-white hover:translate-y-[-2px]"
                target="_blank" 
                rel="noopener noreferrer"
              >
                Demo
              </a>
              <a 
                href={project.githubUrl} 
                className="px-3 py-1.5 text-sm bg-gray-800/70 text-white rounded-lg font-medium transition-all duration-500 hover:bg-gray-800 hover:translate-y-[-2px]"
                target="_blank" 
                rel="noopener noreferrer"
              >
                Kod
              </a>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Holograficzny efekt - delikatne świecące kropki ZREDUKOWANE */}
        <div 
          className="absolute inset-0 pointer-events-none overflow-hidden" 
          style={{ 
            background: mouseEnter 
              ? `radial-gradient(circle at ${(mousePosition.x + 0.5) * 100}% ${(mousePosition.y + 0.5) * 100}%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)` // Mniejsza intensywność
              : 'none',
            transition: 'background 0.8s ease-out' // Wolniejsza animacja
          }}
        >
          {particles.map(particle => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full bg-white/5 blur-lg" // Mniejsza intensywność
              style={{
                width: "10px",
                height: "10px",
              }}
              initial={{ 
                x: `${particle.initialX}%`, 
                y: `${particle.initialY}%`, 
                scale: particle.scale,
                opacity: 0
              }}
              animate={{ 
                x: [
                  `${particle.initialX}%`, 
                  `${particle.finalX}%`,
                  `${Math.random() * 100}%`
                ], 
                y: [
                  `${particle.initialY}%`, 
                  `${particle.finalY}%`,
                  `${Math.random() * 100}%`
                ],
                scale: [particle.scale, particle.scale * 1.2, particle.scale * 0.9], // Mniejszy zakres
                opacity: [0, 0.5, 0] // Mniejsza intensywność
              }}
              transition={{ 
                repeat: Infinity, 
                duration: particle.duration, 
                ease: "linear",
                delay: particle.delay,
                times: [0, 0.5, 1]
              }}
            />
          ))}
        </div>
        
        {/* Interaktywny highlight wokół kursora - SUBTELNIEJSZY */}
        {mouseEnter && (
          <motion.div
            className="absolute pointer-events-none"
            style={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              x: mousePosition.x * cardRef.current?.offsetWidth! + (cardRef.current?.offsetWidth! / 2) - 50,
              y: mousePosition.y * cardRef.current?.offsetHeight! + (cardRef.current?.offsetHeight! / 2) - 50,
              background: `radial-gradient(circle, rgba(${project.colorRgb}, 0.08) 0%, transparent 70%)`, // Mniejsza intensywność
              mixBlendMode: 'soft-light'
            }}
            transition={{
              x: { duration: 0.8, ease: "linear" }, // Wolniejsza animacja
              y: { duration: 0.8, ease: "linear" }, // Wolniejsza animacja
            }}
          />
        )}
      </div>
    </motion.div>
  );
};

export default function FeaturedProjects() {
  const [selectedProject, setSelectedProject] = useState<number>(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Wolniejsze pojawianie się (było 0.1)
        delayChildren: 0.5, // Większe opóźnienie (było 0.3)
        duration: 1.5 // Dodane dłuższe trwanie
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 1.0 } // Wolniejsza animacja (było 0.5)
    }
  };
  
  // Znajduje wybrany projekt
  const currentProject = projects.find(p => p.id === selectedProject) || projects[0];
  
  return (
    <section 
      ref={ref} 
      className="py-20 bg-gradient-to-b from-gray-900 to-gray-950 overflow-hidden relative"
    >
      {/* Rozszerzona dekoracja tła - SPOWOLNIONA */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className={`absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-500/3 blur-3xl`} /> {/* Zmniejszona intensywność */}
        <div className={`absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full bg-purple-500/3 blur-3xl`} /> {/* Zmniejszona intensywność */}
        <div className={`absolute top-1/2 right-1/4 w-72 h-72 rounded-full bg-emerald-500/3 blur-3xl`} /> {/* Zmniejszona intensywność */}
        
        {/* Dodatkowy element dekoracyjny dla wybranego projektu - SPOWOLNIONY */}
        <motion.div 
          className={`absolute w-96 h-96 rounded-full blur-3xl transition-colors duration-1500`} // Wolniejsze przejście kolorów
          animate={{
            backgroundColor: `rgba(${currentProject.colorRgb}, 0.03)`, // Mniejsza intensywność
            x: [0, 10, 0], // Mniejszy zakres
            y: [0, -10, 0], // Mniejszy zakres
          }}
          transition={{
            backgroundColor: { duration: 2 }, // Wolniejsze przejście
            x: { repeat: Infinity, duration: 25, ease: "linear" }, // Znacznie wolniejsza animacja
            y: { repeat: Infinity, duration: 30, ease: "linear" }  // Znacznie wolniejsza animacja
          }}
          style={{
            top: '30%',
            left: '60%',
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
          <motion.div 
            variants={itemVariants} 
            className={`inline-block mb-3 px-3 py-1 rounded-full border border-${currentProject.color.split('-')[1]}/30 bg-${currentProject.color.split('-')[1]}/10 text-${currentProject.color.split('-')[1]}-400 text-sm transition-colors duration-1500`} // Wolniejsza animacja
          >
            Moje prace
          </motion.div>
          
          <motion.h2 variants={itemVariants} className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">
            Wyróżnione projekty
          </motion.h2>
          
          <motion.p variants={itemVariants} className="max-w-2xl mx-auto text-gray-400">
            Odkryj moje najlepsze realizacje. Każdy projekt to unikalne wyzwania
            i innowacyjne rozwiązania techniczne.
          </motion.p>
        </motion.div>
        
        {/* Projekty w siatce z efektem 3D */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              isSelected={project.id === selectedProject}
              onSelect={setSelectedProject}
            />
          ))}
        </div>
        
        <motion.div 
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <Link href="/projekty">
            <motion.button
              variants={itemVariants}
              className={`px-6 py-3 bg-gradient-to-r from-${currentProject.color.split('-')[1]}-600 to-${currentProject.color.split('-')[1]}-500 rounded-lg text-white font-medium inline-flex items-center gap-2 transition-all duration-700 hover:translate-y-[-2px]`}
              whileHover={{ 
                scale: 1.01, // Mniejsza skala (było 1.05)
                boxShadow: `0 10px 25px -5px rgba(${currentProject.colorRgb}, 0.2)` // Mniejsza intensywność
              }}
              whileTap={{ scale: 0.99 }} // Mniejsza skala (było 0.98)
            >
              Zobacz wszystkie projekty
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