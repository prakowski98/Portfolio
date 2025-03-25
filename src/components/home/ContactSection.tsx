'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

export default function ContactSection() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([
    'Inicjowanie formularza kontaktowego...',
    'System gotowy do odbioru wiadomości...'
  ]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const terminalRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll w terminalu
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLines]);
  
  // Efekt pisania w terminalu - SPOWOLNIONY
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
      }, 120); // 3x wolniejsze pisanie (było 40ms)
      
      return () => clearInterval(typingInterval);
    }
  }, [isInView, isSuccess]);
  
  // Animacje formularza - SPOWOLNIONE
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    
    // Dodaj efekt "pisania w terminalu" - OGRANICZONY
    if (value && value.length % 20 === 0) { // Rzadsze aktualizacje (było % 5)
      const fieldMap: Record<string, string> = {
        name: 'IMIĘ I NAZWISKO',
        email: 'EMAIL',
        message: 'WIADOMOŚĆ'
      };
      
      setTerminalLines(prev => [...prev, `> Wprowadzanie ${fieldMap[name]}: ${value.length} znaków...`]);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTerminalLines(prev => [...prev, '> Przetwarzanie danych...']);
    
    // Symulacja opóźnienia wysyłania - SPOWOLNIONA
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
        }, 2000); // Wolniejsze opóźnienie (było 1000ms)
      }, 1500); // Wolniejsze opóźnienie (było 800ms)
    }, 2500); // Wolniejsze opóźnienie (było 1200ms)
  };
  
  const resetForm = () => {
    setFormState({ name: '', email: '', message: '' });
    setIsSuccess(false);
    setTerminalLines(['System zresetowany. Gotowy do nowej wiadomości.']);
  };
  
  // Animacje - SPOWOLNIONE
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Wolniejsze pojawianie się elementów (było 0.1)
        delayChildren: 0.5, // Dłuższe opóźnienie (było 0.3)
        duration: 1.5 // Dodane dłuższe trwanie
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
      className="py-20 bg-gradient-to-b from-gray-900 to-gray-950 overflow-hidden relative"
    >
      {/* Dekoracyjne elementy tła */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-900/20 to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-purple-900/10 blur-3xl rounded-full"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div 
          className="mb-12 text-center"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <motion.div variants={itemVariants} className="inline-block mb-3 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm">
            Kontakt
          </motion.div>
          
          <motion.h2 variants={itemVariants} className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">
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
            
            <div 
              ref={terminalRef}
              className="p-4 font-mono text-sm text-green-400 h-96 overflow-y-auto bg-gray-950 flex flex-col space-y-1"
            >
              {terminalLines.map((line, index) => (
                <div key={index}>
                  {line.startsWith('>') ? <span>{line}</span> : <span className="text-gray-500"># {line}</span>}
                </div>
              ))}
              <div className="flex items-center">
                <span>{currentCommand}</span>
                <motion.span 
                  className="inline-block w-2 h-4 bg-green-400 ml-0.5"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }} // Wolniejsze miganie kursora (było 1s)
                ></motion.span>
              </div>
            </div>
          </motion.div>
          
          {/* Formularz kontaktowy */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            {isSuccess ? (
              <motion.div
                className="bg-green-500/20 border border-green-500/30 rounded-xl p-8 h-full flex flex-col items-center justify-center text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5 }} // Wolniejsza animacja (było 0.5)
              >
                <motion.div 
                  className="w-16 h-16 rounded-full border-4 border-green-500/50 flex items-center justify-center mb-6"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.5, delay: 0.5 }} // Wolniejsza animacja (było 0.5, delay 0.2)
                >
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </motion.div>
                
                <h3 className="text-2xl font-bold mb-4 text-green-400">Wiadomość wysłana!</h3>
                <p className="text-gray-300 mb-8">
                  Dziękuję za kontakt. Odpowiem na Twoją wiadomość najszybciej jak to możliwe.
                </p>
                
                <button
                  className="px-6 py-3 border border-gray-600 bg-gray-800/50 rounded-lg text-gray-200 transition-colors duration-500 hover:bg-gray-700"
                  onClick={resetForm}
                >
                  Wyślij kolejną wiadomość
                </button>
              </motion.div>
            ) : (
              <motion.form 
                className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-8 h-full"
                onSubmit={handleSubmit}
                variants={itemVariants}
              >
                <div className="mb-6">
                  <label htmlFor="name" className="block text-gray-300 mb-2 font-medium">
                    Imię i nazwisko
                  </label>
                  <div className="transition-transform duration-500 hover:scale-[1.01]">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-500"
                      placeholder="Jan Kowalski"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="email" className="block text-gray-300 mb-2 font-medium">
                    Adres email
                  </label>
                  <div className="transition-transform duration-500 hover:scale-[1.01]">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-500"
                      placeholder="jan.kowalski@example.com"
                    />
                  </div>
                </div>
                
                <div className="mb-8">
                  <label htmlFor="message" className="block text-gray-300 mb-2 font-medium">
                    Wiadomość
                  </label>
                  <div className="transition-transform duration-500 hover:scale-[1.01]">
                    <textarea
                      id="message"
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-500 resize-none"
                      placeholder="Treść wiadomości..."
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  className={`w-full py-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-500 ${
                    isSubmitting
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-400'
                  } text-white`}
                  disabled={isSubmitting}
                >
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
                      <span>Wyślij wiadomość</span>
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}