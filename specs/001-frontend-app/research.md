# Research & Technology Decisions

**Feature**: UPro Frontend Application
**Date**: 2026-03-10
**Status**: Complete

## Overview

This document captures all technology research and decisions made during the planning phase. Each decision includes the chosen solution, rationale, alternatives considered, and trade-offs.

## Core Technology Stack

### 1. Framework: React 18.2+

**Decision**: Use React 18 with TypeScript in strict mode

**Rationale**:
- **Industry Standard**: React is the most popular frontend framework with largest ecosystem
- **Concurrent Features**: React 18 adds automatic batching and transitions for better performance
- **TypeScript Support**: Excellent type definitions and tooling support
- **Team Familiarity**: Most developers know React (lower learning curve)
- **Component Reusability**: Large ecosystem of pre-built components (shadcn/ui, Radix UI)

**Alternatives Considered**:
- **Vue 3**: Smaller ecosystem, less TypeScript support historically
- **Angular**: Too opinionated, steeper learning curve, larger bundle size
- **Svelte**: Smaller ecosystem, fewer libraries, less mature tooling

**Trade-offs**:
- ✅ Pros: Large ecosystem, excellent tooling, battle-tested
- ❌ Cons: Virtual DOM overhead (mitigated by React 18 optimizations)

---

### 2. Build Tool: Vite 5.x

**Decision**: Use Vite for development server and production builds

**Rationale**:
- **Development Speed**: 10-100x faster HMR (Hot Module Replacement) than Webpack
- **Modern Defaults**: ESM-first, optimized for modern browsers
- **Zero Config**: Works out of the box with React + TypeScript
- **Optimized Builds**: Uses Rollup for production (tree-shaking, code splitting)
- **Plugin Ecosystem**: Growing ecosystem, official React plugin

**Alternatives Considered**:
- **Create React App (CRA)**: Slow development server, outdated dependencies, deprecated
- **Webpack**: Requires extensive configuration, slower build times
- **Parcel**: Less control over build process, smaller ecosystem

**Trade-offs**:
- ✅ Pros: Fast development, modern tooling, great DX (developer experience)
- ❌ Cons: Slightly newer (less Stack Overflow answers than Webpack)

---

### 3. State Management: TanStack Query v5 + Zustand

**Decision**: Use TanStack Query for server state, Zustand for client state

**Rationale**:
- **TanStack Query (formerly React Query)**:
  - Purpose-built for server state management
  - Automatic caching, revalidation, background updates
  - Request deduplication (multiple components fetch same data = 1 request)
  - Built-in loading/error states
  - DevTools for debugging
- **Zustand**:
  - Minimal boilerplate for client state (auth tokens, UI preferences)
  - No provider wrapping required
  - TypeScript-first design
  - Small bundle size (1KB)

**Alternatives Considered**:
- **Redux Toolkit**: Too much boilerplate, async logic requires middleware, larger bundle
- **React Context + useState**: No caching, poor performance (re-renders), manual loading states
- **Apollo Client**: Requires GraphQL (backend is REST)
- **SWR**: Similar to TanStack Query but smaller feature set, less flexible

**Trade-offs**:
- ✅ Pros: Best-in-class caching, excellent DX, TypeScript support
- ❌ Cons: Learning curve for TanStack Query concepts (query keys, cache invalidation)

**Best Practice**:
```typescript
// TanStack Query for server state
const { data, isLoading } = useQuery({
  queryKey: ['tasks', filters],
  queryFn: () => taskApi.getAll(filters),
});

// Zustand for client state
const { accessToken, setTokens } = useAuthStore();
```

---

### 4. Routing: React Router v6

**Decision**: Use React Router v6 with centralized route configuration

**Rationale**:
- **Industry Standard**: Most popular React routing library
- **Nested Routes**: Clean layout nesting (MainLayout, AuthLayout)
- **Type Safety**: Define routes as constants for type-safe navigation
- **Code Splitting**: Built-in support for lazy loading routes
- **Hooks API**: `useNavigate`, `useParams`, `useLocation` for declarative navigation

