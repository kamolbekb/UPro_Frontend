import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns';

/**
 * Format date for display
 *
 * @param date - Date string or Date object
 * @param formatStr - date-fns format string (default: 'MMM d, yyyy')
 * @returns Formatted date string
 *
 * @example
 * formatDate('2024-03-10') // "Mar 10, 2024"
 * formatDate(new Date(), 'yyyy-MM-dd') // "2024-03-10"
 */
export function formatDate(date: string | Date, formatStr = 'MMM d, yyyy'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
}

/**
 * Format date with time
 *
 * @param date - Date string or Date object
 * @returns Formatted date and time string
 *
 * @example
 * formatDateTime('2024-03-10T14:30:00') // "Mar 10, 2024 at 2:30 PM"
 */
export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM d, yyyy \'at\' h:mm a');
}

/**
 * Format date as relative time (e.g., "2 hours ago")
 *
 * @param date - Date string or Date object
 * @param addSuffix - Whether to add "ago" suffix (default: true)
 * @returns Relative time string
 *
 * @example
 * formatRelativeTime('2024-03-10T10:00:00') // "2 hours ago"
 * formatRelativeTime(new Date(), false) // "less than a minute"
 */
export function formatRelativeTime(date: string | Date, addSuffix = true): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix });
}

/**
 * Format date for chat messages (smart formatting based on recency)
 *
 * - Today: "2:30 PM"
 * - Yesterday: "Yesterday at 2:30 PM"
 * - This year: "Mar 10 at 2:30 PM"
 * - Older: "Mar 10, 2023"
 *
 * @param date - Date string or Date object
 * @returns Formatted date string
 */
export function formatChatMessageDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (isToday(dateObj)) {
    return format(dateObj, 'h:mm a');
  }

  if (isYesterday(dateObj)) {
    return `Yesterday at ${format(dateObj, 'h:mm a')}`;
  }

  const currentYear = new Date().getFullYear();
  const dateYear = dateObj.getFullYear();

  if (currentYear === dateYear) {
    return format(dateObj, 'MMM d \'at\' h:mm a');
  }

  return format(dateObj, 'MMM d, yyyy');
}

/**
 * Format time only
 *
 * @param date - Date string or Date object
 * @returns Formatted time string (12-hour format)
 *
 * @example
 * formatTime('2024-03-10T14:30:00') // "2:30 PM"
 */
export function formatTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'h:mm a');
}

/**
 * Format date range
 *
 * @param startDate - Start date string or Date object
 * @param endDate - End date string or Date object
 * @returns Formatted date range string
 *
 * @example
 * formatDateRange('2024-03-10', '2024-03-15') // "Mar 10 - Mar 15, 2024"
 */
export function formatDateRange(startDate: string | Date, endDate: string | Date): string {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;

  const startYear = start.getFullYear();
  const endYear = end.getFullYear();

  if (startYear === endYear) {
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
  }

  return `${format(start, 'MMM d, yyyy')} - ${format(end, 'MMM d, yyyy')}`;
}
