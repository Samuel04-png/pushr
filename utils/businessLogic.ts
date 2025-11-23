/**
 * Pushr Business Logic
 * Core business rules and calculations
 */

// Commission Structure
export const COMMISSION_CONFIG = {
  platformCommission: 0.15, // 15% platform commission
  pusherEarning: 0.85, // Pusher gets 85%
  serviceFee: 5, // Fixed service fee in ZMW
  cancellationFee: 0.20, // 20% of order value if customer cancels
};

// Float System
export const FLOAT_CONFIG = {
  minFloatToAccept: 1, // Must have at least 1 float to accept job
  floatExpiryDays: 90, // Float expires after 90 days (optional)
  floatPurchaseBonus: 0, // Bonus jobs for bulk purchases (optional)
};

// Pricing Calculations
export interface PricingBreakdown {
  basePrice: number;
  distance: number;
  category: string;
  serviceFee: number;
  platformFee: number;
  pusherEarning: number;
  total: number;
}

export const calculateDeliveryPrice = (
  basePrice: number,
  distance: number,
  category: string
): PricingBreakdown => {
  const serviceFee = COMMISSION_CONFIG.serviceFee;
  const platformFee = Math.round(basePrice * COMMISSION_CONFIG.platformCommission);
  const pusherEarning = Math.round(basePrice * COMMISSION_CONFIG.pusherEarning);
  const total = basePrice + serviceFee;

  return {
    basePrice,
    distance,
    category,
    serviceFee,
    platformFee,
    pusherEarning,
    total,
  };
};

// Pusher Validation
export const canPusherAcceptJob = (
  floatBalance: number,
  isOnline: boolean,
  activeDeliveries: number
): { canAccept: boolean; reason?: string } => {
  if (!isOnline) {
    return { canAccept: false, reason: 'You must be online to accept jobs' };
  }

  if (floatBalance < FLOAT_CONFIG.minFloatToAccept) {
    return { 
      canAccept: false, 
      reason: `You need at least ${FLOAT_CONFIG.minFloatToAccept} float to accept jobs. Please top up.` 
    };
  }

  if (activeDeliveries >= 3) {
    return { 
      canAccept: false, 
      reason: 'You have reached the maximum number of active deliveries (3)' 
    };
  }

  return { canAccept: true };
};

// Customer Validation
export const canCustomerCreateOrder = (
  hasPendingPayment: boolean,
  hasActiveDelivery: boolean
): { canCreate: boolean; reason?: string } => {
  if (hasPendingPayment) {
    return { 
      canCreate: false, 
      reason: 'You have a pending payment. Please complete payment before creating a new order.' 
    };
  }

  if (hasActiveDelivery) {
    return { 
      canCreate: false, 
      reason: 'You have an active delivery. Please wait for it to complete before creating a new order.' 
    };
  }

  return { canCreate: true };
};

// Cancellation Rules
export const calculateCancellationFee = (
  orderValue: number,
  cancelledBy: 'customer' | 'pusher' | 'system',
  timeSinceOrder: number // in minutes
): number => {
  if (cancelledBy === 'system' || timeSinceOrder < 5) {
    return 0; // No fee for system cancellations or very early cancellations
  }

  if (cancelledBy === 'pusher') {
    return 0; // Pusher cancellations don't charge customer
  }

  // Customer cancellation fee
  const fee = Math.round(orderValue * COMMISSION_CONFIG.cancellationFee);
  return Math.min(fee, orderValue * 0.5); // Cap at 50%
};

// Distance Calculation (Haversine formula)
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round((R * c) * 10) / 10; // Round to 1 decimal
};

// Auto-Assign Logic (find nearest available pusher)
export interface PusherLocation {
  pusherId: string;
  lat: number;
  lng: number;
  floatBalance: number;
  isOnline: boolean;
  activeDeliveries: number;
  rating: number;
}

export const findNearestPusher = (
  pickupLat: number,
  pickupLng: number,
  availablePushers: PusherLocation[]
): PusherLocation | null => {
  const eligiblePushers = availablePushers.filter(pusher => {
    const validation = canPusherAcceptJob(
      pusher.floatBalance,
      pusher.isOnline,
      pusher.activeDeliveries
    );
    return validation.canAccept && pusher.rating >= 4.0; // Minimum 4.0 rating
  });

  if (eligiblePushers.length === 0) {
    return null;
  }

  // Find nearest pusher
  let nearestPusher: PusherLocation | null = null;
  let minDistance = Infinity;

  eligiblePushers.forEach(pusher => {
    const distance = calculateDistance(
      pickupLat,
      pickupLng,
      pusher.lat,
      pusher.lng
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearestPusher = pusher;
    }
  });

  return nearestPusher;
};

// Peak Pricing (optional feature)
export const isPeakHours = (): boolean => {
  const hour = new Date().getHours();
  return (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19); // Morning and evening rush
};

export const applyPeakPricing = (basePrice: number): number => {
  if (isPeakHours()) {
    return Math.round(basePrice * 1.2); // 20% increase during peak hours
  }
  return basePrice;
};

// Earnings Calculation
export const calculatePusherEarnings = (
  deliveries: Array<{ price: number; commission: number }>
): {
  totalEarnings: number;
  totalDeliveries: number;
  averageEarning: number;
  platformCommission: number;
} => {
  const totalEarnings = deliveries.reduce((sum, d) => sum + d.commission, 0);
  const totalCommission = deliveries.reduce((sum, d) => sum + (d.price - d.commission), 0);
  const totalDeliveries = deliveries.length;
  const averageEarning = totalDeliveries > 0 ? totalEarnings / totalDeliveries : 0;

  return {
    totalEarnings,
    totalDeliveries,
    averageEarning: Math.round(averageEarning * 100) / 100,
    platformCommission: totalCommission,
  };
};

// Order Status Transitions
export const VALID_STATUS_TRANSITIONS: Record<string, string[]> = {
  'pending': ['accepted', 'cancelled'],
  'accepted': ['pickup', 'cancelled'],
  'pickup': ['enroute', 'cancelled'],
  'enroute': ['delivered', 'cancelled'],
  'delivered': [],
  'cancelled': [],
};

export const canTransitionStatus = (
  currentStatus: string,
  newStatus: string
): boolean => {
  const allowedTransitions = VALID_STATUS_TRANSITIONS[currentStatus] || [];
  return allowedTransitions.includes(newStatus);
};

