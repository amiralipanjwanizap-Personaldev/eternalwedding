import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { differenceInDays, format, parseISO } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function generateSlug(partner1: string, partner2: string): string {
  const base = slugify(`${partner1}-and-${partner2}`)
  const suffix = Math.random().toString(36).slice(2, 6)
  return `${base}-${suffix}`
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'Date TBD'
  try {
    return format(parseISO(dateStr), 'MMMM d, yyyy')
  } catch {
    return dateStr
  }
}

export function formatTime(timeStr: string | null): string {
  if (!timeStr) return ''
  const [h, m] = timeStr.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`
}

export function daysUntilWedding(dateStr: string | null): number | null {
  if (!dateStr) return null
  try {
    const diff = differenceInDays(parseISO(dateStr), new Date())
    return diff
  } catch {
    return null
  }
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export const THEMES = [
  { id: 'rose-garden',    label: 'Rose Garden',    primary: '#C4826A', bg: '#FAF7F2' },
  { id: 'botanical',      label: 'Botanical',      primary: '#7A9E7A', bg: '#F2F7F2' },
  { id: 'golden-hour',    label: 'Golden Hour',    primary: '#C9A96E', bg: '#FAF7EE' },
  { id: 'midnight-blue',  label: 'Midnight Blue',  primary: '#6A7AC4', bg: '#F2F2FA' },
  { id: 'blush-romantic', label: 'Blush Romantic', primary: '#D4889A', bg: '#FDF2F4' },
  { id: 'desert-sand',    label: 'Desert Sand',    primary: '#C4A86A', bg: '#FAF5EE' },
  { id: 'ocean-breeze',   label: 'Ocean Breeze',   primary: '#6AAAC4', bg: '#F2F8FA' },
  { id: 'monochrome',     label: 'Monochrome',     primary: '#555555', bg: '#FAFAFA' },
] as const

export const MEAL_OPTIONS = ['Chicken', 'Beef', 'Fish', 'Vegetarian', 'Vegan', 'Kids Meal']
