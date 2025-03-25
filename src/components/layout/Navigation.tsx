'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

interface NavigationProps {
  isMobile?: boolean;
  closeMenu?: () => void;
}

export default function Navigation({ isMobile = false, closeMenu }: NavigationProps) {
  const pathname = usePathname();
  
  const navItems = [
    { name: 'Strona główna', path: '/' },
    { name: 'Projekty', path: '/projekty' },
    { name: 'Blog', path: '/blog' },
    { name: 'Umiejętności', path: '/umiejetnosci' },
    { name: 'O mnie', path: '/o-mnie' },
    { name: 'Kontakt', path: '/kontakt' },
  ];

  // Animacje
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.nav
      className={`${isMobile ? 'flex flex-col items-center space-y-6' : 'flex space-x-8'}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {navItems.map((item) => (
        <motion.div key={item.name} variants={itemVariants}>
          <Link 
            href={item.path} 
            onClick={isMobile && closeMenu ? closeMenu : undefined}
            className={`relative group ${
              pathname === item.path 
                ? 'text-blue-400 font-medium' 
                : 'text-gray-300 hover:text-white transition-colors'
            }`}
          >
            {item.name}
            <span 
              className={`absolute -bottom-1 left-0 w-full h-0.5 bg-blue-400 transform scale-x-0 origin-left transition-transform duration-300 ${
                pathname === item.path ? 'scale-x-100' : 'group-hover:scale-x-100'
              }`}
            />
          </Link>
        </motion.div>
      ))}
    </motion.nav>
  );
}