import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Conditionally join Tailwind CSS classes together and
 * eliminate conflicts using `tailwind-merge`.
 *
 * @example
 * cn('px-4 py-2', isActive && 'bg-brand-500', 'hover:bg-brand-600')
 * // → 'px-4 py-2 bg-brand-500 hover:bg-brand-600'
 *
 * @example
 * cn('p-4', 'p-2') // later class wins
 * // → 'p-2'
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
