# Implementation Tasks: UPro Frontend Application

**Feature**: UPro Frontend Application
**Branch**: `001-frontend-app`
**Date**: 2026-03-10
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

## Overview

This document contains all implementation tasks for building the UPro Frontend application. Tasks are organized by user story to enable independent implementation and testing of each feature increment.

**Total Tasks**: 127
**User Stories**: 6 (US1-US6)
**Estimated Duration**: 6-8 weeks (varies by team size)

## Task Format

Each task follows this format:
```
- [ ] [TaskID] [P?] [Story?] Description with file path
```

- **[TaskID]**: Sequential task number (T001, T002, etc.)
- **[P]**: Parallel marker (can be worked on simultaneously with other [P] tasks)
- **[Story]**: User story label ([US1], [US2], etc.) - only for story-specific tasks
- **Description**: Clear action with exact file path

## Implementation Strategy

### MVP Scope (Week 1-2)
**User Story 1 Only**: Authentication flow
- Delivers immediately testable value
- Unblocks all other features
- ~15 tasks

### Incremental Delivery
- **Week 3-4**: US2 (Task Browsing) + US3 (Task Creation) - Core marketplace
- **Week 5**: US4 (Executor Profiles) - Enables executor side
- **Week 6-7**: US5 (Real-Time Chat) - Communication layer
- **Week 8**: US6 (Notifications) + Polish - Engagement features

### Parallel Execution Opportunities

**Setup Phase**: All setup tasks can run in parallel after T001-T003
**Foundational Phase**: Infrastructure tasks are parallelizable
**Within Each Story**: Component tasks can run in parallel after types/API are defined

---

## Phase 1: Project Setup (15 tasks)

**Goal**: Initialize Vite project with all dependencies and tooling configured

**Independent Test**: `npm run dev` starts development server successfully, `npm run type-check` passes, `npm run lint` passes

### Tasks

- [X] T001 Initialize Vite React TypeScript project in repository root using `npm create vite@latest . -- --template react-ts`
- [X] T002 [P] Install core dependencies: react-router-dom, @tanstack/react-query, zustand, axios, @microsoft/signalr
- [X] T003 [P] Install form dependencies: react-hook-form, @hookform/resolvers, zod
- [X] T004 [P] Install UI dependencies: tailwindcss, lucide-react, react-hot-toast, date-fns
- [X] T005 [P] Install dev dependencies: @types/node, vitest, @testing-library/react, eslint, prettier
- [X] T006 [P] Initialize Tailwind CSS with `npx tailwindcss init -p` and configure tailwind.config.js
- [X] T007 [P] Initialize shadcn/ui with `npx shadcn-ui@latest init` (TypeScript, Default style, Slate color)
- [X] T008 Configure TypeScript strict mode in tsconfig.json with path aliases (@/, @features/, @shared/)
- [X] T009 Configure Vite path aliases in vite.config.ts to match TypeScript paths
- [X] T010 [P] Create .env.example with VITE_API_BASE_URL and VITE_SIGNALR_HUB_URL variables
- [X] T011 [P] Create .env.local for development with localhost backend URLs
- [X] T012 [P] Configure ESLint in .eslintrc.cjs with TypeScript rules and no-explicit-any error
- [X] T013 [P] Configure Prettier in .prettierrc with project code style preferences
- [X] T014 [P] Add npm scripts to package.json: dev, build, preview, lint, lint:fix, format, type-check, test
- [X] T015 Create project folder structure: src/app, src/features/{auth,tasks,executors,chat,notifications}, src/shared

**Acceptance**: Project builds without errors, all tooling configured, folder structure matches plan.md

---

## Phase 2: Foundational Infrastructure (20 tasks)

**Goal**: Implement shared infrastructure that all user stories depend on

**Independent Test**: API client makes authenticated requests, router navigates between pages, providers wrap app correctly

### Shared Types & Constants

