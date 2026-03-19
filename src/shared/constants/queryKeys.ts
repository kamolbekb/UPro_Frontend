/**
 * TanStack Query key factories for consistent cache management
 *
 * Pattern:
 * - all: Base key for the entire resource
 * - lists: Base key for all list queries
 * - list(filters): Specific list query with filters
 * - detail(id): Specific item by ID
 */

export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
    userAuth: () => [...queryKeys.auth.all, 'user-auth'] as const,
  },

  tasks: {
    all: ['tasks'] as const,
    lists: () => [...queryKeys.tasks.all, 'list'] as const,
    list: (filters: Record<string, unknown> | object) =>
      [...queryKeys.tasks.lists(), filters] as const,
    detail: (id: string) => [...queryKeys.tasks.all, 'detail', id] as const,
    saved: () => [...queryKeys.tasks.all, 'saved'] as const,
  },

  applications: {
    all: ['applications'] as const,
    executors: (taskId: string) =>
      [...queryKeys.applications.all, 'executors', taskId] as const,
    creatorTasks: () =>
      [...queryKeys.applications.all, 'creator-tasks'] as const,
    executorTasks: (status?: number) =>
      [...queryKeys.applications.all, 'executor-tasks', status] as const,
  },

  executors: {
    all: ['executors'] as const,
    lists: () => [...queryKeys.executors.all, 'list'] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.executors.lists(), filters] as const,
    detail: (id: string) => [...queryKeys.executors.all, 'detail', id] as const,
    profile: () => [...queryKeys.executors.all, 'profile'] as const,
    languages: (searchTerm?: string) =>
      [...queryKeys.executors.all, 'languages', searchTerm] as const,
    educationTypes: () => [...queryKeys.executors.all, 'education-types'] as const,
    languageLevels: () => [...queryKeys.executors.all, 'language-levels'] as const,
  },

  chat: {
    all: ['chat'] as const,
    conversations: () => [...queryKeys.chat.all, 'conversations'] as const,
    conversation: (id: string) =>
      [...queryKeys.chat.all, 'conversation', id] as const,
    messages: (conversationId: string) =>
      [...queryKeys.chat.all, 'messages', conversationId] as const,
    unreadCount: () => [...queryKeys.chat.all, 'unread-count'] as const,
  },

  notifications: {
    all: ['notifications'] as const,
    lists: () => [...queryKeys.notifications.all, 'list'] as const,
    list: (filters: Record<string, unknown> | object) =>
      [...queryKeys.notifications.lists(), filters] as const,
    unreadCount: () => [...queryKeys.notifications.all, 'unread-count'] as const,
  },

  subscriptions: {
    all: ['subscriptions'] as const,
    plans: () => [...queryKeys.subscriptions.all, 'plans'] as const,
    mySubscription: () => [...queryKeys.subscriptions.all, 'my-subscription'] as const,
  },

  profile: {
    all: ['profile'] as const,
    currentUser: () => [...queryKeys.profile.all, 'current-user'] as const,
  },

  categories: {
    all: ['categories'] as const,
    detail: (id: string) => [...queryKeys.categories.all, 'detail', id] as const,
    subcategories: (parentId: string) =>
      [...queryKeys.categories.all, 'subcategories', parentId] as const,
    search: (searchTerm: string) =>
      [...queryKeys.categories.all, 'search', searchTerm] as const,
  },

  regions: {
    all: ['regions'] as const,
    detail: (id: string) => [...queryKeys.regions.all, 'detail', id] as const,
    districts: (regionId: string) =>
      [...queryKeys.regions.all, 'districts', regionId] as const,
  },

  budgetTypes: {
    all: ['budgetTypes'] as const,
  },

  extraFields: {
    all: ['extraFields'] as const,
    bySubcategory: (subcategoryId: string) =>
      [...queryKeys.extraFields.all, subcategoryId] as const,
  },
} as const;
