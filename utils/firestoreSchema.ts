/**
 * Firestore Database Schema
 * Complete data structure for Pushr app
 */

export interface FirestoreUser {
  id: string;
  email?: string;
  phone: string;
  name: string;
  role: 'customer' | 'pusher' | 'admin';
  avatar?: string;
  createdAt: number;
  updatedAt: number;
  lastSeen?: number;
  // Customer fields
  walletBalance?: number;
  paymentMethods?: PaymentMethod[];
  // Pusher fields
  floatBalance?: number;
  rating?: number;
  totalDeliveries?: number;
  totalEarnings?: number;
  verificationStatus?: 'pending' | 'verified' | 'rejected';
  documents?: {
    id?: string;
    vehicle?: string;
    license?: string;
  };
  isOnline?: boolean;
  currentLocation?: {
    lat: number;
    lng: number;
    timestamp: number;
  };
}

export interface PaymentMethod {
  id: string;
  type: 'mtn' | 'airtel' | 'zamtel' | 'card';
  lastFour?: string;
  isDefault: boolean;
  addedAt: number;
}

export interface Delivery {
  id: string;
  customerId: string;
  pusherId?: string;
  
  // Order Details
  pickup: {
    address: string;
    lat: number;
    lng: number;
    name?: string;
    phone?: string;
  };
  dropoff: {
    address: string;
    lat: number;
    lng: number;
    name?: string;
    phone?: string;
  };
  
  category: 'walking' | 'wheelbarrow' | 'bike' | 'truck';
  description?: string;
  specialInstructions?: string;
  
  // Pricing
  basePrice: number;
  serviceFee: number;
  platformFee: number;
  pusherEarning: number;
  totalPrice: number;
  
  // Status
  status: 'pending' | 'accepted' | 'pickup' | 'enroute' | 'delivered' | 'cancelled';
  cancelledBy?: 'customer' | 'pusher' | 'system';
  cancellationReason?: string;
  cancellationFee?: number;
  
  // Timing
  createdAt: number;
  acceptedAt?: number;
  pickedUpAt?: number;
  deliveredAt?: number;
  estimatedDuration?: number;
  actualDuration?: number;
  
  // Verification
  pickupCode?: string;
  deliveryCode?: string;
  pickupProof?: {
    photo?: string;
    timestamp: number;
  };
  deliveryProof?: {
    photo?: string;
    signature?: string;
    timestamp: number;
  };
  
  // Payment
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: string;
  paymentTransactionId?: string;
  paidAt?: number;
  
  // Rating
  customerRating?: {
    stars: number;
    comment?: string;
    tags?: string[];
    createdAt: number;
  };
  pusherRating?: {
    stars: number;
    comment?: string;
    createdAt: number;
  };
  
  // Tracking
  pusherLocationHistory?: Array<{
    lat: number;
    lng: number;
    timestamp: number;
  }>;
  
  // AI Analysis
  aiAnalysis?: string;
  aiRecommendedCategory?: string;
}

export interface FloatPackage {
  id: string;
  name: string;
  jobs: number;
  price: number;
  color: string;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface FloatPurchase {
  id: string;
  pusherId: string;
  packageId: string;
  jobsPurchased: number;
  price: number;
  paymentMethod: string;
  paymentTransactionId: string;
  status: 'pending' | 'completed' | 'failed';
  purchasedAt: number;
  completedAt?: number;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'credit' | 'debit';
  category: 'delivery' | 'float_purchase' | 'top_up' | 'withdrawal' | 'refund' | 'commission';
  amount: number;
  description: string;
  status: 'pending' | 'success' | 'failed';
  paymentMethod?: string;
  transactionId?: string;
  deliveryId?: string;
  floatPurchaseId?: string;
  createdAt: number;
  completedAt?: number;
}

export interface Review {
  id: string;
  deliveryId: string;
  reviewerId: string; // Customer or Pusher ID
  revieweeId: string; // Pusher or Customer ID
  reviewerRole: 'customer' | 'pusher';
  stars: number;
  comment?: string;
  tags?: string[];
  createdAt: number;
  updatedAt?: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'order' | 'payment' | 'system' | 'promotion';
  title: string;
  message: string;
  data?: {
    deliveryId?: string;
    transactionId?: string;
    [key: string]: any;
  };
  read: boolean;
  createdAt: number;
  readAt?: number;
}

export interface AdminSettings {
  id: 'main';
  // Pricing
  basePricing: {
    walking: number;
    wheelbarrow: number;
    bike: number;
    truck: number;
  };
  serviceFee: number;
  platformCommission: number; // Percentage (0.15 = 15%)
  
  // Float Packages
  floatPackages: FloatPackage[];
  
  // Business Rules
  minPusherRating: number;
  maxActiveDeliveries: number;
  cancellationFee: number; // Percentage
  
  // Features
  features: {
    peakPricing: boolean;
    floatExpiry: boolean;
    autoAssign: boolean;
  };
  
  updatedAt: number;
  updatedBy: string;
}

export interface Dispute {
  id: string;
  deliveryId: string;
  customerId: string;
  pusherId: string;
  type: 'payment' | 'damage' | 'wrong_item' | 'late' | 'behavior' | 'other';
  status: 'open' | 'in_review' | 'resolved' | 'closed';
  reportedBy: 'customer' | 'pusher';
  description: string;
  evidence?: string[]; // Photo URLs
  resolution?: string;
  resolvedBy?: string;
  resolvedAt?: number;
  createdAt: number;
  updatedAt: number;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userRole: 'customer' | 'pusher';
  type: 'technical' | 'payment' | 'delivery' | 'account' | 'other';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  subject: string;
  message: string;
  attachments?: string[];
  responses?: Array<{
    message: string;
    from: 'user' | 'support';
    createdAt: number;
  }>;
  assignedTo?: string;
  createdAt: number;
  updatedAt: number;
}

// Collection Names
export const COLLECTIONS = {
  users: 'users',
  customers: 'customers',
  pushers: 'pushers',
  deliveries: 'deliveries',
  floatPackages: 'float_packages',
  floatPurchases: 'float_purchases',
  transactions: 'transactions',
  reviews: 'reviews',
  notifications: 'notifications',
  adminSettings: 'admin_settings',
  disputes: 'disputes',
  supportTickets: 'support_tickets',
} as const;

// Firebase Security Rules Templates (for documentation)
export const SECURITY_RULES = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read their own data
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Customers can only see their own deliveries
    match /deliveries/{deliveryId} {
      allow read: if request.auth != null && 
        (resource.data.customerId == request.auth.uid || 
         resource.data.pusherId == request.auth.uid ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow create: if request.auth != null && 
        request.resource.data.customerId == request.auth.uid;
      allow update: if request.auth != null && 
        (resource.data.customerId == request.auth.uid || 
         resource.data.pusherId == request.auth.uid ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Pushers can only see assigned deliveries
    match /pushers/{pusherId} {
      allow read: if request.auth != null && 
        (request.auth.uid == pusherId ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow update: if request.auth != null && request.auth.uid == pusherId;
    }
    
    // Admin-only collections
    match /admin_settings/{document=**} {
      allow read, write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    match /disputes/{disputeId} {
      allow read: if request.auth != null &&
        (resource.data.customerId == request.auth.uid ||
         resource.data.pusherId == request.auth.uid ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow create: if request.auth != null;
      allow update: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
`;

