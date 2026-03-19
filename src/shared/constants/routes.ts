/**
 * Application route paths
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  LOGIN_VERIFY: '/login/verify',
  COMPLETE_PROFILE: '/complete-profile',
  TASKS: '/tasks',
  TASK_DETAIL: (id: string) => `/tasks/${id}`,
  TASK_NEW: '/tasks/new',
  MY_TASKS: '/my-tasks',
  EXECUTORS: '/executors',
  EXECUTOR_PROFILE: (id: string) => `/executors/${id}`,
  EXECUTOR_BECOME: '/executors/become',
  CHAT: '/chat',
  CHAT_CONVERSATION: (id: string) => `/chat/${id}`,
  PROFILE: '/profile',
  SUBSCRIPTIONS: '/subscriptions',
  NOT_FOUND: '/404',
} as const;

/**
 * Route path patterns for React Router
 */
export const ROUTE_PATTERNS = {
  TASK_DETAIL: '/tasks/:id',
  EXECUTOR_PROFILE: '/executors/:id',
  CHAT_CONVERSATION: '/chat/:conversationId',
} as const;
