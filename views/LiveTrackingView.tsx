import React, { useState, useEffect } from 'react';
import { Header, Button, Card, Badge, Sheet } from '../components/UI';
import { MapPin, Phone, MessageSquare, Navigation2, Clock, Star, CheckCircle2, XCircle, Package, Camera, AlertCircle } from 'lucide-react';
import { ChatView } from './ChatView';

interface Delivery {
  id: string;
  pickup: string;
  dropoff: string;
  pusher?: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    phone: string;
    vehicle: string;
  };
  status: 'accepted' | 'pickup' | 'enroute' | 'delivered' | 'cancelled';
  estimatedArrival: number; // minutes
  price: number;
  category: string;
}

export const LiveTrackingView = ({ 
  delivery, 
  onCancel,
  onComplete 
}: { 
  delivery: Delivery;
  onCancel: () => void;
  onComplete: () => void;
}) => {
  const [timeRemaining, setTimeRemaining] = useState(delivery.estimatedArrival);
  const [showChat, setShowChat] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(delivery.status);
  const [location, setLocation] = useState({ lat: -15.3875, lng: 28.3228 }); // Lusaka coordinates

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev > 0) return prev - 1;
        return 0;
      });
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Simulate location updates
  useEffect(() => {
    const locationInterval = setInterval(() => {
      // Simulate pusher movement
      setLocation(prev => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001
      }));
    }, 5000);

    return () => clearInterval(locationInterval);
  }, []);

  const getStatusBadge = () => {
    switch (currentStatus) {
      case 'accepted':
        return <Badge color="blue">Pusher Assigned</Badge>;
      case 'pickup':
        return <Badge color="yellow">Picking Up</Badge>;
      case 'enroute':
        return <Badge color="green">On The Way</Badge>;
      case 'delivered':
        return <Badge color="green">Delivered</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="relative h-screen bg-gray-100 overflow-hidden">
      {/* Full Screen Map */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100">
        {/* Map Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-20" 
          style={{ 
            backgroundImage: 'radial-gradient(#64748b 2px, transparent 2px)', 
            backgroundSize: '30px 30px' 
          }}
        />
        
        {/* Pickup Marker */}
        <div className="absolute top-20 left-10 bg-white p-3 rounded-full shadow-xl animate-bounce-slow z-10">
          <MapPin className="text-pushr-danger" size={24} />
          <div className="absolute -top-1 -right-1">
            <Badge color="red" size="sm">Pickup</Badge>
          </div>
        </div>
        
        {/* Dropoff Marker */}
        <div className="absolute bottom-1/4 right-10 bg-white p-3 rounded-full shadow-xl animate-bounce-slow z-10" style={{ animationDelay: '0.5s' }}>
          <MapPin className="text-pushr-success" size={24} />
          <div className="absolute -top-1 -right-1">
            <Badge color="green" size="sm">Dropoff</Badge>
          </div>
        </div>

        {/* Pusher Marker */}
        {currentStatus === 'enroute' && (
          <div 
            className="absolute bg-pushr-blue p-3 rounded-full shadow-xl z-20 transition-all duration-500"
            style={{
              left: '40%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <Navigation2 className="text-white" size={24} />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-pushr-success rounded-full border-2 border-white animate-pulse"></div>
          </div>
        )}

        {/* Route Line */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <path 
            d="M 60 120 Q 200 300 300 500" 
            stroke="#4489F7" 
            strokeWidth="6" 
            fill="none" 
            strokeDasharray="12,12" 
            className="animate-pulse"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Top Bar */}
      <div className="absolute top-4 left-4 right-4 z-30">
        <div className="flex items-center justify-between">
          <button
            onClick={onCancel}
            className="p-3 bg-white/95 backdrop-blur-md rounded-full shadow-xl active:scale-95 transition-transform touch-feedback"
          >
            <XCircle size={20} className="text-gray-700" />
          </button>
          {getStatusBadge()}
        </div>
      </div>

      {/* Bottom Sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[40px] shadow-2xl z-20 animate-slide-up">
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-3 mb-6"></div>
        
        <div className="px-6 pb-8 space-y-6">
          {/* Status Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {currentStatus === 'accepted' && 'Pusher Assigned'}
                {currentStatus === 'pickup' && 'Picking Up Your Item'}
                {currentStatus === 'enroute' && `Arriving in ${timeRemaining} min${timeRemaining !== 1 ? 's' : ''}`}
                {currentStatus === 'delivered' && 'Delivery Complete!'}
              </h2>
              <p className="text-gray-500 font-medium mt-1">
                {currentStatus === 'accepted' && 'Your pusher is heading to pickup location'}
                {currentStatus === 'pickup' && 'Pusher is collecting your item'}
                {currentStatus === 'enroute' && 'Pusher is on the way to you'}
                {currentStatus === 'delivered' && 'Your delivery has been completed'}
              </p>
            </div>
            {timeRemaining > 0 && currentStatus === 'enroute' && (
              <div className="w-16 h-16 bg-gradient-to-br from-pushr-success to-green-600 text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-xl shadow-green-500/30">
                {timeRemaining}m
              </div>
            )}
          </div>

          {/* Pusher Card */}
          {delivery.pusher && (
            <Card variant="elevated" className="!p-5">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img 
                    src={delivery.pusher.avatar} 
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-pushr-blue/20 shadow-md"
                    alt={delivery.pusher.name}
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-pushr-success rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 text-lg">{delivery.pusher.name}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-semibold text-gray-700">{delivery.pusher.rating}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-600">{delivery.pusher.vehicle}</span>
                  </div>
                  <div className="mt-2">
                    <Badge color="green" size="sm">Online</Badge>
                  </div>
                </div>
                <div className="flex space-x-2 flex-shrink-0">
                  <button
                    onClick={() => {
                      if ('vibrate' in navigator) navigator.vibrate(20);
                      alert(`Calling ${delivery.pusher.name}...`);
                    }}
                    className="w-12 h-12 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200 transition-colors touch-feedback active:scale-95"
                  >
                    <Phone size={20} />
                  </button>
                  <button
                    onClick={() => {
                      setShowChat(true);
                      if ('vibrate' in navigator) navigator.vibrate(10);
                    }}
                    className="w-12 h-12 rounded-2xl bg-pushr-blue text-white flex items-center justify-center shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-colors touch-feedback active:scale-95"
                  >
                    <MessageSquare size={20} />
                  </button>
                </div>
              </div>
            </Card>
          )}

          {/* Route Info */}
          <div className="space-y-3">
            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-2xl">
              <div className="w-10 h-10 bg-pushr-blue rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <MapPin className="text-white" size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Pickup</p>
                <p className="font-bold text-gray-900">{delivery.pickup}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-2xl">
              <div className="w-10 h-10 bg-pushr-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <MapPin className="text-white" size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Dropoff</p>
                <p className="font-bold text-gray-900">{delivery.dropoff}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onCancel}
              fullWidth={false}
              disabled={currentStatus === 'delivered'}
            >
              Cancel
            </Button>
            <Button
              className="flex-[2]"
              onClick={() => {
                if (currentStatus === 'delivered') {
                  onComplete();
                } else {
                  setShowChat(true);
                }
              }}
              icon={currentStatus === 'delivered' ? <CheckCircle2 size={18} /> : <MessageSquare size={18} />}
              fullWidth={false}
            >
              {currentStatus === 'delivered' ? 'Complete' : 'Chat'}
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Sheet */}
      {showChat && delivery.pusher && (
        <Sheet
          isOpen={showChat}
          onClose={() => setShowChat(false)}
          title={`Chat with ${delivery.pusher.name}`}
          size="full"
        >
          <ChatView 
            user={delivery.pusher as any} 
            onBack={() => setShowChat(false)} 
          />
        </Sheet>
      )}
    </div>
  );
};