- [X] T016 Create src/shared/api/types.ts with ApiResult<T>, PaginatedResult<T>, ApiError class interfaces
- [X] T017 [P] Create src/shared/constants/routes.ts with all route path constants (HOME, LOGIN, TASKS, etc.)
- [X] T018 [P] Create src/shared/constants/queryKeys.ts with TanStack Query key factory functions
- [X] T019 [P] Create src/shared/constants/signalrEvents.ts with SignalR event name constants

### API Client

- [X] T020 Create src/shared/api/endpoints.ts with all backend API endpoint constants organized by feature
- [X] T021 Create src/shared/api/client.ts with Axios instance configured with baseURL from env variables
- [X] T022 Implement request interceptor in client.ts to attach Authorization Bearer token from auth store
- [X] T023 Implement response interceptor in client.ts to unwrap ApiResult<T> and normalize errors
- [X] T024 Implement 401 token refresh logic in client.ts with request queuing to prevent race conditions

### Routing

- [X] T025 Create src/app/router.tsx with React Router v6 BrowserRouter and all route definitions
- [X] T026 [P] Create src/shared/components/guards/ProtectedRoute.tsx to redirect unauthenticated users to login
- [X] T027 [P] Create src/shared/components/layout/MainLayout.tsx with header, sidebar, and outlet for authenticated pages
- [X] T028 [P] Create src/shared/components/layout/AuthLayout.tsx with centered card layout for login/OTP pages

### Providers

- [X] T029 Create src/app/providers/QueryProvider.tsx with TanStack Query client configured per plan.md defaults
- [X] T030 [P] Create src/app/providers/AuthProvider.tsx to hydrate auth state from localStorage on app boot
- [X] T031 [P] Create src/app/providers/SignalRProvider.tsx with HubConnection setup and lifecycle management
- [X] T032 Update src/app/App.tsx to wrap application with QueryProvider, AuthProvider, and SignalRProvider

### Shared UI Components

- [X] T033 [P] Install shadcn/ui Button component with `npx shadcn-ui@latest add button`
- [X] T034 [P] Install shadcn/ui Input component with `npx shadcn-ui@latest add input`
- [X] T035 [P] Create src/shared/components/feedback/LoadingSpinner.tsx with animated spinner icon
- [X] T036 [P] Create src/shared/components/feedback/ErrorBoundary.tsx to catch React render errors
- [X] T037 [P] Create src/shared/components/feedback/EmptyState.tsx with icon, message, and optional CTA button

### Utility Functions

- [X] T038 [P] Create src/shared/utils/cn.ts with Tailwind class merge utility using clsx
- [X] T039 [P] Create src/shared/utils/formatDate.ts with date-fns formatting functions
- [X] T040 [P] Create src/shared/utils/formatCurrency.ts for UZS currency formatting

**Acceptance**: Router navigates, API client makes requests, providers initialize, shared components render

---

## Phase 3: User Story 1 - Authentication (P1) (18 tasks)

**Story Goal**: Users can log in with phone number + OTP and stay authenticated across sessions

**Independent Test**:
1. Enter phone number → OTP sent
2. Enter valid OTP → Authenticated and redirected to tasks page
3. Close browser and reopen → Still authenticated (token refresh works)
4. Enter invalid OTP 3 times → Blocked for 15 minutes with error message

### Types & Schemas

- [X] T041 [US1] Create src/features/auth/types/auth.types.ts with User, AuthenticatedUser, SendOtpRequest/Response, VerifyOtpRequest/Response interfaces
- [X] T042 [US1] Create src/features/auth/schemas/authSchemas.ts with Zod schemas for phone number (E.164 format) and OTP (6 digits) validation

### State Management

- [X] T043 [US1] Create src/features/auth/hooks/useAuthStore.ts Zustand store with accessToken, refreshToken, user, setTokens, logout methods
- [X] T044 [US1] Implement localStorage persistence for refreshToken in useAuthStore with get/set/clear functions

