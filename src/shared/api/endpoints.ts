/**
 * Backend API endpoint constants
 *
 * All endpoints are organized by feature and exported as a single ENDPOINTS object.
 * Base URL is configured via VITE_API_BASE_URL environment variable.
 */

export const ENDPOINTS = {
  /**
   * Authentication endpoints
   */
  auth: {
    sendOtp: '/api/Auth/send-otp',
    verifyOtp: '/api/Auth/verify-otp',
    refresh: '/api/Auth/refresh',
  },

  /**
   * Task/Order endpoints
   */
  tasks: {
    list: '/api/OrderTask',
    search: '/api/OrderTasks/search',
    byId: (id: string) => `/api/OrderTask/${id}`,
    create: '/api/OrderTask',
    update: (id: string) => `/api/OrderTask/${id}`,
    delete: (id: string) => `/api/OrderTask/${id}`,
    saved: '/api/OrderTask/saved',
    save: (id: string) => `/api/OrderTask/${id}/save`,
    unsave: (id: string) => `/api/OrderTask/${id}/unsave`,
  },

  /**
   * Executor endpoints
   */
  executors: {
    list: '/api/Executor',
    profile: (id: string) => `/api/Executor/${id}`,
    become: '/api/Executor/become',
    myProfile: '/api/Executor/me',
    updateProfile: '/api/Executor/profile',
    deleteProfile: '/api/Executor/profile',
    languages: '/api/Executor/languages',
    educationTypes: '/api/Executor/education-types',
    languageLevels: '/api/Executor/language-levels',
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
    list: '/api/Notification',
    markRead: (id: string) => `/api/Notification/${id}/read`,
    markAllRead: '/api/Notification/read-all',
    unreadCount: '/api/Notification/unread-count',
    registerToken: '/api/Notification/register-token',
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
    list: '/api/Categories',
    byId: (id: string) => `/api/Categories/${id}`,
    search: '/api/Categories/search',
  },

  /**
   * Region/District endpoints
   */
  regions: {
    list: '/api/Regions',
    byId: (id: string) => `/api/Regions/${id}`,
    districts: (regionId: string) => `/api/Regions/${regionId}/districts`,
  },

  /**
   * Budget Type endpoints
   */
  budgetTypes: {
    list: '/api/BudgetTypes',
  },
} as const;
