export type Role = 'customer' | 'pusher' | 'admin' | 'guest';

export interface User {
  id: string;
  name: string;
  role: Role;
  avatar: string;
  phone?: string;
  walletBalance?: number;
  floatJobsRemaining?: number; // For Pushers
  rating?: number;
}

export interface Order {
  id: string;
  pickup: string;
  dropoff: string;
  status: 'pending' | 'accepted' | 'pickup' | 'enroute' | 'delivered' | 'cancelled';
  price: number;
  category: CategoryId;
  pusherId?: string;
  timestamp: number;
  date: string;
  aiAnalysis?: string;
}

export interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
  status: 'success' | 'pending' | 'failed';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
  isAi?: boolean;
}

export type CategoryId = 'walking' | 'wheelbarrow' | 'bike' | 'truck';

export interface FloatPackage {
  id: string;
  name: string;
  jobs: number;
  price: number;
  color: string;
}

export const CATEGORIES = [
  { id: 'walking', name: 'Runner', icon: 'person', basePrice: 15, desc: 'Small items, documents', limit: '5kg' },
  { id: 'wheelbarrow', name: 'Wheelbarrow', icon: 'archive', basePrice: 25, desc: 'Short haul, heavy loads', limit: '50kg' },
  { id: 'bike', name: 'Bike', icon: 'bike', basePrice: 40, desc: 'Medium items, faster', limit: '15kg' },
  { id: 'truck', name: 'Mover', icon: 'truck', basePrice: 150, desc: 'Furniture & Moving', limit: '1000kg' },
] as const;

export const MOCK_FLOAT_PACKAGES: FloatPackage[] = [
  { id: 'starter', name: 'Starter Pack', jobs: 5, price: 50, color: 'bg-pushr-teal' },
  { id: 'pro', name: 'Pro Pusher', jobs: 15, price: 120, color: 'bg-pushr-blue' },
  { id: 'elite', name: 'Elite Fleet', jobs: 50, price: 350, color: 'bg-pushr-yellow' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', type: 'debit', amount: 45, description: 'Delivery to Manda Hill', date: 'Today, 14:30', status: 'success' },
  { id: 't2', type: 'credit', amount: 200, description: 'Wallet Top-up (MTN Money)', date: 'Yesterday', status: 'success' },
  { id: 't3', type: 'debit', amount: 150, description: 'Moving Service', date: '22 Nov', status: 'success' },
];