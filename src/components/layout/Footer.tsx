'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    { icon: Github, href: 'https://github.com/twojeusername', ariaLabel: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com/in/twojeusername', ariaLabel: 'LinkedIn' },
    { icon: Twitter, href: 'https://twitter.com/twojeusername', ariaLabel: 'Twitter' },
    { icon: Mail, href: 'mailto:email@example.com', ariaLabel: 'Email' },
  ];

  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 } 
    },
  };

  const socialVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const iconVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 } 
    },
  };

  return (
    <motion.footer 
      className="py-8 bg-gray-950/80 backdrop-blur-md border-t border-gray-800"
      variants={footerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="text-center md:text-left">
            <Link href="/">
              <motion.div 
                className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 cursor-pointer mb-2"
                whileHover={{ scale: 1.05 }}
              >
                Patryk<span className="text-white">Rakowski</span>
              </motion.div>
            </Link>
            <p className="text-gray-400 text-sm">
              Inżynier Informatyki | Programista | Pasjonat technologii
            </p>
          </div>
          
          <motion.div 
            className="flex space-x-5" 
            variants={socialVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.ariaLabel}
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                variants={iconVariants}
                whileHover={{ y: -3, color: '#60a5fa' }}
              >
                <social.icon className="h-5 w-5" />
              </motion.a>
            ))}
          </motion.div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>&copy; {currentYear} Patryk Rakowski. Wszelkie prawa zastrzeżone.</p>
        </div>
      </div>
    </motion.footer>
  );
}