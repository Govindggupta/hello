import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * A utility function that combines clsx and tailwind-merge for clean class name management.
 * This allows us to conditionally apply classes and resolve any conflicts with Tailwind CSS classes.
 * 
 * @param inputs - Class values to be merged
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}