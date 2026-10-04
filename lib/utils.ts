import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(
  value: number,
  currency: string = 'USD',
  digits?: number
): string {
  if (value === undefined || value === null || isNaN(value)) {
    return '$0.00';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: digits ?? (value < 1 && value > 0 ? 4 : 2),
    maximumFractionDigits: digits ?? (value < 1 && value > 0 ? 4 : 2),
  }).format(value);
}