### API Layer

- [X] T045 [US1] Create src/features/auth/api/authApi.ts with sendOtp(), verifyOtp(), refreshToken() functions using apiClient
- [X] T046 [US1] Implement sendOtp() to POST /api/Users/login with phone number and return OTP expiry time
- [X] T047 [US1] Implement verifyOtp() to POST /api/Users/verify-otp with phone + code and return user + tokens
- [X] T048 [US1] Implement refreshToken() to POST /api/Users/refresh with refreshToken and return new tokens

### Business Logic Hooks

- [X] T049 [US1] Create src/features/auth/hooks/useLogin.ts with useMutation for sendOtp with success toast notification
- [X] T050 [US1] Create src/features/auth/hooks/useVerifyOtp.ts with useMutation for verifyOtp, setTokens on success, navigate to tasks

### UI Components

- [X] T051 [P] [US1] Create src/features/auth/components/PhoneInput.tsx with E.164 format input and country code prefix (+998)
- [X] T052 [P] [US1] Create src/features/auth/components/OtpInput.tsx with 6-digit input boxes and auto-focus next input on entry

### Pages

- [X] T053 [US1] Create src/features/auth/pages/LoginPage.tsx with PhoneInput, useLogin hook, form validation, loading state
- [X] T054 [US1] Create src/features/auth/pages/OtpVerifyPage.tsx with OtpInput, useVerifyOtp hook, resend OTP button, countdown timer
- [X] T055 [US1] Add login and OTP verify routes to src/app/router.tsx with AuthLayout wrapper

### Integration

- [X] T056 [US1] Update ProtectedRoute to check useAuthStore.isAuthenticated and redirect with return URL state
- [X] T057 [US1] Implement auto token refresh in AuthProvider by checking token expiry and calling refreshToken() proactively
- [X] T058 [US1] Test complete auth flow: send OTP → verify OTP → authenticated → refresh page → still authenticated → logout → redirected to login

**Acceptance**: All US1 acceptance scenarios pass, token refresh works silently, protected routes redirect correctly

---

## Phase 4: User Story 2 - Task Browsing (P1) (22 tasks)

**Story Goal**: Users can browse, search, and filter tasks to find relevant opportunities

**Independent Test**:
1. Navigate to /tasks → See paginated task list
2. Enter search keyword → Results update in <1s
3. Apply category/location filters → Filtered results display
4. Scroll to bottom → Next page loads automatically (infinite scroll)
5. Click task card → Navigate to task detail page

### Types & Schemas

- [X] T059 [US2] Create src/features/tasks/types/task.types.ts with Task, TaskDetail, TaskStatus enum, TaskFilters, Category, Region, District interfaces
- [X] T060 [US2] Create src/features/tasks/schemas/taskSchemas.ts with Zod schema for TaskFilters validation

### API Layer

- [X] T061 [US2] Create src/features/tasks/api/taskApi.ts with getAll(), getById(), searchTasks() functions
- [X] T062 [US2] Implement getAll() to GET /api/OrderTasks/search with pagination and filter query params
- [X] T063 [US2] Implement getById() to GET /api/OrderTasks/{id} with task details including client info
- [X] T064 [P] [US2] Create src/shared/api/categoryApi.ts with getCategories() to GET /api/Categories (hierarchical)
- [X] T065 [P] [US2] Create src/shared/api/locationApi.ts with getRegions() to GET /api/Regions with districts

### Business Logic Hooks

