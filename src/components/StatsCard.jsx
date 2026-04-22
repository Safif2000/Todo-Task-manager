// =====================================================
// components/StatsCard.jsx — Dashboard statistics
// =====================================================

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, AlertTriangle, ListTodo } from 'lucide-react';
import { useTodoState } from '../context/TodoContext';
import { calculateStats } from '../utils/helpers';

/**
 * Individual stat item with icon and animated number
 */
const StatItem = ({ icon: Icon, label, value, colorClass, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="glass-card rounded-2xl p-4 flex items-center gap-3 min-w-0"
  >
    <div className={`rounded-xl p-2.5 ${colorClass} flex-shrink-0`}>
      <Icon size={18} className="opacity-90" />
    </div>
    <div className="min-w-0">
      <p className="text-2xl font-bold font-display leading-none text-slate-800 dark:text-white">
        {value}
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-body truncate">
        {label}
      </p>
    </div>
  </motion.div>
);

/**
 * StatsCard — Shows overall task statistics with progress bar.
 * Renders 4 stat tiles: total, completed, pending, overdue.
 */
const StatsCard = () => {
  const { todos } = useTodoState();
  const stats = calculateStats(todos);

  const statItems = [
    {
      icon: ListTodo,
      label: 'Total Tasks',
      value: stats.total,
      colorClass: 'bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400',
    },
    {
      icon: CheckCircle2,
      label: 'Completed',
      value: stats.completed,
      colorClass: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400',
    },
    {
      icon: Clock,
      label: 'Pending',
      value: stats.pending,
      colorClass: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400',
    },
    {
      icon: AlertTriangle,
      label: 'Overdue',
      value: stats.overdue,
      colorClass: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400',
    },
  ];

  return (
    <div className="space-y-3">
      {/* Stat tiles grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statItems.map((item, i) => (
          <StatItem key={item.label} {...item} delay={i * 0.08} />
        ))}
      </div>

      {/* Progress bar section */}
      {stats.total > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="glass-card rounded-2xl px-5 py-4"
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300 font-body">
              Overall Progress
            </span>
            <span className="text-sm font-bold text-brand-600 dark:text-brand-400 font-mono">
              {stats.percentage}%
            </span>
          </div>
          {/* Background track */}
          <div className="h-2 bg-slate-200 dark:bg-slate-700/50 rounded-full overflow-hidden">
            <motion.div
              className="progress-bar h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${stats.percentage}%` }}
              transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
            />
          </div>
          {/* Sub label */}
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-body">
            {stats.completed} of {stats.total} tasks completed
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default StatsCard;
