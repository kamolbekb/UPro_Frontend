# Implementation Plan: UPro Frontend Application

**Branch**: `001-frontend-app` | **Date**: 2026-03-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-frontend-app/spec.md`

## Summary

Build a production-ready React TypeScript web application for the UPro freelance marketplace platform. The application provides user authentication via phone/OTP, task browsing and creation, executor profile management, real-time chat communication, and push notifications. The frontend integrates with the existing UPro backend API at `https://uprobackend-production-8628.up.railway.app` using RESTful endpoints for data operations and SignalR for real-time features.

**Technical Approach**: Feature-based architecture with strict separation of concerns (API layer, business logic hooks, UI components), comprehensive type safety using TypeScript, server state management via TanStack Query, real-time communication via SignalR, and form validation using React Hook Form + Zod.

## Technical Context

**Language/Version**: TypeScript 5.3+ (strict mode), ES2020+ target
**Framework**: React 18.2+ with functional components and hooks
**Build Tool**: Vite 5.x (fast development server, optimized production builds)
**Primary Dependencies**:
- **State Management**: TanStack Query v5 (server state), Zustand (client state for auth/UI)
- **Routing**: React Router v6 (declarative routing with type-safe navigation)
- **Real-Time**: @microsoft/signalr (WebSocket communication for chat)
- **HTTP Client**: Axios (centralized API client with interceptors)
- **Forms**: React Hook Form + Zod (schema-based validation)
- **UI Framework**: Tailwind CSS + shadcn/ui (utility-first styling with accessible components)
- **Icons**: Lucide React (consistent icon system)
- **Notifications**: react-hot-toast (user feedback for async operations)

**Storage**:
- LocalStorage: Refresh tokens only (security consideration documented)
- Memory: Access tokens (cleared on tab close for security)
- Browser cache: API responses managed by TanStack Query

**Testing**: Vitest + React Testing Library (component testing, integration testing)

**Target Platform**: Modern web browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

**Project Type**: Single-page application (SPA) - web only, no native mobile apps in Phase 1

**Performance Goals**:
- Initial page load: <3s on 3G connection
- API response handling: <2s for 95% of requests
- Search results: <1s latency from input to display
- Real-time message delivery: <2s latency
- Image optimization: Client-side compression before upload to reduce bandwidth

**Constraints**:
- Mobile responsive: Minimum 375px width (iPhone SE)
- Maximum bundle size: <500KB initial bundle (code splitting for routes)
- Image uploads: 5MB max per file, 5 files per task
- SignalR fallback: Long polling if WebSockets unavailable
- Offline support: Not required in Phase 1 (future enhancement)

**Scale/Scope**:
- User base: Designed for 10,000+ concurrent users
- Features: 6 core user journeys (Auth, Tasks, Executors, Chat, Notifications, Profile)
- API endpoints: ~25 REST endpoints + 1 SignalR hub
- Components: ~80-100 React components estimated
- Routes: ~12 distinct pages/views

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

This is a **Frontend project** consuming the UPro Backend API. The Backend constitution (Clean Architecture, .NET patterns) does not directly apply. Instead, we follow **Frontend architecture principles**:

### Frontend Architecture Principles

- **Feature-Based Organization**: Code organized by domain feature (auth, tasks, chat, etc.), not by technical layer
- **Separation of Concerns**: Strict boundaries between API layer, business logic (hooks), and presentation (components)
- **Type Safety**: No `any` types; all API responses, props, and state must be typed
- **Declarative Data Fetching**: Use TanStack Query for server state; avoid manual fetch/setState patterns
- **Single Source of Truth**: Server is source of truth; optimize UI with caching and optimistic updates
- **Accessibility**: WCAG 2.1 AA compliance; keyboard navigation, screen reader support, ARIA labels
- **Performance**: Code splitting by route, lazy loading for heavy components, image optimization
- **Security**: Tokens in memory (access) or httpOnly cookies (refresh), XSS prevention via React's built-in escaping, CSRF tokens if required by backend

### Backend API Integration Compliance

