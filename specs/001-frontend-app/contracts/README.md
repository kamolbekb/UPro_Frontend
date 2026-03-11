# API Contracts

**Feature**: UPro Frontend Application
**Backend Base URL**: `https://uprobackend-production-8628.up.railway.app`
**Date**: 2026-03-10

## Overview

This directory contains API contract specifications for all REST endpoints and SignalR hubs consumed by the UPro frontend. Each file documents endpoints for a specific domain.

## Contract Files

1. **[auth.md](./auth.md)** - Authentication endpoints (phone login, OTP verification, token refresh)
2. **[tasks.md](./tasks.md)** - Task/OrderTask endpoints (CRUD, search, filtering, bookmarking)
3. **[executors.md](./executors.md)** - Executor profile endpoints (registration, management, lookup)
4. **[chat.md](./chat.md)** - Chat endpoints (conversations, messages) + SignalR hub
5. **[notifications.md](./notifications.md)** - Notification endpoints (list, mark read)

## Standard Response Format

All REST endpoints return responses wrapped in `ApiResult<T>`:

```typescript
interface ApiResult<T> {
  succeeded: boolean;    // true if request successful
  result: T;             // Actual response data
  errors: string[];      // Error messages (empty if succeeded)
  message: string | null; // Optional success/error message
}
```

### Success Response Example

```json
{
  "succeeded": true,
  "result": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Need a web developer"
  },
  "errors": [],
  "message": "Task created successfully"
}
```

### Error Response Example

```json
{
  "succeeded": false,
  "result": null,
  "errors": [
    "Title is required",
    "Budget must be greater than 0"
  ],
  "message": "Validation failed"
}
```

## Pagination Format

Paginated endpoints return `PaginatedResult<T>`:

```typescript
interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;  // 1-indexed
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
```

## Authentication

Protected endpoints require JWT Bearer token in `Authorization` header:

```http
Authorization: Bearer <access_token>
```

## Error Handling

### HTTP Status Codes

| Code | Meaning | Frontend Action |
|------|---------|----------------|
| 200 | Success | Display data |
| 400 | Bad Request | Show validation errors from `errors` array |
| 401 | Unauthorized | Attempt token refresh, redirect to login if fails |
| 403 | Forbidden | Show "Access denied" message |
| 404 | Not Found | Show "Resource not found" message |
| 500 | Server Error | Show generic error, log details for debugging |

### Token Expiration Handling

1. **Access Token Expired (401)**:
   - Frontend automatically attempts to refresh using refresh token
   - Retry original request with new access token
   - If refresh fails, redirect to login page

2. **Refresh Token Expired**:
   - Clear auth state
   - Redirect to login page
   - Preserve return URL for post-login redirect

## Rate Limiting

Authentication endpoints (`/api/Users/login`, `/api/Users/verify-otp`) are rate-limited:
- **Limit**: 5 requests per minute per IP
- **Response**: HTTP 429 (Too Many Requests)
- **Frontend Action**: Show "Too many attempts, please wait" message with retry timer

## CORS Configuration

Backend must allow the following origins:
- **Development**: `http://localhost:5173` (Vite default)
- **Production**: TBD (will be configured after frontend deployment)

## SignalR Hub

Real-time features use SignalR hub at `/hubs/chat`:
- **Connection**: WebSocket (fallback to Server-Sent Events → Long Polling)
- **Authentication**: Pass access token via `accessTokenFactory` option
- **Reconnection**: Automatic with exponential backoff

See [chat.md](./chat.md) for detailed SignalR event specifications.

## File Uploads

Endpoints that accept file uploads use `multipart/form-data`:

```typescript
const formData = new FormData();
formData.append('title', 'My Task');
formData.append('images', file1);
formData.append('images', file2);

await axios.post('/api/OrderTasks', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
```

## Image URL Pattern

Backend returns image URLs (not base64) for optimal performance:

```json
{
  "image": "https://uprobackend-production-8628.up.railway.app/images/abc123.jpg"
}
```

Frontend should:
- Display images using `<img src={imageUrl} />`
- Leverage browser caching (backend sets cache headers)
- Use thumbnail endpoint for list views: `/images/thumbnail/{filename}`

## Versioning

Current API version: **v1** (implicit, no version prefix in URLs)

Future versions will use URL prefix: `/api/v2/...`

---

**For detailed endpoint specifications, see individual contract files.**
