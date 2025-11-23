import React, { useState } from 'react';
import { Header, Button, Card, Badge, Sheet, Input } from '../components/UI';
import { MapPin, Camera, CheckCircle2, XCircle, Navigation2, Package, DollarSign, Clock, FileText, Upload, Shield } from 'lucide-react';

interface ActiveDelivery {
  id: string;
  pickup: string;
  dropoff: string;
  customer: {
    name: string;
    phone: string;
  };
  price: number;
  category: string;
  status: 'accepted' | 'picked_up' | 'delivered';
  pickupCode?: string;
  deliveryCode?: string;
}

export const PusherActiveDeliveryView = ({
  delivery,
  onPickup,
  onDeliver,
  onCancel
}: {
  delivery: ActiveDelivery;
  onPickup: (proof: { photo?: string; code?: string }) => void;
  onDeliver: (proof: { photo?: string; signature?: string; code?: string }) => void;
  onCancel: () => void;
}) => {
  const [step, setStep] = useState<'navigation' | 'pickup' | 'delivery'>('navigation');
  const [pickupCode, setPickupCode] = useState('');
  const [deliveryCode, setDeliveryCode] = useState('');
  const [pickupPhoto, setPickupPhoto] = useState<string | null>(null);
  const [deliveryPhoto, setDeliveryPhoto] = useState<string | null>(null);
  const [showPickupSheet, setShowPickupSheet] = useState(false);
  const [showDeliverySheet, setShowDeliverySheet] = useState(false);

  const handlePickupConfirm = () => {
    if (!pickupCode && !pickupPhoto) {
      alert('Please provide pickup code or photo');
      return;
    }
    onPickup({ photo: pickupPhoto || undefined, code: pickupCode || undefined });
    setStep('delivery');
    setShowPickupSheet(false);
    if ('vibrate' in navigator) navigator.vibrate(30);
  };

  const handleDeliveryConfirm = () => {
    if (!deliveryCode && !deliveryPhoto) {
      alert('Please provide delivery code or photo');
      return;
    }
    onDeliver({ photo: deliveryPhoto || undefined, code: deliveryCode || undefined });
    setShowDeliverySheet(false);
    if ('vibrate' in navigator) navigator.vibrate(50);
  };

  // Render Pickup Sheet as overlay
  const renderPickupSheet = () => (
    <Sheet
      isOpen={showPickupSheet}
      onClose={() => setShowPickupSheet(false)}
      title="Confirm Pickup"
      size="md"
    >
      <div className="space-y-6">
        <Card variant="outlined" className="!p-4 bg-blue-50 border-2 border-blue-200">
          <div className="flex items-start space-x-3">
            <Package className="text-pushr-blue flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-bold text-gray-900 mb-1">Pickup Verification</p>
              <p className="text-sm text-gray-600">
                Verify pickup by entering the pickup code or taking a photo of the item
              </p>
            </div>
          </div>
        </Card>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Pickup Code (Optional)
          </label>
          <Input
            value={pickupCode}
            onChange={setPickupCode}
            placeholder="Enter pickup code"
            icon={<FileText size={18} />}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Photo Proof (Optional)
          </label>
          <button
            onClick={() => {
              // Simulate photo capture
              setPickupPhoto('photo_' + Date.now());
              alert('Photo captured!');
            }}
            className="w-full p-8 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center space-y-3 hover:border-pushr-blue hover:bg-blue-50 transition-colors touch-feedback active:scale-95"
          >
            {pickupPhoto ? (
              <>
                <CheckCircle2 className="text-pushr-success" size={32} />
                <span className="font-semibold text-gray-900">Photo Captured</span>
              </>
            ) : (
              <>
                <Camera className="text-gray-400" size={32} />
                <span className="font-semibold text-gray-700">Take Photo</span>
              </>
            )}
          </button>
        </div>

        <Button
          onClick={handlePickupConfirm}
          disabled={!pickupCode && !pickupPhoto}
          icon={<CheckCircle2 size={18} />}
        >
          Confirm Pickup
        </Button>
      </div>
    </Sheet>
  );

  // Render Delivery Sheet
  const renderDeliverySheet = () => (
    <Sheet
      isOpen={showDeliverySheet}
      onClose={() => setShowDeliverySheet(false)}
      title="Confirm Delivery"
      size="md"
    >
      <div className="space-y-6">
        <Card variant="outlined" className="!p-4 bg-green-50 border-2 border-green-200">
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="text-pushr-success flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-bold text-gray-900 mb-1">Delivery Verification</p>
              <p className="text-sm text-gray-600">
                Verify delivery by entering the delivery code or taking a photo
              </p>
            </div>
          </div>
        </Card>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Delivery Code (Optional)
          </label>
          <Input
            value={deliveryCode}
            onChange={setDeliveryCode}
            placeholder="Enter delivery code"
            icon={<FileText size={18} />}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Delivery Photo
            <span className="text-xs font-normal text-gray-500 ml-2">(Requires customer permission)</span>
          </label>
          {!deliveryPhoto && (
            <Card variant="outlined" className="!p-4 bg-blue-50 border-blue-200 mb-3">
              <div className="flex items-start space-x-3">
                <Shield className="text-pushr-blue flex-shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-xs font-semibold text-gray-900 mb-1">Customer Consent Required</p>
                  <p className="text-xs text-gray-600">
                    A permission request will be sent to the customer. You can only take a photo if they approve.
                  </p>
                </div>
              </div>
            </Card>
          )}
          <button
            onClick={() => {
              // In real app, this would trigger a notification to customer
              // For now, simulate customer consent
              const customerConsented = confirm('Request permission from customer to take delivery photo?');
              if (customerConsented) {
                // Simulate customer approval
                setTimeout(() => {
                  setDeliveryPhoto('photo_' + Date.now());
                  if ('vibrate' in navigator) navigator.vibrate(20);
                  alert('Customer approved! Photo permission granted.');
                }, 1000);
              }
            }}
            disabled={!!deliveryPhoto}
            className={`w-full p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center space-y-3 transition-all touch-feedback active:scale-95 ${
              deliveryPhoto
                ? 'border-green-300 bg-green-50 cursor-not-allowed'
                : 'border-gray-300 hover:border-pushr-blue hover:bg-blue-50 cursor-pointer'
            }`}
          >
            {deliveryPhoto ? (
              <>
                <CheckCircle2 className="text-pushr-success" size={32} />
                <span className="font-semibold text-gray-900">Photo Captured</span>
                <span className="text-xs text-gray-500">Saved to delivery history</span>
              </>
            ) : (
              <>
                <Camera className="text-gray-400" size={32} />
                <span className="font-semibold text-gray-700">Request Photo Permission</span>
                <span className="text-xs text-gray-500">Customer will receive a notification</span>
              </>
            )}
          </button>
        </div>

        <div className="bg-gradient-to-r from-pushr-success/10 to-green-50 p-4 rounded-2xl border-2 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Collect Payment</p>
              <p className="text-2xl font-black text-gray-900">K{delivery.price}</p>
            </div>
            <DollarSign className="w-8 h-8 text-pushr-success" />
          </div>
        </div>

        <Button
          onClick={handleDeliveryConfirm}
          disabled={!deliveryCode && !deliveryPhoto}
          icon={<CheckCircle2 size={18} />}
          variant="success"
        >
          Complete Delivery & Collect Payment
        </Button>
      </div>
    </Sheet>
  );

  // Navigation View
  if (step === 'navigation') {
    return (
      <>
        <div className="h-screen flex flex-col bg-gray-100 relative overflow-hidden">
          {/* Map View */}
          <div className="flex-1 bg-gradient-to-br from-blue-100 to-indigo-100 relative">
            <div 
              className="absolute inset-0 opacity-20" 
              style={{ 
                backgroundImage: 'radial-gradient(#64748b 2px, transparent 2px)', 
                backgroundSize: '30px 30px' 
              }}
            />
            
            {/* Pickup Marker */}
            <div className="absolute top-20 left-10 bg-white p-3 rounded-full shadow-xl z-10">
              <MapPin className="text-pushr-danger" size={24} />
              <Badge color="red" size="sm" className="absolute -top-1 -right-1">Pickup</Badge>
            </div>

            {/* Navigation Card */}
            <div className="absolute top-4 left-4 right-4 glass rounded-2xl p-4 shadow-xl z-10">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-pushr-blue rounded-2xl flex items-center justify-center shadow-lg">
                  <Navigation2 className="text-white transform -rotate-45" size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-gray-900">Turn Right</h3>
                  <p className="text-gray-600 text-sm">in 200m on Cairo Rd</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Clock size={12} className="mr-1" /> 8 mins
                    </span>
                    <span className="flex items-center">
                      <MapPin size={12} className="mr-1" /> 2.1 km
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Sheet */}
          <div className="bg-white rounded-t-[40px] -mt-8 relative z-10 p-6 shadow-2xl">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Active Delivery</h2>
                  <Badge color="blue" className="mt-1">In Progress</Badge>
                </div>
                <span className="font-black text-2xl text-pushr-blue">K{delivery.price}</span>
              </div>

              {/* Route */}
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-2xl">
                  <div className="w-10 h-10 bg-pushr-blue rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <MapPin className="text-white" size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 font-bold uppercase mb-1">Pickup</p>
                    <p className="font-bold text-gray-900">{delivery.pickup}</p>
                    <p className="text-xs text-gray-500 mt-1">Customer: {delivery.customer.name}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-2xl">
                  <div className="w-10 h-10 bg-pushr-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <MapPin className="text-white" size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 font-bold uppercase mb-1">Dropoff</p>
                    <p className="font-bold text-gray-900">{delivery.dropoff}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  onClick={() => setShowPickupSheet(true)}
                  icon={<CheckCircle2 size={20} />}
                  variant="success"
                >
                  Confirm Pickup
                </Button>
                <Button
                  variant="outline"
                  onClick={onCancel}
                  fullWidth={false}
                  className="mx-auto"
                >
                  Cancel Delivery
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Pickup Sheet Overlay */}
        {renderPickupSheet()}
      </>
    );
  }

  // Delivery Step View
  return (
    <div className="p-4 sm:p-6 pb-32 space-y-6 animate-fade-in min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header 
        title="Delivery to Destination"
        subtitle="Confirm delivery to complete"
        onBack={() => setStep('navigation')}
      />

      <Card variant="elevated" className="!p-6">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-pushr-success to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
            <MapPin className="text-white" size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">You've Arrived!</h3>
          <p className="text-gray-600">Confirm delivery to complete this job</p>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-2xl">
            <p className="text-xs text-gray-500 font-bold uppercase mb-1">Dropoff Address</p>
            <p className="font-bold text-gray-900">{delivery.dropoff}</p>
            <p className="text-xs text-gray-500 mt-2">Customer: {delivery.customer.name}</p>
            <p className="text-xs text-gray-500">Phone: {delivery.customer.phone}</p>
          </div>

          <div className="bg-gradient-to-r from-pushr-success/10 to-green-50 p-5 rounded-2xl border-2 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Collect Cash Payment</p>
                <p className="text-2xl font-black text-gray-900">K{delivery.price}</p>
              </div>
              <DollarSign className="w-10 h-10 text-pushr-success" />
            </div>
          </div>
        </div>
      </Card>

      <Button
        onClick={() => setShowDeliverySheet(true)}
        icon={<CheckCircle2 size={20} />}
        variant="success"
      >
        Confirm Delivery
      </Button>

      {/* Delivery Sheet Overlay */}
      {renderDeliverySheet()}
    </div>
  );
};