- **API Response Pattern**: ✅ Backend returns `ApiResult<T>` - Frontend must handle `.succeeded`, `.result`, `.errors` pattern
- **Authentication**: ✅ Backend uses JWT - Frontend must attach `Authorization: Bearer <token>` header to all protected requests
- **Validation**: ✅ Backend validates with FluentValidation - Frontend provides client-side validation for UX but trusts backend as authority
- **Real-Time**: ✅ Backend provides SignalR hub at `/hubs/chat` - Frontend must implement connection lifecycle management
- **File Uploads**: ✅ Backend accepts multipart/form-data and returns image URLs (not base64) - Frontend must use `FormData` for uploads
- **Cross-Origin**: ✅ Backend CORS must be configured to allow frontend origin during development and production

**Status**: ✅ **Compliant** - No constitution violations. Frontend follows React/TypeScript best practices and integrates correctly with Backend API contracts.

## Project Structure

### Documentation (this feature)

```text
specs/001-frontend-app/
├── plan.md              # This file (implementation plan)
├── research.md          # Phase 0: Technology decisions and alternatives
├── data-model.md        # Phase 1: TypeScript interfaces for all entities
├── contracts/           # Phase 1: API endpoint specifications (OpenAPI-style)
│   ├── auth.md
│   ├── tasks.md
│   ├── executors.md
│   ├── chat.md
│   └── notifications.md
└── quickstart.md        # Phase 1: Development setup and run instructions
```

### Source Code (Frontend repository root)

```text
upro-frontend/
├── src/
│   ├── app/
│   │   ├── App.tsx                        # Root component with providers
│   │   ├── router.tsx                     # Centralized route definitions
│   │   └── providers/
│   │       ├── AuthProvider.tsx           # Auth state + token lifecycle
│   │       ├── QueryProvider.tsx          # TanStack Query config
│   │       └── SignalRProvider.tsx        # SignalR connection management
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── api/authApi.ts             # Auth API calls
│   │   │   ├── components/                # Auth-specific UI (OtpInput, PhoneInput)
│   │   │   ├── hooks/                     # useLogin, useAuthStore (Zustand)
│   │   │   ├── schemas/authSchemas.ts     # Zod validation schemas
│   │   │   ├── types/auth.types.ts        # TypeScript interfaces
│   │   │   └── pages/                     # LoginPage, OtpVerifyPage
│   │   │
│   │   ├── tasks/
│   │   │   ├── api/taskApi.ts             # Task CRUD operations
│   │   │   ├── components/                # TaskCard, TaskFilters, TaskImageUpload
│   │   │   ├── hooks/                     # useTasks, useCreateTask, useSavedTasks
│   │   │   ├── schemas/taskSchemas.ts     # Form validation
│   │   │   ├── types/task.types.ts        # Task interfaces
│   │   │   └── pages/                     # TasksPage, TaskDetailPage, CreateTaskPage
│   │   │
│   │   ├── executors/
│   │   │   ├── api/executorApi.ts
│   │   │   ├── components/                # ExecutorCard, BecomeExecutorForm
│   │   │   ├── hooks/                     # useExecutors, useBecomeExecutor
│   │   │   ├── schemas/executorSchemas.ts
│   │   │   ├── types/executor.types.ts
│   │   │   └── pages/                     # ExecutorsPage, ExecutorProfilePage
│   │   │
│   │   ├── chat/
│   │   │   ├── api/chatApi.ts             # REST API for chat history
│   │   │   ├── components/                # ConversationList, MessageBubble, MessageInput
│   │   │   ├── hooks/                     # useConversations, useMessages, useChatHub
│   │   │   ├── types/chat.types.ts
│   │   │   └── pages/ChatPage.tsx
│   │   │
│   │   └── notifications/
│   │       ├── api/notificationApi.ts
│   │       ├── components/                # NotificationBell, NotificationList
│   │       ├── hooks/useNotifications.ts
│   │       └── types/notification.types.ts
│   │
│   ├── shared/
│   │   ├── api/
│   │   │   ├── client.ts                  # Axios instance + interceptors
│   │   │   ├── types.ts                   # ApiResult<T>, PaginatedResult<T>
│   │   │   └── endpoints.ts               # All API URL constants
│   │   ├── components/
│   │   │   ├── ui/                        # shadcn/ui base components
│   │   │   ├── layout/                    # MainLayout, AuthLayout, Sidebar
│   │   │   ├── feedback/                  # LoadingSpinner, ErrorBoundary, EmptyState
│   │   │   └── guards/ProtectedRoute.tsx  # Auth route protection
│   │   ├── hooks/
│   │   │   ├── useDebounce.ts
│   │   │   └── usePagination.ts
│   │   ├── utils/
│   │   │   ├── formatDate.ts
│   │   │   ├── formatCurrency.ts
│   │   │   └── cn.ts                      # Tailwind class merge utility
│   │   └── constants/
│   │       ├── queryKeys.ts               # TanStack Query key factories
│   │       ├── signalrEvents.ts           # SignalR event name constants
│   │       └── routes.ts                  # App route path constants
│   │
│   ├── assets/                            # Static images, fonts
│   ├── main.tsx                           # App entry point
│   ├── index.css                          # Global Tailwind imports
│   └── vite-env.d.ts                      # Vite type definitions
│
├── public/                                # Static assets served as-is
├── .env.example                           # Environment variables template
├── .env.local                             # Local environment (gitignored)
├── package.json                           # Dependencies and scripts
├── tsconfig.json                          # TypeScript configuration (strict mode)
├── tsconfig.node.json                     # TypeScript for build scripts
├── vite.config.ts                         # Vite build configuration + path aliases
├── tailwind.config.js                     # Tailwind CSS configuration
├── components.json                        # shadcn/ui CLI configuration
├── .eslintrc.cjs                          # ESLint rules
├── .prettierrc                            # Code formatting rules
└── README.md                              # Project documentation
```

