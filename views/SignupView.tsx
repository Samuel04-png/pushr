import React, { useState } from 'react';
import { Button, Card, Input, Alert } from '../components/UI';
import { Mail, Phone, Lock, Eye, EyeOff, User, ArrowRight, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface SignupViewProps {
  onSignup: (data: SignupData) => Promise<void>;
  onLogin: () => void;
  onChooseRole?: () => void;
}

interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: 'customer' | 'pusher' | null;
}

export const SignupView = ({ 
  onSignup, 
  onLogin,
  onChooseRole 
}: SignupViewProps) => {
  const [step, setStep] = useState<'details' | 'role'>('details');
  const [formData, setFormData] = useState<SignupData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const validatePassword = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const handlePasswordChange = (value: string) => {
    setFormData({ ...formData, password: value });
    setPasswordStrength(validatePassword(value));
  };

  const handleNext = () => {
    setError(null);
    
    if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (passwordStrength < 3) {
      setError('Password is too weak. Please use a stronger password.');
      return;
    }

    if (onChooseRole) {
      onChooseRole();
    } else {
      setStep('role');
    }
  };

  const handleSubmit = async () => {
    if (!formData.role) {
      setError('Please select a role');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await onSignup(formData);
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Details Step
  if (step === 'details') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pushr-blue via-blue-600 to-indigo-700 flex flex-col items-center justify-center p-6 animate-fade-in">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-3 animate-slide-down">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-3xl mx-auto flex items-center justify-center shadow-2xl">
              <Sparkles className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white mb-1">Create Account</h1>
              <p className="text-white/90 font-medium text-sm">Join Pushr and get started</p>
            </div>
          </div>

          {/* Signup Card */}
          <Card variant="elevated" className="!p-8 animate-slide-up">
            {error && (
              <Alert
                type="error"
                message={error}
                onClose={() => setError(null)}
                className="mb-6 animate-slide-down"
              />
            )}

            <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-5">
              <Input
                label="Full Name"
                value={formData.name}
                onChange={(val) => setFormData({ ...formData, name: val })}
                placeholder="Enter your full name"
                icon={<User size={18} />}
                disabled={loading}
                required
                autoComplete="name"
              />

              <Input
                label="Email Address"
                value={formData.email}
                onChange={(val) => setFormData({ ...formData, email: val })}
                placeholder="Enter your email"
                type="email"
                icon={<Mail size={18} />}
                disabled={loading}
                required
                autoComplete="email"
              />

              <Input
                label="Phone Number"
                value={formData.phone}
                onChange={(val) => setFormData({ ...formData, phone: val })}
                placeholder="+260 XXX XXX XXX"
                type="tel"
                icon={<Phone size={18} />}
                disabled={loading}
                required
                autoComplete="tel"
              />

              <div>
                <Input
                  label="Password"
                  value={formData.password}
                  onChange={handlePasswordChange}
                  placeholder="Create a password"
                  type={showPassword ? 'text' : 'password'}
                  icon={<Lock size={18} />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => {
                        setShowPassword(!showPassword);
                        if ('vibrate' in navigator) navigator.vibrate(5);
                      }}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors touch-feedback active:scale-95"
                    >
                      {showPassword ? <EyeOff size={18} className="text-gray-400" /> : <Eye size={18} className="text-gray-400" />}
                    </button>
                  }
                  disabled={loading}
                  required
                  autoComplete="new-password"
                />
                {formData.password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            i <= passwordStrength
                              ? passwordStrength <= 2
                                ? 'bg-red-500'
                                : passwordStrength <= 4
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">
                      {passwordStrength <= 2 && 'Weak password'}
                      {passwordStrength === 3 && 'Fair password'}
                      {passwordStrength === 4 && 'Good password'}
                      {passwordStrength === 5 && 'Strong password'}
                    </p>
                  </div>
                )}
              </div>

              <Input
                label="Confirm Password"
                value={formData.confirmPassword}
                onChange={(val) => setFormData({ ...formData, confirmPassword: val })}
                placeholder="Confirm your password"
                type={showConfirmPassword ? 'text' : 'password'}
                icon={<Lock size={18} />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => {
                      setShowConfirmPassword(!showConfirmPassword);
                      if ('vibrate' in navigator) navigator.vibrate(5);
                    }}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors touch-feedback active:scale-95"
                  >
                    {showConfirmPassword ? <EyeOff size={18} className="text-gray-400" /> : <Eye size={18} className="text-gray-400" />}
                  </button>
                }
                disabled={loading}
                required
                autoComplete="new-password"
                error={formData.confirmPassword && formData.password !== formData.confirmPassword ? 'Passwords do not match' : undefined}
              />

              <Button
                type="submit"
                disabled={loading}
                icon={<ArrowRight size={18} />}
                className="mt-6"
              >
                Continue
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">Already have an account?</span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => {
                onLogin();
                if ('vibrate' in navigator) navigator.vibrate(15);
              }}
              disabled={loading}
              fullWidth={false}
              className="w-full"
            >
              Sign In
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // Role Selection Step
  return (
    <div className="min-h-screen bg-gradient-to-br from-pushr-blue via-blue-600 to-indigo-700 flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-3 animate-slide-down">
          <h1 className="text-3xl font-black text-white mb-1">Choose Your Role</h1>
          <p className="text-white/90 font-medium text-sm">How would you like to use Pushr?</p>
        </div>

        <Card variant="elevated" className="!p-8 animate-slide-up">
          {error && (
            <Alert
              type="error"
              message={error}
              onClose={() => setError(null)}
              className="mb-6"
            />
          )}

          <div className="space-y-4 mb-6">
            <button
              onClick={() => {
                setFormData({ ...formData, role: 'customer' });
                if ('vibrate' in navigator) navigator.vibrate(15);
              }}
              className={`w-full p-6 rounded-2xl border-2 transition-all touch-feedback active:scale-98 ${
                formData.role === 'customer'
                  ? 'border-pushr-blue bg-blue-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  formData.role === 'customer' ? 'bg-pushr-blue text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  <User size={24} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">I'm a Customer</h3>
                  <p className="text-sm text-gray-600">Request deliveries and track orders</p>
                </div>
                {formData.role === 'customer' && (
                  <CheckCircle2 className="text-pushr-blue" size={24} />
                )}
              </div>
            </button>

            <button
              onClick={() => {
                setFormData({ ...formData, role: 'pusher' });
                if ('vibrate' in navigator) navigator.vibrate(15);
              }}
              className={`w-full p-6 rounded-2xl border-2 transition-all touch-feedback active:scale-98 ${
                formData.role === 'pusher'
                  ? 'border-pushr-blue bg-blue-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  formData.role === 'pusher' ? 'bg-pushr-blue text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  <Sparkles size={24} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">I'm a Pusher</h3>
                  <p className="text-sm text-gray-600">Accept jobs and earn money</p>
                </div>
                {formData.role === 'pusher' && (
                  <CheckCircle2 className="text-pushr-blue" size={24} />
                )}
              </div>
            </button>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setStep('details')}
              disabled={loading}
              fullWidth={false}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              isLoading={loading}
              disabled={!formData.role || loading}
              icon={<CheckCircle2 size={18} />}
              fullWidth={false}
              className="flex-1"
            >
              Create Account
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

