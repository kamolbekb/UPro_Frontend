import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind class merge utility
 *
 * Combines clsx and tailwind-merge to merge Tailwind CSS classes intelligently.
 * Resolves conflicts (e.g., 'px-2 px-4' → 'px-4')
 *
 * @example
 * cn('px-2 py-1', 'px-4') // 'px-4 py-1'
 * cn('text-red-500', condition && 'text-blue-500') // conditional classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