**Structure Decision**: **Single-page web application** (Option 1 adapted for React). The project is organized by **feature modules** (auth, tasks, executors, chat, notifications) rather than technical layers. Each feature is self-contained with its own API layer, hooks (business logic), components (UI), types, and schemas. Shared code lives in `/shared` for cross-feature utilities and components.

This structure was chosen because:
- **Scalability**: Features can be developed and tested independently
- **Maintainability**: Related code is co-located (easier to find and modify)
- **Team collaboration**: Multiple developers can work on different features without conflicts
- **Code splitting**: Features can be lazy-loaded for better performance

## Complexity Tracking

**Status**: ✅ **No violations** - Frontend architecture aligns with React/TypeScript best practices.

*This section is empty because there are no deviations from standard patterns that require justification.*

## Phase 0: Research & Technology Decisions

**Status**: ✅ **COMPLETE** - See [research.md](./research.md)

All technology choices have been validated:
- React 18 + TypeScript: Industry standard for type-safe SPAs
- Vite: 10x faster than Webpack for development, better production builds
- TanStack Query: Best-in-class server state management with caching
- Zustand: Lightweight state management for client-side state (auth, UI)
- SignalR: Mandated by backend for real-time chat
- Tailwind CSS: Utility-first CSS for rapid development
- shadcn/ui: Accessible, customizable component library built on Radix UI

No open questions or NEEDS CLARIFICATION markers remain.

## Phase 1: Design & Contracts

### Data Model

**Status**: ✅ **COMPLETE** - See [data-model.md](./data-model.md)

All TypeScript interfaces defined for:
- User, Task, Executor, Conversation, Message, Notification
- API request/response DTOs
- Form data types
- UI state types

### API Contracts

**Status**: ✅ **COMPLETE** - See [contracts/](./contracts/)

Documented all REST endpoints and SignalR hub methods:
- Auth: POST /api/Users/login, POST /api/Users/verify-otp
- Tasks: GET/POST /api/OrderTasks, GET /api/OrderTasks/search
- Executors: POST /api/Executors/become, GET /api/Executors/profile
- Chat: GET /api/Chat/conversations, SignalR /hubs/chat
- Notifications: GET /api/Notifications, POST /api/Notifications/mark-read

### Quick Start Guide

**Status**: ✅ **COMPLETE** - See [quickstart.md](./quickstart.md)

Setup instructions for developers:
1. Prerequisites (Node.js 18+, npm/yarn/pnpm)
2. Installation steps
3. Environment configuration
4. Development server
5. Build and deploy

## Phase 2: Implementation Tasks

**Status**: ⏳ **PENDING** - Use `/speckit.tasks` to generate dependency-ordered tasks

