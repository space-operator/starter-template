import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export function formatDateTime(dataTime: Date | undefined): string {
  if (!dataTime) return '';
  const date = new Date(dataTime);
  return `${('0' + (date.getMonth() + 1)).slice(-2)}/${(
    '0' + date.getDate()
  ).slice(-2)} - ${('0' + date.getHours()).slice(-2)}:${(
    '0' + date.getMinutes()
  ).slice(-2)}:${('0' + date.getSeconds()).slice(-2)}:${(
    '00' + date.getMilliseconds()
  ).slice(-3)}`;
}
