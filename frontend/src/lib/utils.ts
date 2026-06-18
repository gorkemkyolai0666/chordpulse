import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('tr-TR', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('tr-TR', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `%${value}`;
}

export function formatLaborHours(value: number): string {
  return `${value.toFixed(0)} demet`;
}

const ORDER_STATUS: Record<string, string> = {
  quoted: 'Teklif',
  sourcing: 'Tedarik',
  preparing: 'Hazırlık',
  arranging: 'Düzenleme',
  ready: 'Hazır',
  delivered: 'Teslim Edildi',
  cancelled: 'İptal',
};

export function formatOrderStatus(status: string): string {
  return ORDER_STATUS[status] || status;
}

const STEM_CONDITION: Record<string, string> = {
  fresh: 'Taze',
  conditioning: 'Kondisyon',
  arranged: 'Düzenlenmiş',
  wilted: 'Solmuş',
  discarded: 'İmha',
};

export function formatInstrumentCondition(condition: string): string {
  return STEM_CONDITION[condition] || condition;
}

const DELIVERY_STATUS: Record<string, string> = {
  scheduled: 'Planlandı',
  loading: 'Yükleme',
  en_route: 'Yolda',
  delivered: 'Teslim Edildi',
  cancelled: 'İptal',
};

export function formatHandoffStatus(status: string): string {
  return DELIVERY_STATUS[status] || status;
}

const WORKSHOP_STATUS: Record<string, string> = {
  scheduled: 'Planlandı',
  in_progress: 'Devam Ediyor',
  completed: 'Tamamlandı',
  cancelled: 'İptal',
  full: 'Dolu',
};

export function formatBenchStatus(status: string): string {
  return WORKSHOP_STATUS[status] || status;
}

const DELIVERY_TYPE: Record<string, string> = {
  wedding: 'Düğün',
  event: 'Etkinlik',
  wholesale: 'Toptan',
  subscription: 'Abonelik',
  rush: 'Acil',
};

export function formatHandoffType(value: string): string {
  return DELIVERY_TYPE[value] || value;
}

const VARIETY_STATUS: Record<string, string> = {
  active: 'Aktif',
  seasonal: 'Mevsimlik',
  discontinued: 'Durduruldu',
};

export function formatPartStatus(status: string): string {
  return VARIETY_STATUS[status] || status;
}

const ORDER_TYPE: Record<string, string> = {
  wedding: 'Düğün',
  funeral: 'Cenaze',
  corporate: 'Kurumsal',
  retail: 'Perakende',
  subscription: 'Abonelik',
  seasonal: 'Mevsimlik',
};

export function formatOrderType(value: string): string {
  return ORDER_TYPE[value] || value;
}

const VARIETY_CATEGORY: Record<string, string> = {
  rose: 'Gül',
  tropical: 'Tropik',
  foliage: 'Yeşillik',
  seasonal: 'Mevsimlik',
  dried: 'Kurutulmuş',
  other: 'Diğer',
};

export function formatPartCategory(value: string): string {
  return VARIETY_CATEGORY[value] || value;
}

const STEM_STATUS: Record<string, string> = {
  in_stock: 'Stokta',
  reserved: 'Rezerve',
  sold: 'Satıldı',
  expired: 'Süresi Doldu',
};

export function formatInstrumentStatus(status: string): string {
  return STEM_STATUS[status] || status;
}
