import React, { useState } from 'react';
import { User } from '../types';
import { Card, Button, Badge, Input, Sheet } from '../components/UI';
import { AppBar } from '../components/AppBar';
import { Settings, Bell, Shield, HelpCircle, LogOut, Edit, Camera, Star, TrendingUp, MapPin, CreditCard, Package, Zap, Award, ChevronRight } from 'lucide-react';
import { CustomerSettingsView } from './CustomerSettingsView';
import { CustomerNotificationsView } from './CustomerNotificationsView';
import { CustomerSavedLocationsView } from './CustomerSavedLocationsView';
import { CustomerPaymentMethodsView } from './CustomerPaymentMethodsView';
import { CustomerHelpView } from './CustomerHelpView';
import { CustomerPrivacyView } from './CustomerPrivacyView';
import { PusherVerificationView } from './PusherVerificationView';

export const PusherProfileView = ({ user, onLogout }: { user: User; onLogout: () => void }) => {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [currentPage, setCurrentPage] = useState<'main' | 'settings' | 'notifications' | 'locations' | 'payments' | 'help' | 'privacy' | 'verification'>('main');

  const stats = {
    deliveries: 142,
    rating: 4.9,
    earnings: 12500,
    floatBalance: 3,
  };

  // Mock delivery history
  const deliveryHistory = [
    {
      id: 'd1',
      orderId: '#12345',
      date: '2024-01-15',
      customer: 'Mwila J.',
      pickup: 'Manda Hill',
      dropoff: 'East Park',
      photo: null,
      rating: 5,
    },
    {
      id: 'd2',
      orderId: '#12344',
      date: '2024-01-14',
      customer: 'Sarah K.',
      pickup: 'UNZA',
      dropoff: 'Woodlands',
      photo: '/images/Logopushr.png',
      rating: 5,
    },
  ];

  // Navigate to specific page (reuse Customer views)
  if (currentPage === 'settings') {
    return <CustomerSettingsView user={user} onBack={() => setCurrentPage('main')} />;
  }

  if (currentPage === 'notifications') {
    return <CustomerNotificationsView onBack={() => setCurrentPage('main')} />;
  }

  if (currentPage === 'locations') {
    return <CustomerSavedLocationsView onBack={() => setCurrentPage('main')} />;
  }

  if (currentPage === 'payments') {
    return <CustomerPaymentMethodsView onBack={() => setCurrentPage('main')} />;
  }

  if (currentPage === 'help') {
    return <CustomerHelpView onBack={() => setCurrentPage('main')} />;
  }

  if (currentPage === 'privacy') {
    return <CustomerPrivacyView onBack={() => setCurrentPage('main')} />;
  }

  if (currentPage === 'verification') {
    return <PusherVerificationView user={user} onBack={() => setCurrentPage('main')} />;
  }

  const menuItems = [
    { icon: Settings, label: 'Settings', onClick: () => setCurrentPage('settings') },
    { icon: Bell, label: 'Notifications', onClick: () => setCurrentPage('notifications') },
    { icon: MapPin, label: 'Saved Locations', onClick: () => setCurrentPage('locations') },
    { icon: CreditCard, label: 'Payment Methods', onClick: () => setCurrentPage('payments') },
    { icon: Shield, label: 'Verification', onClick: () => setCurrentPage('verification') },
    { icon: HelpCircle, label: 'Help & Support', onClick: () => setCurrentPage('help') },
    { icon: Shield, label: 'Privacy & Security', onClick: () => setCurrentPage('privacy') },
  ];

  return (
    <div className="pb-24 animate-fade-in min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <AppBar
        title="Profile"
        subtitle={user.name}
        showBack={false}
        showLogout={false}
      />

      <div className="p-4 sm:p-6 space-y-6">
        {/* Profile Card */}
        <Card variant="elevated" className="!p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-pushr-blue to-pushr-accent -z-10"></div>
          
          <div className="relative z-10 mt-12">
            <div className="flex items-end justify-between mb-6">
              <div className="relative -mt-16">
                <div className="w-24 h-24 bg-white rounded-full p-1 shadow-xl">
                  <img 
                    src={user.avatar} 
                    className="w-full h-full rounded-full object-cover" 
                    alt={user.name}
                  />
                </div>
                <button
                  onClick={() => setShowEditProfile(true)}
                  className="absolute bottom-0 right-0 w-10 h-10 bg-pushr-blue rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-600 transition-colors touch-feedback active:scale-95"
                >
                  <Camera size={18} />
                </button>
              </div>
              <Button
                variant="outline"
                size="sm"
                fullWidth={false}
                icon={<Edit size={16} />}
                onClick={() => setShowEditProfile(true)}
              >
                Edit
              </Button>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h2>
              <p className="text-gray-500 text-sm">Pusher</p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge color="green" size="sm">
                  <Star size={10} className="mr-1 fill-current" />
                  Verified
                </Badge>
                {user.rating && (
                  <Badge color="orange" size="sm">
                    ⭐ {user.rating} Rating
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <Card variant="elevated" className="!p-4 text-center">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Package size={20} className="text-pushr-blue" />
            </div>
            <p className="text-2xl font-black text-gray-900">{stats.deliveries}</p>
            <p className="text-xs text-gray-500 mt-1">Deliveries</p>
          </Card>
          <Card variant="elevated" className="!p-4 text-center">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <TrendingUp size={20} className="text-pushr-success" />
            </div>
            <p className="text-2xl font-black text-gray-900">K{stats.earnings}</p>
            <p className="text-xs text-gray-500 mt-1">Earnings</p>
          </Card>
        </div>

        {/* Float Balance */}
        <Card variant="elevated" className="!p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">Float Balance</p>
              <p className="text-3xl font-black">{stats.floatBalance}</p>
              <p className="text-gray-400 text-xs mt-1">jobs remaining</p>
            </div>
            <Zap className="text-pushr-accent" size={32} />
          </div>
        </Card>

        {/* Delivery History */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-gray-900">Delivery History</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => alert('View full history')}
              fullWidth={false}
            >
              View All
            </Button>
          </div>
          {deliveryHistory.length > 0 ? (
            <div className="space-y-3">
              {deliveryHistory.slice(0, 3).map((delivery) => (
                <Card
                  key={delivery.id}
                  variant="elevated"
                  className="!p-4 hover:shadow-lg transition-all touch-feedback active:scale-98 cursor-pointer"
                  onClick={() => alert(`View order ${delivery.orderId}`)}
                >
                  <div className="flex items-center space-x-4">
                    {delivery.photo ? (
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={delivery.photo}
                          alt="Delivery"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Package size={24} className="text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-bold text-gray-900 text-sm">{delivery.orderId}</p>
                        <div className="flex items-center space-x-1">
                          <Star size={12} className="fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-semibold text-gray-700">{delivery.rating}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{delivery.pickup} → {delivery.dropoff}</p>
                      <p className="text-xs text-gray-400 mt-1">{delivery.date}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card variant="outlined" className="!p-8 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">No deliveries yet</p>
              <p className="text-sm text-gray-400 mt-1">Complete your first delivery to build your portfolio</p>
            </Card>
          )}
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={item.onClick}
                className="w-full p-4 bg-white rounded-2xl border border-gray-100 flex items-center justify-between hover:border-gray-200 hover:shadow-md transition-all touch-feedback active:scale-98"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-700">
                    <Icon size={20} />
                  </div>
                  <span className="font-semibold text-gray-900">{item.label}</span>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </button>
            );
          })}
        </div>

        {/* Logout Button */}
        <Button
          variant="danger"
          icon={<LogOut size={18} />}
          onClick={onLogout}
        >
          Logout
        </Button>
      </div>

      {/* Edit Profile Sheet */}
      <Sheet
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        title="Edit Profile"
        size="md"
      >
        <div className="space-y-4">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 relative">
              <img 
                src={user.avatar} 
                className="w-full h-full rounded-full object-cover" 
                alt={user.name}
              />
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-pushr-blue rounded-full flex items-center justify-center text-white">
                <Camera size={14} />
              </button>
            </div>
          </div>

          <Input
            label="Full Name"
            value={user.name}
            onChange={() => {}}
            placeholder="Enter your name"
          />
          
          <Input
            label="Phone Number"
            value={user.phone || ''}
            onChange={() => {}}
            placeholder="+260 XXX XXX XXX"
            type="tel"
          />

          <Button onClick={() => {
            setShowEditProfile(false);
            alert('Profile updated!');
          }}>
            Save Changes
          </Button>
        </div>
      </Sheet>
    </div>
  );
};