Task generation will produce `tasks.md` with:
- Phase 1: Foundation (Vite setup, Tailwind, folder structure)
- Phase 2: Authentication (Login, OTP, token refresh)
- Phase 3: Tasks (Browse, search, create, detail view)
- Phase 4: Executors (Profile creation, management)
- Phase 5: Chat (SignalR integration, messaging UI)
- Phase 6: Notifications (Browser notifications, notification center)

Each task will include:
- Acceptance criteria from feature spec
- Dependencies on other tasks
- File paths to create/modify
- Testing requirements

## Architecture Decisions

### 1. State Management Strategy

**Decision**: TanStack Query for server state + Zustand for client state

**Rationale**:
- **TanStack Query**: Purpose-built for server state (caching, revalidation, background updates, request deduplication)
- **Zustand**: Minimal boilerplate for client state (auth tokens, UI preferences, modals)
- **Avoid Redux**: Overkill for this application; TanStack Query handles 90% of state needs

**Alternatives Considered**:
- Redux Toolkit: Too much boilerplate, async logic requires thunks/saga
- React Context + useState: Poor performance (re-renders), no caching, manual loading states
- Apollo Client: Requires GraphQL (backend is REST)

### 2. Form Validation Approach

**Decision**: React Hook Form + Zod schemas

**Rationale**:
- **React Hook Form**: Best performance (uncontrolled inputs), minimal re-renders
- **Zod**: Type-safe schemas that generate TypeScript types
- **Integration**: `@hookform/resolvers/zod` provides seamless integration

**Alternatives Considered**:
- Formik + Yup: Slower (controlled inputs), larger bundle size
- Vanilla React state: Manual error handling, no schema reuse
- HTML5 validation: Insufficient (no async validation, poor UX)

### 3. Real-Time Communication

**Decision**: @microsoft/signalr library

**Rationale**:
- **Backend mandate**: Backend already provides SignalR hub at `/hubs/chat`
- **WebSocket fallback**: Automatically falls back to long polling if WebSockets blocked
- **TypeScript support**: Official package has excellent type definitions

**Alternatives Considered**:
- Socket.io: Backend doesn't use Socket.io (incompatible protocol)
- Native WebSocket: No automatic reconnection, no fallback mechanism
- Polling only: Inefficient for real-time chat (high latency, server load)

### 4. Routing Strategy

**Decision**: React Router v6 with centralized route configuration

**Rationale**:
- **Type-safe navigation**: Define all routes in one file with constants
- **Nested layouts**: MainLayout (authenticated) vs AuthLayout (public pages)
- **Protected routes**: `ProtectedRoute` component checks auth before rendering
- **Code splitting**: Lazy load route components to reduce initial bundle

