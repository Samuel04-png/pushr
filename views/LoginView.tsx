import React, { useState, useEffect } from 'react';
import { Button, Card, Input, Alert } from '../components/UI';
import { Mail, Phone, Lock, Eye, EyeOff, ArrowRight, Sparkles, AlertCircle, ShoppingBag, Briefcase, Shield } from 'lucide-react';

interface LoginViewProps {
  onLogin: (email: string, password: string, role?: 'customer' | 'pusher' | 'admin') => Promise<void>;
  onSignup: () => void;
  onForgotPassword: () => void;
  onPhoneLogin?: () => void;
}

export const LoginView = ({ 
  onLogin, 
  onSignup, 
  onForgotPassword,
  onPhoneLogin 
}: LoginViewProps) => {
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<'customer' | 'pusher' | 'admin' | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  // Detect desktop view
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768); // md breakpoint
    };
    
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (loginMethod === 'email') {
        if (!email || !password) {
          setError('Please enter both email and password');
          setLoading(false);
          return;
        }
        if (!selectedRole) {
          setError('Please select a role to continue');
          setLoading(false);
          return;
        }
        await onLogin(email, password, selectedRole);
      } else {
        // Phone login logic would go here
        if (onPhoneLogin) {
          onPhoneLogin();
        }
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pushr-blue via-blue-600 to-indigo-700 flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-md space-y-8">
        {/* Logo & Branding */}
        <div className="text-center space-y-4 animate-slide-down">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl mx-auto flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300 overflow-hidden">
            <img 
              src="/images/Logopushr.png" 
              alt="Pushr Logo" 
              className="w-full h-full object-contain p-2"
            />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Welcome Back</h1>
            <p className="text-white/90 font-medium">Sign in to continue to Pushr</p>
          </div>
        </div>

        {/* Login Card */}
        <Card variant="elevated" className="!p-8 animate-slide-up">
          {/* Login Method Toggle */}
          <div className="flex space-x-2 mb-6 bg-gray-100 rounded-2xl p-1">
            <button
              onClick={() => {
                setLoginMethod('email');
                setError(null);
                if ('vibrate' in navigator) navigator.vibrate(10);
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-200 touch-feedback active:scale-95 ${
                loginMethod === 'email'
                  ? 'bg-white text-pushr-blue shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Mail className="w-4 h-4 inline mr-2" />
              Email
            </button>
            <button
              onClick={() => {
                setLoginMethod('phone');
                setError(null);
                if ('vibrate' in navigator) navigator.vibrate(10);
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-200 touch-feedback active:scale-95 ${
                loginMethod === 'phone'
                  ? 'bg-white text-pushr-blue shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Phone className="w-4 h-4 inline mr-2" />
              Phone
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert
              type="error"
              message={error}
              onClose={() => setError(null)}
              className="mb-6 animate-slide-down"
            />
          )}

          {/* Role Selection */}
          {loginMethod === 'email' && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Login as
              </label>
              <div className={`grid gap-3 ${isDesktop ? 'grid-cols-3' : 'grid-cols-2'}`}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('customer');
                    if ('vibrate' in navigator) navigator.vibrate(10);
                  }}
                  className={`p-4 rounded-2xl border-2 transition-all touch-feedback active:scale-95 ${
                    selectedRole === 'customer'
                      ? 'border-pushr-blue bg-blue-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <ShoppingBag className={`mx-auto mb-2 ${selectedRole === 'customer' ? 'text-pushr-blue' : 'text-gray-400'}`} size={24} />
                  <p className={`font-bold text-sm ${selectedRole === 'customer' ? 'text-pushr-blue' : 'text-gray-700'}`}>
                    Customer
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Order deliveries</p>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('pusher');
                    if ('vibrate' in navigator) navigator.vibrate(10);
                  }}
                  className={`p-4 rounded-2xl border-2 transition-all touch-feedback active:scale-95 ${
                    selectedRole === 'pusher'
                      ? 'border-pushr-success bg-green-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <Briefcase className={`mx-auto mb-2 ${selectedRole === 'pusher' ? 'text-pushr-success' : 'text-gray-400'}`} size={24} />
                  <p className={`font-bold text-sm ${selectedRole === 'pusher' ? 'text-pushr-success' : 'text-gray-700'}`}>
                    Pusher
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Accept jobs</p>
                </button>
                {isDesktop && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('admin');
                      if ('vibrate' in navigator) navigator.vibrate(10);
                    }}
                    className={`p-4 rounded-2xl border-2 transition-all touch-feedback active:scale-95 ${
                      selectedRole === 'admin'
                        ? 'border-purple-600 bg-purple-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <Shield className={`mx-auto mb-2 ${selectedRole === 'admin' ? 'text-purple-600' : 'text-gray-400'}`} size={24} />
                    <p className={`font-bold text-sm ${selectedRole === 'admin' ? 'text-purple-600' : 'text-gray-700'}`}>
                      Admin
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Manage platform</p>
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                {isDesktop ? 'Select your role to continue' : 'You can switch roles anytime after login'}
              </p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {loginMethod === 'email' ? (
              <>
                <Input
                  label="Email Address"
                  value={email}
                  onChange={setEmail}
                  placeholder="Enter your email"
                  type="email"
                  icon={<Mail size={18} />}
                  disabled={loading}
                />
                <div className="relative">
                  <Input
                    label="Password"
                    value={password}
                    onChange={setPassword}
                    placeholder="Enter your password"
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
                  />
                </div>
              </>
            ) : (
              <Input
                label="Phone Number"
                value={phone}
                onChange={setPhone}
                placeholder="+260 XXX XXX XXX"
                type="tel"
                icon={<Phone size={18} />}
                disabled={loading}
              />
            )}

            {/* Forgot Password */}
            {loginMethod === 'email' && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    onForgotPassword();
                    if ('vibrate' in navigator) navigator.vibrate(10);
                  }}
                  className="text-sm font-semibold text-pushr-blue hover:text-blue-600 transition-colors touch-feedback active:scale-95"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              isLoading={loading}
              disabled={loading}
              icon={<ArrowRight size={18} />}
              className="mt-6"
            >
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">New to Pushr?</span>
            </div>
          </div>

          {/* Sign Up Button */}
          <Button
            variant="outline"
            onClick={() => {
              onSignup();
              if ('vibrate' in navigator) navigator.vibrate(15);
            }}
            disabled={loading}
            fullWidth={false}
            className="w-full"
          >
            Create Account
          </Button>
        </Card>

        {/* Footer */}
        <p className="text-center text-white/80 text-sm font-medium">
          By continuing, you agree to our{' '}
          <a href="#" className="underline hover:text-white transition-colors">Terms</a> and{' '}
          <a href="#" className="underline hover:text-white transition-colors">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

