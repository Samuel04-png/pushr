import React, { useState } from 'react';
import { AppBar } from '../components/AppBar';
import { Card, Button, Input, Badge } from '../components/UI';
import { Switch } from '../components/Switch';
import { User, Bell, MapPin, CreditCard, Shield, HelpCircle, Globe, Moon, Sun, Briefcase, ArrowRight } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export const CustomerSettingsView = ({ 
  user, 
  onBack,
  onBecomePushr
}: { 
  user: any; 
  onBack: () => void;
  onBecomePushr?: () => void;
}) => {
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    sms: false,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
      <AppBar
        title="Settings"
        showBack
        onBack={onBack}
        showLogout={false}
      />

      <div className="p-4 sm:p-6 space-y-6">
        {/* Profile Section */}
        <Card variant="elevated" className="!p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-pushr-blue to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.email || user.phone || 'No contact info'}</p>
              <Badge color="blue" size="sm" className="mt-2">Customer</Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              fullWidth={false}
              icon={<User size={16} />}
            >
              Edit
            </Button>
          </div>
        </Card>

        {/* Become a Pushr CTA */}
        {user.role === 'customer' && onBecomePushr && (
          <Card variant="elevated" className="!p-6 bg-gradient-to-br from-pushr-blue to-indigo-600 text-white relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                  <Briefcase className="text-white" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">Become a Pushr</h3>
                  <p className="text-white/90 text-sm">Start earning by delivering for others</p>
                </div>
              </div>
              <Button
                onClick={() => {
                  onBecomePushr();
                  if ('vibrate' in navigator) navigator.vibrate(20);
                }}
                variant="secondary"
                icon={<ArrowRight size={18} />}
                className="w-full bg-white text-pushr-blue hover:bg-white/90"
              >
                Apply Now
              </Button>
            </div>
          </Card>
        )}

        {/* Account Settings */}
        <div>
          <h4 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-3">Account</h4>
          <div className="space-y-2">
            <SettingItem
              icon={<User size={20} />}
              title="Edit Profile"
              subtitle="Update your personal information"
              onClick={() => alert('Edit profile')}
            />
            <SettingItem
              icon={<Shield size={20} />}
              title="Privacy & Security"
              subtitle="Manage your privacy settings"
              onClick={() => alert('Privacy settings')}
            />
            <SettingItem
              icon={<Globe size={20} />}
              title="Language"
              subtitle="English"
              onClick={() => alert('Change language')}
            />
          </div>
        </div>

        {/* Notification Settings */}
        <div>
          <h4 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-3">Notifications</h4>
          <Card variant="elevated" className="!p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="text-gray-600" size={20} />
                  <div>
                    <p className="font-semibold text-gray-900">Push Notifications</p>
                    <p className="text-xs text-gray-500">Receive push notifications</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.push}
                  onChange={(val) => setNotifications(prev => ({ ...prev, push: val }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="text-gray-600" size={20} />
                  <div>
                    <p className="font-semibold text-gray-900">Email Notifications</p>
                    <p className="text-xs text-gray-500">Receive email updates</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.email}
                  onChange={(val) => setNotifications(prev => ({ ...prev, email: val }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="text-gray-600" size={20} />
                  <div>
                    <p className="font-semibold text-gray-900">SMS Notifications</p>
                    <p className="text-xs text-gray-500">Receive SMS updates</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.sms}
                  onChange={(val) => setNotifications(prev => ({ ...prev, sms: val }))}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* App Settings */}
        <div>
          <h4 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-3">App</h4>
          <div className="space-y-2">
            <SettingItem
              icon={theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              title="Dark Mode"
              subtitle={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              rightAction={
                <Switch
                  checked={theme === 'dark'}
                  onChange={toggleTheme}
                />
              }
            />
          </div>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-3">Support</h4>
          <div className="space-y-2">
            <SettingItem
              icon={<HelpCircle size={20} />}
              title="Help & Support"
              subtitle="Get help and contact support"
              onClick={() => alert('Help & Support')}
            />
            <SettingItem
              icon={<Shield size={20} />}
              title="Terms & Conditions"
              subtitle="Read our terms and conditions"
              onClick={() => alert('Terms & Conditions')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingItem: React.FC<{
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onClick?: () => void;
  rightAction?: React.ReactNode;
}> = ({ icon, title, subtitle, onClick, rightAction }) => (
  <button
    onClick={onClick}
    className="w-full bg-white p-4 rounded-2xl border border-gray-200 hover:border-gray-300 transition-all touch-feedback active:scale-98 flex items-center justify-between"
  >
    <div className="flex items-center space-x-4 flex-1 min-w-0">
      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0 text-left">
        <p className="font-semibold text-gray-900">{title}</p>
        {subtitle && <p className="text-xs text-gray-500 truncate">{subtitle}</p>}
      </div>
    </div>
    {rightAction ? rightAction : <span className="text-gray-400">›</span>}
  </button>
);

