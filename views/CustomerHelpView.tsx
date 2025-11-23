import React, { useState } from 'react';
import { AppBar } from '../components/AppBar';
import { Card, Button, Input } from '../components/UI';
import { HelpCircle, MessageSquare, Phone, Mail, Search, ChevronDown, ChevronUp } from 'lucide-react';

const FAQ_ITEMS = [
  {
    id: '1',
    question: 'How do I create a delivery request?',
    answer: 'Tap the "Create Delivery" button on the home screen, enter your pickup and dropoff locations, select a delivery category, and confirm your order. Payment will be processed automatically.',
  },
  {
    id: '2',
    question: 'How long does delivery take?',
    answer: 'Delivery times vary based on distance and category. Typical delivery times range from 10 minutes (walking) to 30 minutes (bike/truck). You\'ll see an estimated time before confirming your order.',
  },
  {
    id: '3',
    question: 'Can I cancel my delivery?',
    answer: 'Yes, you can cancel your delivery within 5 minutes of placing the order without any charges. Cancellations after 5 minutes may incur a cancellation fee.',
  },
  {
    id: '4',
    question: 'How do I track my delivery?',
    answer: 'Once your delivery is accepted by a pusher, you\'ll be able to see real-time tracking on the map. You can also chat with your pusher and see their estimated arrival time.',
  },
  {
    id: '5',
    question: 'What payment methods are accepted?',
    answer: 'We accept MTN Money, Airtel Money, Zamtel Money, and Debit/Credit cards. All payments are processed securely through our payment partners.',
  },
];

export const CustomerHelpView = ({ onBack }: { onBack: () => void }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showContactForm, setShowContactForm] = useState(false);

  const filteredFAQs = FAQ_ITEMS.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
      <AppBar
        title="Help & Support"
        showBack
        onBack={onBack}
        showLogout={false}
      />

      <div className="p-4 sm:p-6 space-y-6">
        {/* Search */}
        <Input
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search for help..."
          icon={<Search size={18} />}
          className="!mb-0"
        />

        {/* Contact Options */}
        <Card variant="elevated" className="!p-6">
          <h3 className="font-bold text-lg mb-4">Get in Touch</h3>
          <div className="space-y-3">
            <button
              onClick={() => setShowContactForm(true)}
              className="w-full p-4 rounded-2xl border-2 border-gray-200 bg-white hover:border-pushr-blue hover:bg-blue-50 transition-all touch-feedback active:scale-98 flex items-center space-x-3"
            >
              <MessageSquare className="text-pushr-blue" size={20} />
              <span className="font-semibold text-gray-900 flex-1 text-left">Live Chat</span>
              <span className="text-sm text-gray-500">Available 24/7</span>
            </button>

            <button
              onClick={() => window.open('tel:+260977123456')}
              className="w-full p-4 rounded-2xl border-2 border-gray-200 bg-white hover:border-pushr-blue hover:bg-blue-50 transition-all touch-feedback active:scale-98 flex items-center space-x-3"
            >
              <Phone className="text-pushr-success" size={20} />
              <span className="font-semibold text-gray-900 flex-1 text-left">Call Support</span>
              <span className="text-sm text-gray-500">+260 977 123 456</span>
            </button>

            <button
              onClick={() => window.open('mailto:support@pushr.com')}
              className="w-full p-4 rounded-2xl border-2 border-gray-200 bg-white hover:border-pushr-blue hover:bg-blue-50 transition-all touch-feedback active:scale-98 flex items-center space-x-3"
            >
              <Mail className="text-pushr-accent" size={20} />
              <span className="font-semibold text-gray-900 flex-1 text-left">Email Us</span>
              <span className="text-sm text-gray-500">support@pushr.com</span>
            </button>
          </div>
        </Card>

        {/* FAQ Section */}
        <div>
          <h3 className="font-bold text-lg mb-4">Frequently Asked Questions</h3>
          <div className="space-y-3">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map(item => (
                <Card
                  key={item.id}
                  variant="elevated"
                  className="!p-0 overflow-hidden hover:shadow-lg transition-all touch-feedback active:scale-98"
                >
                  <button
                    onClick={() => {
                      setExpandedId(expandedId === item.id ? null : item.id);
                      if ('vibrate' in navigator) navigator.vibrate(10);
                    }}
                    className="w-full p-5 flex items-center justify-between text-left"
                  >
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                      <HelpCircle className="text-pushr-blue flex-shrink-0 mt-0.5" size={20} />
                      <span className="font-semibold text-gray-900 flex-1">{item.question}</span>
                    </div>
                    {expandedId === item.id ? (
                      <ChevronUp className="text-gray-400 flex-shrink-0 ml-3" size={20} />
                    ) : (
                      <ChevronDown className="text-gray-400 flex-shrink-0 ml-3" size={20} />
                    )}
                  </button>
                  {expandedId === item.id && (
                    <div className="px-5 pb-5 pt-0 animate-slide-down">
                      <p className="text-sm text-gray-600 leading-relaxed pl-8">{item.answer}</p>
                    </div>
                  )}
                </Card>
              ))
            ) : (
              <Card variant="outlined" className="!p-12 text-center">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No results found</p>
                <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
              </Card>
            )}
          </div>
        </div>

        {/* Contact Form */}
        {showContactForm && (
          <Card variant="elevated" className="!p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Contact Support</h3>
              <button
                onClick={() => setShowContactForm(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <Input
                label="Subject"
                value=""
                onChange={() => {}}
                placeholder="What can we help you with?"
              />
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                <textarea
                  placeholder="Describe your issue..."
                  rows={4}
                  className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-pushr-blue focus:ring-2 focus:ring-pushr-blue/20 outline-none resize-none"
                />
              </div>
              <Button
                onClick={() => {
                  alert('Message sent! We\'ll get back to you soon.');
                  setShowContactForm(false);
                }}
                icon={<MessageSquare size={18} />}
              >
                Send Message
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

