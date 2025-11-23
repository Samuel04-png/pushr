import React, { useState } from 'react';
import { User, MOCK_FLOAT_PACKAGES, FloatPackage } from '../types';
import { Button, Card, Badge, Header, Sheet, Input, Alert } from '../components/UI';
import { Zap, CheckCircle2, CreditCard, DollarSign, AlertCircle, Lock, Sparkles, ArrowRight } from 'lucide-react';
import { PaymentSuccessView, PaymentFailedView } from './PaymentResultView';

const PAYMENT_METHODS = [
  { id: 'mtn', name: 'MTN Money', icon: '💛', color: 'bg-yellow-400', textColor: 'text-yellow-900' },
  { id: 'airtel', name: 'Airtel Money', icon: '❤️', color: 'bg-red-500', textColor: 'text-white' },
  { id: 'zamtel', name: 'Zamtel Money', icon: '💙', color: 'bg-blue-500', textColor: 'text-white' },
  { id: 'card', name: 'Debit/Credit Card', icon: '💳', color: 'bg-purple-500', textColor: 'text-white' },
];

interface FloatPurchaseViewProps {
  user: User;
  currentBalance: number;
  onPurchase: (packageId: string, paymentMethod: string) => Promise<{ success: boolean; transactionId?: string; error?: string }>;
  onBack: () => void;
}

