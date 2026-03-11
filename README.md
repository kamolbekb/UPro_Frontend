# UPro Frontend

> A modern, full-featured task marketplace platform built with React, TypeScript, and real-time capabilities.

## 🚀 Overview

UPro is a comprehensive task marketplace application that connects task posters with skilled executors. The frontend provides a seamless, real-time experience for browsing tasks, creating assignments, communicating via chat, and managing executor profiles.

## ✨ Features

### 🔐 Authentication
- Phone-based OTP authentication
- JWT token management with automatic refresh
- Secure session handling with localStorage persistence

### 📋 Task Management
- Browse and search tasks with advanced filters
- Create tasks with image uploads and budget options
- Save favorite tasks for later
- Real-time task status updates
- Category and subcategory selection

### 👷 Executor Profiles
- Multi-step executor registration (5 steps)
- Comprehensive profile with:
  - Work experience (dynamic entries)
  - Education history (dynamic entries)
  - Language proficiency (levels 1-5)
  - Service location and fields
- Executor discovery and filtering

### 💬 Real-Time Chat
- SignalR-powered instant messaging
- Typing indicators (1s debounce, 3s auto-clear)
- Read receipts and message status
- Optimistic updates for better UX
- Infinite scroll message history
- File attachment support

### 🔔 Notifications
- Browser push notifications (Notification API)
- Real-time notification updates via SignalR
- Unread count badges
- Click-to-navigate functionality
- Auto-refresh every 30 seconds

### 🎨 UI/UX
- Responsive design (mobile-first, min 375px)
- Dark mode support ready
- Loading states and skeletons
- Empty state components
- Toast notifications for all actions
- Global error boundary

## 🛠️ Technology Stack

### Core
- **React 18** - UI library
- **TypeScript** - Type safety (strict mode)
- **Vite 5.x** - Build tool and dev server

### State Management
- **TanStack Query v5** - Server state management
- **Zustand** - Client state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Styling
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - High-quality React components
- **Lucide React** - Icon library

### Real-Time
- **SignalR** - WebSocket connections
- **Auto-reconnect** - Exponential backoff (1s, 2s, 4s, 8s, max 30s)

### Additional Libraries
- **date-fns** - Date formatting
- **react-hot-toast** - Toast notifications
- **browser-image-compression** - Image optimization

## 📁 Project Structure

```
src/
├── app/                        # Application core
│   ├── providers/             # React context providers
│   └── router.tsx             # Route configuration
├── features/                  # Feature modules
│   ├── auth/                  # Authentication
│   ├── tasks/                 # Task management
│   ├── executors/             # Executor profiles
│   ├── chat/                  # Real-time chat
│   └── notifications/         # Notifications
├── shared/                    # Shared resources
│   ├── api/                   # API client & endpoints
│   ├── components/            # Reusable components
│   ├── constants/             # App constants
│   ├── hooks/                 # Custom hooks
│   ├── types/                 # Shared types
│   └── utils/                 # Utility functions
└── App.tsx                    # Root component
```

### Feature Module Structure
Each feature follows Clean Architecture principles:
```
feature/
├── api/                       # API functions
├── components/                # Feature-specific components
├── hooks/                     # Business logic hooks
├── pages/                     # Page components
├── schemas/                   # Zod validation schemas
└── types/                     # TypeScript types
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- UPro Backend API running

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd UPro_Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   Create a `.env` file:
   ```env
   VITE_API_BASE_URL=http://localhost:5150
   VITE_SIGNALR_HUB_URL=http://localhost:5150/hubs/chat
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Build output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript compiler |

## 🏗️ Architecture Highlights

### Clean Architecture
- **Separation of Concerns**: API → Hooks → Components
- **Feature-based Organization**: Each feature is self-contained
- **Type Safety**: Strict TypeScript throughout

### State Management
- **Server State**: TanStack Query with smart caching
- **Client State**: Zustand for auth and UI state
- **Form State**: React Hook Form with Zod validation

### Performance Optimizations
- Optimistic updates for instant feedback
- Query caching and invalidation
- Image compression before upload
- Auto-reconnect with exponential backoff
- Code splitting ready (React.lazy)

### Error Handling
- Global error boundary
- API error interceptors
- Toast notifications for user feedback
- Graceful fallbacks

## 🔐 Authentication Flow

1. User enters phone number
2. OTP sent to phone
3. User verifies OTP code
4. JWT tokens issued (access + refresh)
5. Tokens stored (access in memory, refresh in localStorage)
6. Auto-refresh before expiration

## 📱 Key User Flows

### Task Creation
1. Navigate to "New Task"
2. Fill in task details (title, description, category)
3. Upload images (auto-compressed)
4. Select budget type and amount
5. Choose service location
6. Submit or save as draft

### Becoming an Executor
1. Click "Become Executor"
2. Complete 5-step form:
   - Personal info + profile image
   - Service location & fields
   - Work experience (dynamic entries)
   - Education (dynamic entries)
   - Languages (proficiency levels)
3. Submit for approval

### Real-Time Chat
1. Select conversation from list
2. Type message (typing indicator sent)
3. Press Enter to send (optimistic update)
4. See real-time delivery status
5. Receive messages instantly via SignalR

## 🎨 UI Components

### shadcn/ui Components Used
- Button, Input, Textarea, Select
- Card, Badge, Avatar
- Dialog, Popover, Dropdown Menu
- Scroll Area, Skeleton
- Checkbox, Label
- Toast (via react-hot-toast)

### Custom Components
- LoadingSpinner
- EmptyState
- ErrorBoundary
- NotificationBell
- TaskCard, ExecutorCard
- MessageBubble, ConversationList
- Multi-step form components

## 🔌 API Integration

### Base Configuration
- Base URL: Configurable via environment
- Interceptors: Auth token injection, error handling
- Retry Logic: Token refresh on 401

### Endpoints Used
- `/api/Auth` - Authentication
- `/api/Tasks` - Task management
- `/api/Executors` - Executor profiles
- `/api/Chat` - Chat conversations & messages
- `/api/Notifications` - Notifications
- `/api/Categories` - Categories & subcategories
- `/api/Regions` - Regions & districts
- `/hubs/chat` - SignalR hub

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Future: Run tests
npm run test
```

## 📦 Build Output

- **Production build**: ~785 KB (gzipped: ~246 KB)
- **Build time**: ~6.7 seconds
- **Modules**: 2433 transformed

## 🌐 Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

**Minimum Viewport**: 375px width (mobile-first)

## 🤝 Contributing

1. Follow the existing code structure
2. Use TypeScript strict mode
3. Write meaningful commit messages
4. Run `npm run lint` before committing
5. Ensure `npm run type-check` passes

## 📄 License

[Specify your license here]

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [TanStack Query](https://tanstack.com/query) - Data fetching
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Vite](https://vitejs.dev/) - Build tool

---

**Built with ❤️ using React + TypeScript**
