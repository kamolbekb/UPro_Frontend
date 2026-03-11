import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { ApiError, type ApiResult } from './types';
import { useAuthStore } from '@features/auth/hooks/useAuthStore';
import { refreshToken as refreshTokenApi } from '@features/auth/api/authApi';

/**
 * Get auth token from store
 */
function getAuthToken(): string | null {
  return useAuthStore.getState().getAccessToken();
}

/**
 * Get refresh token from store
 */
function getRefreshToken(): string | null {
  return useAuthStore.getState().getRefreshToken();
}

/**
 * Refresh token and update store
 */
async function refreshTokenAndRetry(
  _config: InternalAxiosRequestConfig
): Promise<void> {
  const storedRefreshToken = getRefreshToken();

  if (!storedRefreshToken) {
    throw new ApiError(401, 'Session expired. Please log in again.');
  }

  try {
    const response = await refreshTokenApi(storedRefreshToken);

    // Update tokens in store
    const userId = useAuthStore.getState().userId;
    if (userId) {
      useAuthStore.getState().setTokens(
        response.accessToken,
        response.refreshToken,
        userId,
        response.isProfileCompleted ?? false
      );
    } else {
      // No userId in store - should not happen
      throw new ApiError(401, 'Invalid session state');
    }
  } catch (error) {
    // Refresh failed - logout user
    useAuthStore.getState().logout();
    throw new ApiError(401, 'Session expired. Please log in again.');
  }
}

/**
 * Token refresh queue to prevent multiple simultaneous refresh attempts
 */
interface QueuedRequest {
  resolve: (value: unknown) => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: QueuedRequest[] = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

/**
 * Axios instance configured with baseURL from environment variables
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

/**
 * T022: Request interceptor to attach Authorization header
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * T023: Response interceptor to unwrap ApiResult<T> and normalize errors
 * T024: Handle 401 with token refresh and request queuing
 */
apiClient.interceptors.response.use(
  (response) => {
    // Unwrap ApiResult<T> if present
    if (response.data && isApiResult(response.data)) {
      const apiResult = response.data;
      if (apiResult.succeeded) {
        response.data = apiResult.result;
      } else {
        // API returned success status but succeeded=false
        throw new ApiError(
          response.status,
          'Request failed',
          apiResult.errors
        );
      }
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized - Token refresh logic
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request and wait for token refresh to complete
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => apiClient.request(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await refreshTokenAndRetry(originalRequest);
        processQueue(null, getAuthToken());
        return apiClient.request(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Clear auth state and redirect to login
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Normalize all errors into ApiError
    if (error.response) {
      // Server responded with error status
      const data = error.response.data;
      const errors: string[] = [];

      if (isApiResult(data) && !data.succeeded) {
        errors.push(...data.errors);
      } else if (typeof data === 'string') {
        errors.push(data);
      }

      throw new ApiError(
        error.response.status,
        error.message || 'Request failed',
        errors
      );
    } else if (error.request) {
      // Request made but no response
      throw new ApiError(0, 'Network Error', [
        'Unable to connect to server. Please check your internet connection.',
      ]);
    } else {
      // Something happened in setting up the request
      throw new ApiError(0, error.message, []);
    }
  }
);

export { apiClient };

/**
 * Helper to check if response is ApiResult
 */
export function isApiResult<T>(data: unknown): data is ApiResult<T> {
  return (
    typeof data === 'object' &&
    data !== null &&
    'succeeded' in data &&
    'result' in data &&
    'errors' in data
  );
}

/**
 * Unwrap ApiResult<T> or throw ApiError
 */
export function unwrapApiResult<T>(data: ApiResult<T>): T {
  if (data.succeeded) {
    return data.result;
  }
  throw new ApiError(400, 'Request failed', data.errors);
}
