'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion';

// Interfejs dla animacji fali
interface WavePoint {
  id: number;
  x: number;
  y: number;
  radius: number;
  opacity: number;
  delay: number;
}

// Interfejs dla cząsteczek tła
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
}

// Komponent pola formularza z animacjami
const FormField = ({ 
  label,
  id, 
  type = 'text', 
  value, 
  onChange, 
  placeholder,
  rows,
  isActive,
  onFocus,
  onBlur,
  isValid,
  isTouched,
  errorMessage
}: { 
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder: string;
  rows?: number;
  isActive: boolean;
  onFocus: () => void;
  onBlur: () => void;
  isValid: boolean;
  isTouched: boolean;
  errorMessage?: string;
}) => {
  // Obliczenie stanu walidacji dla animacji
  const validationState = isTouched 
    ? isValid 
      ? 'valid' 
      : 'invalid' 
    : 'idle';

  // Efekt unoszenia pola przy aktywności
  const elevationVariants = {
    idle: { y: 0, boxShadow: '0 0 0 rgba(0, 0, 0, 0)' },
    active: { 
      y: -5, 
      boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.2)',
      transition: { 
        duration: 0.3, 
        ease: 'easeOut'
      }
    }
  };

  // Efekt ikonki walidacji
  const iconVariants = {
    hidden: { scale: 0, opacity: 0 },
    valid: { 
      scale: 1, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 15 }
    },
    invalid: { 
      scale: 1, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 15 }
    }
  };

  // Efekt informacji o błędzie
  const errorVariants = {
    hidden: { 
      opacity: 0, 
      y: -10, 
      height: 0,
      transition: { duration: 0.2 }
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      height: 'auto',
      transition: { duration: 0.3, delay: 0.1 }
    }
  };
  
  // Efekt tła pola formularza
  const fieldBgVariants = {
    idle: { 
      background: 'rgba(55, 65, 81, 0.5)' 
    },
    active: { 
      background: 'rgba(59, 72, 95, 0.6)',
      transition: { duration: 0.3 }
    },
    valid: { 
      background: 'rgba(5, 102, 54, 0.15)',
      transition: { duration: 0.3 }
    },
    invalid: { 
      background: 'rgba(153, 27, 27, 0.15)',
      transition: { duration: 0.3 }
    }
  };

  // Efekt obramowania pola formularza
  const fieldBorderVariants = {
    idle: { 
      borderColor: 'rgba(75, 85, 99, 0.6)' 
    },
    active: { 
      borderColor: 'rgba(59, 130, 246, 0.7)',
      transition: { duration: 0.3 }
    },
    valid: { 
      borderColor: 'rgba(16, 185, 129, 0.6)',
      transition: { duration: 0.3 }
    },
    invalid: { 
      borderColor: 'rgba(239, 68, 68, 0.6)',
      transition: { duration: 0.3 }
    }
  };
  
  return (
    <div className="mb-6 relative">
      <label 
        htmlFor={id} 
        className={`block mb-2 font-medium transition-colors duration-300 ${
          isActive ? 'text-blue-400' : 
          validationState === 'valid' ? 'text-green-400' : 
          validationState === 'invalid' ? 'text-red-400' : 
          'text-gray-300'
        }`}
      >
        {label}
        {isTouched && (
          <AnimatePresence>
            {validationState === 'valid' ? (
              <motion.span 
                className="inline-block ml-2 text-green-400"
                initial="hidden"
                animate="valid"
                exit="hidden"
                variants={iconVariants}
              >
                <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </motion.span>
            ) : validationState === 'invalid' ? (
              <motion.span 
                className="inline-block ml-2 text-red-400"
                initial="hidden"
                animate="invalid"
                exit="hidden"
                variants={iconVariants}
              >
                <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </motion.span>
            ) : null}
          </AnimatePresence>
        )}
      </label>
      
      <motion.div 
        className="relative"
        initial="idle"
        animate={isActive ? "active" : "idle"}
        variants={elevationVariants}
      >
        {/* Tło pola formularza z animacją stanu */}
        <motion.div 
          className="absolute inset-0 rounded-lg z-0" 
          initial="idle"
          animate={
            isActive ? "active" : 
            validationState === 'valid' ? "valid" : 
            validationState === 'invalid' ? "invalid" : 
            "idle"
          }
          variants={fieldBgVariants}
        />
        
        {/* Generowane cząsteczki podczas pisania */}
        {isActive && value && (
          <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
            {Array.from({ length: Math.min(value.length / 5, 20) }).map((_, i) => (
              <motion.div
                key={`particle-${id}-${i}`}
                className="absolute w-2 h-2 rounded-full bg-blue-500/30 z-0"
                initial={{ 
                  x: "50%", 
                  y: "50%", 
                  opacity: 0.8,
                  scale: 0
                }}
                animate={{ 
                  x: `${Math.random() * 100}%`, 
                  y: `${Math.random() * 100}%`,
                  opacity: 0,
                  scale: 1 + Math.random()
                }}
                transition={{ 
                  duration: 1 + Math.random(), 
                  ease: "easeOut",
                  delay: i * 0.1
                }}
              />
            ))}
          </div>
        )}
        
        {/* Pole tekstowe lub textarea */}
        {type === 'textarea' ? (
          <motion.textarea
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            rows={rows || 4}
            className="w-full px-4 py-3 bg-transparent border rounded-lg focus:outline-none resize-none relative z-10"
            placeholder={placeholder}
            initial="idle"
            animate={
              isActive ? "active" : 
              validationState === 'valid' ? "valid" : 
              validationState === 'invalid' ? "invalid" : 
              "idle"
            }
            variants={fieldBorderVariants}
          />
        ) : (
          <motion.input
            type={type}
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            className="w-full px-4 py-3 bg-transparent border rounded-lg focus:outline-none relative z-10"
            placeholder={placeholder}
            initial="idle"
            animate={
              isActive ? "active" : 
              validationState === 'valid' ? "valid" : 
              validationState === 'invalid' ? "invalid" : 
              "idle"
            }
            variants={fieldBorderVariants}
          />
        )}
      </motion.div>
      
      {/* Komunikat o błędzie */}
      <AnimatePresence>
        {validationState === 'invalid' && errorMessage && (
          <motion.div 
            className="text-sm text-red-400 mt-1 ml-1 overflow-hidden"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={errorVariants}
          >
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function ContactSection() {
  // Dane formularza
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  // Stan formularza
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [wavePoints, setWavePoints] = useState<WavePoint[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  
  // Walidacja pól
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Stan terminala
  const [terminalLines, setTerminalLines] = useState<string[]>([
    'Inicjowanie formularza kontaktowego...',
    'System gotowy do odbioru wiadomości...'
  ]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [terminalTheme, setTerminalTheme] = useState('default');
  
  // Referencje
  const controls = useAnimation();
  const ref = useRef(null);
  const formRef = useRef<HTMLFormElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const terminalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Generowanie cząsteczek tła
  useEffect(() => {
    if (!containerRef.current) return;
    
    const particlesCount = 15;
    const newParticles = Array.from({ length: particlesCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      color: ['rgba(59, 130, 246, 0.3)', 'rgba(139, 92, 246, 0.3)', 'rgba(16, 185, 129, 0.3)'][Math.floor(Math.random() * 3)],
      delay: i * 0.2
    }));
    
    setParticles(newParticles);
  }, []);
  
  // Auto-scroll w terminalu
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLines]);
  
  // Efekt pisania w terminalu
  useEffect(() => {
    if (isInView && !isSuccess) {
      const initialCommand = '> Formularz kontaktowy uruchomiony. Wprowadź dane, aby się ze mną skontaktować.';
      let currentIndex = 0;
      
      const typingInterval = setInterval(() => {
        if (currentIndex <= initialCommand.length) {
          setCurrentCommand(initialCommand.substring(0, currentIndex));
          currentIndex++;
          setCursorPosition(currentIndex);
        } else {
          clearInterval(typingInterval);
          setTerminalLines(prev => [...prev, initialCommand]);
          setCurrentCommand('');
          setCursorPosition(0);
        }
      }, 40);
      
      return () => clearInterval(typingInterval);
    }
  }, [isInView, isSuccess]);
  
  // Animacje formularza
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);
  
  // Funkcja walidacji pól
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        return value.length < 3 
          ? 'Imię i nazwisko musi mieć co najmniej 3 znaki'
          : '';
      case 'email':
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? 'Podaj poprawny adres email'
          : '';
      case 'message':
        return value.length < 10
          ? 'Wiadomość musi mieć co najmniej 10 znaków'
          : '';
      default:
        return '';
    }
  };
  
  // Obsługa zmiany pola formularza
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Aktualizacja wartości pola
    setFormState(prev => ({ ...prev, [name]: value }));
    
    // Walidacja pola
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
    
    // Dodaj efekt "pisania w terminalu" 
    if (value && value.length % 10 === 0) {
      const fieldMap: Record<string, string> = {
        name: 'IMIĘ I NAZWISKO',
        email: 'EMAIL',
        message: 'WIADOMOŚĆ'
      };
      
      // Dodaj komendę do terminala
      const terminalMsg = `> Wprowadzanie ${fieldMap[name]}: ${value.length} znaków...`;
      setTerminalLines(prev => [...prev, terminalMsg]);
      
      // Aktualizacja motywu terminala w zależności od pola
      setTerminalTheme(name);
    }
  };
  
  // Obsługa focus pola
  const handleFocus = (fieldName: string) => {
    setActiveField(fieldName);
    
    // Dodaj informację do terminala
    const fieldMap: Record<string, string> = {
      name: 'IMIĘ I NAZWISKO',
      email: 'EMAIL',
      message: 'WIADOMOŚĆ'
    };
    
    setTerminalLines(prev => [...prev, `> Aktywne pole: ${fieldMap[fieldName]}`]);
    setTerminalTheme(fieldName);
  };
  
  // Obsługa blur pola
  const handleBlur = (fieldName: string) => {
    setActiveField(null);
    
    // Oznacz pole jako dotknięte
    setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
    
    // Walidacja pola po opuszczeniu
    const error = validateField(fieldName, formState[fieldName as keyof typeof formState]);
    setErrors(prev => ({ ...prev, [fieldName]: error }));
    
    // Dodaj informację do terminala, jeśli pole jest niepoprawne
    if (error) {
      setTerminalLines(prev => [...prev, `> Błąd walidacji: ${error}`]);
      setTerminalTheme('error');
    } else if (formState[fieldName as keyof typeof formState]) {
      setTerminalLines(prev => [...prev, `> Pole ${fieldName} poprawne`]);
      setTerminalTheme('success');
    }
  };
  
  // Sprawdzenie czy formularz jest poprawny
  const isFormValid = (): boolean => {
    // Sprawdź czy wszystkie pola są wypełnione
    const allFilled = Object.values(formState).every(value => value.trim() !== '');
    
    // Sprawdź czy nie ma błędów
    const hasNoErrors = Object.values(errors).every(error => error === '');
    
    return allFilled && hasNoErrors;
  };
  
  // Generowanie fali po wysłaniu formularza
  const generateWaveEffect = () => {
    if (!formRef.current) return;
    
    const rect = formRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Generuj punkty fali
    const waves = Array.from({ length: 5 }).map((_, i) => ({
      id: i,
      x: centerX,
      y: centerY,
      radius: 10,
      opacity: 0.8,
      delay: i * 0.2
    }));
    
    setWavePoints(waves);
  };
  
  // Obsługa wysłania formularza
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Sprawdź czy wszystkie pola są dotknięte
    const newTouchedFields = {
      name: true,
      email: true,
      message: true
    };
    setTouchedFields(newTouchedFields);
    
    // Walidacja wszystkich pól
    const newErrors = {
      name: validateField('name', formState.name),
      email: validateField('email', formState.email),
      message: validateField('message', formState.message)
    };
    setErrors(newErrors);
    
    // Sprawdź czy formularz jest poprawny
    if (!Object.values(newErrors).every(error => error === '')) {
      setTerminalLines(prev => [...prev, '> Formularz zawiera błędy. Popraw dane i spróbuj ponownie.']);
      setTerminalTheme('error');
      return;
    }
    
    // Rozpocznij wysyłanie
    setIsSubmitting(true);
    setTerminalLines(prev => [...prev, '> Przetwarzanie danych...']);
    setTerminalTheme('processing');
    
    // Generuj efekt fali
    generateWaveEffect();
    
    // Symulacja opóźnienia wysyłania
    setTimeout(() => {
      setTerminalLines(prev => [...prev, '> Weryfikacja danych wejściowych...']);
      
      setTimeout(() => {
        setTerminalLines(prev => [...prev, '> Szyfrowanie wiadomości...']);
        
        setTimeout(() => {
          setTerminalLines(prev => [
            ...prev, 
            '> Wysyłanie danych na serwer...',
            '> Wiadomość wysłana pomyślnie!',
            '> Dziękujemy za kontakt! Odpowiem tak szybko, jak to możliwe.'
          ]);
          setIsSubmitting(false);
          setIsSuccess(true);
          setTerminalTheme('success');
        }, 1000);
      }, 800);
    }, 1200);
  };
  
  // Reset formularza
  const resetForm = () => {
    setFormState({ name: '', email: '', message: '' });
    setTouchedFields({});
    setErrors({});
    setIsSuccess(false);
    setWavePoints([]);
    setIsSubmitting(false);
    setActiveField(null);
    setTerminalLines(['System zresetowany. Gotowy do nowej wiadomości.']);
    setTerminalTheme('default');
    
    // Dodajemy log w konsoli dla debugowania
    console.log('Formularz został zresetowany');
  };
  
  // Animacje
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.7, type: "spring", stiffness: 100 }
    }
  };

  // Warianty animacji fali po wysłaniu
  const waveVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i: number) => ({
      scale: 20,
      opacity: 0,
      transition: {
        delay: i * 0.2,
        duration: 1.5,
        ease: "easeOut"
      }
    })
  };
  
  // Warianty animacji terminala
  const terminalColorVariants = {
    default: {
      borderColor: 'rgba(55, 65, 81, 0.7)',
      background: 'rgba(17, 24, 39, 1)',
    },
    name: {
      borderColor: 'rgba(59, 130, 246, 0.7)',
      background: 'linear-gradient(rgba(30, 58, 138, 0.05), rgba(17, 24, 39, 1))',
    },
    email: {
      borderColor: 'rgba(139, 92, 246, 0.7)',
      background: 'linear-gradient(rgba(91, 33, 182, 0.05), rgba(17, 24, 39, 1))',
    },
    message: {
      borderColor: 'rgba(16, 185, 129, 0.7)',
      background: 'linear-gradient(rgba(6, 95, 70, 0.05), rgba(17, 24, 39, 1))',
    },
    error: {
      borderColor: 'rgba(239, 68, 68, 0.7)',
      background: 'linear-gradient(rgba(153, 27, 27, 0.05), rgba(17, 24, 39, 1))',
    },
    success: {
      borderColor: 'rgba(16, 185, 129, 0.7)',
      background: 'linear-gradient(rgba(6, 95, 70, 0.05), rgba(17, 24, 39, 1))',
    },
    processing: {
      borderColor: 'rgba(251, 191, 36, 0.7)',
      background: 'linear-gradient(rgba(146, 64, 14, 0.05), rgba(17, 24, 39, 1))',
    }
  };
  
  // Animacje dla cząsteczek tła
  const particleVariants = {
    hidden: (i: number) => ({
      opacity: 0,
      scale: 0
    }),
    visible: (i: number) => ({
      opacity: [0, 0.8, 0],
      scale: [0, 1, 0],
      transition: {
        delay: i * 0.2,
        repeat: Infinity,
        repeatType: "reverse" as const,
        duration: 4 + Math.random() * 4,
        ease: "easeInOut"
      }
    })
  };
  
  return (
    <section 
      ref={ref} 
      className="py-20 bg-gradient-to-b from-gray-900 to-gray-950 overflow-hidden relative"
    >
      {/* Interaktywne cząsteczki tła */}
      <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={`bg-particle-${particle.id}`}
            className="absolute rounded-full opacity-0"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: particle.color
            }}
            custom={particle.delay}
            initial="hidden"
            animate="visible"
            variants={particleVariants}
          />
        ))}
      </div>
      
      {/* Dekoracyjne elementy tła */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-900/20 to-transparent"></div>
      <motion.div 
        className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-purple-900/10 blur-3xl rounded-full" 
        animate={{
          x: [0, 20, 0],
          y: [0, -20, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 20,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-900/5 blur-3xl rounded-full" 
        animate={{
          x: [0, -30, 0],
          y: [0, 30, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 25,
          ease: "easeInOut"
        }}
      />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div 
          className="mb-12 text-center"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <motion.div 
            variants={itemVariants} 
            className="inline-block mb-3 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)"
            }}
          >
            Kontakt
          </motion.div>
          
          <motion.h2 
            variants={itemVariants} 
            className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400"
          >
            Porozmawiajmy
          </motion.h2>
          
          <motion.p variants={itemVariants} className="max-w-2xl mx-auto text-gray-400">
            Masz ciekawy projekt lub propozycję współpracy? Jeśli jesteś zainteresowany(a) współpracą
            lub masz pytania, śmiało napisz do mnie. Postaram się odpowiedzieć najszybciej jak to możliwe.
          </motion.p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Terminal z historią interakcji */}
          <motion.div
            className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            <div className="bg-gray-800 px-4 py-2 flex items-center">
              <div className="flex space-x-2 mr-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="text-gray-400 text-xs">contact-terminal@Patryk Rakowski</div>
            </div>
            
            <motion.div 
              ref={terminalRef}
              className="p-4 font-mono text-sm text-green-400 h-96 overflow-y-auto flex flex-col space-y-1"
              animate={terminalColorVariants[terminalTheme as keyof typeof terminalColorVariants]}
              transition={{ duration: 0.5 }}
            >
              {terminalLines.map((line, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  {line.startsWith('>') ? (
                    <span className={
                      line.includes('Błąd') ? 'text-red-400' : 
                      line.includes('poprawne') ? 'text-green-400' : 
                      line.includes('Aktywne pole') ? 'text-blue-400' :
                      'text-green-400'
                    }>{line}</span>
                  ) : (
                    <span className="text-gray-500"># {line}</span>
                  )}
                </motion.div>
              ))}
              <div className="flex items-center">
                <span>{currentCommand}</span>
                <motion.span 
                  className="inline-block w-2 h-4 bg-green-400 ml-0.5"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                ></motion.span>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Formularz kontaktowy */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            className="relative"
          >
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success-screen"
                  className="bg-green-500/20 border border-green-500/30 rounded-xl p-8 h-full flex flex-col items-center justify-center text-center relative overflow-hidden"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.8, type: "spring", damping: 12 }}
                >
                  {/* Efekt cząsteczek sukcesu */}
                  <div className="absolute inset-0 overflow-hidden">
                    {Array.from({ length: 30 }).map((_, i) => (
                      <motion.div
                        key={`success-particle-${i}`}
                        className="absolute w-2 h-2 rounded-full bg-green-500/40"
                        initial={{ 
                          x: "50%", 
                          y: "50%", 
                          opacity: 0 
                        }}
                        animate={{ 
                          x: `${Math.random() * 100}%`, 
                          y: `${Math.random() * 100}%`,
                          opacity: [0, 0.8, 0],
                          scale: [0, 1 + Math.random(), 0]
                        }}
                        transition={{ 
                          duration: 3 + Math.random() * 2, 
                          ease: "easeOut",
                          delay: i * 0.1,
                          repeat: Infinity,
                          repeatDelay: Math.random() * 3
                        }}
                      />
                    ))}
                  </div>
                  
                  <motion.div 
                    className="w-20 h-20 rounded-full border-4 border-green-500/50 flex items-center justify-center mb-6 relative"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ 
                      scale: 1, 
                      opacity: 1, 
                      boxShadow: ["0 0 0 rgba(16, 185, 129, 0)", "0 0 20px rgba(16, 185, 129, 0.5)", "0 0 0 rgba(16, 185, 129, 0)"] 
                    }}
                    transition={{ 
                      duration: 0.6, 
                      boxShadow: { repeat: Infinity, duration: 2 } 
                    }}
                  >
                    <motion.svg 
                      className="w-10 h-10 text-green-500" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    >
                      <motion.path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M5 13l4 4L19 7"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      />
                    </motion.svg>
                  </motion.div>
                  
                  <motion.h3 
                    className="text-2xl font-bold mb-4 text-green-400"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    Wiadomość wysłana!
                  </motion.h3>
                  
                  <motion.p 
                    className="text-gray-300 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    Dziękuję za kontakt. Odpowiem na Twoją wiadomość najszybciej jak to możliwe.
                  </motion.p>
                  
                  <motion.button
                    className="px-6 py-3 border border-gray-600 bg-gray-800/50 rounded-lg text-gray-200 hover:bg-gray-700 hover:border-gray-500 hover:translate-y-[-2px] transition-all duration-300 z-50 relative"
                    onClick={() => {
                      resetForm();
                      // Dodatkowe bezpośrednie ustawienie stanu dla pewności
                      setIsSuccess(false);
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Wyślij kolejną wiadomość
                  </motion.button>
                </motion.div>
              ) : (
                <motion.form 
                  key="contact-form"
                  ref={formRef}
                  className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-8 h-full relative overflow-hidden"
                  onSubmit={handleSubmit}
                  variants={itemVariants}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                {/* Efekt fali po kliknięciu przycisku wysyłania */}
                <AnimatePresence>
                  {wavePoints.map((wave) => (
                    <motion.div
                      key={`wave-${wave.id}`}
                      className="absolute rounded-full bg-blue-500/10 pointer-events-none"
                      style={{
                        top: wave.y,
                        left: wave.x,
                        translateX: '-50%',
                        translateY: '-50%',
                      }}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0 }}
                      custom={wave.delay}
                      variants={waveVariants}
                    />
                  ))}
                </AnimatePresence>
                
                {/* Pola formularza z animacjami */}
                <FormField 
                  label="Imię i nazwisko"
                  id="name"
                  type="text"
                  value={formState.name}
                  onChange={handleChange}
                  placeholder="Jan Kowalski"
                  isActive={activeField === 'name'}
                  onFocus={() => handleFocus('name')}
                  onBlur={() => handleBlur('name')}
                  isValid={!errors.name}
                  isTouched={!!touchedFields.name}
                  errorMessage={errors.name}
                />
                
                <FormField 
                  label="Adres email"
                  id="email"
                  type="email"
                  value={formState.email}
                  onChange={handleChange}
                  placeholder="jan.kowalski@example.com"
                  isActive={activeField === 'email'}
                  onFocus={() => handleFocus('email')}
                  onBlur={() => handleBlur('email')}
                  isValid={!errors.email}
                  isTouched={!!touchedFields.email}
                  errorMessage={errors.email}
                />
                
                <FormField 
                  label="Wiadomość"
                  id="message"
                  type="textarea"
                  value={formState.message}
                  onChange={handleChange}
                  placeholder="Treść wiadomości..."
                  rows={5}
                  isActive={activeField === 'message'}
                  onFocus={() => handleFocus('message')}
                  onBlur={() => handleBlur('message')}
                  isValid={!errors.message}
                  isTouched={!!touchedFields.message}
                  errorMessage={errors.message}
                />
                
                {/* Przycisk wysyłania */}
                <motion.button
                  type="submit"
                  className={`w-full py-4 rounded-lg font-medium flex items-center justify-center gap-2 text-white relative overflow-hidden ${
                    isSubmitting
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-blue-500'
                  }`}
                  disabled={isSubmitting}
                  whileHover={!isSubmitting ? { 
                    scale: 1.02,
                    boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)"
                  } : {}}
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {/* Efekt gradientu pulsujący dla przycisku */}
                  {!isSubmitting && isFormValid() && (
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-400/30 to-blue-600/0"
                      animate={{
                        x: ['-100%', '100%'],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                        ease: "linear"
                      }}
                    />
                  )}
                  
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Wysyłanie...</span>
                    </>
                  ) : (
                    <>
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                      <span className="relative z-10">Wyślij wiadomość</span>
                    </>
                  )}
                </motion.button>
                              </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}