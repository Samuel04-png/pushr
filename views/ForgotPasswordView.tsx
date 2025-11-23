import React, { useState } from 'react';
import { Button, Card, Input, Alert, Header } from '../components/UI';
import { Mail, ArrowLeft, CheckCircle2, ArrowRight } from 'lucide-react';

interface ForgotPasswordViewProps {
  onBack: () => void;
  onResetSent?: (email: string) => void;
}

export const ForgotPasswordView = ({ 
  onBack,
  onResetSent 
}: ForgotPasswordViewProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSent(true);
      if ('vibrate' in navigator) navigator.vibrate(30);
      onResetSent?.(email);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pushr-blue via-blue-600 to-indigo-700 flex flex-col items-center justify-center p-6 animate-fade-in">
        <Card variant="elevated" className="!p-8 max-w-md w-full animate-scale-in">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-scale-in">
              <CheckCircle2 className="text-pushr-success" size={40} />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-black text-gray-900">Check Your Email</h1>
              <p className="text-gray-600 font-medium">
                We've sent a password reset link to
              </p>
              <p className="font-bold text-pushr-blue text-lg">{email}</p>
            </div>

            <Alert
              type="info"
              message="If you don't see the email, check your spam folder or try again."
              className="mt-6"
            />

            <Button
              onClick={onBack}
              icon={<ArrowLeft size={18} />}
              variant="outline"
            >
              Back to Login
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pushr-blue via-blue-600 to-indigo-700 flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-3 animate-slide-down">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-3xl mx-auto flex items-center justify-center shadow-2xl">
            <Mail className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white mb-1">Forgot Password?</h1>
            <p className="text-white/90 font-medium text-sm">
              Enter your email and we'll send you a reset link
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card variant="elevated" className="!p-8 animate-slide-up">
          {error && (
            <Alert
              type="error"
              message={error}
              onClose={() => setError(null)}
              className="mb-6 animate-slide-down"
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              value={email}
              onChange={setEmail}
              placeholder="Enter your email"
              type="email"
              icon={<Mail size={18} />}
              disabled={loading}
              required
              autoComplete="email"
              autoFocus
            />

            <Button
              type="submit"
              isLoading={loading}
              disabled={loading}
              icon={<ArrowRight size={18} />}
            >
              Send Reset Link
            </Button>
          </form>

          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={onBack}
            icon={<ArrowLeft size={18} />}
            fullWidth={false}
            className="w-full mt-4"
          >
            Back to Login
          </Button>
        </Card>
      </div>
    </div>
  );
};

