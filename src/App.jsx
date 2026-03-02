// =====================================================
// App.jsx — Root application component
// =====================================================

import React from 'react';
import { TodoProvider } from './context/TodoContext';
import useDarkMode from './hooks/useDarkMode';

import Header from './components/Header';
import BackgroundOrbs from './components/BackgroundOrbs';
import Footer from './components/Footer';
import StatsCard from './components/StatsCard';
import TodoInput from './components/TodoInput';
import FilterBar from './components/FilterBar';
import TodoList from './components/TodoList';

import './styles/glass.css';

/**
 * AppContent — Inner layout that consumes the TodoContext.
 * Separated from App so TodoProvider can wrap it.
 */
const AppContent = () => {
  const [isDark, toggleDark] = useDarkMode();

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark gradient-bg transition-colors duration-300">
      {/* Decorative background orbs */}
      <BackgroundOrbs />

      {/* Main content */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <Header isDark={isDark} toggleDark={toggleDark} />

        {/* Stats Dashboard */}
        <section aria-label="Task statistics" className="mb-6">
          <StatsCard />
        </section>

        {/* Add Todo */}
        <section aria-label="Add new task" className="mb-4">
          <TodoInput />
        </section>

        {/* Filter & Search */}
        <section aria-label="Filter tasks" className="mb-4 space-y-3">
          <FilterBar />
        </section>

        {/* Todo List */}
        <main aria-label="Task list">
          <TodoList />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

/**
 * App — Root component.
 * Wraps everything in TodoProvider for global state access.
 */
const App = () => (
  <TodoProvider>
    <AppContent />
  </TodoProvider>
);

export default App;
