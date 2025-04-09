'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import * as THREE from 'three';
import { ShaderMaterial } from 'three';

// Shadery dla efektu płynnego tła - pozostawione bez zmian
const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float time;
  uniform vec2 resolution;
  uniform vec2 mousePosition;
  uniform vec3 color1;
  uniform vec3 color2;
  uniform vec3 color3;
  uniform vec3 color4;
  
  varying vec2 vUv;
  varying vec3 vPosition;
  
  // Funkcja szumowa dla organicznego efektu
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
      -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
      + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
      dot(x12.zw, x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = vUv;
    vec2 mouse = mousePosition;
    
    // Obliczanie odległości od myszy dla efektu interaktywności
    float distanceToMouse = length(uv - mouse);
    
    // Tworzenie dużych, płynnych fal
    float time1 = time * 0.05;
    float n1 = snoise(vec2(uv.x * 2.0 + time1, uv.y * 2.0 - time1));
    float n2 = snoise(vec2(uv.x * 1.4 - time1 * 0.8, uv.y * 1.4 + time1 * 0.8));
    float n3 = snoise(vec2(uv.x * 3.5 + time1 * 0.5, uv.y * 3.5 - time1 * 0.5));
    
    // Wpływ myszy na animację - siła fal zwiększa się bliżej kursora
    float mouseInfluence = smoothstep(0.6, 0.0, distanceToMouse) * 0.8;
    n1 = mix(n1, n1 * 1.5, mouseInfluence);
    n2 = mix(n2, n2 * 1.5, mouseInfluence);
    
    // Mieszanie szumów dla bardziej organicznego efektu
    float mixer1 = n1 * 0.5 + 0.5;
    float mixer2 = n2 * 0.5 + 0.5;
    float mixer3 = n3 * 0.5 + 0.5;
    
    // Efekt koncentrycznych kół wokół kursora
    float rings = sin(distanceToMouse * 20.0 - time * 0.5) * 0.5 + 0.5;
    rings *= smoothstep(0.6, 0.0, distanceToMouse); // Zanikanie z odległością
    
    // Mieszanie kolorów
    vec3 baseColor = mix(color1, color2, mixer1);
    baseColor = mix(baseColor, color3, mixer2 * 0.6);
    baseColor = mix(baseColor, color4, rings * 0.2);
    
    // Dodanie subtelnego gradientu głębi
    baseColor = mix(baseColor, mix(color1, color4, uv.y), 0.2);
    
    // Poprawka jasności i finalny kolor
    gl_FragColor = vec4(baseColor, 1.0);
  }
