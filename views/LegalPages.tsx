import React from 'react';
import { Header, Card, Button } from '../components/UI';
import { ArrowLeft, FileText, Shield, DollarSign, UserCheck } from 'lucide-react';

export const TermsAndConditionsView = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="pb-24 animate-fade-in min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header 
        title="Terms & Conditions"
        onBack={onBack}
      />
      
      <div className="p-4 sm:p-6 space-y-6">
        <Card variant="elevated" className="!p-6">
          <div className="prose prose-sm max-w-none space-y-6">
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-3">1. Acceptance of Terms</h3>
              <p className="text-gray-700 leading-relaxed text-sm">
                By accessing and using the Pushr delivery service platform, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-3">2. Service Description</h3>
              <p className="text-gray-700 leading-relaxed text-sm mb-3">
                Pushr connects customers with delivery service providers (Pushers) for the transportation of items.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm ml-4">
                <li>Customers can request delivery services through the platform</li>
                <li>Pushers provide delivery services and are independent contractors</li>
                <li>Pushr acts as an intermediary platform, not a delivery service provider</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-3">3. User Responsibilities</h3>
              <p className="text-gray-700 leading-relaxed text-sm mb-3">
                Users agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm ml-4">
                <li>Provide accurate information</li>
                <li>Use the service legally and appropriately</li>
                <li>Pay all fees promptly</li>
                <li>Treat all parties with respect</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-3">4. Payment Terms</h3>
              <p className="text-gray-700 leading-relaxed text-sm">
                All payments are processed through secure payment gateways. Refunds are subject to our refund policy. 
                Prices may vary based on distance, item type, and service level.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-3">5. Cancellation Policy</h3>
              <p className="text-gray-700 leading-relaxed text-sm">
                Cancellations may be subject to fees. Cancellation fees depend on when the cancellation is made 
                and whether a pusher has been assigned.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-3">6. Limitation of Liability</h3>
              <p className="text-gray-700 leading-relaxed text-sm">
                Pushr is not liable for any damage, loss, or injury arising from the delivery service. 
                Users are responsible for insuring valuable items.
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mt-8">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export const PrivacyPolicyView = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="pb-24 animate-fade-in min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header 
        title="Privacy Policy"
        onBack={onBack}
      />
      
      <div className="p-4 sm:p-6 space-y-6">
        <Card variant="elevated" className="!p-6">
          <div className="prose prose-sm max-w-none space-y-6">
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-3">1. Information We Collect</h3>
              <p className="text-gray-700 leading-relaxed text-sm mb-3">
                We collect the following information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm ml-4">
                <li>Personal identification (name, phone, email)</li>
                <li>Location data for delivery services</li>
                <li>Payment information (processed securely through payment gateways)</li>
                <li>Usage data and app interactions</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-3">2. How We Use Your Information</h3>
              <p className="text-gray-700 leading-relaxed text-sm mb-3">
                Your information is used to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm ml-4">
                <li>Provide and improve delivery services</li>
                <li>Process payments and transactions</li>
                <li>Send notifications about your deliveries</li>
                <li>Communicate with you about the service</li>
                <li>Ensure safety and security</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-3">3. Data Security</h3>
              <p className="text-gray-700 leading-relaxed text-sm">
                We implement industry-standard security measures to protect your personal information. 
                All data is encrypted in transit and at rest.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-3">4. Data Sharing</h3>
              <p className="text-gray-700 leading-relaxed text-sm">
                We share minimal information with delivery pushers to complete deliveries. 
                We do not sell your personal data to third parties.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-3">5. Your Rights</h3>
              <p className="text-gray-700 leading-relaxed text-sm mb-3">
                You have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm ml-4">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </div>

            <div>
              <p className="text-xs text-gray-500 mt-8">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export const RefundPolicyView = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="pb-24 animate-fade-in min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header 
        title="Refund Policy"
        onBack={onBack}
      />
      
      <div className="p-4 sm:p-6 space-y-6">
        <Card variant="elevated" className="!p-6">
          <div className="prose prose-sm max-w-none space-y-6">
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-3">1. Eligible Refunds</h3>
              <p className="text-gray-700 leading-relaxed text-sm mb-3">
                Refunds may be issued in the following cases:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm ml-4">
                <li>Delivery was not completed due to pusher fault</li>
                <li>Item was damaged or lost during delivery</li>
                <li>Wrong item was delivered</li>
                <li>Delivery was significantly delayed (over 2 hours)</li>
                <li>Service cancellation within first 5 minutes</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-3">2. Non-Refundable Items</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm ml-4">
                <li>Service fees (if cancellation is after pusher assignment)</li>
                <li>Cancellation fees (as per cancellation policy)</li>
                <li>Completed deliveries (unless there's a valid complaint)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-3">3. Refund Process</h3>
              <p className="text-gray-700 leading-relaxed text-sm mb-3">
                To request a refund:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm ml-4">
                <li>Contact support within 24 hours of delivery</li>
                <li>Provide order details and reason for refund</li>
                <li>Submit any supporting evidence (photos, etc.)</li>
                <li>Wait for review and decision (typically 24-48 hours)</li>
              </ol>
            </div>

            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-3">4. Refund Timeline</h3>
              <p className="text-gray-700 leading-relaxed text-sm">
                Approved refunds will be processed within 5-7 business days. 
                Refunds will be returned to the original payment method.
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mt-8">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

