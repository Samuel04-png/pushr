import React, { useState } from 'react';
import { AppBar } from '../components/AppBar';
import { Card } from '../components/UI';
import { Switch } from '../components/Switch';
import { Bell, Mail, MessageSquare, Package, DollarSign } from 'lucide-react';

export const CustomerNotificationsView = ({ onBack }: { onBack: () => void }) => {
  const [settings, setSettings] = useState({
    orderUpdates: { push: true, email: false, sms: true },
    paymentUpdates: { push: true, email: true, sms: false },
    promotions: { push: true, email: true, sms: false },
    accountUpdates: { push: true, email: true, sms: true },
  });

  const updateSetting = (category: string, type: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [type]: value,
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
      <AppBar
        title="Notifications"
        showBack
        onBack={onBack}
        showLogout={false}
      />

      <div className="p-4 sm:p-6 space-y-6">
        <Card variant="elevated" className="!p-6">
          <h3 className="font-bold text-lg mb-6">Notification Preferences</h3>
          
          <div className="space-y-6">
            {/* Order Updates */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Package className="text-pushr-blue" size={20} />
                <h4 className="font-semibold text-gray-900">Order Updates</h4>
              </div>
              <div className="space-y-3 pl-8">
                <NotificationOption
                  label="Push Notifications"
                  checked={settings.orderUpdates.push}
                  onChange={(val) => updateSetting('orderUpdates', 'push', val)}
                />
                <NotificationOption
                  label="Email"
                  checked={settings.orderUpdates.email}
                  onChange={(val) => updateSetting('orderUpdates', 'email', val)}
                />
                <NotificationOption
                  label="SMS"
                  checked={settings.orderUpdates.sms}
                  onChange={(val) => updateSetting('orderUpdates', 'sms', val)}
                />
              </div>
            </div>

            {/* Payment Updates */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <DollarSign className="text-pushr-success" size={20} />
                <h4 className="font-semibold text-gray-900">Payment Updates</h4>
              </div>
              <div className="space-y-3 pl-8">
                <NotificationOption
                  label="Push Notifications"
                  checked={settings.paymentUpdates.push}
                  onChange={(val) => updateSetting('paymentUpdates', 'push', val)}
                />
                <NotificationOption
                  label="Email"
                  checked={settings.paymentUpdates.email}
                  onChange={(val) => updateSetting('paymentUpdates', 'email', val)}
                />
                <NotificationOption
                  label="SMS"
                  checked={settings.paymentUpdates.sms}
                  onChange={(val) => updateSetting('paymentUpdates', 'sms', val)}
                />
              </div>
            </div>

            {/* Promotions */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Bell className="text-pushr-accent" size={20} />
                <h4 className="font-semibold text-gray-900">Promotions & Offers</h4>
              </div>
              <div className="space-y-3 pl-8">
                <NotificationOption
                  label="Push Notifications"
                  checked={settings.promotions.push}
                  onChange={(val) => updateSetting('promotions', 'push', val)}
                />
                <NotificationOption
                  label="Email"
                  checked={settings.promotions.email}
                  onChange={(val) => updateSetting('promotions', 'email', val)}
                />
              </div>
            </div>

            {/* Account Updates */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <MessageSquare className="text-gray-600" size={20} />
                <h4 className="font-semibold text-gray-900">Account Updates</h4>
              </div>
              <div className="space-y-3 pl-8">
                <NotificationOption
                  label="Push Notifications"
                  checked={settings.accountUpdates.push}
                  onChange={(val) => updateSetting('accountUpdates', 'push', val)}
                />
                <NotificationOption
                  label="Email"
                  checked={settings.accountUpdates.email}
                  onChange={(val) => updateSetting('accountUpdates', 'email', val)}
                />
                <NotificationOption
                  label="SMS"
                  checked={settings.accountUpdates.sms}
                  onChange={(val) => updateSetting('accountUpdates', 'sms', val)}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const NotificationOption: React.FC<{
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-gray-700 font-medium">{label}</span>
    <Switch checked={checked} onChange={onChange} />
  </div>
);

