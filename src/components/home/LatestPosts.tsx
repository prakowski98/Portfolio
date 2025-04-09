'use client';

import { useRef, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import Link from 'next/link';

// Dane przykładowe dla bloga
const blogPosts = [
  {
    id: 1,
    title: 'Przyszłość rozwoju aplikacji webowych na rok 2025',
    excerpt: 'Przegląd najnowszych trendów i technologii, które będą kształtować przyszłość aplikacji internetowych. Od AI po WebAssembly.',
    date: '2025-03-15',
    readTime: '8 min',
    tags: ['Web Development', 'Trendy'],
    color: 'blue',
    image: '/placeholder-blog.jpg' // w ostatecznej wersji zastąpić prawdziwym obrazem
  },
  {
    id: 2,
    title: 'Jak zoptymalizować wydajność aplikacji React',
    excerpt: 'Szczegółowy przewodnik po metodach optymalizacji aplikacji React. Poznaj zaawansowane techniki zwiększające wydajność.',
    date: '2025-02-28',
    readTime: '12 min',
    tags: ['React', 'Performance'],
    color: 'emerald',
    image: '/placeholder-blog.jpg'
  },
  {
    id: 3,
    title: 'Architektura mikrousług: wdrażanie i monitorowanie',
    excerpt: 'Praktyczne podejście do wdrażania architektury mikrousług, wraz z narzędziami do monitorowania i rozwiązywania problemów.',
    date: '2025-02-10',
    readTime: '10 min',
    tags: ['Mikrousługi', 'DevOps'],
    color: 'purple',
    image: '/placeholder-blog.jpg'
  }
];

// Komponent pojedynczego wpisu blog z efektem 3D - SPOWOLNIONY
const BlogCard = ({ post, index }: { post: typeof blogPosts[0], index: number }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    // Obliczamy pozycję, ale aplikujemy ją wolniej
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
    setIsHovered(true);
  };
  
  const handleMouseLeave = () => {
    // Płynny powrót do pozycji początkowej
    setMousePosition({ x: 0, y: 0 });
    setIsHovered(false);
  };
  
  // Obliczenie rotacji 3D - ZMNIEJSZONA
  const rotateY = mousePosition.x * 2; // Zmniejszone z 10 do 2 stopni
  const rotateX = mousePosition.y * -2; // Zmniejszone z 10 do 2 stopni
  
  // Mapowanie kolorów
  const colorMap: Record<string, string> = {
    blue: 'from-blue-500/20 to-blue-700/20 border-blue-500/30',
    emerald: 'from-emerald-500/20 to-emerald-700/20 border-emerald-500/30',
    purple: 'from-purple-500/20 to-purple-700/20 border-purple-500/30'
  };
  
  const tagColorMap: Record<string, string> = {
    blue: 'bg-blue-500/20 text-blue-300',
    emerald: 'bg-emerald-500/20 text-emerald-300',
    purple: 'bg-purple-500/20 text-purple-300'
  };
  
  const dateColor: Record<string, string> = {
    blue: 'text-blue-400',
    emerald: 'text-emerald-400',
    purple: 'text-purple-400'
  };
  
  return (
    <motion.div
      ref={cardRef}
      className={`rounded-xl overflow-hidden border bg-gradient-to-br ${colorMap[post.color]} backdrop-blur-sm relative h-full`}
      style={{
        transformStyle: 'preserve-3d',
        transform: isHovered 
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)` 
          : 'perspective(1000px) rotateX(0) rotateY(0)',
        transition: 'transform 1s linear', // Spowolnione przejście
        boxShadow: isHovered 
          ? '0 20px 40px -10px rgba(0, 0, 0, 0.3)' // Zmniejszona intensywność
          : '0 10px 20px -15px rgba(0, 0, 0, 0.2)',
      }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.0, delay: index * 0.2 }} // Wolniejsza animacja
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="transition-transform duration-1000 hover:scale-[1.01]" // Mniejsza skala z wolniejszą animacją
    >
      <Link href={`/blog/${post.id}`} className="block h-full">
        <div className="p-4 flex flex-col h-full">
          {/* Tagi */}
          <div className="mb-2 flex flex-wrap gap-1.5">
            {post.tags.map(tag => (
              <span 
                key={tag} 
                className={`inline-block px-2 py-0.5 text-xs rounded-full ${tagColorMap[post.color]}`}
              >
                {tag}
              </span>
            ))}
          </div>
          
          {/* Tytuł */}
          <h3 className="text-lg font-bold mb-2 text-white">
            {post.title}
          </h3>
          
          {/* Fragment */}
          <p className="text-sm text-gray-300 mb-3 flex-grow">
            {post.excerpt}
          </p>
          
          {/* Data i czas czytania */}
          <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-700/50 text-xs">
            <span className={dateColor[post.color]}>
              {new Date(post.date).toLocaleDateString('pl-PL', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
            <span className="text-gray-400">
              {post.readTime} czytania
            </span>
          </div>
        </div>
        
        {/* Efekt "glare" dla karty - subtelny efekt świecenia - ZREDUKOWANY */}
        {isHovered && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${(mousePosition.x + 0.5) * 100}% ${(mousePosition.y + 0.5) * 100}%, rgba(255, 255, 255, 0.05) 0%, transparent 60%)`,
              opacity: 0.4,
              transition: 'background 1s linear' // Spowolnione przejście
            }}
          />
        )}
      </Link>
    </motion.div>
  );
};

export default function LatestPosts() {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  // Efekt pojawiania się elementów - SPOWOLNIONY
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Wolniejsze pojawianie (było 0.1)
        delayChildren: 0.5, // Większe opóźnienie (było 0.3)
        duration: 1.5 // Dłuższy czas trwania
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 1.2 } // Wolniejsza animacja (było 0.5)
    }
  };
  
  return (
    <section 
      ref={ref} 
      className="py-14 bg-gradient-to-b from-gray-950 to-gray-900 overflow-hidden relative"
    >
      {/* Dekoracyjne elementy tła - ZREDUKOWANE */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-600/3 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600/3 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div 
          className="mb-8 text-center"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="inline-block mb-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm">
            Blog
          </motion.div>
          
          <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">
            Najnowsze artykuły
          </motion.h2>
          
          <motion.p variants={itemVariants} className="max-w-2xl mx-auto text-gray-400">
            Dzielę się swoją wiedzą i przemyśleniami na temat najnowszych trendów w technologii,
            programowaniu i inżynierii oprogramowania.
          </motion.p>
        </motion.div>
        
        {/* Wpisy bloga z efektem 3D */}
        <div className="grid md:grid-cols-3 gap-5 mb-8">
          {blogPosts.map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} />
          ))}
        </div>
        
        {/* Link do wszystkich artykułów */}
        <motion.div 
          className="text-center"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <Link href="/blog">
            <button
              className="px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 font-medium inline-flex items-center gap-2 transition-all duration-700 hover:translate-y-[-2px]"
            >
              Zobacz wszystkie artykuły
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}