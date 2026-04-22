// =====================================================
// components/Footer.jsx — App footer
// =====================================================

import React from 'react';
import { motion } from 'framer-motion';

/**
 * Footer — Simple animated footer with credits.
 */
const Footer = () => (
  <motion.footer
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.8 }}
    className="mt-10 text-center"
  >
    <p className="text-xs text-slate-400 dark:text-slate-600 font-body">
      Built with ♥ using React + Vite + Tailwind
    </p>
  </motion.footer>
);

export default Footer;
