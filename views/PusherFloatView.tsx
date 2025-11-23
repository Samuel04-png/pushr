import React, { useState } from 'react';
import { User, MOCK_FLOAT_PACKAGES } from '../types';
import { Button, Card, Badge, Alert, StatCard, Sheet } from '../components/UI';
import { AppBar } from '../components/AppBar';
import { Zap, DollarSign, TrendingUp, ArrowDown, ArrowRight, Sparkles, CreditCard, CheckCircle2 } from 'lucide-react';
import { FloatPurchaseView } from './FloatPurchaseView';

interface PusherFloatViewProps {
  user: User;
  floatBalance: number;
  earnings: {
    available: number;
    pending: number;
    total: number;
  };
  onBuyFloat: () => void;
  onWithdrawEarnings: () => void;
}

export const PusherFloatView = ({
  user,
  floatBalance,
  earnings,
  onBuyFloat,
  onWithdrawEarnings,
}: PusherFloatViewProps) => {
  const [showBuyFloat, setShowBuyFloat] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  const handleBuyFloat = async () => {
    setShowBuyFloat(true);
  };

  const handleWithdraw = async () => {
    if (earnings.available <= 0) {
      alert('No earnings available for withdrawal');
      return;
    }
    setShowWithdraw(true);
  };

  // Float Purchase View
  if (showBuyFloat) {
    return (
      <FloatPurchaseView
        user={user}
        currentBalance={floatBalance}
        onPurchase={async (packageId, paymentMethod) => {
          // Simulate purchase
          await new Promise(resolve => setTimeout(resolve, 1000));
          setShowBuyFloat(false);
          onBuyFloat();
          return { success: true, transactionId: 'TXN' + Date.now() };
        }}
        onBack={() => setShowBuyFloat(false)}
      />
    );
  }

  // Withdraw Earnings View
  if (showWithdraw) {
    return (
      <div className="p-4 sm:p-6 pb-32 space-y-6 animate-fade-in min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header
          title="Withdraw Earnings"
          subtitle="Transfer earnings to your account"
          onBack={() => setShowWithdraw(false)}
        />

        <Card variant="elevated" className="!p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-pushr-success rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="text-white" size={32} />
            </div>
            <p className="text-sm text-gray-600 font-medium mb-2">Available Earnings</p>
            <p className="text-4xl font-black text-gray-900">K{earnings.available}</p>
          </div>
        </Card>

        <Card variant="elevated" className="!p-6">
          <h3 className="font-bold text-lg mb-4">Withdrawal Method</h3>
          <div className="space-y-3">
            {['MTN Money', 'Airtel Money', 'Zamtel Money', 'Bank Transfer'].map((method, idx) => (
              <button
                key={idx}
                className="w-full p-4 rounded-2xl border-2 border-gray-200 bg-white hover:border-pushr-blue hover:bg-blue-50 transition-all touch-feedback active:scale-98 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <CreditCard className="text-gray-400" size={20} />
                  <span className="font-semibold text-gray-900">{method}</span>
                </div>
                <ArrowRight className="text-gray-400" size={18} />
              </button>
            ))}
          </div>
        </Card>

        <Card variant="outlined" className="!p-4 bg-blue-50 border-2 border-blue-200">
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="text-pushr-blue flex-shrink-0 mt-0.5" size={18} />
            <div>
              <p className="font-semibold text-gray-900 text-sm mb-1">Withdrawal Processing</p>
              <p className="text-xs text-gray-600">
                Withdrawals typically take 1-3 business days to process. A small processing fee may apply.
              </p>
            </div>
          </div>
        </Card>

        <Button
          onClick={() => {
            alert(`Withdrawing K${earnings.available}...`);
            onWithdrawEarnings();
            setShowWithdraw(false);
          }}
          disabled={earnings.available <= 0}
          icon={<ArrowDown size={18} />}
        >
          Withdraw K{earnings.available}
        </Button>
      </div>
    );
  }

  // Main Float View
  return (
    <div className="p-4 sm:p-6 pb-32 space-y-6 animate-fade-in min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <AppBar
        title="Float & Earnings"
        subtitle="Manage your float and earnings"
        showBack={false}
        showLogout={false}
      />

      {/* Float Balance Card */}
      <Card variant="elevated" className="!p-6 sm:!p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-pushr-blue/20 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-pushr-accent" />
              <span className="text-gray-400 font-medium text-sm uppercase tracking-wider">Float Balance</span>
            </div>
            {floatBalance < 3 && (
              <Badge color="orange" variant="outlined" size="sm">Low</Badge>
            )}
          </div>
          <div className="flex items-end justify-between mb-6">
            <h2 className={`text-5xl sm:text-6xl font-black transition-colors duration-300 ${
              floatBalance < 3 ? 'text-pushr-danger animate-pulse' : floatBalance < 5 ? 'text-pushr-warning' : ''
            }`}>
              {floatBalance}
            </h2>
            <span className="text-gray-400 text-sm sm:text-base mb-2">jobs remaining</span>
          </div>
          
          {floatBalance < 3 && (
            <Alert
              type="warning"
              message="Low balance! Purchase more float to continue accepting jobs."
              className="mt-4 !bg-yellow-900/20 !border-yellow-600/50"
            />
          )}
        </div>
      </Card>

      {/* Earnings Card */}
      <Card variant="elevated" className="!p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-pushr-success rounded-xl flex items-center justify-center">
              <DollarSign className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Earnings</p>
              <p className="text-2xl font-black text-gray-900">K{earnings.total}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-green-200">
          <div>
            <p className="text-xs text-gray-600 mb-1">Available</p>
            <p className="text-xl font-black text-gray-900">K{earnings.available}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Pending</p>
            <p className="text-xl font-black text-gray-600">K{earnings.pending}</p>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          title="Jobs Completed"
          value="142"
          icon={<TrendingUp size={18} />}
          color="blue"
        />
        <StatCard
          title="Average/Job"
          value="K88"
          icon={<DollarSign size={18} />}
          color="green"
        />
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          onClick={handleBuyFloat}
          icon={<Zap size={20} />}
          variant="secondary"
        >
          Buy Float
        </Button>

        <Button
          onClick={handleWithdraw}
          disabled={earnings.available <= 0}
          icon={<ArrowDown size={20} />}
          variant="outline"
        >
          Withdraw Earnings
        </Button>
      </div>

      {/* Float Packages Preview */}
      <Card variant="elevated" className="!p-6">
        <h3 className="font-bold text-lg mb-4">Float Packages</h3>
        <div className="space-y-3">
          {MOCK_FLOAT_PACKAGES.slice(0, 2).map((pkg) => (
            <div
              key={pkg.id}
              className="p-4 rounded-2xl border-2 border-gray-200 bg-white hover:border-gray-300 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${pkg.color} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                    {pkg.jobs}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{pkg.name}</p>
                    <p className="text-sm text-gray-500">K{(pkg.price / pkg.jobs).toFixed(2)} per job</p>
                  </div>
                </div>
                <span className="font-black text-xl text-gray-900">K{pkg.price}</span>
              </div>
            </div>
          ))}
        </div>
        <Button
          onClick={handleBuyFloat}
          variant="ghost"
          fullWidth={false}
          className="w-full mt-4"
        >
          View All Packages
        </Button>
      </Card>
    </div>
  );
};

