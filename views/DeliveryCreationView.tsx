import React, { useState } from 'react';
import { User, CATEGORIES, CategoryId } from '../types';
import { Button, Card, Input, Badge, Sheet, Header } from '../components/UI';
import { MapPin, Package, Clock, DollarSign, FileText, AlertCircle, CheckCircle2, ArrowRight, Plus, X } from 'lucide-react';

interface DeliveryDetails {
  pickup: string;
  dropoff: string;
  category: CategoryId;
  description: string;
  receiverName?: string;
  receiverPhone?: string;
  specialInstructions?: string;
  estimatedPrice: number;
  estimatedTime: number;
  estimatedDistance: number;
}

export const DeliveryCreationView = ({ 
  user, 
  onConfirm, 
  onCancel 
}: { 
  user: User;
  onConfirm: (details: DeliveryDetails) => void;
  onCancel: () => void;
}) => {
  const [step, setStep] = useState<'location' | 'details' | 'summary'>('location');
  const [delivery, setDelivery] = useState<Partial<DeliveryDetails>>({
    pickup: '',
    dropoff: '',
    category: 'bike',
    description: '',
    receiverName: '',
    receiverPhone: '',
    specialInstructions: '',
  });

  const [pricing, setPricing] = useState({
    basePrice: 45,
    distance: 5.2,
    time: 15,
    serviceFee: 5,
    total: 50
  });

  const selectedCategory = CATEGORIES.find(c => c.id === delivery.category);

  const calculatePricing = () => {
    if (!delivery.pickup || !delivery.dropoff) return;
    
    // Simulate price calculation based on distance and category
    const basePrice = selectedCategory?.basePrice || 45;
    const distance = 5.2; // Would come from maps API
    const time = Math.ceil(distance * 3); // Estimate
    const serviceFee = Math.round(basePrice * 0.1);
    const total = basePrice + serviceFee;

    setPricing({
      basePrice,
      distance,
      time,
      serviceFee,
      total
    });

    setDelivery(prev => ({
      ...prev,
      estimatedPrice: total,
      estimatedTime: time,
      estimatedDistance: distance
    }));
  };

  React.useEffect(() => {
    if (delivery.pickup && delivery.dropoff && delivery.category) {
      calculatePricing();
    }
  }, [delivery.pickup, delivery.dropoff, delivery.category]);

  // Location Step
  if (step === 'location') {
    return (
      <div className="p-4 sm:p-6 pb-32 space-y-6 animate-fade-in min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header 
          title="Create Delivery"
          subtitle="Step 1 of 3: Locations"
          onBack={onCancel}
        />

        <Card variant="elevated" className="!p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center">
            <MapPin className="w-5 h-5 text-pushr-blue mr-2" />
            Pickup Location
          </h3>
          <Input
            label="Pickup Address"
            value={delivery.pickup || ''}
            onChange={(val) => setDelivery({...delivery, pickup: val})}
            placeholder="Enter pickup address"
            icon={<MapPin size={18} />}
            helperText="Where should we pick up the item?"
          />
          <button className="w-full mt-2 text-sm font-semibold text-pushr-blue flex items-center justify-center">
            <MapPin size={14} className="mr-1" />
            Use Current Location
          </button>
        </Card>

        <Card variant="elevated" className="!p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center">
            <MapPin className="w-5 h-5 text-pushr-accent mr-2" />
            Dropoff Location
          </h3>
          <Input
            label="Delivery Address"
            value={delivery.dropoff || ''}
            onChange={(val) => setDelivery({...delivery, dropoff: val})}
            placeholder="Enter delivery address"
            icon={<MapPin size={18} />}
            helperText="Where should we deliver the item?"
          />
        </Card>

        <Card variant="elevated" className="!p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center">
            <Package className="w-5 h-5 text-pushr-blue mr-2" />
            What are you sending?
          </h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setDelivery({...delivery, category: cat.id as CategoryId})}
                className={`p-4 rounded-2xl border-2 transition-all touch-feedback active:scale-95 ${
                  delivery.category === cat.id
                    ? 'border-pushr-blue bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <p className="font-bold text-gray-900 text-sm mb-1">{cat.name}</p>
                <p className="text-xs text-gray-500 mb-2">{cat.limit}</p>
                <p className="text-xs font-bold text-pushr-blue">K{cat.basePrice}+</p>
              </button>
            ))}
          </div>
          <textarea
            value={delivery.description || ''}
            onChange={(e) => setDelivery({...delivery, description: e.target.value})}
            placeholder="Describe the item (e.g., Small package, documents, food)"
            rows={3}
            className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-pushr-blue focus:ring-2 focus:ring-pushr-blue/20 outline-none resize-none"
          />
        </Card>

        {pricing.total > 0 && (
          <Card className="!p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Estimated Cost</p>
                <p className="text-2xl font-black text-pushr-blue">K{pricing.total}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">~{pricing.time} mins</p>
                <p className="text-xs text-gray-500">{pricing.distance} km</p>
              </div>
            </div>
          </Card>
        )}

        <Button
          onClick={() => {
            if (delivery.pickup && delivery.dropoff && delivery.category) {
              setStep('details');
            }
          }}
          disabled={!delivery.pickup || !delivery.dropoff || !delivery.category}
          icon={<ArrowRight size={20} />}
        >
          Continue to Details
        </Button>
      </div>
    );
  }

  // Details Step
  if (step === 'details') {
    return (
      <div className="p-4 sm:p-6 pb-32 space-y-6 animate-fade-in min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header 
          title="Delivery Details"
          subtitle="Step 2 of 3: Additional Info"
          onBack={() => setStep('location')}
        />

        <Card variant="elevated" className="!p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center">
            <FileText className="w-5 h-5 text-pushr-blue mr-2" />
            Receiver Information (Optional)
          </h3>
          <Input
            label="Receiver Name"
            value={delivery.receiverName || ''}
            onChange={(val) => setDelivery({...delivery, receiverName: val})}
            placeholder="Name of person receiving"
          />
          <Input
            label="Receiver Phone"
            value={delivery.receiverPhone || ''}
            onChange={(val) => setDelivery({...delivery, receiverPhone: val})}
            placeholder="+260 XXX XXX XXX"
            type="tel"
          />
        </Card>

        <Card variant="elevated" className="!p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 text-pushr-accent mr-2" />
            Special Instructions
          </h3>
          <textarea
            value={delivery.specialInstructions || ''}
            onChange={(e) => setDelivery({...delivery, specialInstructions: e.target.value})}
            placeholder="Any special instructions for the pusher? (e.g., Call before arriving, Leave at gate, Fragile)"
            rows={4}
            className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-pushr-blue focus:ring-2 focus:ring-pushr-blue/20 outline-none resize-none"
          />
        </Card>

        <Button
          onClick={() => setStep('summary')}
          icon={<ArrowRight size={20} />}
        >
          Review Order
        </Button>
      </div>
    );
  }

  // Summary Step
  return (
    <div className="p-4 sm:p-6 pb-32 space-y-6 animate-fade-in min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header 
        title="Order Summary"
        subtitle="Step 3 of 3: Review & Confirm"
        onBack={() => setStep('details')}
      />

      {/* Route Preview */}
      <Card variant="elevated" className="!p-0 overflow-hidden">
        <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative">
          {/* Map placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-pushr-blue mx-auto mb-2" />
              <p className="text-sm text-gray-600 font-medium">Route Preview</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-pushr-blue rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Pickup</p>
                <p className="font-bold text-gray-900">{delivery.pickup}</p>
              </div>
            </div>
            
            <div className="w-px h-6 bg-gray-300 ml-4"></div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-pushr-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Dropoff</p>
                <p className="font-bold text-gray-900">{delivery.dropoff}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Order Details */}
      <Card variant="elevated" className="!p-6">
        <h3 className="font-bold text-lg mb-4">Order Details</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Service Type</span>
            <Badge color="blue">{selectedCategory?.name}</Badge>
          </div>
          {delivery.description && (
            <div className="flex justify-between items-start">
              <span className="text-gray-600 font-medium">Description</span>
              <span className="text-gray-900 text-sm text-right max-w-[60%]">{delivery.description}</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Distance</span>
            <span className="text-gray-900 font-semibold">{pricing.distance} km</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Estimated Time</span>
            <span className="text-gray-900 font-semibold">~{pricing.time} mins</span>
          </div>
        </div>
      </Card>

      {/* Pricing Breakdown */}
      <Card variant="elevated" className="!p-6">
        <h3 className="font-bold text-lg mb-4">Pricing Breakdown</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Base Price</span>
            <span className="text-gray-900 font-semibold">K{pricing.basePrice}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Service Fee</span>
            <span className="text-gray-900 font-semibold">K{pricing.serviceFee}</span>
          </div>
          <div className="h-px bg-gray-200 my-2"></div>
          <div className="flex justify-between items-center">
            <span className="text-gray-900 font-bold text-lg">Total</span>
            <span className="text-pushr-blue font-black text-2xl">K{pricing.total}</span>
          </div>
        </div>
      </Card>

      {/* Payment Method */}
      <Card variant="elevated" className="!p-6">
        <h3 className="font-bold text-lg mb-4 flex items-center">
          <DollarSign className="w-5 h-5 text-pushr-blue mr-2" />
          Payment Method
        </h3>
        <div className="space-y-2">
          {['MTN Money', 'Airtel Money', 'Zamtel Money', 'Card'].map((method, idx) => (
            <button
              key={idx}
              className={`w-full p-4 rounded-2xl border-2 text-left transition-all touch-feedback active:scale-95 ${
                idx === 0
                  ? 'border-pushr-blue bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">{method}</span>
                {idx === 0 && <CheckCircle2 className="text-pushr-blue" size={20} />}
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          onClick={() => {
            if (delivery.pickup && delivery.dropoff && delivery.category && pricing.total) {
              onConfirm({
                ...delivery as DeliveryDetails,
                estimatedPrice: pricing.total,
                estimatedTime: pricing.time,
                estimatedDistance: pricing.distance
              });
            }
          }}
          icon={<CheckCircle2 size={20} />}
        >
          Confirm & Pay K{pricing.total}
        </Button>
        <Button
          variant="ghost"
          onClick={onCancel}
          fullWidth={false}
          className="mx-auto"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

