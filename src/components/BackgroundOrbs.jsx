// =====================================================
// components/BackgroundOrbs.jsx — Decorative background blobs
// =====================================================

import React from 'react';

/**
 * BackgroundOrbs — Fixed decorative gradient orbs behind the app UI.
 * Purely visual, pointer-events disabled.
 */
const BackgroundOrbs = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-400/10 dark:bg-brand-600/10 rounded-full blur-3xl" />
    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-400/10 dark:bg-violet-600/10 rounded-full blur-3xl" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-300/5 rounded-full blur-3xl" />
  </div>
);

export default BackgroundOrbs;
