
# Todo-Task-manager
=======
# Tasko — Premium Todo App

> A portfolio-grade, fully-featured todo application built with React + Vite.

![Tasko](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite) ![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss) ![Framer](https://img.shields.io/badge/Framer%20Motion-11-ff69b4)

## ✨ Features

- ✅ Add, edit, delete, and toggle todos
- 🎯 Three-level priority system (Low / Medium / High) with visual indicators
- 📅 Due dates with overdue detection and highlight
- 🔍 Real-time debounced search by title + priority
- 🗂 Filter tabs: All / Active / Done
- 📊 Stats dashboard with animated progress bar
- 🌗 Dark/Light mode with system preference detection, persisted to localStorage
- 🔀 Drag & drop reordering via @hello-pangea/dnd
- 🧹 Bulk actions: Mark all complete, Clear completed (with confirmation)
- 💾 Full localStorage persistence (auto-synced on every change)
- ✨ Glassmorphism UI with Framer Motion animations throughout
- ♿ Accessible: keyboard navigation, ARIA labels, focus visible

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🏗 Project Structure

```
src/
├── components/
│   ├── TodoInput.jsx     # Add todo form (title, priority, due date)
│   ├── TodoList.jsx      # DnD-enabled list wrapper
│   ├── TodoItem.jsx      # Single todo with inline editing
│   ├── FilterBar.jsx     # Search + filter tabs + bulk actions
│   ├── StatsCard.jsx     # Stats dashboard with progress bar
│   └── EmptyState.jsx    # Empty state illustration
├── context/
│   ├── TodoContext.jsx   # Provider, hooks, action creators
│   └── TodoReducer.js    # Pure reducer, action types
├── hooks/
│   ├── useLocalStorage.js  # Persistent state hook
│   └── useDarkMode.js      # Dark mode with system pref sync
├── styles/
│   └── glass.css         # Glassmorphism + premium UI styles
├── utils/
│   └── helpers.js        # Pure utility functions
├── App.jsx               # Root component + layout
└── main.jsx              # Entry point
```

## 🎨 Design

- **Typography**: Clash Display (headings) + Satoshi (body) + JetBrains Mono (code/dates)
- **Color Palette**: Indigo/Violet brand with emerald, amber, red priority accents
- **Effects**: Glassmorphism cards, gradient buttons, animated background orbs
- **Animations**: Framer Motion for list transitions, micro-interactions, drag feedback