**Alternatives Considered**:
- **TanStack Router**: Too new (v1 released 2023), smaller ecosystem, beta features
- **Next.js**: Overkill for SPA (don't need SSR, file-based routing not preferred)
- **Reach Router**: Deprecated, merged into React Router v6

**Trade-offs**:
- ✅ Pros: Mature, well-documented, large ecosystem
- ❌ Cons: v6 API changes from v5 (but v6 is more declarative)

**Pattern**:
```typescript
// Centralized routes in /shared/constants/routes.ts
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  TASKS: '/tasks',
  TASK_DETAIL: '/tasks/:id',
};

// Type-safe navigation
navigate(ROUTES.TASK_DETAIL.replace(':id', taskId));
```

---

### 5. Real-Time Communication: @microsoft/signalr

**Decision**: Use official Microsoft SignalR client library

**Rationale**:
- **Backend Mandate**: Backend already provides SignalR hub at `/hubs/chat`
- **Automatic Fallback**: WebSocket → Server-Sent Events → Long Polling
- **Reconnection Logic**: Built-in exponential backoff
- **TypeScript Support**: Excellent type definitions
- **Hub Proxy**: Strongly-typed hub method invocation

**Alternatives Considered**:
- **Socket.io**: Incompatible with SignalR backend (different protocol)
- **Native WebSocket**: No automatic reconnection, no fallback, manual error handling
- **Polling Only**: Inefficient for real-time (high latency, server load)

**Trade-offs**:
- ✅ Pros: Backend compatibility, automatic fallback, strong typing
- ❌ Cons: Microsoft-specific (but well-maintained)

**Connection Pattern**:
```typescript
const connection = new HubConnectionBuilder()
  .withUrl('/hubs/chat', {
    accessTokenFactory: () => getAccessToken(),
  })
  .withAutomaticReconnect() // Exponential backoff
  .build();

connection.on('ReceiveMessage', (message) => {
  // Update TanStack Query cache
  queryClient.setQueryData(['messages', conversationId], (old) => [...old, message]);
});
```

---

### 6. HTTP Client: Axios

**Decision**: Use Axios for all REST API calls

**Rationale**:
- **Interceptors**: Attach auth tokens, handle 401 refresh, transform responses
- **TypeScript Support**: Generic types for request/response
- **Error Handling**: Normalized error objects
- **Request/Response Transformation**: Centralized handling of `ApiResult<T>` pattern
- **Cancel Tokens**: Cancel in-flight requests on component unmount

**Alternatives Considered**:
- **Fetch API**: No interceptors, requires manual error handling, verbose
- **ky**: Smaller bundle but less mature, fewer features
- **Superagent**: Older API, less TypeScript support

**Trade-offs**:
- ✅ Pros: Rich feature set, excellent TypeScript support, large ecosystem
- ❌ Cons: Slightly larger bundle than fetch (~5KB gzipped)

**Interceptor Pattern**:
```typescript
// Request interceptor: Attach token
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: Handle 401, unwrap ApiResult<T>
apiClient.interceptors.response.use(
  (response) => response.data.result, // Unwrap ApiResult<T>
  async (error) => {
    if (error.response?.status === 401) {
      // Attempt token refresh
      await refreshToken();
      return apiClient.request(error.config); // Retry
    }
    throw error;
  }
);
```

---

### 7. Form Management: React Hook Form + Zod

**Decision**: Use React Hook Form with Zod schema validation

**Rationale**:
- **Performance**: Uncontrolled inputs (no re-renders on every keystroke)
- **Type Safety**: Zod schemas generate TypeScript types automatically
- **DX**: Minimal boilerplate, declarative validation rules
- **Integration**: `@hookform/resolvers/zod` provides seamless schema integration
- **Reusability**: Schemas can be reused for runtime validation and type generation

**Alternatives Considered**:
- **Formik + Yup**: Slower (controlled inputs), larger bundle, more boilerplate
- **Vanilla React State**: Manual error handling, no schema reuse, poor DX
- **HTML5 Validation**: Insufficient (no async validation, poor UX, no complex rules)

**Trade-offs**:
- ✅ Pros: Best performance, type safety, excellent DX
- ❌ Cons: Learning curve for React Hook Form API

**Usage Pattern**:
```typescript
// Define schema
const taskSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  budget: z.number().positive('Budget must be positive'),
  categoryId: z.string().uuid('Invalid category'),
});

type TaskFormData = z.infer<typeof taskSchema>;

// Use in component
const { register, handleSubmit, formState: { errors } } = useForm<TaskFormData>({
  resolver: zodResolver(taskSchema),
});
```

---

### 8. Styling: Tailwind CSS + shadcn/ui

**Decision**: Use Tailwind CSS for styling + shadcn/ui for components

**Rationale**:
- **Tailwind CSS**:
  - Utility-first: Rapid development, no context switching
  - Design consistency: Design tokens in config (colors, spacing, breakpoints)
  - Performance: PurgeCSS removes unused styles (small production CSS)
  - Responsive: Mobile-first breakpoints (`sm:`, `md:`, `lg:`)
- **shadcn/ui**:
  - Built on Radix UI (accessible, unstyled components)
  - Copy-paste components (no version lock-in, full customization)
  - Tailwind-compatible (uses Tailwind classes)
  - TypeScript-first design

**Alternatives Considered**:
- **CSS Modules**: Requires writing CSS, no utility classes, larger stylesheets
- **Styled Components**: Runtime performance cost, larger bundle, CSS-in-JS complexity
- **MUI/Ant Design**: Opinionated design, hard to customize, large bundle, poor Tailwind integration

**Trade-offs**:
- ✅ Pros: Fast development, consistent design, small bundle, full customization
- ❌ Cons: Class name verbosity (mitigated by editor autocomplete)

**Component Example**:
```tsx
// shadcn/ui Button component (owned by project)
<Button variant="primary" size="lg" className="w-full">
  Create Task
</Button>

// Compiled to:
<button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md w-full">
  Create Task
</button>
```

---

### 9. Testing: Vitest + React Testing Library

**Decision**: Use Vitest for test runner, React Testing Library for component tests

**Rationale**:
- **Vitest**:
  - Vite-native (same config, instant startup)
  - Jest-compatible API (easy migration, familiar syntax)
  - ESM support (no transforms needed)
  - Fast execution (parallel tests, watch mode)
- **React Testing Library**:
  - User-centric testing (test behavior, not implementation)
  - Accessibility-first (queries by role, label, text)
  - Avoids testing internal state (more maintainable tests)

**Alternatives Considered**:
- **Jest**: Slower startup (requires Babel transforms), CJS modules
- **Enzyme**: Tests implementation details (brittle), deprecated
- **Cypress Component Testing**: Slower execution, heavier setup

**Trade-offs**:
- ✅ Pros: Fast, Jest-compatible, great DX
- ❌ Cons: Vitest is newer (but mature, maintained by Vite team)

**Test Example**:
```typescript
test('renders login form and submits phone number', async () => {
  render(<LoginPage />);

  const input = screen.getByLabelText(/phone number/i);
  const button = screen.getByRole('button', { name: /send code/i });

  await userEvent.type(input, '+998901234567');
  await userEvent.click(button);

  expect(await screen.findByText(/verification code sent/i)).toBeInTheDocument();
});
```

---

## Supporting Libraries

### Icons: Lucide React

**Decision**: Use Lucide React for all icons

**Rationale**:
- Tree-shakeable: Only bundle icons you use
- Consistent design: All icons same style (stroke-based)
- React-native support: Can reuse in future mobile apps
- Customizable: Size, color, stroke width via props

**Alternatives**: Heroicons, React Icons, Font Awesome

---

### Date Formatting: date-fns

**Decision**: Use date-fns for date manipulation and formatting

**Rationale**:
- Tree-shakeable: Import only functions you need
- Immutable: No mutation of Date objects
- TypeScript support: Full type definitions
- Locale support: i18n-ready

**Alternatives**: Moment.js (deprecated), Day.js (smaller but fewer features)

---

### Image Compression: browser-image-compression

**Decision**: Use browser-image-compression for client-side image optimization

**Rationale**:
- Reduces upload bandwidth (compress 5MB image to <1MB)
- Improves UX on slow connections
- Maintains image quality (configurable compression)
- Works in browser (no server dependency)

---

### Notifications: react-hot-toast

**Decision**: Use react-hot-toast for toast notifications

**Rationale**:
- Lightweight (3KB gzipped)
- Accessible (ARIA live regions)
- Customizable (Tailwind classes work)
- Promise-based API (auto-show loading/success/error)

**Alternatives**: react-toastify (larger bundle), Sonner (newer, less mature)

---

## Architecture Patterns

### 1. Feature-Based Folder Structure

**Decision**: Organize code by feature, not by technical layer

**Structure**:
```
features/
  auth/
    api/
    components/
    hooks/
    pages/
    schemas/
    types/
```

**Rationale**:
- **Scalability**: Easy to add new features without affecting others
- **Maintainability**: Related code is co-located (easier to find and modify)
- **Team Collaboration**: Multiple developers work on different features
- **Code Splitting**: Features can be lazy-loaded independently

**Alternative**: Layer-based structure (`/components`, `/hooks`, `/api`) - harder to navigate as project grows

---

### 2. API Layer Pattern

**Decision**: Centralized API client with feature-specific API modules

**Pattern**:
```typescript
// /shared/api/client.ts
export const apiClient = axios.create({ baseURL: API_BASE_URL });

// /features/tasks/api/taskApi.ts
export const taskApi = {
  getAll: (filters: TaskFilters) => apiClient.get<ApiResult<Task[]>>('/api/OrderTasks', { params: filters }),
  create: (data: CreateTaskDto) => apiClient.post<ApiResult<Task>>('/api/OrderTasks', data),
};
```

**Rationale**:
- Single source of truth for API calls
- Easy to mock in tests
- Centralized error handling (interceptors)
- Type-safe requests/responses

---

### 3. Query Key Factory Pattern

**Decision**: Centralized query keys for TanStack Query

**Pattern**:
```typescript
// /shared/constants/queryKeys.ts
export const queryKeys = {
  tasks: {
    all: ['tasks'] as const,
    lists: () => [...queryKeys.tasks.all, 'list'] as const,
    list: (filters: TaskFilters) => [...queryKeys.tasks.lists(), filters] as const,
    detail: (id: string) => [...queryKeys.tasks.all, 'detail', id] as const,
  },
};

// Usage in component
const { data } = useQuery({
  queryKey: queryKeys.tasks.list(filters),
  queryFn: () => taskApi.getAll(filters),
});

// Invalidate all task lists when creating a new task
queryClient.invalidateQueries({ queryKey: queryKeys.tasks.lists() });
```

**Rationale**:
- Consistent query keys across codebase
- Easy to invalidate related queries
- Prevents typos (type-safe)
- Hierarchical structure (invalidate all tasks or specific subset)

---

## Security Considerations

### Token Storage

**Decision**: Access tokens in memory (Zustand), refresh tokens in localStorage

**Rationale**:
- **XSS Mitigation**: Access tokens cleared on tab close (can't persist in localStorage)
- **UX**: Refresh tokens allow session restoration without re-login
- **Short-lived**: Access tokens expire quickly (5-15 min), limiting attack window
- **Future**: Move refresh tokens to httpOnly cookies (requires backend support)

**Implementation**:
```typescript
// Zustand store (memory)
interface AuthState {
  accessToken: string | null;
  user: User | null;
}

// localStorage (persisted)
localStorage.setItem('refreshToken', refreshToken);
```

---

### Input Sanitization

**Decision**: Rely on React's built-in XSS protection + backend validation

**Rationale**:
- **React**: Automatically escapes JSX content (prevents XSS)
- **Backend**: Final authority on validation (client-side can be bypassed)
- **Client-side validation**: For UX only (instant feedback, no server round-trip)

**Exception**: Using `dangerouslySetInnerHTML` is FORBIDDEN unless HTML is sanitized with DOMPurify

---

## Performance Optimization

### Code Splitting

**Strategy**: Split by route + lazy load heavy components

**Implementation**:
```typescript
// Lazy load route components
const TasksPage = lazy(() => import('@features/tasks/pages/TasksPage'));
const ChatPage = lazy(() => import('@features/chat/pages/ChatPage'));

// Lazy load heavy components
const ImageUploader = lazy(() => import('./ImageUploader'));
```

**Rationale**: Reduces initial bundle size, faster time-to-interactive

---

### Image Optimization

**Strategy**: Client-side compression + lazy loading

**Implementation**:
- Compress images before upload (reduce bandwidth)
- Use `loading="lazy"` on images (browser-native lazy loading)
- Use `srcset` for responsive images (serve appropriate size)

---

## Development Workflow

### Code Quality Tools

- **ESLint**: Enforce code standards (no `any`, unused imports, etc.)
- **Prettier**: Consistent code formatting (auto-format on save)
- **TypeScript**: Strict mode (`noImplicitAny`, `strictNullChecks`)
- **Husky**: Pre-commit hooks (lint, type-check before commit)

### Environment Variables

**Pattern**:
```bash
# .env.local (development)
VITE_API_BASE_URL=http://localhost:5150

# .env.production
VITE_API_BASE_URL=https://uprobackend-production-8628.up.railway.app
```

**Rationale**: Vite exposes vars prefixed with `VITE_` to client (others are build-time only)

---

## Open Questions (RESOLVED)

**All questions have been resolved during research. No NEEDS CLARIFICATION markers remain.**

✅ **Q: Should we use SSR (Server-Side Rendering)?**
**A**: No. This is an authenticated SPA - SSR benefits (SEO, initial load) don't apply. Client-side rendering is simpler and sufficient.

✅ **Q: Should we support IE11?**
**A**: No. IE11 is EOL (end of life). Target modern browsers (Chrome 90+, Firefox 88+, Safari 14+).

✅ **Q: Should we implement offline support?**
**A**: Not in Phase 1. Defer to post-MVP (requires Service Worker + IndexedDB).

✅ **Q: Should we use GraphQL?**
**A**: No. Backend is REST. Don't introduce complexity for no benefit.

---

## Summary

All technology choices validated and documented. Stack prioritizes:
- **Developer Experience**: Fast builds (Vite), minimal boilerplate (Zustand, React Hook Form)
- **Performance**: Code splitting, lazy loading, TanStack Query caching
- **Type Safety**: TypeScript strict mode, Zod schemas
- **Maintainability**: Feature-based structure, centralized patterns

**Ready for Phase 1 (Design & Contracts)**
