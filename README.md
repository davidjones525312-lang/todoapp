# My Todo App

A modern, responsive todo application built with React, TypeScript, and Supabase.

## Features

- Create, complete, and delete tasks
- Add optional descriptions to tasks
- Filter tasks by status (All, Active, Completed)
- Clear all completed tasks at once
- Optimistic UI updates for instant feedback
- Smooth animations and glassmorphism design
- Fully responsive layout

## Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development and builds
- **Tailwind CSS v4** for styling
- **Supabase** for backend database
- **Netlify** for deployment

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env` file in the root directory with your Supabase credentials:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_key
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
  App.tsx              # Main app component with todo state management
  main.tsx             # App entry point
  index.css            # Global styles, Tailwind config, and custom utilities
  components/
    TodoForm.tsx       # Input form for adding new todos
    TodoItem.tsx       # Individual todo item with toggle and delete
  services/
    todoService.ts     # Supabase CRUD operations for todos
  utils/
    supabase.ts        # Supabase client configuration
```

## Deployment

The app is configured for Netlify deployment. Push to the main branch to trigger a deploy.
