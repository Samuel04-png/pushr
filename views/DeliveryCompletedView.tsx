import React, { useState } from 'react';
import { Header, Button, Card, Badge, StatCard } from '../components/UI';
import { CheckCircle2, Star, Download, Share2, Receipt, MapPin, Clock, DollarSign, Package, ArrowRight } from 'lucide-react';
import { RatingModal } from '../components/RatingModal';

interface CompletedDelivery {
  id: string;
  pickup: string;
  dropoff: string;
  pusher: {
    name: string;
    avatar: string;
    rating: number;
  };
  completedAt: string;
  price: number;
  category: string;
  distance: number;
  duration: number;
}

export const DeliveryCompletedView = ({
  delivery,
  onRate,
  onShare,
  onViewReceipt,
  onNewDelivery
}: {
  delivery: CompletedDelivery;
  onRate?: (rating: { stars: number; comment: string; tags?: string[] }) => void;
  onShare?: () => void;
  onViewReceipt?: () => void;
  onNewDelivery?: () => void;
}) => {
  const [showRating, setShowRating] = useState(false);
  const [hasRated, setHasRated] = useState(false);

  const handleRate = (rating: { stars: number; comment: string; tags?: string[] }) => {
    setShowRating(false);
    setHasRated(true);
    onRate?.(rating);
    if ('vibrate' in navigator) navigator.vibrate(30);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-32 animate-fade-in">
      {/* Success Header */}
      <div className="bg-gradient-to-br from-pushr-success to-green-600 p-8 pb-16 text-white relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-in">
            <CheckCircle2 size={48} className="text-white" />
          </div>
          <h1 className="text-3xl font-black mb-2">Delivery Complete!</h1>
          <p className="text-white/90 font-medium">Thank you for using Pushr</p>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6 -mt-8 relative z-10">
        {/* Delivery Summary Card */}
        <Card variant="elevated" className="!p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-gray-500 font-medium">Order #{delivery.id}</p>
              <p className="text-xs text-gray-400 mt-1">Completed {delivery.completedAt}</p>
            </div>
            <Badge color="green" size="lg">Delivered</Badge>
          </div>

          {/* Route */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-8 h-8 bg-pushr-blue rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <MapPin className="text-white" size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">From</p>
                <p className="font-bold text-gray-900 text-sm">{delivery.pickup}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-8 h-8 bg-pushr-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <MapPin className="text-white" size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">To</p>
                <p className="font-bold text-gray-900 text-sm">{delivery.dropoff}</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-gray-100">
            <div className="text-center">
              <Clock className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-xs text-gray-500 mb-1">Duration</p>
              <p className="font-bold text-gray-900">{delivery.duration} min</p>
            </div>
            <div className="text-center">
              <MapPin className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-xs text-gray-500 mb-1">Distance</p>
              <p className="font-bold text-gray-900">{delivery.distance} km</p>
            </div>
            <div className="text-center">
              <Package className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-xs text-gray-500 mb-1">Category</p>
              <p className="font-bold text-gray-900 text-xs">{delivery.category}</p>
            </div>
          </div>
        </Card>

        {/* Pusher Card */}
        <Card variant="elevated" className="!p-5">
          <p className="text-sm text-gray-500 font-medium mb-3">Delivered By</p>
          <div className="flex items-center space-x-4">
            <img 
              src={delivery.pusher.avatar} 
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-pushr-blue/20"
              alt={delivery.pusher.name}
            />
            <div className="flex-1">
              <h4 className="font-bold text-gray-900">{delivery.pusher.name}</h4>
              <div className="flex items-center space-x-1 mt-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-semibold text-gray-700">{delivery.pusher.rating}</span>
              </div>
            </div>
            {!hasRated && (
              <Button
                variant="outline"
                size="sm"
                fullWidth={false}
                onClick={() => setShowRating(true)}
                icon={<Star size={16} />}
              >
                Rate
              </Button>
            )}
          </div>
        </Card>

        {/* Payment Summary */}
        <Card variant="elevated" className="!p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600 font-medium">Total Paid</p>
            <DollarSign className="w-6 h-6 text-pushr-blue" />
          </div>
          <p className="text-4xl font-black text-pushr-blue mb-4">K{delivery.price}.00</p>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              fullWidth={false}
              onClick={onViewReceipt}
              icon={<Receipt size={16} />}
              className="flex-1"
            >
              Receipt
            </Button>
            <Button
              variant="ghost"
              size="sm"
              fullWidth={false}
              onClick={onShare}
              icon={<Share2 size={16} />}
              className="flex-1"
            >
              Share
            </Button>
          </div>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          {!hasRated && (
            <Button
              onClick={() => setShowRating(true)}
              icon={<Star size={20} />}
              variant="secondary"
            >
              Rate Your Delivery
            </Button>
          )}
          <Button
            onClick={onNewDelivery}
            icon={<ArrowRight size={20} />}
          >
            Order Another Delivery
          </Button>
        </div>
      </div>

      {/* Rating Modal */}
      {showRating && (
        <RatingModal
          isOpen={showRating}
          onClose={() => setShowRating(false)}
          onSubmit={handleRate}
          pusherName={delivery.pusher.name}
        />
      )}
    </div>
  );
};

