import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return `₹${price.toFixed(0)}`;
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `VJ${timestamp}${random}`;
}

export function calculateDeliveryFee(subtotal: number): number {
  if (subtotal >= 399) return 0;
  return 30;
}

export function calculateTax(subtotal: number): number {
  return Math.round(subtotal * 0.05); // 5% GST
}

export function calculateTotal(subtotal: number): {
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
} {
  const deliveryFee = calculateDeliveryFee(subtotal);
  const tax = calculateTax(subtotal);
  return {
    subtotal,
    deliveryFee,
    tax,
    total: subtotal + deliveryFee + tax,
  };
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    pending: 'text-yellow-600 bg-yellow-50',
    confirmed: 'text-blue-600 bg-blue-50',
    preparing: 'text-orange-600 bg-orange-50',
    out_for_delivery: 'text-purple-600 bg-purple-50',
    delivered: 'text-green-600 bg-green-50',
    cancelled: 'text-red-600 bg-red-50',
  };
  return map[status] || 'text-gray-600 bg-gray-50';
}

export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    preparing: 'Preparing',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };
  return map[status] || status;
}

export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export const FALLBACK_FOOD_IMAGE = 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&q=80';
export const FALLBACK_RESTAURANT_IMAGE = 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1200&q=80';
