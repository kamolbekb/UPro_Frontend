/**
 * Backend API endpoint constants
 *
 * All endpoints are organized by feature and exported as a single ENDPOINTS object.
 * Base URL is configured via VITE_API_BASE_URL environment variable.
 */

export const ENDPOINTS = {
  /**
   * Authentication endpoints (via UsersController)
   */
  auth: {
    sendOtp: '/api/Users/InitiateLogin',
    verifyOtp: '/api/Users/VerifyOtp',
    refresh: '/api/Users/RefreshToken',
  },

  /**
   * Task/Order endpoints
   */
  tasks: {
    list: '/api/OrderTasks',
    search: '/api/OrderTasks/search',
    byId: (id: string) => `/api/OrderTasks/${id}`,
    create: '/api/OrderTasks/create',
    update: (id: string) => `/api/OrderTasks/${id}`,
    delete: (id: string) => `/api/OrderTasks/${id}`,
    archive: (id: string) => `/api/OrderTasks/archive/${id}`,
  },

  /**
   * Saved Tasks endpoints
   */
  savedTasks: {
    list: '/api/SavedTasks',
    save: (taskId: string) => `/api/SavedTasks/${taskId}`,
    unsave: (taskId: string) => `/api/SavedTasks/${taskId}`,
    isSaved: (taskId: string) => `/api/SavedTasks/is-saved/${taskId}`,
    removeAll: '/api/SavedTasks',
  },

  /**
   * Executor endpoints
   */
  executors: {
    list: '/api/Executors/GetExecutorsList',
    profile: (id: string) => `/api/Executors/${id}`,
    become: '/api/Executors/BecomeExecutor',
    myProfile: '/api/Executors/profile',
    updateProfile: '/api/Executors/profile',
    deleteProfile: '/api/Executors/profile',
  },

  /**
   * Chat endpoints
   */
  chat: {
    conversations: '/api/Chat/conversations',
    conversationById: (id: string) => `/api/Chat/conversations/${id}`,
    messages: (conversationId: string) =>
      `/api/Chat/conversations/${conversationId}/messages`,
    sendMessage: '/api/Chat/messages',
    markAsRead: (messageId: string) => `/api/Chat/messages/${messageId}/read`,
    hub: '/hubs/chat',
  },

  /**
   * Notification endpoints
   */
  notifications: {
    list: '/api/Notifications/my-notifications',
    markRead: (id: string) => `/api/Notifications/${id}/mark-read`,
    markAllRead: '/api/Notifications/mark-all-read',
    unreadCount: '/api/Notifications/unread-count',
    registerToken: '/api/Notifications/register-token',
  },

  /**
   * User endpoints
   */
  users: {
    profile: '/api/Users/profile',
    profileImage: '/api/Users/profile-image',
    updateProfile: '/api/Users/profile',
  },

  /**
   * Image endpoints
   */
  images: {
    get: (filename: string) => `/images/${filename}`,
    thumbnail: (filename: string) => `/images/thumbnail/${filename}`,
  },

  /**
   * Category endpoints
   */
  categories: {
    parents: '/api/Categories/parents',
    subcategories: '/api/Categories/subcategories',
    search: '/api/Categories/subcategories/search',
  },

  /**
   * Region/District endpoints
   */
  regions: {
    list: '/api/Regions',
    districts: '/api/Regions/GetDistrictsByRegionId',
  },

  /**
   * Budget Type endpoints
   */
  budgetTypes: {
    list: '/api/BudgetTypes',
  },
} as const;
