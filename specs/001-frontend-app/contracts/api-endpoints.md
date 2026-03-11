# API Endpoints Specification

**Backend Base URL**: `https://uprobackend-production-8628.up.railway.app`
**Date**: 2026-03-10

## Authentication Endpoints

### POST /api/Users/login
Send OTP code to phone number

**Request**:
```typescript
{
  phoneNumber: string; // E.164 format: "+998901234567"
}
```

**Response** `ApiResult<LoginResponseModel>`:
```typescript
{
  message: string; // "OTP sent successfully"
  expiresIn: number; // Seconds (300 = 5 minutes)
}
```

**Errors**:
- 400: Invalid phone number format
- 429: Too many requests (rate limited)

---

### POST /api/Users/verify-otp
Verify OTP and authenticate user

**Request**:
```typescript
{
  phoneNumber: string;
  code: string; // 6-digit OTP
}
```

**Response** `ApiResult<{user, accessToken, refreshToken}>`:
```typescript
{
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // Token lifetime in seconds
}
```

**Errors**:
- 400: Invalid OTP code
- 401: OTP expired
- 429: Too many failed attempts

---

### POST /api/Users/refresh
Refresh access token

**Request**:
```typescript
{
  refreshToken: string;
}
```

**Response** `ApiResult<{accessToken, refreshToken}>`:
```typescript
{
  accessToken: string;
  refreshToken: string; // New refresh token (rotation)
  expiresIn: number;
}
```

**Errors**:
- 401: Invalid or expired refresh token

---

## Task Endpoints

### GET /api/OrderTasks/search
Search and filter tasks

**Query Parameters**:
```typescript
{
  searchTerm?: string;      // Keyword search
  page?: number;            // Default 1
  limit?: number;           // Default 10
  categoryId?: string;      // UUID filter
  regionId?: string;        // UUID filter
  districtId?: string;      // UUID filter
  budgetTypeId?: string;    // UUID filter
  minBudget?: number;
  maxBudget?: number;
  status?: number;          // TaskStatus enum
}
```

**Response** `ApiResult<PaginatedResult<Task>>`:
```typescript
{
  items: Task[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
```

---

### GET /api/OrderTasks/{id}
Get task by ID

**Path Parameters**:
- `id` (UUID): Task ID

**Response** `ApiResult<TaskDetail>`:
```typescript
{
  task: TaskDetail; // Includes client info and applications
}
```

**Errors**:
- 404: Task not found
- 403: Access denied (private task)

---

### POST /api/OrderTasks
Create new task

**Request** (multipart/form-data):
```typescript
{
  title: string;              // Min 5 chars
  description: string;        // Min 20 chars
  categoryId: string;         // UUID
  subCategoryId?: string;     // UUID, optional
  budgetTypeId: string;       // UUID
  budgetAmount: number;       // Positive
  serviceLocationId: string;  // District UUID
  images: File[];             // Max 5 files, max 5MB each
  extraFields?: object;       // Custom category fields
}
```

**Response** `ApiResult<TaskDetail>`:
```typescript
{
  task: TaskDetail; // Newly created task
}
```

**Errors**:
- 400: Validation errors (title too short, invalid budget, etc.)
- 413: File too large
- 415: Unsupported file type

---

### PUT /api/OrderTasks/{id}
Update existing task

**Path Parameters**:
- `id` (UUID): Task ID

**Request** (multipart/form-data):
```typescript
{
  // Same as POST, all fields optional except required by business logic
}
```

**Response** `ApiResult<TaskDetail>`:

**Errors**:
- 403: Not task owner
- 404: Task not found

---

### POST /api/SavedTasks/{taskId}
Bookmark/save task

**Path Parameters**:
- `taskId` (UUID): Task to bookmark

**Response** `ApiResult<boolean>`:
```typescript
{
  result: true;
  message: "Task bookmarked successfully"
}
```

---

### DELETE /api/SavedTasks/{taskId}
Remove bookmark

**Path Parameters**:
- `taskId` (UUID): Task to unbookmark

**Response** `ApiResult<boolean>`:

---

### GET /api/SavedTasks
Get user's bookmarked tasks

