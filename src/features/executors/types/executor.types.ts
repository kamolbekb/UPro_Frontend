/**
 * Executor-related TypeScript interfaces and types
 * Maps to backend Executor entity and related DTOs
 */

/**
 * Language proficiency level enumeration
 */
export enum LanguageLevel {
  Elementary = 1,
  Advanced = 2,
  Professional = 3,
  Proficient = 4,
  Native = 5,
}

/**
 * Language lookup data
 */
export interface Language {
  id: string; // UUID
  name: string; // e.g., "English", "Russian", "Uzbek"
}

/**
 * Education type lookup data
 */
export interface EducationType {
  id: string; // UUID
  name: string; // e.g., "Bachelor's", "Master's", "PhD"
}

/**
 * Work experience entry
 */
export interface WorkExperience {
  id?: string; // UUID (optional for new entries)
  companyName: string;
  position: string;
  startDate: string; // MM.YYYY format
  endDate?: string | null | undefined; // MM.YYYY or null for current work
  details?: string | null | undefined;
}

/**
 * Education entry
 */
export interface Education {
  id?: string; // UUID (optional for new entries)
  schoolName: string;
  educationTypeId: string; // UUID
  educationTypeName?: string; // Display name
  fieldOfStudy: string;
  startDate: string; // MM.YYYY format
  endDate?: string | null | undefined; // MM.YYYY or null for current studies
  details?: string | null | undefined;
}

/**
 * Language proficiency entry
 */
export interface LanguageProficiency {
  id?: string; // UUID (optional for new entries)
  languageId: string; // UUID
  languageName?: string; // Display name
  proficiencyLevel: LanguageLevel; // 1-5
}

/**
 * Executor profile data
 */
export interface ExecutorProfile {
  id: string; // UUID
  userId: string; // UUID
  firstName: string;
  lastName: string;
  image: string | null; // Full image URL
  birthDate: string; // ISO 8601: 2000-01-15
  serviceLocationId: string; // District UUID
  serviceLocationName?: string;
  regionName?: string;
  rating: number | null; // Average rating (0-5)
  completedTasks: number; // Number of completed tasks
  isAvailable: boolean; // Currently accepting work
  serviceFields: string[]; // Category IDs executor offers
  workExperience: WorkExperience[];
  education: Education[];
  languages: LanguageProficiency[];
  createdAt: string; // ISO 8601
  modifiedAt: string | null; // ISO 8601
}

/**
 * Executor profile form data (for become executor)
 */
export interface BecomeExecutorFormData {
  // Personal Info
  image?: File | undefined;
  firstName: string;
  lastName: string;
  birthDate: string; // YYYY-MM-DD format for input[type="date"]

  // Service Info
  serviceLocationId: string; // District UUID
  serviceFields: string[]; // Category IDs

  // Work Experience (dynamic array)
  workExperience: WorkExperience[];

  // Education (dynamic array)
  education: Education[];

  // Languages (dynamic array)
  languages: LanguageProficiency[];
}

/**
 * API request payload for becoming an executor
 * Sent as multipart/form-data with FormData
 */
export interface BecomeExecutorRequest {
  image?: File | undefined;
  firstName: string;
  lastName: string;
  birthDate: string; // ISO 8601
  serviceLocationId: string;
  serviceFields: string[]; // JSON stringified array
  workExperience: string; // JSON stringified array
  education: string; // JSON stringified array
  languages: string; // JSON stringified array
}

/**
 * API response for becoming an executor
 */
export interface BecomeExecutorResponse {
  id: string; // Executor profile ID
  userId: string;
  createdAt: string; // ISO 8601
}

/**
 * Update executor profile request
 */
export interface UpdateExecutorRequest {
  image?: File | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
  birthDate?: string | undefined;
  serviceLocationId?: string | undefined;
  serviceFields?: string | undefined; // JSON stringified array
  workExperience?: string | undefined; // JSON stringified array
  education?: string | undefined; // JSON stringified array
  languages?: string | undefined; // JSON stringified array
  isAvailable?: boolean | undefined;
}

/**
 * Executor list item (for browse executors page)
 */
export interface ExecutorListItem {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  image: string | null;
  serviceLocationName: string;
  regionName: string;
  rating: number | null;
  completedTasks: number;
  isAvailable: boolean;
  serviceFields: string[]; // Category names
}

/**
 * Executor filters for search/browse
 */
export interface ExecutorFilters {
  searchTerm?: string | undefined;
  categoryId?: string | undefined;
  regionId?: string | undefined;
  districtId?: string | undefined;
  minRating?: number | undefined;
  isAvailable?: boolean | undefined;
  page?: number | undefined;
  limit?: number | undefined;
}
