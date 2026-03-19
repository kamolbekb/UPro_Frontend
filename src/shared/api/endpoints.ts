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
    resendOtp: '/api/Users/ResendOtpCode',
    verifyOtp: '/api/Users/VerifyOtp',
    refresh: '/api/Users/RefreshToken',
  },

  /**
   * User endpoints (via UsersController)
   */
  users: {
    currentUser: '/api/Users/GetCurrentUser',
    userAuth: '/api/Users/get-user-auth',
    completeProfile: '/api/Users/CompleteProfile',
    myProfile: '/api/Users/my-profile',
    profileImage: '/api/Users/profile-image',
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
    save: (taskId: string) => `/api/SavedTasks/${taskId}`,
    saved: '/api/SavedTasks',
  },

  /**
   * Task Applications endpoints (via OrderTaskApplicationsController)
   */
  applications: {
    apply: '/api/OrderTaskApplications/apply',
    executors: (taskId: string) => `/api/OrderTaskApplications/executors/${taskId}`,
    accept: (applicationId: string) => `/api/OrderTaskApplications/applications/accept/${applicationId}`,
    complete: (applicationId: string) => `/api/OrderTaskApplications/applications/complete/${applicationId}`,
    reject: (applicationId: string) => `/api/OrderTaskApplications/applications/reject/${applicationId}`,
    creatorTasks: '/api/OrderTaskApplications/creator/tasks',
    executorTasks: '/api/OrderTaskApplications/executor/tasks',
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
    languages: '/api/Executors/languages',
    educationTypes: '/api/Executors/education-types',
    languageLevels: '/api/Executors/language-levels',
  },

  /**
   * Chat endpoints
   */
  chat: {
    conversations: '/api/Chat/conversations',
    conversationById: (id: string) => `/api/Chat/conversations/${id}`,
    createConversation: (applicationId: string) => `/api/Chat/conversations/${applicationId}`,
    messages: (conversationId: string) =>
      `/api/Chat/conversations/${conversationId}/messages`,
    markAsRead: (conversationId: string) =>
      `/api/Chat/conversations/${conversationId}/read`,
    unreadCount: '/api/Chat/unread-count',
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
    removeToken: (token: string) => `/api/Notifications/remove-token/${token}`,
  },

  /**
   * Subscription endpoints
   */
  subscriptions: {
    plans: '/api/Subscriptions/plans',
    planById: (id: string) => `/api/Subscriptions/plans/${id}`,
    mySubscription: '/api/Subscriptions/my-subscription',
    subscribe: '/api/Subscriptions/subscribe',
    cancel: '/api/Subscriptions/cancel',
  },

  /**
   * Image endpoints
   */
  images: {
    get: (filename: string) => `/images/${filename}`,
    thumbnail: (filename: string) => `/images/thumbnail/${filename}`,
  },

  /**
   * File endpoints (authenticated)
   */
  files: {
    get: (filename: string) => `/files/${filename}`,
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
   * Extra Fields endpoints (dynamic form fields per subcategory)
   */
  extraFields: {
    bySubcategory: (subcategoryId: string) => `/api/ExtraFields/${subcategoryId}`,
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
