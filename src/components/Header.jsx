// =====================================================
// components/Header.jsx — App header with branding & theme toggle
// =====================================================

import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Sparkles, Github } from 'lucide-react';

/**
 * Header — App title, subtitle, and dark mode toggle
 * @param {boolean} isDark — Current theme state
 * @param {Function} toggleDark — Toggle dark/light mode
 */
const Header = ({ isDark, toggleDark }) => (
  <motion.header
    initial={{ opacity: 0, y: -30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: 'easeOut' }}
    className="flex items-center justify-between mb-8"
  >
    {/* Brand */}
    <div>
      <div className="flex items-center gap-2 mb-1">
        <div className="w-8 h-8 rounded-xl btn-gradient flex items-center justify-center">
          <Sparkles size={16} className="text-white relative z-10" />
        </div>
        <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
          Tasko
        </h1>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 font-body pl-10">
        Your premium task manager
      </p>
    </div>

    {/* Theme toggle */}
    <div className="flex items-center gap-2">
      {/* GitHub link */}
      <motion.a
        href="#"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="tooltip p-2.5 rounded-xl glass-card text-slate-500 dark:text-slate-400
                   hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
        data-tooltip="View Source"
        aria-label="GitHub"
      >
        <Github size={18} />
      </motion.a>

      {/* Dark/Light Toggle */}
      <motion.button
        onClick={toggleDark}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="tooltip p-2.5 rounded-xl glass-card text-slate-500 dark:text-slate-400
                   hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
        data-tooltip={isDark ? 'Light Mode' : 'Dark Mode'}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        <motion.div
          initial={false}
          animate={{ rotate: isDark ? 0 : 360 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </motion.div>
      </motion.button>
    </div>
  </motion.header>
);

export default Header;
