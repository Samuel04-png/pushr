import React, { useState } from 'react';
import { User } from '../types';
import { Card, Button, Badge, Input, Sheet } from '../components/UI';
import { AppBar } from '../components/AppBar';
import { User as UserIcon, Settings, Bell, Shield, HelpCircle, LogOut, Edit, Camera, Star, Award, TrendingUp, Calendar, MapPin, CreditCard, MessageSquare, Phone, Package, ChevronRight } from 'lucide-react';
import { CustomerSettingsView } from './CustomerSettingsView';
import { CustomerNotificationsView } from './CustomerNotificationsView';
import { CustomerSavedLocationsView } from './CustomerSavedLocationsView';
import { CustomerPaymentMethodsView } from './CustomerPaymentMethodsView';
import { CustomerHelpView } from './CustomerHelpView';
import { CustomerPrivacyView } from './CustomerPrivacyView';
import { PusherVerificationView } from './PusherVerificationView';

export const ProfileView = ({ user, onLogout }: { user: User; onLogout: () => void }) => {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [currentPage, setCurrentPage] = useState<'main' | 'settings' | 'notifications' | 'locations' | 'payments' | 'help' | 'privacy' | 'verification'>('main');
  const [notifications, setNotifications] = useState(true);
  
  const stats = {
    orders: 42,
    rating: 4.9,
    savings: 245,
    streak: 7
  };

  // Navigate to specific page
  if (currentPage === 'settings') {
    return (
      <CustomerSettingsView 
        user={user} 
        onBack={() => setCurrentPage('main')}
        onBecomePushr={() => setCurrentPage('verification')}
      />
    );
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
    { icon: Settings, label: 'Settings', onClick: () => setCurrentPage('settings'), color: 'text-gray-700' },
    { icon: Bell, label: 'Notifications', onClick: () => setCurrentPage('notifications'), color: 'text-gray-700' },
    { icon: MapPin, label: 'Saved Locations', onClick: () => setCurrentPage('locations'), color: 'text-gray-700' },
    { icon: CreditCard, label: 'Payment Methods', onClick: () => setCurrentPage('payments'), color: 'text-gray-700' },
    { icon: HelpCircle, label: 'Help & Support', onClick: () => setCurrentPage('help'), color: 'text-gray-700' },
    { icon: Shield, label: 'Privacy & Security', onClick: () => setCurrentPage('privacy'), color: 'text-gray-700' },
  ];

  if (user.role === 'pusher') {
    menuItems.push({ icon: Shield, label: 'Verification', onClick: () => setCurrentPage('verification'), color: 'text-gray-700' });
  }

  return (
    <div className="pb-24 animate-fade-in min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <AppBar
        title="Profile"
        subtitle={user.name}
        showBack={false}
        showLogout={true}
        onLogout={onLogout}
        notificationCount={0}
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
                  onClick={() => alert('Change photo')}
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
              <p className="text-gray-500 text-sm">{user.phone || '+260 XXX XXX XXX'}</p>
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
          <Card className="!p-4 text-center">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Package size={20} className="text-pushr-blue" />
            </div>
            <p className="text-2xl font-black text-gray-900">{stats.orders}</p>
            <p className="text-xs text-gray-500 mt-1">Total Orders</p>
          </Card>
          <Card className="!p-4 text-center">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Award size={20} className="text-pushr-accent" />
            </div>
            <p className="text-2xl font-black text-gray-900">{stats.streak}</p>
            <p className="text-xs text-gray-500 mt-1">Day Streak</p>
          </Card>
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
                  <div className={`w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center ${item.color}`}>
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

