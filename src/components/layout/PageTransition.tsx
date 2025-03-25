'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode, useContext, createContext, useState } from 'react';

type TransitionContextType = {
  previousPath: string | null;
  setPreviousPath: (path: string | null) => void;
};

const TransitionContext = createContext<TransitionContextType>({
  previousPath: null,
  setPreviousPath: () => {},
});

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [previousPath, setPreviousPath] = useState<string | null>(null);
  
  return (
    <TransitionContext.Provider value={{ previousPath, setPreviousPath }}>
      {children}
    </TransitionContext.Provider>
  );
}

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { previousPath, setPreviousPath } = useContext(TransitionContext);
  
  const getTransitionStyles = () => {
    if (!previousPath) return {};
    
    const isHomeToBlog = previousPath === '/' && pathname === '/blog';
    const isBlogToHome = previousPath === '/blog' && pathname === '/';
    const isHomeToProject = previousPath === '/' && pathname === '/projekty';
    const isProjectToHome = previousPath === '/projekty' && pathname === '/';
    
    if (isHomeToBlog || isBlogToHome) {
      return {
        initial: { 
          clipPath: isHomeToBlog 
            ? 'circle(0% at 80% 30%)' 
            : 'circle(0% at 20% 70%)',
          opacity: 0 
        },
        animate: { 
          clipPath: 'circle(125% at 50% 50%)', 
          opacity: 1,
          transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
        },
        exit: { 
          clipPath: isHomeToBlog 
            ? 'circle(0% at 80% 30%)' 
            : 'circle(0% at 20% 70%)',
          opacity: 0,
          transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] }
        }
      };
    }
    
    if (isHomeToProject || isProjectToHome) {
      return {
        initial: { opacity: 0, x: isHomeToProject ? '10%' : '-10%' },
        animate: { 
          opacity: 1, 
          x: '0%',
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
        },
        exit: { 
          opacity: 0, 
          x: isHomeToProject ? '-10%' : '10%',
          transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
        }
      };
    }
    
    return {
      initial: { opacity: 0, y: 20 },
      animate: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
      },
      exit: { 
        opacity: 0, 
        y: -20,
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
      }
    };
  };
  
  const transitionStyles = getTransitionStyles();
  
  return (
    <AnimatePresence mode="wait" onExitComplete={() => setPreviousPath(null)}>
      <motion.div
        key={pathname}
        initial={transitionStyles.initial}
        animate={transitionStyles.animate}
        exit={transitionStyles.exit}
        onAnimationStart={() => {
          if (!previousPath) {
            setPreviousPath(pathname);
          }
        }}
        className="w-full h-full"
      >
        {children}
        
        <motion.div 
          className="fixed inset-0 z-50 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
        />
      </motion.div>
    </AnimatePresence>
  );
}