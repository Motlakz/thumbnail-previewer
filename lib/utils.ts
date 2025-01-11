import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: string | number): string {
  const n = typeof num === 'string' ? parseInt(num) : num;
  if (n >= 1000000) {
      return (n / 1000000).toFixed(1) + 'M';
  }
  if (n >= 1000) {
      return (n / 1000).toFixed(1) + 'K';
  }
  return n.toString();
}
