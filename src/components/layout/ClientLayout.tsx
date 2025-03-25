'use client';

import { useState, useEffect } from 'react';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { LanguageProvider } from '@/providers/LanguageProvider';
import { TransitionProvider, default as PageTransition } from '@/components/layout/PageTransition';
import Preloader from '@/components/common/Preloader';
import ImprovedHeader from '@/components/layout/ImprovedHeader';
import Footer from '@/components/layout/Footer';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Symulacja ładowania zasobów strony
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 sekundy na pokazanie preloadera
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <ThemeProvider>
      <LanguageProvider>
        <TransitionProvider>
          {isLoading && <Preloader />}
          
          <div className="flex flex-col min-h-screen">
            <ImprovedHeader />
            
            <main className="flex-grow">
              <PageTransition>
                {children}
              </PageTransition>
            </main>
            
            <Footer />
          </div>
        </TransitionProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}