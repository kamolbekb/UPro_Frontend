/**
 * Standard API response wrapper from backend
 */
export interface ApiResult<T> {
  succeeded: boolean;
  result: T;
  errors: string[];
}

/**
 * Paginated response for list endpoints
 */
export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Normalized error class for API errors
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors: string[] = []
  ) {
    super(message);
    this.name = 'ApiError';
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  /**
   * Check if error is authentication related
   */
  isAuthError(): boolean {
    return this.status === 401 || this.status === 403;
  }

  /**
   * Check if error is a network error
   */
  static isNetworkError(error: unknown): boolean {
    return (
      error instanceof Error &&
      (error.message === 'Network Error' || error.message.includes('ECONNREFUSED'))
    );
  }

  /**
   * Get user-friendly error message
   */
  getUserMessage(): string {
    if (this.errors.length > 0) {
      return this.errors.join('. ');
    }
    return this.message || 'An unexpected error occurred';
  }
}
