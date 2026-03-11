# CLAUDE.md - UPro Frontend Project Guide

> Instructions for Claude Code when working with the UPro Frontend codebase

## Project Overview

**UPro Frontend** is a modern task marketplace platform built with React, TypeScript, and real-time capabilities. It connects task posters (clients) with skilled executors through a seamless web interface featuring browsing, task creation, real-time chat, and comprehensive executor profiles.

**Backend API**: `https://uprobackend-production-8628.up.railway.app`
**SignalR Hub**: `/hubs/chat`

## Tech Stack

### Core
- **React 18** with TypeScript (strict mode)
- **Vite 5.x** for build tooling
- **React Router v7** for navigation

### State Management
- **TanStack Query v5** - Server state with caching
- **Zustand** - Client state (auth, UI)
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Styling & UI
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Pre-built components
- **Lucide React** - Icons
- **react-hot-toast** - Notifications

### Real-Time
- **SignalR (@microsoft/signalr)** - WebSocket connections
- Auto-reconnect with exponential backoff (1s → 30s max)

### Additional
- **axios** - HTTP client
- **date-fns** - Date formatting
- **browser-image-compression** - Image optimization

## Project Structure

```
src/
├── app/                        # Application core
│   ├── providers/             # Context providers (Auth, Query, SignalR)
│   └── router.tsx             # Route configuration
├── features/                  # Feature modules (Clean Architecture)
│   ├── auth/                  # Phone-based OTP authentication
│   ├── tasks/                 # Task management & browsing
│   ├── executors/             # Executor profiles
│   ├── chat/                  # Real-time chat
│   └── notifications/         # Push notifications
├── shared/                    # Shared resources
│   ├── api/                   # API client & endpoints
│   ├── components/            # Reusable UI components
│   ├── constants/             # App constants
│   ├── hooks/                 # Custom hooks
│   ├── types/                 # Shared TypeScript types
│   └── utils/                 # Utility functions
├── lib/                       # Third-party lib configurations
├── App.tsx                    # Root component
├── main.tsx                   # Entry point
└── index.css                  # Global styles
```

### Feature Module Structure
Each feature follows Clean Architecture:
```
feature/
├── api/                       # API calls (backend integration)
├── components/                # Feature-specific UI components
├── hooks/                     # Business logic (queries/mutations)
├── pages/                     # Route-level page components
├── schemas/                   # Zod validation schemas
└── types/                     # TypeScript interfaces
```

## Architecture Principles

### Clean Architecture Flow
1. **API Layer** (`api/`) - HTTP requests, endpoints
2. **Hooks Layer** (`hooks/`) - Business logic, TanStack Query
3. **Components Layer** (`components/` + `pages/`) - UI presentation

### Key Patterns

**API Integration**
- All requests through centralized `apiClient` (axios instance)
- Interceptors handle auth tokens and errors
- All endpoints defined as constants
- Response type: `ApiResult<T>` pattern from backend
- No `any` types - strict TypeScript throughout

**State Management**
- Server state → TanStack Query (queries/mutations)
- Auth state → Zustand (`useAuthStore`)
- UI state → React local state or Zustand
- Form state → React Hook Form + Zod validation

**Error Handling**
- Global error boundary
- API error interceptors
- Toast notifications for user feedback
- Graceful fallbacks and loading states

**Performance**
- Optimistic updates for instant feedback
- Query caching and smart invalidation
- Image compression before upload
- Auto-reconnect for SignalR
- Code splitting ready (React.lazy)

## Coding Conventions

### File Naming
- Components: `PascalCase.tsx` (e.g., `TaskCard.tsx`)
- Hooks: `camelCase.ts` with `use` prefix (e.g., `useTaskList.ts`)
- Utils: `camelCase.ts` (e.g., `formatDate.ts`)
- Types: `camelCase.types.ts` (e.g., `task.types.ts`)
- API: `camelCase.ts` with `Api` suffix (e.g., `taskApi.ts`)

### TypeScript
- Strict mode enabled - NO `any` types
- Explicit return types for functions
- Interface for component props
- Type imports: `import type { ... }`
- Shared types in `shared/types/`

### Component Structure
```tsx
// Imports
import { useState } from 'react';
import type { ComponentProps } from './types';

// Types/Interfaces
interface Props {
  title: string;
  onClick: () => void;
}

// Component
export function Component({ title, onClick }: Props) {
  // State
  const [state, setState] = useState();

  // Hooks
  const { data } = useQuery();

  // Handlers
  const handleClick = () => {
    // logic
  };

  // Render
  return <div>...</div>;
}
```