**Query Parameters**:
```typescript
{
  page?: number;
  limit?: number;
}
```

**Response** `ApiResult<PaginatedResult<Task>>`:

---

## Executor Endpoints

### POST /api/Executors/apply (or /become)
Become an executor

**Request** (multipart/form-data):
```typescript
{
  firstName: string;
  lastName: string;
  birthDate: string;          // ISO 8601: "2000-01-15"
  image?: File;               // Profile image
  serviceLocationId: string;  // District UUID
  serviceFields: Array<{
    categoryId: string;
    subCategoryId?: string;
  }>;
  workExperience: Array<{
    companyName: string;
    position: string;
    startDate: string;        // "MM.YYYY"
    endDate?: string | null;  // null = currently working
    details?: string;
  }>;
  education: Array<{
    schoolName: string;
    educationTypeId: string;
    fieldOfStudy: string;
    startDate: string;        // "MM.YYYY"
    endDate?: string | null;  // null = currently studying
    details?: string;
  }>;
  languages: Array<{
    languageId: string;
    proficiencyLevel: number; // LanguageLevel enum (1-5)
  }>;
}
```

**Response** `ApiResult<ExecutorProfile>`:

---

### GET /api/Executors/profile
Get current user's executor profile

**Response** `ApiResult<ExecutorProfile>`:

**Errors**:
- 404: User is not an executor

---

### PUT /api/Executors/profile
Update executor profile

**Request** (multipart/form-data): Same as POST /apply

**Response** `ApiResult<ExecutorProfile>`:

---

### DELETE /api/Executors/profile
Delete executor profile

**Response** `ApiResult<boolean>`:

---

### GET /api/Executors
List all executors (public)

**Query Parameters**:
```typescript
{
  page?: number;
  limit?: number;
  categoryId?: string;
  regionId?: string;
  minRating?: number;
}
```

**Response** `ApiResult<PaginatedResult<ExecutorProfile>>`:

---

### GET /api/Executors/{id}
Get executor by ID

**Path Parameters**:
- `id` (UUID): Executor ID

**Response** `ApiResult<ExecutorProfile>`:

---

### GET /api/Executors/languages
Get all languages with optional search

**Query Parameters**:
```typescript
{
  searchTerm?: string; // Filter by name
}
```

**Response** `ApiResult<Language[]>`:

---

### GET /api/Executors/education-types
Get all education types

**Response** `ApiResult<EducationType[]>`:

---

## Chat Endpoints

### GET /api/Chat/conversations
Get user's conversations

**Response** `ApiResult<Conversation[]>`:
```typescript
{
  conversations: Array<{
    id: string;
    applicationId: string;
    taskId: string;
    taskTitle: string;
    participant: {
      id: string;
      firstName: string;
      lastName: string;
      image: string | null;
      isOnline: boolean;
    };
    lastMessage: Message | null;
    unreadCount: number;
    createdAt: string;
    updatedAt: string;
  }>;
}
```

---

### POST /api/Chat/conversations/{applicationId}
Get or create conversation for application

**Path Parameters**:
- `applicationId` (UUID): Task application ID

**Response** `ApiResult<Conversation>`:

---

### GET /api/Chat/conversations/{conversationId}/messages
Get conversation messages

**Path Parameters**:
- `conversationId` (UUID): Conversation ID

**Query Parameters**:
```typescript
{
  page?: number;
  limit?: number; // Default 50
}
```

**Response** `ApiResult<PaginatedResult<Message>>`:

---

### SignalR Hub: /hubs/chat

**Connection**:
```typescript
const connection = new HubConnectionBuilder()
  .withUrl('/hubs/chat', {
    accessTokenFactory: () => getAccessToken(),
  })
  .withAutomaticReconnect()
  .build();
```

**Server → Client Events**:

#### ReceiveMessage
New message received
```typescript
connection.on('ReceiveMessage', (message: Message) => {
  // Update UI, add to message list
});
```

#### MessageRead
Message marked as read
```typescript
connection.on('MessageRead', (payload: { messageId: string; readAt: string }) => {
  // Update read status in UI
});
```

