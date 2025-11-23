import React, { useState } from 'react';
import { AppBar } from '../components/AppBar';
import { Card, Button, Badge } from '../components/UI';
import { Switch } from '../components/Switch';
import { Shield, Lock, Eye, EyeOff, Globe, Bell } from 'lucide-react';
import { TermsAndConditionsView, PrivacyPolicyView, RefundPolicyView } from './LegalPages';

export const CustomerPrivacyView = ({ onBack }: { onBack: () => void }) => {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showRefund, setShowRefund] = useState(false);
  const [settings, setSettings] = useState({
    profileVisible: true,
    locationSharing: true,
    dataCollection: true,
    marketingEmails: false,
  });

  if (showTerms) {
    return <TermsAndConditionsView onBack={() => setShowTerms(false)} />;
  }

  if (showPrivacy) {
    return <PrivacyPolicyView onBack={() => setShowPrivacy(false)} />;
  }

  if (showRefund) {
    return <RefundPolicyView onBack={() => setShowRefund(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
      <AppBar
        title="Privacy & Security"
        showBack
        onBack={onBack}
        showLogout={false}
      />

      <div className="p-4 sm:p-6 space-y-6">
        {/* Privacy Settings */}
        <Card variant="elevated" className="!p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="text-pushr-blue" size={24} />
            <h3 className="font-bold text-lg">Privacy Settings</h3>
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <Eye className="text-gray-600" size={20} />
                <div>
                  <p className="font-semibold text-gray-900">Profile Visibility</p>
                  <p className="text-xs text-gray-500">Make your profile visible to pushers</p>
                </div>
              </div>
              <Switch
                checked={settings.profileVisible}
                onChange={(val) => setSettings(prev => ({ ...prev, profileVisible: val }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <Globe className="text-gray-600" size={20} />
                <div>
                  <p className="font-semibold text-gray-900">Location Sharing</p>
                  <p className="text-xs text-gray-500">Share location for better delivery service</p>
                </div>
              </div>
              <Switch
                checked={settings.locationSharing}
                onChange={(val) => setSettings(prev => ({ ...prev, locationSharing: val }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <Lock className="text-gray-600" size={20} />
                <div>
                  <p className="font-semibold text-gray-900">Data Collection</p>
                  <p className="text-xs text-gray-500">Allow data collection for service improvement</p>
                </div>
              </div>
              <Switch
                checked={settings.dataCollection}
                onChange={(val) => setSettings(prev => ({ ...prev, dataCollection: val }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <Bell className="text-gray-600" size={20} />
                <div>
                  <p className="font-semibold text-gray-900">Marketing Emails</p>
                  <p className="text-xs text-gray-500">Receive promotional emails</p>
                </div>
              </div>
              <Switch
                checked={settings.marketingEmails}
                onChange={(val) => setSettings(prev => ({ ...prev, marketingEmails: val }))}
              />
            </div>
          </div>
        </Card>

        {/* Security Settings */}
        <Card variant="elevated" className="!p-6">
          <h3 className="font-bold text-lg mb-4">Security</h3>
          <div className="space-y-3">
            <button
              onClick={() => alert('Change password')}
              className="w-full p-4 rounded-2xl border-2 border-gray-200 bg-white hover:border-pushr-blue hover:bg-blue-50 transition-all touch-feedback active:scale-98 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <Lock className="text-gray-600" size={20} />
                <span className="font-semibold text-gray-900">Change Password</span>
              </div>
              <span className="text-gray-400">›</span>
            </button>

            <button
              onClick={() => alert('Two-factor authentication')}
              className="w-full p-4 rounded-2xl border-2 border-gray-200 bg-white hover:border-pushr-blue hover:bg-blue-50 transition-all touch-feedback active:scale-98 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <Shield className="text-gray-600" size={20} />
                <span className="font-semibold text-gray-900">Two-Factor Authentication</span>
              </div>
              <Badge color="gray" size="sm">Coming Soon</Badge>
            </button>
          </div>
        </Card>

        {/* Legal Documents */}
        <div>
          <h4 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-3">Legal</h4>
          <div className="space-y-2">
            <button
              onClick={() => setShowTerms(true)}
              className="w-full p-4 rounded-2xl border-2 border-gray-200 bg-white hover:border-pushr-blue hover:bg-blue-50 transition-all touch-feedback active:scale-98 flex items-center justify-between"
            >
              <span className="font-semibold text-gray-900">Terms & Conditions</span>
              <span className="text-gray-400">›</span>
            </button>

            <button
              onClick={() => setShowPrivacy(true)}
              className="w-full p-4 rounded-2xl border-2 border-gray-200 bg-white hover:border-pushr-blue hover:bg-blue-50 transition-all touch-feedback active:scale-98 flex items-center justify-between"
            >
              <span className="font-semibold text-gray-900">Privacy Policy</span>
              <span className="text-gray-400">›</span>
            </button>

            <button
              onClick={() => setShowRefund(true)}
              className="w-full p-4 rounded-2xl border-2 border-gray-200 bg-white hover:border-pushr-blue hover:bg-blue-50 transition-all touch-feedback active:scale-98 flex items-center justify-between"
            >
              <span className="font-semibold text-gray-900">Refund Policy</span>
              <span className="text-gray-400">›</span>
            </button>
          </div>
        </div>

        {/* Delete Account */}
        <Button
          variant="danger"
          onClick={() => {
            if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
              alert('Account deletion requested. We\'ll process this within 30 days.');
            }
          }}
          fullWidth={false}
          className="w-full"
        >
          Delete Account
        </Button>
      </div>
    </div>
  );
};