### Form Handling
1. Define Zod schema in `schemas/`
2. Use React Hook Form with `@hookform/resolvers/zod`
3. Show field-specific errors
4. Retain data on validation failure
5. Toast on submit success/error

### API Calls
1. Define endpoint in feature's `api/` file
2. Create TanStack Query hook in `hooks/`
3. Use query for GET, mutation for POST/PUT/DELETE
4. Handle loading, error, success states
5. Invalidate related queries on mutation success

## Environment Variables

Required in `.env`:
```
VITE_API_BASE_URL=http://localhost:5150
VITE_SIGNALR_HUB_URL=http://localhost:5150/hubs/chat
```

## Common Commands

```bash
# Development
npm run dev              # Start dev server (localhost:5173)

# Build & Preview
npm run build            # TypeScript compile + Vite build
npm run preview          # Preview production build

# Code Quality
npm run lint             # ESLint (max 5 warnings allowed)
npm run lint:fix         # Auto-fix ESLint issues
npm run format           # Format with Prettier
npm run type-check       # TypeScript check without emit

# Testing
npm run test             # Run Vitest
npm run test:ci          # CI mode (no watch)
npm run test:coverage    # With coverage report
```

## Important Notes

### Authentication
- Email-based OTP flow (2 steps: email → OTP verification)
- Access token in memory, refresh token in localStorage
- Auto-refresh before expiration
- Protected routes redirect to login with return URL (using ProtectedRoute component)
- Token attached via axios interceptor
- Auth state includes: userId, accessToken, isProfileCompleted

### Real-Time Chat
- SignalR connection in `SignalRProvider`
- Typing indicators: 1s debounce, 3s auto-clear
- Optimistic message updates
- Auto-reconnect on network loss
- Message status: sending → sent → delivered

### Image Handling
- Max 5 images per task, 5MB each
- JPEG/PNG/GIF/WEBP supported
- Client-side compression before upload
- Backend returns image URLs (not base64)
- Display via `<img src={url}>` for caching

### Data Flow Examples

**Creating a Task**
```
1. User fills form (React Hook Form + Zod validation)
2. Form submits → useCreateTask mutation
3. API call via taskApi.createTask()
4. Success → invalidate task queries, show toast
5. Navigate to task detail page
```

**Real-Time Messages**
```
1. User types → send typing indicator via SignalR
2. User submits → optimistic update (show immediately)
3. Send via SignalR hub
4. Server confirms → update message status
5. Recipient receives via SignalR event listener
```

## Working with This Codebase

### When Adding Features
1. Identify feature module (or create new under `features/`)
2. Add API functions in `api/`
3. Create hooks with TanStack Query in `hooks/`
4. Build components in `components/`
5. Create page component in `pages/`
6. Update router in `app/router.tsx`
7. Add validation schemas if forms involved

### When Fixing Bugs
1. Locate feature module
2. Check API response types match backend
3. Verify error handling in hooks
4. Check loading/error states in components
5. Test with network throttling for real-time features

### When Refactoring
1. Maintain Clean Architecture separation
2. Keep feature modules self-contained
3. Extract shared logic to `shared/`
4. Update types if API contracts change
5. Run `npm run type-check` and `npm run lint`

## Best Practices

✅ **DO**
- Use TypeScript strict mode (no `any`)
- Define types/interfaces for all data structures
- Use TanStack Query for all server state
- Show loading states and errors in UI
- Validate forms with Zod schemas
- Keep components small and focused
- Use shadcn/ui components when available
- Handle edge cases (network errors, empty states)
- Write meaningful commit messages

❌ **DON'T**
- Hardcode API URLs (use constants)
- Store server state in Zustand/local state
- Use inline type literals for props
- Skip error handling
- Ignore TypeScript errors
- Mix business logic in components
- Create new components if shadcn/ui has one
- Commit without running lint and type-check

## Git Workflow

```bash
# Before committing
npm run lint:fix
npm run type-check
npm run format

# Commit message format
feat: add task filtering by category
fix: resolve SignalR reconnection issue
refactor: extract message list to component
docs: update API integration guide
```

## Resources

- **shadcn/ui docs**: https://ui.shadcn.com/
- **TanStack Query**: https://tanstack.com/query
- **React Hook Form**: https://react-hook-form.com/
- **Zod**: https://zod.dev/
- **SignalR**: https://learn.microsoft.com/en-us/aspnet/core/signalr/

---

**Last Updated**: 2026-03-11
**Project Version**: 0.0.1
**Node Version Required**: 18+