#### UserTyping
Other user started typing
```typescript
connection.on('UserTyping', (payload: { conversationId: string; userId: string; userName: string }) => {
  // Show "User is typing..." indicator
});
```

#### UserStoppedTyping
Other user stopped typing
```typescript
connection.on('UserStoppedTyping', (payload: { conversationId: string; userId: string }) => {
  // Hide typing indicator
});
```

**Client → Server Methods**:

#### SendMessage
Send a message
```typescript
await connection.invoke('SendMessage', {
  conversationId: string;
  content: string;
  attachments?: File[];
});
```

#### SendTypingIndicator
Notify other user you're typing
```typescript
await connection.invoke('SendTypingIndicator', conversationId);
```

#### MarkAsRead
Mark message as read
```typescript
await connection.invoke('MarkAsRead', messageId);
```

---

## Notification Endpoints

### GET /api/Notifications
Get user notifications

**Query Parameters**:
```typescript
{
  page?: number;
  limit?: number;
  unreadOnly?: boolean; // Filter to unread only
}
```

**Response** `ApiResult<PaginatedResult<Notification>>`:

---

### POST /api/Notifications/{id}/read
Mark notification as read

**Path Parameters**:
- `id` (UUID): Notification ID

**Response** `ApiResult<boolean>`:

---

### POST /api/Notifications/read-all
Mark all notifications as read

**Response** `ApiResult<number>`:
```typescript
{
  result: 5; // Number of notifications marked as read
}
```

---

### GET /api/Notifications/unread-count
Get count of unread notifications

**Response** `ApiResult<number>`:
```typescript
{
  result: 3; // Unread count
}
```

---

### POST /api/Notifications/register-token
Register FCM device token for push notifications

**Request**:
```typescript
{
  token: string; // FCM device token
  deviceType: string; // "web" | "ios" | "android"
}
```

**Response** `ApiResult<boolean>`:

---

## Category & Location Endpoints

### GET /api/Categories
Get all categories (hierarchical)

**Response** `ApiResult<Category[]>`:
```typescript
{
  categories: Array<{
    id: string;
    name: string;
    nameUz: string | null;
    nameRu: string | null;
    icon: string | null;
    parentId: string | null;
    subCategories: Category[]; // Nested
    hint: string | null;
  }>;
}
```

---

### GET /api/Regions
Get all regions with districts

**Response** `ApiResult<Region[]>`:
```typescript
{
  regions: Array<{
    id: string;
    name: string;
    nameUz: string | null;
    nameRu: string | null;
    districts: Array<{
      id: string;
      name: string;
      nameUz: string | null;
      nameRu: string | null;
      regionId: string;
    }>;
  }>;
}
```

---

## User Profile Endpoints

### GET /api/Users/GetCurrentUser
Get current user profile

**Response** `ApiResult<User>`:

---

### POST /api/Users/profile-image
Upload user profile image

**Request** (multipart/form-data):
```typescript
{
  image: File; // JPEG/PNG, max 5MB
}
```

**Response** `ApiResult<string>`:
```typescript
{
  result: "https://.../images/abc123.jpg"; // Image URL
}
```

---

### DELETE /api/Users/profile-image
Delete user profile image

**Response** `ApiResult<boolean>`:

---

## Image Endpoints

### GET /images/{filename}
Get original image

**Path Parameters**:
- `filename` (string): Image filename (e.g., "abc123.jpg")

**Response**: Binary image file

**Headers**:
- `Cache-Control: public, max-age=3600` (1 hour)
- `Content-Type: image/jpeg` (or png, gif, webp)

---

### GET /images/thumbnail/{filename}
Get thumbnail (150px max dimension)

**Path Parameters**:
- `filename` (string): Image filename

**Response**: Binary image file (thumbnail)

**Headers**: Same as original image

---

## Summary

**Total Endpoints**: 30+ REST endpoints + 1 SignalR hub

All endpoints follow consistent patterns:
- ✅ ApiResult<T> wrapper for responses
- ✅ JWT authentication for protected routes
- ✅ Pagination for list endpoints
- ✅ Validation errors with field-level detail
- ✅ Image URLs (not base64)

**Next Step**: Create quickstart development guide
