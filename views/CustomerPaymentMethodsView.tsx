import React, { useState } from 'react';
import { AppBar } from '../components/AppBar';
import { Card, Button, Input, Badge, Sheet } from '../components/UI';
import { CreditCard, Plus, Trash2, CheckCircle2, X } from 'lucide-react';

const MOCK_PAYMENT_METHODS = [
  { id: '1', type: 'mtn', name: 'MTN Money', lastFour: '1234', isDefault: true },
  { id: '2', type: 'airtel', name: 'Airtel Money', lastFour: '5678', isDefault: false },
  { id: '3', type: 'card', name: 'Visa Card', lastFour: '9012', isDefault: false },
];

export const CustomerPaymentMethodsView = ({ onBack }: { onBack: () => void }) => {
  const [methods, setMethods] = useState(MOCK_PAYMENT_METHODS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ type: 'mtn', name: '', number: '' });

  const handleAdd = () => {
    if (!formData.name || !formData.number) return;
    
    const newMethod = {
      id: Date.now().toString(),
      type: formData.type as any,
      name: formData.name,
      lastFour: formData.number.slice(-4),
      isDefault: methods.length === 0,
    };
    
    setMethods(prev => [...prev, newMethod]);
    setFormData({ type: 'mtn', name: '', number: '' });
    setShowAddForm(false);
    if ('vibrate' in navigator) navigator.vibrate(20);
  };

  const handleSetDefault = (id: string) => {
    setMethods(prev => prev.map(m => ({ ...m, isDefault: m.id === id })));
    if ('vibrate' in navigator) navigator.vibrate(10);
  };

  const handleDelete = (id: string) => {
    setMethods(prev => prev.filter(m => m.id !== id));
    if ('vibrate' in navigator) navigator.vibrate(10);
  };

  const getPaymentIcon = (type: string) => {
    switch(type) {
      case 'mtn': return '💛';
      case 'airtel': return '❤️';
      case 'zamtel': return '💙';
      default: return '💳';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
      <AppBar
        title="Payment Methods"
        showBack
        onBack={onBack}
        showLogout={false}
      />

      <div className="p-4 sm:p-6 space-y-6">
        <Button
          onClick={() => setShowAddForm(true)}
          icon={<Plus size={18} />}
          variant="secondary"
        >
          Add Payment Method
        </Button>

        {/* Payment Methods List */}
        <div className="space-y-3">
          {methods.map(method => (
            <Card
              key={method.id}
              variant="elevated"
              className={`!p-5 hover:shadow-lg transition-all touch-feedback active:scale-98 ${
                method.isDefault ? 'border-2 border-pushr-blue bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-md flex-shrink-0">
                  {getPaymentIcon(method.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-bold text-gray-900">{method.name}</h4>
                    {method.isDefault && (
                      <Badge color="blue" size="sm">Default</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">•••• {method.lastFour}</p>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  {!method.isDefault && (
                    <button
                      onClick={() => handleSetDefault(method.id)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors touch-feedback active:scale-95"
                      title="Set as default"
                    >
                      <CheckCircle2 size={18} className="text-gray-400" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(method.id)}
                    className="p-2 hover:bg-red-50 rounded-full transition-colors touch-feedback active:scale-95"
                  >
                    <Trash2 size={18} className="text-red-500" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {methods.length === 0 && (
          <Card variant="outlined" className="!p-12 text-center">
            <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium mb-2">No Payment Methods</p>
            <p className="text-sm text-gray-400 mb-4">Add a payment method for faster checkout</p>
            <Button
              onClick={() => setShowAddForm(true)}
              icon={<Plus size={18} />}
              size="md"
              fullWidth={false}
              className="mx-auto"
            >
              Add Payment Method
            </Button>
          </Card>
        )}

        {/* Add Payment Method Sheet */}
        {showAddForm && (
          <Sheet
            isOpen={showAddForm}
            onClose={() => {
              setShowAddForm(false);
              setFormData({ type: 'mtn', name: '', number: '' });
            }}
            title="Add Payment Method"
            size="md"
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Payment Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'mtn', label: 'MTN Money', icon: '💛' },
                    { value: 'airtel', label: 'Airtel Money', icon: '❤️' },
                    { value: 'zamtel', label: 'Zamtel Money', icon: '💙' },
                    { value: 'card', label: 'Card', icon: '💳' },
                  ].map(type => (
                    <button
                      key={type.value}
                      onClick={() => setFormData(prev => ({ ...prev, type: type.value as any }))}
                      className={`p-4 rounded-2xl border-2 transition-all touch-feedback active:scale-95 ${
                        formData.type === type.value
                          ? 'border-pushr-blue bg-blue-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <span className="text-2xl mb-2 block">{type.icon}</span>
                      <span className="text-sm font-semibold text-gray-900">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Input
                label="Account Name"
                value={formData.name}
                onChange={(val) => setFormData(prev => ({ ...prev, name: val }))}
                placeholder="Enter account name"
                icon={<CreditCard size={18} />}
              />

              <Input
                label="Account Number"
                value={formData.number}
                onChange={(val) => setFormData(prev => ({ ...prev, number: val }))}
                placeholder={formData.type === 'card' ? 'Card number' : 'Phone number'}
                type={formData.type === 'card' ? 'text' : 'tel'}
                icon={<CreditCard size={18} />}
              />

              <Button
                onClick={handleAdd}
                disabled={!formData.name || !formData.number}
                icon={<CheckCircle2 size={18} />}
              >
                Add Payment Method
              </Button>
            </div>
          </Sheet>
        )}
      </div>
    </div>
  );
};