**Alternatives Considered**:
- TanStack Router: Too new, smaller ecosystem
- Next.js: Over-engineering (don't need SSR for authenticated SPA)
- Manual history API: Missing routing features (params, query strings, nested routes)

### 5. Styling Approach

**Decision**: Tailwind CSS + shadcn/ui

**Rationale**:
- **Rapid development**: Utility classes eliminate context switching between files
- **Consistency**: Design tokens enforced via Tailwind config
- **Accessibility**: shadcn/ui built on Radix UI (ARIA compliant)
- **Customization**: All components owned by project (no version lock-in)

**Alternatives Considered**:
- CSS Modules: Requires writing CSS, no utility classes, larger stylesheets
- Styled Components: Runtime performance cost, larger bundle
- MUI/Ant Design: Opinionated design, hard to customize, large bundle size

### 6. Token Storage Strategy

**Decision**: Access tokens in memory (Zustand), refresh tokens in localStorage

**Rationale**:
- **Security**: Access tokens cleared on tab close (can't be stolen from localStorage)
- **UX**: Refresh tokens persist for session restoration (user doesn't re-login)
- **XSS mitigation**: Short-lived access tokens reduce attack window
- **Production TODO**: Move refresh tokens to httpOnly cookies (requires backend change)

**Alternatives Considered**:
- Both in localStorage: Vulnerable to XSS attacks (malicious script steals tokens)
- Both in memory: Poor UX (user logs out on every tab close)
- SessionStorage: Loses tokens on tab duplication, same XSS risk as localStorage

## Risk Mitigation

### Risk 1: SignalR Connection Stability

**Risk**: Poor network conditions cause frequent disconnections

**Mitigation**:
- Exponential backoff for reconnection attempts (1s, 2s, 4s, 8s, max 30s)
- Show connection status indicator in UI
- Queue messages during disconnection, send on reconnect
- Log connection events for debugging

### Risk 2: Token Refresh Race Conditions

**Risk**: Multiple API calls trigger simultaneous token refresh, causing conflicts

**Mitigation**:
- Implement request queue during token refresh
- First 401 response triggers refresh, subsequent requests wait
- Retry queued requests after successful refresh
- Logout on refresh failure

### Risk 3: Image Upload Failures

**Risk**: Large images on slow connections timeout or fail

**Mitigation**:
- Client-side compression using browser-image-compression library
- Show upload progress indicator
- Retry logic with exponential backoff
- Clear error messages ("Reduce image size" vs generic "Upload failed")

### Risk 4: Performance on Low-End Devices

**Risk**: Heavy JavaScript bundle causes poor performance on older phones

**Mitigation**:
- Code splitting by route (load only what's needed)
- Lazy load heavy components (image uploader, chat)
- Use React.memo sparingly (only for proven bottlenecks)
- Monitor bundle size with vite-bundle-visualizer

## Testing Strategy

### Unit Tests (Vitest + React Testing Library)

- **Hooks**: Test custom hooks in isolation (useLogin, useTasks, etc.)
- **Components**: Test render output and user interactions
- **Utilities**: Test pure functions (formatDate, formatCurrency, validation)
- **Coverage Target**: 80% for critical paths (auth, task creation, chat)

### Integration Tests

- **API Layer**: Mock Axios responses, test error handling
- **Form Flows**: Test complete form submission (validation, API call, success/error states)
- **SignalR**: Mock connection, test message send/receive

### E2E Tests (Optional - Future)

- Use Playwright for critical user journeys
- Test full auth flow, task creation, chat conversation
- Run in CI/CD pipeline before deployment

## Deployment Considerations

### Build Optimization

- Vite production build with tree-shaking
- Asset optimization (image compression, code splitting)
- Service worker for caching (future: offline support)

### Environment Configuration

- `.env.local` for development (localhost backend)
- `.env.production` for production (Railway backend URL)
- Environment variables for feature flags (e.g., `VITE_ENABLE_NOTIFICATIONS`)

### Hosting Recommendations

- **Vercel**: Zero-config React deployment, automatic HTTPS, edge caching
- **Netlify**: Similar to Vercel, built-in form handling
- **AWS S3 + CloudFront**: More control, lower cost at scale
- **Backend same-origin**: Serve frontend from backend (simplifies CORS)

## Post-MVP Enhancements

Features deferred to future iterations:

1. **Offline Support**: Service worker + IndexedDB for offline task viewing
2. **Progressive Web App**: Install prompt, app-like experience on mobile
3. **Advanced Search**: Elasticsearch integration for fuzzy search, filters
4. **Performance Monitoring**: Sentry for error tracking, Web Vitals monitoring
5. **A/B Testing**: Split testing framework for UX experiments
6. **Internationalization**: i18n support for multiple languages
7. **Dark Mode Persistence**: Remember user theme preference across sessions
8. **Voice/Video Calls**: WebRTC integration for executor-client calls

## Next Steps

1. **Review this plan**: Ensure technical approach aligns with team capabilities
2. **Run `/speckit.tasks`**: Generate dependency-ordered implementation tasks
3. **Set up repository**: Initialize Vite project, install dependencies, configure tools
4. **Phase 1 Development**: Implement foundation (routing, layouts, API client)
5. **Iterative Development**: Build features in priority order (P1 → P2 → P3)
6. **Testing & QA**: Write tests alongside feature development
7. **Deployment**: Deploy to staging environment, test with real backend
8. **Production Launch**: Deploy to production, monitor performance and errors

---

**Plan Status**: ✅ **READY FOR TASK GENERATION**

All research complete, all contracts defined, architecture decisions documented. Use `/speckit.tasks` to break this plan into actionable development tasks.
