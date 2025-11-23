import React from 'react';
import { Button, Card, Header } from '../components/UI';
import { CheckCircle2, XCircle, AlertCircle, ArrowRight, Home, Receipt } from 'lucide-react';

interface PaymentResult {
  success: boolean;
  orderId?: string;
  amount: number;
  paymentMethod: string;
  transactionId?: string;
  message?: string;
}

export const PaymentSuccessView = ({
  result,
  onViewReceipt,
  onGoHome
}: {
  result: PaymentResult;
  onViewReceipt?: () => void;
  onGoHome: () => void;
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-pushr-success rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-500/30 animate-scale-in">
          <CheckCircle2 size={48} className="text-white" />
        </div>

        {/* Success Message */}
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-gray-900">Payment Successful!</h1>
          <p className="text-gray-600 font-medium">Your payment has been processed successfully</p>
        </div>

        {/* Payment Details */}
        <Card variant="elevated" className="!p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Amount Paid</span>
              <span className="text-2xl font-black text-pushr-success">K{result.amount}.00</span>
            </div>
            <div className="h-px bg-gray-200"></div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Payment Method</span>
              <span className="font-bold text-gray-900">{result.paymentMethod}</span>
            </div>
            {result.transactionId && (
              <>
                <div className="h-px bg-gray-200"></div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Transaction ID</span>
                  <span className="font-mono text-xs text-gray-700">{result.transactionId}</span>
                </div>
              </>
            )}
            {result.orderId && (
              <>
                <div className="h-px bg-gray-200"></div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Order ID</span>
                  <span className="font-mono text-xs text-gray-700">#{result.orderId}</span>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          {onViewReceipt && (
            <Button
              variant="outline"
              onClick={onViewReceipt}
              icon={<Receipt size={18} />}
            >
              View Receipt
            </Button>
          )}
          <Button
            onClick={onGoHome}
            icon={<Home size={18} />}
          >
            Continue to Tracking
          </Button>
        </div>
      </div>
    </div>
  );
};

export const PaymentFailedView = ({
  result,
  onRetry,
  onCancel
}: {
  result: PaymentResult;
  onRetry?: () => void;
  onCancel: () => void;
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Error Icon */}
        <div className="w-24 h-24 bg-pushr-danger rounded-full flex items-center justify-center mx-auto shadow-xl shadow-red-500/30 animate-scale-in">
          <XCircle size={48} className="text-white" />
        </div>

        {/* Error Message */}
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-gray-900">Payment Failed</h1>
          <p className="text-gray-600 font-medium">
            {result.message || 'Your payment could not be processed'}
          </p>
        </div>

        {/* Error Details */}
        <Card variant="elevated" className="!p-6 bg-red-50 border-2 border-red-100">
          <div className="flex items-start space-x-3">
            <AlertCircle className="text-pushr-danger flex-shrink-0 mt-0.5" size={20} />
            <div className="text-left">
              <p className="font-bold text-gray-900 mb-1">What happened?</p>
              <p className="text-sm text-gray-600">
                {result.message || 
                  'There was an issue processing your payment. Please check your payment method and try again.'}
              </p>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          {onRetry && (
            <Button
              onClick={onRetry}
              icon={<ArrowRight size={18} />}
            >
              Try Again
            </Button>
          )}
          <Button
            variant="outline"
            onClick={onCancel}
            fullWidth={false}
            className="mx-auto"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