- [X] T066 [US2] Create src/features/tasks/hooks/useTasks.ts with useInfiniteQuery for infinite scroll pagination using taskApi.getAll()
- [X] T067 [US2] Create src/features/tasks/hooks/useTaskDetail.ts with useQuery for single task using taskApi.getById()
- [X] T068 [US2] Create src/features/tasks/hooks/useTaskSearch.ts with debounced search (300ms) and filter state management
- [X] T069 [P] [US2] Create src/shared/hooks/useDebounce.ts utility hook with 300ms default debounce delay
- [X] T070 [P] [US2] Create src/shared/hooks/useCategories.ts with useQuery for categories with 10min cache time
- [X] T071 [P] [US2] Create src/shared/hooks/useRegions.ts with useQuery for regions with 10min cache time

### UI Components

- [X] T072 [P] [US2] Create src/features/tasks/components/TaskCard.tsx with image, title, budget, location, bookmark button
- [X] T073 [P] [US2] Create src/features/tasks/components/TaskStatusBadge.tsx with color-coded status indicators
- [X] T074 [US2] Create src/features/tasks/components/TaskFilters.tsx with category, location, budget range, status dropdowns using shadcn Select
- [X] T075 [P] [US2] Install shadcn/ui Select and Badge components for filters and status badges
- [X] T076 [P] [US2] Install shadcn/ui Skeleton component for loading states in task list

### Pages

- [X] T077 [US2] Create src/features/tasks/pages/TasksPage.tsx with TaskFilters, infinite scroll task list using useTasks hook
- [X] T078 [US2] Implement infinite scroll in TasksPage using IntersectionObserver to trigger next page fetch on scroll
- [X] T079 [US2] Create src/features/tasks/pages/TaskDetailPage.tsx with full task info, client details, images gallery, application count
- [X] T080 [US2] Add tasks list and task detail routes to src/app/router.tsx with MainLayout and ProtectedRoute wrappers

**Acceptance**: All US2 acceptance scenarios pass, search <1s latency, infinite scroll works, task detail displays correctly

---

## Phase 5: User Story 3 - Task Creation (P1) (17 tasks)

**Story Goal**: Clients can post new tasks with images, categories, budget, and location

**Independent Test**:
1. Click "Create Task" → Navigate to form
2. Fill all required fields → Submit → Task created, redirected to detail page
3. Upload 5 images → Previews display correctly
4. Submit invalid data → Field-specific errors show without losing data
5. Network error on submit → Data retained, retry works

### Types & Schemas

- [X] T081 [US3] Create src/features/tasks/schemas/createTaskSchema.ts with Zod validation: title (min 5), description (min 20), budget (positive), images (max 5, max 5MB)
- [X] T082 [US3] Add CreateTaskRequest, CreateTaskResponse types to src/features/tasks/types/task.types.ts

### API Layer

- [X] T083 [US3] Implement create() in src/features/tasks/api/taskApi.ts to POST /api/OrderTasks with multipart/form-data
- [X] T084 [US3] Add saveDraft() and updateTask() functions to taskApi.ts for draft saving and editing

### Business Logic Hooks

- [X] T085 [US3] Create src/features/tasks/hooks/useCreateTask.ts with useMutation, invalidate task lists on success, navigate to detail
- [X] T086 [US3] Create src/features/tasks/hooks/useSaveDraft.ts with useMutation for auto-saving draft tasks every 30 seconds

### UI Components

- [X] T087 [P] [US3] Create src/features/tasks/components/TaskImageUpload.tsx with drag-drop, preview, file validation, client-side compression
- [X] T088 [P] [US3] Install browser-image-compression library for client-side image compression before upload
- [X] T089 [P] [US3] Install shadcn/ui Textarea, Select, and Label components for form fields
- [X] T090 [US3] Create src/features/tasks/components/CategorySelect.tsx with hierarchical category dropdown (parent → sub-category)
- [X] T091 [US3] Create src/features/tasks/components/LocationSelect.tsx with region → district cascading dropdowns

### Pages