`;

// Komponent implementujący tło Three.js - z minimalnymi zmianami dla wydajności
function ThreeJSBackground({ mousePosition }) {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const materialRef = useRef(null);
  const reqAnimFrameRef = useRef(null);
  const timeRef = useRef(0);

  // Inicjalizacja Three.js
  useEffect(() => {
    if (!mountRef.current) return;

    // Tworzenie sceny
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Kamera
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;
    cameraRef.current = camera;

    // Renderer z dostosowaniem do urządzenia
    const isMobile = window.innerWidth < 768;
    const renderer = new THREE.WebGLRenderer({ 
      antialias: !isMobile, // Wyłączamy antyaliasing na mobilnych
      alpha: true
    });
    
    // Mniejszy pixelRatio na mobilnych dla lepszej wydajności
    const pixelRatio = isMobile ? 
      Math.min(1.5, window.devicePixelRatio) : window.devicePixelRatio;
    renderer.setPixelRatio(pixelRatio);
    
    rendererRef.current = renderer;

    // Material z shaderami - standardowy
    const uniforms = {
      time: { value: 0 },
      resolution: { value: new THREE.Vector2(1, 1) },
      mousePosition: { value: new THREE.Vector2(0.5, 0.5) },
      color1: { value: new THREE.Color(0x0f172a) }, // Ciemny niebieski
      color2: { value: new THREE.Color(0x1e293b) }, // Granatowy
      color3: { value: new THREE.Color(0x3b82f6) }, // Niebieski
      color4: { value: new THREE.Color(0x8b5cf6) }  // Fioletowy
    };

    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true
    });
    materialRef.current = material;

    // Geometria (płaszczyzna pokrywająca cały ekran)
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Dodanie renderera do DOM
    mountRef.current.appendChild(renderer.domElement);
    
    // Obsługa responsywności
    const handleResize = () => {
      if (mountRef.current && rendererRef.current) {
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        
        uniforms.resolution.value.set(width, height);
        rendererRef.current.setSize(width, height);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();

    // Funkcja animacji z dostosowaniem prędkości
    const isMobileDevice = window.innerWidth < 768;
    const frameSkip = isMobileDevice ? 2 : 1; // Renderuj co drugą klatkę na mobilnych
    let frameCount = 0;
    
    const animate = () => {
      frameCount++;
      
      // Opuszczanie klatek na urządzeniach mobilnych dla oszczędności baterii
      if (frameCount % frameSkip === 0) {
        timeRef.current += isMobileDevice ? 0.008 : 0.01; // Nieco wolniejsza animacja na mobile
        
        if (materialRef.current) {
          materialRef.current.uniforms.time.value = timeRef.current;
        }

        if (rendererRef.current && sceneRef.current && cameraRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
      }

      reqAnimFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
    
    // Czyszczenie
    return () => {
      window.removeEventListener('resize', handleResize);
      if (reqAnimFrameRef.current) {
        cancelAnimationFrame(reqAnimFrameRef.current);
      }
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      scene.remove(mesh);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  // Aktualizacja pozycji myszy
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.mousePosition.value.set(
        mousePosition.x + 0.5, // Konwersja z zakresu -0.5 do 0.5 na zakres 0 do 1
        -mousePosition.y + 0.5  // Odwrócenie osi Y
      );
    }
  }, [mousePosition]);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full z-0" />;
}

// Implementacja głównego komponentu Hero
function HeroContent() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [targetMousePosition, setTargetMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [clickEffect, setClickEffect] = useState<{x: number, y: number, time: number} | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  // Oznaczamy komponent jako zamontowany w przeglądarce
  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Śledzenie pozycji myszy dla efektu 3D + obsługa dotyku
  useEffect(() => {
    if (!isMounted) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      setTargetMousePosition({
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      });
    };
    
    // Dodanie obsługi dotyku dla urządzeń mobilnych
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        setTargetMousePosition({
          x: e.touches[0].clientX / window.innerWidth - 0.5,
          y: e.touches[0].clientY / window.innerHeight - 0.5,
        });
      }
    };

    const handleClick = (e: MouseEvent) => {
      // Dodajemy efekt kliknięcia w danym miejscu
      setClickEffect({
        x: e.clientX,
        y: e.clientY,
        time: Date.now()
      });
    };
    
    // Dodanie obsługi dotknięcia dla urządzeń mobilnych
    const handleTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches.length > 0) {
        setClickEffect({
          x: e.changedTouches[0].clientX,
          y: e.changedTouches[0].clientY,
          time: Date.now()
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('click', handleClick);
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMounted]);

  // Wygładzenie ruchu myszy - ZRÓWNOWAŻONE SPOWOLNIENIE
  useEffect(() => {
    if (!isMounted) return;
    
    const smoothFactor = 0.0008;
    let frameSkip = 0;
    
    const smoothMouse = () => {
      // Aktualizuj pozycję co 5 klatek - zbalansowana wartość
      frameSkip++;
      if (frameSkip >= 5) {
        frameSkip = 0;
        setMousePosition(prev => ({
          x: prev.x + (targetMousePosition.x - prev.x) * smoothFactor,
          y: prev.y + (targetMousePosition.y - prev.y) * smoothFactor
        }));
      }
      requestAnimationFrame(smoothMouse);
    };
    
    const animation = requestAnimationFrame(smoothMouse);
    return () => cancelAnimationFrame(animation);
  }, [targetMousePosition, isMounted]);

  // Animacje tekstu i przycisków - ZRÓWNOWAŻONE
  const titleVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 2.2,
        ease: "easeOut",
        staggerChildren: 0.3,
      }
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 2.0, ease: "easeOut" }
    }
  };

  // Styl 3D dla głównego kontenera - ZRÓWNOWAŻONA CZUŁOŚĆ
  const style3D = {
    transform: `perspective(1000px) rotateX(${mousePosition.y * 0.4}deg) rotateY(${-mousePosition.x * 0.4}deg)`,
    transition: 'transform 1.5s ease-out'
  };

  // Nie renderujemy nic jeśli nie jesteśmy w przeglądarce
  if (!isMounted) {
    return (
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full" 
             style={{ background: 'linear-gradient(to bottom, #0f172a, #1e293b)' }} />
        <div className="container mx-auto px-4 md:px-6 z-20 text-center max-w-4xl">
          {/* Szkielet treści, aby SSR miał coś do wyrenderowania */}
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Tło Three.js */}
      <ThreeJSBackground mousePosition={mousePosition} />
      
      {/* Półprzezroczyste kule w tle - zostawiamy dla dodatkowego efektu głębi */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl" />
      <div className="absolute top-1/2 right-1/4 w-72 h-72 rounded-full bg-emerald-500/5 blur-3xl" />
      
      {/* Gradientowa nakładka - pomaga w czytelności tekstu */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/10 to-gray-950/70 z-10"></div>
      
      {/* Zawartość Hero - zoptymalizowana dla mobile */}
      <div
        className="container mx-auto px-4 md:px-6 z-20 text-center max-w-4xl" 
        style={style3D}
      >
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={titleVariants}
          className="space-y-4 sm:space-y-6" // Zmniejszone z space-y-6 sm:space-y-8
        >
          <motion.div variants={childVariants} className="inline-flex mb-1 sm:mb-2 items-center gap-2 px-3 sm:px-4 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs sm:text-sm font-medium tracking-wide backdrop-blur-sm">
            <span>Patryk Rakowski</span>
          </motion.div>
          
          <motion.h1 
            variants={childVariants} 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-4 leading-tight text-white" // Zmniejszone z mb-3 sm:mb-6 i zmniejszony rozmiar lg:text-7xl na lg:text-6xl
          >
            Tworzę{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              nowoczesne
            </span>{" "}
            rozwiązania cyfrowe
          </motion.h1>
          
          <motion.p 
            variants={childVariants} 
            className="text-base sm:text-lg md:text-xl text-gray-300 mb-4 sm:mb-6 leading-relaxed max-w-3xl mx-auto" // Zmniejszone z mb-6 sm:mb-10
          >
            Witaj w moim cyfrowym portfolio. Jestem pasjonatem technologii specjalizującym się
            w tworzeniu innowacyjnych projektów informatycznych. Moja misja to przekształcanie
            złożonych problemów w eleganckie rozwiązania.
          </motion.p>
          
          <motion.div 
            variants={childVariants} 
            className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center" // Zmniejszone z gap-3 sm:gap-4
          >
            <Link href="/projekty" className="w-full sm:w-auto">
              <button
                className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:translate-y-[-2px] transition-all duration-300" // Zmniejszone padding z px-6 sm:px-8 py-3 sm:py-4
              >
                Zobacz projekty
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> {/* Zmniejszona ikona z w-5 h-5 */}
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </button>
            </Link>
            <Link href="/kontakt" className="w-full sm:w-auto">
              <button
                className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-gray-800/80 backdrop-blur-sm border border-gray-700 text-white font-medium hover:bg-gray-800/90 hover:border-gray-600 hover:translate-y-[-2px] transition-all duration-300" // Zmniejszone padding z px-6 sm:px-8 py-3 sm:py-4
              >
                Kontakt
              </button>
            </Link>
          </motion.div>

          {/* Pływające technologie - responsywny układ */}
          <motion.div
            variants={childVariants}
            className="mt-6 sm:mt-10 pt-4 sm:pt-6 border-t border-gray-800/50" // Zmniejszone z mt-8 sm:mt-16 pt-6 sm:pt-8
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.2 }}
          >
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3"> {/* Zmniejszone z gap-2 sm:gap-4 */}
              {['React', 'TypeScript', 'Next.js', 'Node.js', 'Python', 'AI/ML'].map((tech, index) => (
                <div
                  key={tech}
                  className="text-xs sm:text-sm font-medium text-gray-400 bg-gray-800/50 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full backdrop-blur-sm hover:bg-gray-700/60 hover:text-gray-300 transition-all duration-300" // Zmniejszone z px-3 sm:px-4 py-1.5 sm:py-2
                >
                  {tech}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Wskaźnik przewijania z efektem pulsowania */}
      <motion.div 
        className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-20" // Zmniejszone z bottom-6 sm:bottom-8
        animate={{ 
          y: [0, 5, 0],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 2,
          ease: "easeInOut"
        }}
      >
        <svg className="w-4 sm:w-5 h-4 sm:h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> {/* Zmniejszone z w-5 sm:w-6 h-5 sm:h-6 */}
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </motion.div>
    </section>
  );
}

// Renderuj tylko po stronie klienta za pomocą dynamic import
const ClientHero = dynamic(() => Promise.resolve(HeroContent), {
  ssr: false
});

// Główny komponent eksportowany
export default function Hero() {
  return <ClientHero />;
}