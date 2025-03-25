'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Implementacja głównego komponentu Hero
function HeroContent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
    }, 1200); // Jeszcze wolniejszy start
    return () => clearTimeout(timer);
  }, []);

  // Śledzenie pozycji myszy dla efektu 3D - ze ZNACZNIE WIĘKSZYM WYGŁADZANIEM
  useEffect(() => {
    if (!isMounted) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      setTargetMousePosition({
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      });
    };

    const handleClick = (e: MouseEvent) => {
      // Dodajemy efekt kliknięcia w danym miejscu
      setClickEffect({
        x: e.clientX,
        y: e.clientY,
        time: Date.now()
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, [isMounted]);

  // Wygładzenie ruchu myszy - ZRÓWNOWAŻONE SPOWOLNIENIE
  useEffect(() => {
    if (!isMounted) return;
    
    const smoothFactor = 0.0008; // Nieco szybsza reakcja, ale wciąż powolna
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

  // Efekt animowanego tła - uruchamiamy tylko po stronie klienta
  useEffect(() => {
    if (!canvasRef.current || !isMounted) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const fluidParticles: FluidParticle[] = [];
    const particlesCount = 70; // Zmniejszona liczba cząsteczek (było 100)
    const fluidParticlesCount = 6; // Zmniejszona liczba cząsteczek (było 10)
    const maxDistance = 120; // Zmniejszony zasięg połączeń (było 150)
    
    // Klasa cząsteczki płynu - wizualnie imponująca!
    class FluidParticle {
      x: number;
      y: number;
      originX: number;
      originY: number;
      size: number;
      angle: number;
      speed: number;
      color: string;
      alpha: number;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.originX = this.x;
        this.originY = this.y;
        this.size = Math.random() * 120 + 80; // Większe ale mniej widoczne cząsteczki
        this.angle = Math.random() * Math.PI * 2;
        this.speed = 0.00007 + Math.random() * 0.00007; // Nieco szybszy, ale nadal spokojny ruch
        
        // Paleta kolorów dla organicznego wyglądu
        const colors = [
          'rgba(59, 130, 246, 0.04)', // blue - lekko zwiększona widoczność
          'rgba(16, 185, 129, 0.03)', // emerald - lekko zwiększona widoczność
          'rgba(139, 92, 246, 0.04)', // purple - lekko zwiększona widoczność
          'rgba(59, 130, 246, 0.05)'  // blue stronger - lekko zwiększona widoczność
        ];
        
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = 0.2 + Math.random() * 0.2; // Zmniejszona przezroczystość (było 0.3 + 0.3)
      }
      
      update(mouseX: number, mouseY: number, time: number) {
        // Organiczny ruch - kombinacja kilku funkcji sinusoidalnych
        this.angle += this.speed;
        
        // Atrakcja do oryginalnej pozycji
        const pullFactor = 0.0007; // Zrównoważona wartość
        this.x += Math.sin(this.angle * 1.1 + time * 0.00008) * 0.35; // Nieco szybszy, ale wciąż spokojny ruch
        this.y += Math.cos(this.angle * 1.3 + time * 0.00008) * 0.35; // Nieco szybszy, ale wciąż spokojny ruch
        
        // Delikatne przyciąganie do myszy
        const dx = mouseX * canvas.width - this.x;
        const dy = mouseY * canvas.height - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 300) {
          const force = Math.min(150 / dist, 1.5); // Zmniejszona siła (było 2)
          this.x += dx * force * 0.0002; // Zmniejszone przyciąganie (było 0.0005)
          this.y += dy * force * 0.0002; // Zmniejszone przyciąganie (było 0.0005)
        }
        
        // Unikaj krawędzi - bardziej zaawansowana logika "zawracania"
        const margin = 50;
        if (this.x < margin) this.x += (margin - this.x) * 0.01; // Wolniejsze (było 0.02)
        if (this.x > canvas.width - margin) this.x -= (this.x - (canvas.width - margin)) * 0.01; // Wolniejsze (było 0.02)
        if (this.y < margin) this.y += (margin - this.y) * 0.01; // Wolniejsze (było 0.02)
        if (this.y > canvas.height - margin) this.y -= (this.y - (canvas.height - margin)) * 0.01; // Wolniejsze (było 0.02)
      }
      
      draw(ctx: CanvasRenderingContext2D) {
        // Bardziej zaawansowane rysowanie - gradientowe plamy organiczne
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        
        // Poprawka: Prawidłowe formatowanie kolorów RGBA
        // Wyodrębniamy składowe koloru i tworzymy nowe stringi RGBA
        const rgbaMatch = this.color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
        if (rgbaMatch) {
          const r = rgbaMatch[1];
          const g = rgbaMatch[2];
          const b = rgbaMatch[3];
          
          gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${this.alpha})`);
          gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${this.alpha * 0.5})`);
          gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        } else {
          // Fallback jeśli format koloru jest inny
          gradient.addColorStop(0, this.color);
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        }
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Klasa standardowej cząsteczki - teraz z nowymi efektami
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      originalVx: number;
      originalVy: number;
      size: number;
      color: string;
      originalX: number;
      originalY: number;
      life: number;
      maxLife: number;
      pulseFactor: number;
      pulseSpeed: number;
      
      constructor(isExplosion = false, explosionX = 0, explosionY = 0) {
        if (isExplosion) {
          // Cząsteczki eksplozji startują w miejscu kliknięcia
          this.x = explosionX;
          this.y = explosionY;
          
          // Losowy kierunek wyrzucenia
          const angle = Math.random() * Math.PI * 2;
          const speed = 0.5 + Math.random() * 1; // Zmniejszona szybkość (było 1 + random * 2)
          
          this.vx = Math.cos(angle) * speed;
          this.vy = Math.sin(angle) * speed;
          this.size = Math.random() * 3 + 1; // Mniejsze cząsteczki (było 4 + 1)
          this.life = 150; // Dłuższe życie dla wolniejszej animacji (było 100)
          this.maxLife = 150;
        } else {
          // Normalne cząsteczki z losową pozycją
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.vx = Math.random() * 0.2 - 0.1; // Zmniejszona prędkość (było 0.4 - 0.2)
          this.vy = Math.random() * 0.2 - 0.1; // Zmniejszona prędkość (było 0.4 - 0.2)
          this.size = Math.random() * 2 + 1; // Mniejsze cząsteczki (było 2 + 1)
          this.life = 1000; // nieskończone praktycznie
          this.maxLife = 1000;
        }
        
        this.originalX = this.x;
        this.originalY = this.y;
        this.originalVx = this.vx;
        this.originalVy = this.vy;
        
        // Efekt pulsowania
        this.pulseFactor = Math.random() * 0.15 + 0.9; // Nieco większy zakres, ale wciąż spokojny
        this.pulseSpeed = 0.002 + Math.random() * 0.003; // Nieco szybsze pulsowanie, ale wciąż spokojne
        
        // Gradient kolorów dla cząsteczek
        const colors = [
          'rgba(59, 130, 246, 0.4)', // blue-500 - zmniejszona intensywność
          'rgba(16, 185, 129, 0.4)', // emerald-500 - zmniejszona intensywność
          'rgba(139, 92, 246, 0.4)', // purple-500 - zmniejszona intensywność
          'rgba(236, 72, 153, 0.4)'  // pink-500 - zmniejszona intensywność
        ];
        
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }
      
      update(mouseX: number, mouseY: number, time: number, isClick: boolean, clickX: number, clickY: number) {
        // Zmniejszamy życie cząsteczki eksplozji
        if (this.life < this.maxLife) {
          this.life -= 0.5; // Wolniejsze zanikanie (było 1)
          if (this.life <= 0) return false;
        }
        
        // Efekt pulsu - płynnie zmienia rozmiar, ZNACZNIE WOLNIEJSZY
        this.pulseFactor = 0.9 + Math.sin(time * this.pulseSpeed) * 0.1; // Mniejszy zakres pulsowania (było 0.8 + sin * 0.2)
        
        // Atrakcja do myszy - teraz JESZCZE ŁAGODNIEJSZA
        const dx = mouseX * canvas.width - this.x;
        const dy = mouseY * canvas.height - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 300) {
          // Mniejsza siła przyciągania i wygładzona funkcja zanikania
          const force = Math.min(300 / (distance + 150), 0.15); // Zmniejszona siła (było 0.3)
          const directionX = dx / (distance || 1);
          const directionY = dy / (distance || 1);
          
          // Znacznie mniejsze przyspieszenie = płynniejszy ruch
          this.vx += directionX * force * 0.001; // Zmniejszone (było 0.002)
          this.vy += directionY * force * 0.001; // Zmniejszone (było 0.002)
        }
        
        // Wpływ efektu kliknięcia
        if (isClick) {
          const clickDx = clickX - this.x;
          const clickDy = clickY - this.y;
          const clickDistance = Math.sqrt(clickDx * clickDx + clickDy * clickDy);
          
          if (clickDistance < 300) {
            // Efekt odpychania od kliknięcia
            const force = Math.min(300 / (clickDistance + 80), 0.5); // Zmniejszona siła (było 1)
            const directionX = -clickDx / (clickDistance || 1); // odpychamy, stąd minus
            const directionY = -clickDy / (clickDistance || 1);
            
            this.vx += directionX * force * 0.01; // Zmniejszone (było 0.02)
            this.vy += directionY * force * 0.01; // Zmniejszone (było 0.02)
          }
        }
        
        // Grawitacja do oryginalnej pozycji - BARDZO DELIKATNA
        const dxOrigin = this.originalX - this.x;
        const dyOrigin = this.originalY - this.y;
        
        // Znacznie słabsze przyciąganie = mniejsze "drganie"
        this.vx += dxOrigin * 0.0001; // Zmniejszone (było 0.0002)
        this.vy += dyOrigin * 0.0001; // Zmniejszone (było 0.0002)
        
        // Tarcie - kluczowe dla stabilności
        this.vx *= 0.98; // Większe tarcie = wolniejszy ruch (było 0.97)
        this.vy *= 0.98; // Większe tarcie = wolniejszy ruch (było 0.97)
        
        // Ogranicznik prędkości, żeby nie szalały za bardzo
        const maxSpeed = 0.4; // Zmniejszona prędkość maksymalna (było 0.8)
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > maxSpeed) {
          this.vx = (this.vx / speed) * maxSpeed;
          this.vy = (this.vy / speed) * maxSpeed;
        }
        
        this.x += this.vx;
        this.y += this.vy;
        
        // Odbijanie od krawędzi
        if (this.x < 0 || this.x > canvas.width) {
          this.vx *= -0.5; // większe tłumienie przy odbiciu (było -0.6)
          this.x = this.x < 0 ? 0 : canvas.width;
        }
        if (this.y < 0 || this.y > canvas.height) {
          this.vy *= -0.5; // większe tłumienie przy odbiciu (było -0.6)
          this.y = this.y < 0 ? 0 : canvas.height;
        }
        
        return true;
      }
      
      draw(ctx: CanvasRenderingContext2D) {
        if (!ctx) return;
        
        // Przezroczystość bazowana na życiu cząsteczki
        const alpha = this.life < this.maxLife ? this.life / this.maxLife : 1;
        
        // Poprawione formatowanie koloru dla gradientu
        const rgbaMatch = this.color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
        if (rgbaMatch) {
          const r = rgbaMatch[1];
          const g = rgbaMatch[2];
          const b = rgbaMatch[3];
          
          // Gradient dla bardziej realistycznego wyglądu
          const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.size * this.pulseFactor
          );
          
          gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`);
          gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * this.pulseFactor, 0, Math.PI * 2);
          ctx.fill();
          
          // Dodajemy świecący efekt dla większych cząsteczek
          if (this.size > 2) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * this.pulseFactor * 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.15})`; // Zmniejszona przezroczystość (było 0.2)
            ctx.fill();
          }
        } else {
          // Fallback w przypadku nieoczekiwanego formatu koloru
          ctx.fillStyle = this.color;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * this.pulseFactor, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    
    // Dopasowanie rozmiaru canvas do okna
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };
    
    function initParticles() {
      particles = [];
      for (let i = 0; i < particlesCount; i++) {
        particles.push(new Particle());
      }
      
      // Inicjalizacja cząsteczek płynu
      fluidParticles.length = 0;
      for (let i = 0; i < fluidParticlesCount; i++) {
        fluidParticles.push(new FluidParticle());
      }
    }
    
    // Sprawdzenie czy mamy efekt kliknięcia
    function checkClickEffect() {
      if (clickEffect && Date.now() - clickEffect.time < 3000) { // Dłuższy czas trwania (było 1500)
        // Generujemy eksplozję cząsteczek dla efektu wow!
        if (Date.now() - clickEffect.time < 50) { // tylko na początku kliknięcia
          for (let i = 0; i < 6; i++) { // Mniej cząsteczek (było 10)
            particles.push(new Particle(true, clickEffect.x, clickEffect.y));
          }
        }
        return {
          isActive: true,
          x: clickEffect.x,
          y: clickEffect.y
        };
      }
      return { isActive: false, x: 0, y: 0 };
    }
    
    let lastTime = 0;
    let frameCount = 0;
    
    function animate(time: number) {
      const deltaTime = time - lastTime;
      lastTime = time;
      
      // Spowalniamy animację przez renderowanie co trzecią klatkę - zbalansowana wartość
      frameCount++;
      if (frameCount % 3 !== 0) { // Zmieniono z 4 na 3 dla nieco szybszej animacji
        animationFrameId = requestAnimationFrame(animate);
        return;
      }
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Najpierw narysujmy płynne cząsteczki tła
      fluidParticles.forEach(particle => {
        particle.update(
          0.5 + mousePosition.x * 0.05, // zmniejszona czułość (było 0.1)
          0.5 + mousePosition.y * 0.05, // zmniejszona czułość (było 0.1)
          time
        );
        particle.draw(ctx);
      });
      
      const clickStatus = checkClickEffect();
      
      // Aktualizacja i rysowanie standardowych cząsteczek
      particles = particles.filter(particle => {
        return particle.update(
          0.5 + mousePosition.x * 0.05, // zmniejszona czułość (było 0.1)
          0.5 + mousePosition.y * 0.05, // zmniejszona czułość (było 0.1)
          time,
          clickStatus.isActive,
          clickStatus.x,
          clickStatus.y
        );
      });
      
      particles.forEach(particle => {
        particle.draw(ctx);
      });
      
      // Rysowanie linii pomiędzy bliskimi cząsteczkami
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            // Płynniejsze przejście linii
            const alpha = Math.pow(1 - distance / maxDistance, 2) * 0.2; // Zmniejszona widoczność (było 0.3)
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = (1 - distance / maxDistance) * 0.6; // Cieńsze linie (było 0.8)
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      
      // Efekt fali po kliknięciu - ZNACZNIE WOLNIEJSZY
      if (clickStatus.isActive) {
        const timeSinceClick = Date.now() - clickEffect!.time;
        const radius = timeSinceClick * 0.1; // Wolniejsze rozszerzanie (było 0.2)
        const alpha = 1 - timeSinceClick / 3000; // Wolniejsze zanikanie (było 1500)
        
        ctx.beginPath();
        ctx.arc(clickStatus.x, clickStatus.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.8})`; // Zmniejszona nieprzezroczystość
        ctx.lineWidth = 1.5; // Cieńsza linia (było 2)
        ctx.stroke();
        
        // Druga fala, wolniejsza
        if (timeSinceClick > 400) { // Wolniejsze rozpoczęcie (było 200)
          const radius2 = (timeSinceClick - 400) * 0.05; // Wolniejsze rozszerzanie (było 0.1)
          const alpha2 = 1 - (timeSinceClick - 400) / 3000; // Wolniejsze zanikanie (było 1500)
          
          ctx.beginPath();
          ctx.arc(clickStatus.x, clickStatus.y, radius2, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(59, 130, 246, ${alpha2 * 0.4})`; // Mniej intensywne (było 0.6)
          ctx.lineWidth = 1; // Cieńsza linia (było 1.5)
          ctx.stroke();
        }
      }
      
      animationFrameId = requestAnimationFrame(animate);
    }
    
    window.addEventListener('resize', handleResize);
    handleResize();
    animate(0);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePosition, clickEffect, isMounted]);

  // Animacje tekstu i przycisków - ZRÓWNOWAŻONE
  const titleVariants = {
    hidden: { opacity: 0, y: 5 }, // Mniejszy ruch w osi Y
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 2.2, // Zrównoważona prędkość animacji
        ease: "easeOut", // Łagodne przejście
        staggerChildren: 0.3, // Zrównoważone opóźnienie między elementami
      }
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 5 }, // Mniejszy ruch w osi Y
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 2.0, ease: "easeOut" } // Zrównoważona prędkość animacji
    }
  };

  // Styl 3D dla głównego kontenera - ZRÓWNOWAŻONA CZUŁOŚĆ
  const style3D = {
    transform: `perspective(1000px) rotateX(${mousePosition.y * 0.4}deg) rotateY(${-mousePosition.x * 0.4}deg)`, // Zrównoważona rotacja
    transition: 'transform 1.5s ease-out' // Zrównoważona prędkość animacji z łagodnym przejściem
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
      {/* Animowane tło z cząsteczkami */}
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full z-0" 
        style={{ background: 'linear-gradient(to bottom, #0f172a, #1e293b)' }}
      />
      
      {/* Półprzezroczyste kule w tle */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl" /> {/* Zmniejszona intensywność (było /10) */}
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl" /> {/* Zmniejszona intensywność (było /10) */}
      <div className="absolute top-1/2 right-1/4 w-72 h-72 rounded-full bg-emerald-500/5 blur-3xl" /> {/* Zmniejszona intensywność (było /10) */}
      
      {/* Gradientowa nakładka */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/10 to-gray-950/80 z-10"></div>
      
      {/* Zawartość Hero */}
      <div
        className="container mx-auto px-4 md:px-6 z-20 text-center max-w-4xl" 
        style={style3D}
      >
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={titleVariants}
          className="space-y-8"
        >
          <motion.div variants={childVariants} className="inline-flex mb-4 items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium tracking-wide backdrop-blur-sm">
            <span>Patryk Rakowski</span>
          </motion.div>
          
          <motion.h1 
            variants={childVariants} 
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white"
          >
            Tworzę{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              nowoczesne
            </span>{" "}
            rozwiązania cyfrowe
          </motion.h1>
          
          <motion.p 
            variants={childVariants} 
            className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed max-w-3xl mx-auto"
          >
            Witaj w moim cyfrowym portfolio. Jestem pasjonatem technologii specjalizującym się
            w tworzeniu innowacyjnych projektów informatycznych. Moja misja to przekształcanie
            złożonych problemów w eleganckie rozwiązania.
          </motion.p>
          
          <motion.div 
            variants={childVariants} 
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/projekty">
              <button
                className="px-8 py-4 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium flex items-center gap-2 shadow-lg shadow-blue-500/20"
              >
                Zobacz projekty
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </button>
            </Link>
            <Link href="/kontakt">
              <button
                className="px-8 py-4 rounded-lg bg-gray-800/80 backdrop-blur-sm border border-gray-700 text-white font-medium"
              >
                Kontakt
              </button>
            </Link>
          </motion.div>

          {/* Pływające technologie */}
          <motion.div
            variants={childVariants}
            className="mt-16 pt-8 border-t border-gray-800/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.2 }} // Zrównoważone opóźnienie
          >
            <div className="flex flex-wrap justify-center gap-8">
              {['React', 'TypeScript', 'Next.js', 'Node.js', 'Python', 'AI/ML'].map((tech, index) => (
                <div
                  key={tech}
                  className="text-sm font-medium text-gray-400 bg-gray-800/50 px-4 py-2 rounded-full backdrop-blur-sm"
                >
                  {tech}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Statyczny wskaźnik przewijania (bez animacji) */}
      <div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
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