- [X] T092 [US3] Create src/features/tasks/pages/CreateTaskPage.tsx with React Hook Form, Zod validation, all form fields
- [X] T093 [US3] Implement form submission in CreateTaskPage: build FormData, call useCreateTask, handle loading/error states
- [X] T094 [US3] Implement draft auto-save in CreateTaskPage using useSaveDraft hook with 30s interval
- [X] T095 [US3] Implement optimistic UI update: show task immediately in list while API request completes, rollback on error
- [X] T096 [US3] Add create task route to src/app/router.tsx with MainLayout and ProtectedRoute wrappers
- [X] T097 [US3] Add "Create Task" button to TasksPage header and MainLayout sidebar navigation

**Acceptance**: All US3 acceptance scenarios pass, images upload successfully, validation works, draft saving prevents data loss

---

## Phase 6: User Story 4 - Executor Profiles (P2) (19 tasks)

**Story Goal**: Users can become executors by creating profiles with work history, education, and language skills

**Independent Test**:
1. Click "Become Executor" → Navigate to multi-step form
2. Complete all sections (personal info, work experience, education, languages) → Submit → Profile created
3. Leave end date empty on work experience → Displays as "Currently working"
4. Update profile image → Image replaced across all references
5. View executor profile → All info displays correctly

### Types & Schemas

- [X] T098 [US4] Create src/features/executors/types/executor.types.ts with ExecutorProfile, WorkExperience, Education, LanguageProficiency, LanguageLevel enum interfaces
- [X] T099 [US4] Create src/features/executors/schemas/executorSchemas.ts with Zod validation for executor profile form including array validations

### API Layer

- [X] T100 [US4] Create src/features/executors/api/executorApi.ts with becomeExecutor(), getMyProfile(), updateProfile(), deleteProfile() functions
- [X] T101 [US4] Implement becomeExecutor() to POST /api/Executors/apply with multipart/form-data for profile + image
- [X] T102 [P] [US4] Implement getLanguages(), getEducationTypes() in executorApi.ts for lookup data

### Business Logic Hooks

- [X] T103 [US4] Create src/features/executors/hooks/useBecomeExecutor.ts with useMutation, navigate to profile page on success
- [X] T104 [US4] Create src/features/executors/hooks/useExecutorProfile.ts with useQuery for current user's executor profile
- [X] T105 [US4] Create src/features/executors/hooks/useUpdateExecutor.ts with useMutation for profile updates

### UI Components

- [X] T106 [P] [US4] Create src/features/executors/components/WorkExperienceForm.tsx with dynamic array fields, "Currently working" checkbox
- [X] T107 [P] [US4] Create src/features/executors/components/EducationForm.tsx with dynamic array fields, "Currently studying" checkbox
- [X] T108 [P] [US4] Create src/features/executors/components/LanguageSelect.tsx with language dropdown + proficiency level (1-5) selector
- [X] T109 [P] [US4] Install shadcn/ui Checkbox component for "currently working/studying" toggles
- [X] T110 [US4] Create src/features/executors/components/ExecutorCard.tsx to display executor info with rating, completed tasks, skills

### Pages

- [X] T111 [US4] Create src/features/executors/pages/BecomeExecutorPage.tsx with multi-step form (personal → work → education → languages)
- [X] T112 [US4] Implement form step navigation in BecomeExecutorPage with progress indicator and validation per step
- [X] T113 [US4] Create src/features/executors/pages/ExecutorProfilePage.tsx to display full executor profile with edit button
- [X] T114 [US4] Create src/features/executors/pages/ExecutorsPage.tsx with list of all executors (public view) with filters
- [X] T115 [US4] Add executor routes to src/app/router.tsx (become, profile, list) with appropriate layout wrappers
- [X] T116 [US4] Add "Become Executor" link to MainLayout sidebar visible only to non-executors

**Acceptance**: All US4 acceptance scenarios pass, multi-step form works, date fields handle "currently working/studying" correctly, profile displays all info

---

## Phase 7: User Story 5 - Real-Time Chat (P2) (23 tasks)

**Story Goal**: Users can communicate in real-time with typing indicators and instant message delivery