export const FloatPurchaseView = ({
  user,
  currentBalance,
  onPurchase,
  onBack
}: FloatPurchaseViewProps) => {
  const [selectedPackage, setSelectedPackage] = useState<FloatPackage | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);
  const [showPaymentResult, setShowPaymentResult] = useState<'success' | 'failed' | null>(null);
  const [processing, setProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState<any>(null);

  const handleSelectPackage = (pkg: FloatPackage) => {
    setSelectedPackage(pkg);
    setShowPaymentSheet(true);
    if ('vibrate' in navigator) navigator.vibrate(10);
  };

  const handlePurchase = async () => {
    if (!selectedPackage || !selectedPayment) {
      alert('Please select a package and payment method');
      return;
    }

    setProcessing(true);
    
    try {
      const result = await onPurchase(selectedPackage.id, selectedPayment);
      
      if (result.success) {
        setPaymentResult({
          success: true,
          amount: selectedPackage.price,
          paymentMethod: PAYMENT_METHODS.find(p => p.id === selectedPayment)?.name || selectedPayment,
          transactionId: result.transactionId,
          orderId: selectedPackage.id
        });
        setShowPaymentResult('success');
        setShowPaymentSheet(false);
      } else {
        setPaymentResult({
          success: false,
          amount: selectedPackage.price,
          paymentMethod: PAYMENT_METHODS.find(p => p.id === selectedPayment)?.name || selectedPayment,
          message: result.error || 'Payment failed. Please try again.'
        });
        setShowPaymentResult('failed');
        setShowPaymentSheet(false);
      }
    } catch (error: any) {
      setPaymentResult({
        success: false,
        amount: selectedPackage.price,
        paymentMethod: PAYMENT_METHODS.find(p => p.id === selectedPayment)?.name || selectedPayment,
        message: error.message || 'Payment failed. Please try again.'
      });
      setShowPaymentResult('failed');
      setShowPaymentSheet(false);
    } finally {
      setProcessing(false);
    }
  };

  if (showPaymentResult === 'success' && paymentResult) {
    return (
      <PaymentSuccessView
        result={paymentResult}
        onGoHome={onBack}
        onViewReceipt={() => alert('Receipt view coming soon')}
      />
    );
  }

  if (showPaymentResult === 'failed' && paymentResult) {
    return (
      <PaymentFailedView
        result={paymentResult}
        onRetry={() => {
          setShowPaymentResult(null);
          setShowPaymentSheet(true);
        }}
        onCancel={onBack}
      />
    );
  }

  return (
    <div className="p-4 sm:p-6 pb-32 space-y-6 animate-fade-in min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header 
        title="Purchase Float"
        subtitle="Buy job credits to accept deliveries"
        onBack={onBack}
      />

      {/* Current Balance */}
      <Card variant="elevated" className="!p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-pushr-blue/20 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-400 font-medium text-sm uppercase tracking-wider flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              Current Balance
            </p>
            {currentBalance < 3 && (
              <Badge color="orange" variant="outlined" size="sm">Low</Badge>
            )}
          </div>
          <h2 className={`text-5xl sm:text-6xl font-black mb-2 transition-colors ${
            currentBalance < 3 ? 'text-pushr-danger animate-pulse' : ''
          }`}>
            {currentBalance}
          </h2>
          <p className="text-gray-400 font-medium">jobs remaining</p>
        </div>
      </Card>

      {currentBalance < 3 && (
        <Alert
          type="warning"
          title="Low Balance"
          message="You need more float to accept new deliveries. Top up now!"
        />
      )}

      {/* Float Packages */}
      <div>
        <h3 className="font-bold text-lg mb-4 text-gray-900">Float Packages</h3>
        <div className="space-y-4">
          {MOCK_FLOAT_PACKAGES.map((pkg, idx) => {
            const isPopular = pkg.id === 'pro';
            const pricePerJob = (pkg.price / pkg.jobs).toFixed(2);
            
            return (
              <button
                key={pkg.id}
                onClick={() => handleSelectPackage(pkg)}
                className={`w-full p-5 rounded-3xl border-2 transition-all touch-feedback active:scale-98 ${
                  isPopular
                    ? 'border-pushr-accent bg-gradient-to-r from-yellow-50 to-orange-50 shadow-xl shadow-pushr-accent/20 relative overflow-hidden'
                    : 'border-gray-200 bg-white hover:border-pushr-blue hover:shadow-lg'
                }`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {isPopular && (
                  <div className="absolute top-2 right-2">
                    <Badge color="orange" size="sm">
                      <Sparkles size={8} className="mr-1" />
                      Popular
                    </Badge>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div className={`w-16 h-16 ${pkg.color} rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0`}>
                      {pkg.jobs}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-lg sm:text-xl text-gray-900 flex items-center">
                        {pkg.name}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">K{pricePerJob} per job</p>
                      {isPopular && (
                        <Badge color="green" size="sm" className="mt-2">Best Value</Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-4 flex-shrink-0">
                    <span className="block font-bold text-xl sm:text-2xl text-gray-900">K{pkg.price}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Payment Sheet */}
      {selectedPackage && (
        <Sheet
          isOpen={showPaymentSheet}
          onClose={() => {
            setShowPaymentSheet(false);
            setSelectedPackage(null);
            setSelectedPayment(null);
          }}
          title="Complete Purchase"
          size="md"
        >
          <div className="space-y-6">
            {/* Package Summary */}
            <Card variant="outlined" className="!p-5 bg-blue-50 border-2 border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-bold text-gray-900 text-lg">{selectedPackage.name}</p>
                  <p className="text-sm text-gray-600">{selectedPackage.jobs} jobs</p>
                </div>
                <div className="w-12 h-12 bg-pushr-blue rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {selectedPackage.jobs}
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-blue-200">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-2xl font-black text-pushr-blue">K{selectedPackage.price}</span>
              </div>
            </Card>

            {/* Payment Methods */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select Payment Method
              </label>
              <div className="space-y-2">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => {
                      setSelectedPayment(method.id);
                      if ('vibrate' in navigator) navigator.vibrate(10);
                    }}
                    className={`w-full p-4 rounded-2xl border-2 transition-all touch-feedback active:scale-98 ${
                      selectedPayment === method.id
                        ? 'border-pushr-blue bg-blue-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${method.color} rounded-xl flex items-center justify-center text-lg shadow-md`}>
                          {method.icon}
                        </div>
                        <span className="font-semibold text-gray-900">{method.name}</span>
                      </div>
                      {selectedPayment === method.id && (
                        <CheckCircle2 className="text-pushr-blue" size={20} />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Security Notice */}
            <Card variant="outlined" className="!p-4 bg-gray-50 border border-gray-200">
              <div className="flex items-start space-x-3">
                <Lock className="text-gray-600 flex-shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">Secure Payment</p>
                  <p className="text-xs text-gray-600">
                    Your payment is processed securely. Your float will be added instantly after payment confirmation.
                  </p>
                </div>
              </div>
            </Card>

            {/* Purchase Button */}
            <Button
              onClick={handlePurchase}
              disabled={!selectedPayment || processing}
              isLoading={processing}
              icon={<DollarSign size={18} />}
            >
              {processing ? 'Processing...' : `Pay K${selectedPackage.price}`}
            </Button>
          </div>
        </Sheet>
      )}
    </div>
  );
};

