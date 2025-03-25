'use client';

import { ReactNode, useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';

interface ParallaxLayerProps {
  children: ReactNode;
  speed?: number;
  className?: string;
  horizontalOffset?: number;
  scale?: number;
  opacity?: number[] | MotionValue<number>;
}

export function ParallaxLayer({
  children,
  speed = 1,
  className = "",
  horizontalOffset = 0,
  scale,
  opacity,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const yRange = useTransform(
    scrollYProgress,
    [0, 1],
    [0, speed * 100]
  );
  
  const xRange = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [horizontalOffset * -1, 0, horizontalOffset]
  );
  
  const y = useSpring(yRange, { stiffness: 100, damping: 30 });
  const x = useSpring(xRange, { stiffness: 100, damping: 30 });
  
  const scaleValue = scale
    ? useTransform(scrollYProgress, [0, 0.5, 1], [scale, 1, scale])
    : undefined;
  
  const opacityValue = typeof opacity === 'object' && !Array.isArray(opacity)
    ? opacity
    : Array.isArray(opacity)
      ? useTransform(scrollYProgress, [0, 0.1, 0.9, 1], opacity)
      : undefined;
  
  return (
    <motion.div
      ref={ref}
      style={{ 
        y, 
        x, 
        scale: scaleValue,
        opacity: opacityValue,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  depth: number;
}

interface ParallaxBackgroundProps {
  particleCount?: number;
  children?: ReactNode;
}

export function ParallaxBackground({ 
  particleCount = 50,
  children 
}: ParallaxBackgroundProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [initialized, setInitialized] = useState(false);
  const { scrollYProgress } = useScroll();
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
      
      const handleResize = () => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
      };
      
      window.addEventListener('resize', handleResize);
      
      const newParticles = Array.from({ length: particleCount }).map(() => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight * 3, 
        size: Math.random() * 4 + 1, 
        speed: Math.random() * 0.5 + 0.1, 
        opacity: Math.random() * 0.5 + 0.1,
        depth: Math.random() * 3 + 1 
      }));
      
      setParticles(newParticles);
      setInitialized(true);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [particleCount]);
  
  return (
    <div className="relative overflow-hidden">
      {initialized && (
        <div className="fixed inset-0 pointer-events-none z-0">
          {particles.map((particle, i) => {
            const yValue = useTransform(
              scrollYProgress,
              [0, 1],
              [0, particle.depth * -300]
            );
            
            return (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  x: particle.x,
                  y: yValue,
                  width: particle.size,
                  height: particle.size,
                  opacity: particle.opacity,
                  filter: `blur(${(3 - particle.depth) * 0.5}px)`,
                }}
              />
            );
          })}
        </div>
      )}
      
      {children}
    </div>
  );
}

export function ParallaxSection({ children }: { children: ReactNode }) {
  return (
    <div className="relative overflow-hidden">
      {children}
    </div>
  );
}