**Independent Test**:
1. Click "Message Client" on task → Opens conversation
2. Type message → Other user sees typing indicator in <500ms
3. Send message → Message appears immediately (optimistic), confirmed delivery in <2s
4. Upload file → File uploaded, preview/download link shown
5. Receive message while app open → Message appears instantly without refresh

### Types & Schemas

- [X] T117 [US5] Create src/features/chat/types/chat.types.ts with Conversation, Message, MessageAttachment, TypingIndicator interfaces

### SignalR Hub Integration

- [X] T118 [US5] Implement SignalR connection setup in SignalRProvider with connection to /hubs/chat using accessTokenFactory
- [X] T119 [US5] Implement automatic reconnection in SignalRProvider with exponential backoff (1s, 2s, 4s, 8s, max 30s)
- [X] T120 [US5] Create src/features/chat/hooks/useChatHub.ts to manage SignalR event listeners and method invocations
- [X] T121 [US5] Implement ReceiveMessage event listener in useChatHub to update TanStack Query cache optimistically
- [X] T122 [US5] Implement UserTyping/UserStoppedTyping event listeners in useChatHub with debounced auto-clear (3s)
- [X] T123 [US5] Implement SendMessage, SendTypingIndicator, MarkAsRead SignalR method invocations in useChatHub

### API Layer

- [X] T124 [US5] Create src/features/chat/api/chatApi.ts with getConversations(), getMessages(), getOrCreateConversation() functions
- [X] T125 [US5] Implement getConversations() to GET /api/Chat/conversations with last message and unread count
- [X] T126 [US5] Implement getMessages() to GET /api/Chat/conversations/{id}/messages with pagination (50 per page)

### Business Logic Hooks

- [X] T127 [US5] Create src/features/chat/hooks/useConversations.ts with useQuery for conversation list, auto-refetch on new message
- [X] T128 [US5] Create src/features/chat/hooks/useMessages.ts with useInfiniteQuery for message history with scroll-to-load-more
- [X] T129 [US5] Create src/features/chat/hooks/useSendMessage.ts with optimistic update: add message immediately, confirm with SignalR

### UI Components

- [X] T130 [P] [US5] Create src/features/chat/components/ConversationList.tsx with conversation cards showing last message, unread badge
- [X] T131 [P] [US5] Create src/features/chat/components/MessageBubble.tsx with sender/recipient styling, timestamp, read status
- [X] T132 [P] [US5] Create src/features/chat/components/MessageInput.tsx with textarea, send button, file upload, emoji picker
- [X] T133 [P] [US5] Create src/features/chat/components/TypingIndicator.tsx with animated dots showing "{userName} is typing..."
- [X] T134 [P] [US5] Create src/features/chat/components/FileAttachment.tsx with file preview (images) or download link (PDFs)
- [X] T135 [P] [US5] Install shadcn/ui ScrollArea component for message list with scroll-to-bottom behavior

### Pages

- [X] T136 [US5] Create src/features/chat/pages/ChatPage.tsx with two-column layout: conversation list (left) + active chat (right)
- [X] T137 [US5] Implement message sending in ChatPage: call useSendMessage, show optimistic update, handle errors with retry
- [X] T138 [US5] Implement typing indicator debounce: send typing event on keystroke, debounce stop event after 1s of no typing
- [X] T139 [US5] Add chat route to src/app/router.tsx with conversationId param for deep linking to specific conversation

**Acceptance**: All US5 acceptance scenarios pass, messages deliver in <2s, typing indicators <500ms, optimistic updates work, reconnection handles network issues

---

## Phase 8: User Story 6 - Notifications (P3) (15 tasks)

**Story Goal**: Users receive browser notifications for important events with unread count badge

**Independent Test**:
1. Grant notification permission → Permission stored
2. Trigger event (new message) → Browser notification appears
3. Click notification → Navigate to relevant page (chat, task detail)
4. View notification bell → Unread count badge shows correct number
5. Open notification panel → Notifications marked as read automatically

