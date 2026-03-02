// =====================================================
// components/EmptyState.jsx — No todos illustration
// =====================================================

import React from 'react';
import { motion } from 'framer-motion';

/**
 * EmptyState — Shown when no todos match the current filter/search.
 * Renders different messages based on the active state.
 */
const EmptyState = ({ filter, hasSearch }) => {
  // Different copy based on context
  const config = hasSearch
    ? {
        emoji: '🔍',
        title: 'No results found',
        subtitle: 'Try adjusting your search or clearing filters',
      }
    : filter === 'completed'
    ? {
        emoji: '🏆',
        title: 'No completed tasks',
        subtitle: "Complete some tasks and they'll show up here",
      }
    : filter === 'active'
    ? {
        emoji: '✨',
        title: 'All caught up!',
        subtitle: 'No active tasks — great work on staying on top of things',
      }
    : {
        emoji: '🌱',
        title: 'Your workspace is empty',
        subtitle: 'Add your first task above to get started',
      };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      {/* Animated floating illustration */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="mb-6"
      >
        {/* SVG illustration */}
        <svg
          width="140"
          height="140"
          viewBox="0 0 140 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="opacity-60"
        >
          {/* Outer circle */}
          <circle cx="70" cy="70" r="60" fill="url(#emptyGrad)" opacity="0.15" />
          {/* Clipboard body */}
          <rect x="42" y="35" width="56" height="72" rx="8" fill="url(#emptyGrad)" opacity="0.3" />
          <rect x="45" y="38" width="50" height="66" rx="6" fill="white" opacity="0.4"
            className="dark:opacity-10" />
          {/* Clipboard clip */}
          <rect x="58" y="30" width="24" height="12" rx="6" fill="url(#emptyGrad)" opacity="0.5" />
          {/* Lines (tasks) */}
          <rect x="52" y="55" width="36" height="4" rx="2" fill="url(#emptyGrad)" opacity="0.4" />
          <rect x="52" y="67" width="28" height="4" rx="2" fill="url(#emptyGrad)" opacity="0.3" />
          <rect x="52" y="79" width="32" height="4" rx="2" fill="url(#emptyGrad)" opacity="0.2" />
          {/* Check mark circle */}
          <circle cx="100" cy="100" r="18" fill="url(#emptyGrad)" opacity="0.8" />
          <path d="M93 100 L98 105 L108 95" stroke="white" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round" />
          <defs>
            <linearGradient id="emptyGrad" x1="0" y1="0" x2="140" y2="140">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
          </defs>
        </svg>

        {/* Floating emoji */}
        <motion.div
          className="text-4xl mt-2"
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          {config.emoji}
        </motion.div>
      </motion.div>

      {/* Text content */}
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-xl font-semibold font-display text-slate-700 dark:text-slate-200 mb-2"
      >
        {config.title}
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="text-sm text-slate-400 dark:text-slate-500 font-body max-w-xs"
      >
        {config.subtitle}
      </motion.p>
    </motion.div>
  );
};

export default EmptyState;