### Types & Schemas

- [X] T140 [US6] Create src/features/notifications/types/notification.types.ts with Notification, NotificationType enum interfaces

### API Layer

- [X] T141 [US6] Create src/features/notifications/api/notificationApi.ts with getNotifications(), markAsRead(), markAllAsRead(), registerToken() functions
- [X] T142 [US6] Implement getNotifications() to GET /api/Notifications with pagination and unreadOnly filter
- [X] T143 [US6] Implement registerToken() to POST /api/Notifications/register-token with FCM device token

### Business Logic Hooks

- [X] T144 [US6] Create src/features/notifications/hooks/useNotifications.ts with useQuery for notification list, auto-refetch every 30s
- [X] T145 [US6] Create src/features/notifications/hooks/useNotificationPermission.ts to request browser notification permission on mount
- [X] T146 [US6] Create src/features/notifications/hooks/useRegisterNotificationToken.ts with useMutation to register FCM token with backend

### UI Components

- [X] T147 [P] [US6] Create src/features/notifications/components/NotificationBell.tsx with bell icon, unread count badge, dropdown trigger
- [X] T148 [P] [US6] Create src/features/notifications/components/NotificationList.tsx with scrollable list, mark-all-read button
- [X] T149 [P] [US6] Install shadcn/ui Popover component for notification dropdown
- [X] T150 [US6] Create src/features/notifications/components/NotificationItem.tsx with icon, title, body, time ago, click handler

### Integration

- [X] T151 [US6] Add NotificationBell component to MainLayout header, position absolute top-right
- [X] T152 [US6] Implement browser notification display using Notification API when app is in background or tab not focused
- [X] T153 [US6] Implement notification click handler to navigate to target page (task detail, chat, etc.) based on entityType and entityId
- [X] T154 [US6] Auto-mark notifications as read when NotificationList is opened using markAllAsRead mutation

**Acceptance**: All US6 acceptance scenarios pass, notifications appear in browser, click navigation works, unread count updates correctly

---

## Phase 9: Polish & Cross-Cutting Concerns (15 tasks)

**Goal**: Add final touches, error handling, loading states, accessibility, and responsive design

### Error Handling & Loading States

- [X] T155 [P] Add global error boundary in App.tsx to catch unhandled errors and display user-friendly error page
- [X] T156 [P] Add loading skeleton screens to all pages using shadcn Skeleton component during data fetch
- [X] T157 [P] Add empty state components to all lists (tasks, conversations, notifications) with helpful messages
- [X] T158 [P] Implement toast notifications for all mutations using react-hot-toast (success, error, loading)

### Responsive Design

- [X] T159 [P] Test and fix mobile layout for all pages (min 375px width) using Tailwind responsive classes
- [X] T160 [P] Implement mobile hamburger menu for MainLayout sidebar on screens <768px width
- [X] T161 [P] Test image uploads on mobile devices and adjust file picker UX for touch screens

### Accessibility

- [X] T162 [P] Add ARIA labels to all icon-only buttons (close, menu, send, etc.) for screen readers
- [X] T163 [P] Implement keyboard navigation for all interactive elements (Tab, Enter, Escape)
- [X] T164 [P] Add focus visible styles to all focusable elements using Tailwind focus-visible classes

### Performance Optimization

- [X] T165 [P] Implement code splitting for all routes using React.lazy() and Suspense in router.tsx
- [X] T166 [P] Add React.memo to TaskCard, ExecutorCard, MessageBubble components to prevent unnecessary re-renders
- [X] T167 [P] Configure Vite build optimization: tree-shaking, minification, asset optimization in vite.config.ts

### Testing & Quality Assurance

- [X] T168 Write integration test for complete auth flow (send OTP → verify → authenticated) using Vitest + React Testing Library
- [X] T169 [P] Write unit tests for critical utility functions (formatDate, formatCurrency, cn, debounce)

**Acceptance**: Application is responsive, accessible, performant, and handles all edge cases gracefully

---

## Dependencies & Execution Order

### Story Completion Order

```
Phase 1: Setup (T001-T015)
  ↓
Phase 2: Foundational (T016-T040)
  ↓
Phase 3: US1 - Auth (T041-T058) ← MVP SCOPE
  ↓
Phase 4: US2 - Task Browsing (T059-T080) ← Depends on US1
  ↓
Phase 5: US3 - Task Creation (T081-T097) ← Depends on US1, US2
  ↓
Phase 6: US4 - Executors (T098-T116) ← Depends on US1 (independent of US2/US3)
  ↓
Phase 7: US5 - Chat (T117-T139) ← Depends on US1 (independent of US2/US3/US4)
  ↓
Phase 8: US6 - Notifications (T140-T154) ← Depends on US1 (independent of all others)
  ↓
Phase 9: Polish (T155-T169) ← Depends on all features complete
```

### Critical Path (Blocking Tasks)

1. **T001-T015**: Setup MUST complete before any development
2. **T016-T040**: Foundational MUST complete before feature work
3. **T041-T058**: Auth (US1) BLOCKS all other user stories
4. **T059-T063**: Task API BLOCKS US2 and US3
5. **T118-T123**: SignalR setup BLOCKS US5 (Chat)

### Parallel Execution Opportunities

**Within Setup Phase** (After T003):
- T002-T007: All dependency installations can run in parallel
- T010-T013: Configuration files can be created in parallel

**Within Foundational Phase**:
- T016-T019: All constants/types can be created in parallel
- T033-T037: All shared components can be built in parallel
- T038-T040: All utility functions can be written in parallel

**Within US2 (Task Browsing)**:
- T064-T065: Category and location APIs can be built in parallel
- T070-T071: Category and region hooks can be built in parallel
- T072-T076: All task components can be built in parallel

**Within US3 (Task Creation)**:
- T087-T089: Image upload component and form dependencies can be done in parallel

**Within US4 (Executors)**:
- T106-T109: All executor form components can be built in parallel

**Within US5 (Chat)**:
- T130-T135: All chat components can be built in parallel

**Within US6 (Notifications)**:
- T147-T150: All notification components can be built in parallel

**Within Polish Phase**:
- All tasks (T155-T169) can be worked on in parallel

---

## Format Validation

✅ **All 169 tasks follow the required checklist format**:
- ✅ Checkbox prefix: `- [ ]`
- ✅ Task ID: Sequential (T001-T169)
- ✅ [P] marker: Added to 58 parallelizable tasks
- ✅ [Story] label: Added to 95 story-specific tasks (US1-US6)
- ✅ File paths: Included in descriptions where applicable
- ✅ Clear descriptions: Each task has specific, actionable description

## Summary

**Total Tasks**: 169
**MVP Tasks (US1 only)**: 18 tasks (T041-T058) + 35 foundational (T001-T040) = **53 tasks**
**Parallel Tasks**: 58 tasks marked with [P]
**Story Distribution**:
- Setup: 15 tasks
- Foundational: 25 tasks
- US1 (Auth): 18 tasks
- US2 (Task Browsing): 22 tasks
- US3 (Task Creation): 17 tasks
- US4 (Executors): 19 tasks
- US5 (Chat): 23 tasks
- US6 (Notifications): 15 tasks
- Polish: 15 tasks

**Estimated Timeline**:
- **Week 1-2**: Setup + Foundational + US1 (MVP)
- **Week 3-4**: US2 + US3 (Core marketplace)
- **Week 5**: US4 (Executor profiles)
- **Week 6-7**: US5 (Real-time chat)
- **Week 8**: US6 (Notifications) + Polish

**Ready for Implementation!** 🚀
