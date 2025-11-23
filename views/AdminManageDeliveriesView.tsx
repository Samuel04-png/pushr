import React, { useState } from 'react';
import { Card, Badge, Button, Sheet, Input, StatCard } from '../components/UI';
import { AppBar } from '../components/AppBar';
import { Package, Search, Filter, MapPin, Clock, DollarSign, User, Phone, AlertCircle, CheckCircle2, XCircle, Eye, RefreshCw } from 'lucide-react';

const MOCK_DELIVERIES = [
  {
    id: 'D001',
    customer: { name: 'Mwila J.', phone: '+260 977 123456' },
    pusher: { name: 'Kennedy M.', phone: '+260 977 789012' },
    pickup: 'Garden City',
    dropoff: 'UNILUS',
    status: 'delivered',
    price: 45,
    category: 'bike',
    createdAt: Date.now() - 3600000,
    deliveredAt: Date.now() - 1800000,
    paymentStatus: 'paid',
  },
  {
    id: 'D002',
    customer: { name: 'Jane S.', phone: '+260 977 234567' },
    pusher: null,
    pickup: 'Woodlands',
    dropoff: 'Kabulonga',
    status: 'pending',
    price: 150,
    category: 'truck',
    createdAt: Date.now() - 600000,
    paymentStatus: 'pending',
  },
  {
    id: 'D003',
    customer: { name: 'Mike D.', phone: '+260 977 345678' },
    pusher: { name: 'Sarah K.', phone: '+260 977 890123' },
    pickup: 'Downtown',
    dropoff: 'Cairo Rd',
    status: 'enroute',
    price: 25,
    category: 'walking',
    createdAt: Date.now() - 1200000,
    paymentStatus: 'paid',
  },
];

export const AdminManageDeliveriesView = ({ onBack }: { onBack: () => void }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'active' | 'completed' | 'cancelled'>('all');
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const filteredDeliveries = MOCK_DELIVERIES.filter(d => {
    const matchesSearch = 
      d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.pickup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.dropoff.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' ||
      (filterStatus === 'pending' && d.status === 'pending') ||
      (filterStatus === 'active' && ['accepted', 'pickup', 'enroute'].includes(d.status)) ||
      (filterStatus === 'completed' && d.status === 'delivered') ||
      (filterStatus === 'cancelled' && d.status === 'cancelled');
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: MOCK_DELIVERIES.length,
    pending: MOCK_DELIVERIES.filter(d => d.status === 'pending').length,
    active: MOCK_DELIVERIES.filter(d => ['accepted', 'pickup', 'enroute'].includes(d.status)).length,
    completed: MOCK_DELIVERIES.filter(d => d.status === 'delivered').length,
    revenue: MOCK_DELIVERIES.filter(d => d.paymentStatus === 'paid').reduce((sum, d) => sum + d.price, 0),
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 pb-6 sm:pb-8 space-y-4 sm:space-y-6 animate-fade-in min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <AppBar 
        title="Manage Deliveries"
        subtitle={`${filteredDeliveries.length} deliveries`}
        showBack={true}
        onBack={onBack}
        showLogout={false}
        rightAction={
          <button
            onClick={() => {
              setRefreshing(true);
              setTimeout(() => setRefreshing(false), 1000);
              if ('vibrate' in navigator) navigator.vibrate(10);
            }}
            className={`p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors touch-feedback active:scale-95 ${
              refreshing ? 'animate-spin' : ''
            }`}
          >
            <RefreshCw size={18} className="text-gray-700" />
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <StatCard title="Total" value={stats.total} icon={<Package size={18} />} color="blue" />
        <StatCard title="Active" value={stats.active} icon={<Clock size={18} />} color="orange" />
        <StatCard title="Completed" value={stats.completed} icon={<CheckCircle2 size={18} />} color="green" />
        <StatCard title="Revenue" value={`K${stats.revenue}`} icon={<DollarSign size={18} />} color="green" />
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        <Input
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by ID, customer, or location..."
          icon={<Search size={18} />}
          className="!mb-0"
        />
        <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-2">
          {(['all', 'pending', 'active', 'completed', 'cancelled'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all touch-feedback active:scale-95 whitespace-nowrap flex-shrink-0 ${
                filterStatus === status
                  ? 'bg-pushr-blue text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Deliveries List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {filteredDeliveries.length > 0 ? (
          filteredDeliveries.map(delivery => (
            <Card
              key={delivery.id}
              variant="elevated"
              className="!p-5 hover:shadow-lg transition-all touch-feedback active:scale-98"
              onClick={() => setSelectedDelivery(delivery)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-bold text-gray-900">Order #{delivery.id}</h4>
                    <Badge 
                      color={
                        delivery.status === 'delivered' ? 'green' :
                        delivery.status === 'pending' ? 'yellow' :
                        delivery.status === 'cancelled' ? 'red' : 'blue'
                      }
                      size="sm"
                    >
                      {delivery.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Clock size={12} className="mr-1" />
                      {new Date(delivery.createdAt).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <Badge 
                      color={delivery.paymentStatus === 'paid' ? 'green' : 'yellow'}
                      size="sm"
                    >
                      {delivery.paymentStatus}
                    </Badge>
                  </div>
                </div>
                <span className="font-black text-xl text-pushr-blue ml-4">K{delivery.price}</span>
              </div>

              <div className="space-y-2 mb-4 pl-4 border-l-2 border-gray-100">
                <div className="flex items-center text-sm text-gray-700">
                  <MapPin size={14} className="mr-2 text-pushr-blue" />
                  <span className="font-semibold mr-2">From:</span>
                  <span className="truncate">{delivery.pickup}</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <MapPin size={14} className="mr-2 text-pushr-accent" />
                  <span className="font-semibold mr-2">To:</span>
                  <span className="truncate">{delivery.dropoff}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{delivery.customer.name}</span>
                  {delivery.pusher && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-600">{delivery.pusher.name}</span>
                    </>
                  )}
                </div>
                <Eye className="w-5 h-5 text-gray-400" />
              </div>
            </Card>
          ))
        ) : (
          <Card variant="outlined" className="!p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No deliveries found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
          </Card>
        )}
      </div>

      {/* Delivery Details Sheet */}
      {selectedDelivery && (
        <Sheet
          isOpen={!!selectedDelivery}
          onClose={() => setSelectedDelivery(null)}
          title={`Order #${selectedDelivery.id}`}
          size="lg"
        >
          <div className="space-y-6">
            {/* Status and Actions */}
            <div className="flex items-center justify-between">
              <Badge 
                color={
                  selectedDelivery.status === 'delivered' ? 'green' :
                  selectedDelivery.status === 'pending' ? 'yellow' :
                  selectedDelivery.status === 'cancelled' ? 'red' : 'blue'
                }
                size="lg"
              >
                {selectedDelivery.status}
              </Badge>
              <div className="flex space-x-2">
                {selectedDelivery.status === 'pending' && (
                  <Button
                    variant="danger"
                    size="sm"
                    fullWidth={false}
                    onClick={() => {
                      alert('Cancel delivery?');
                      setSelectedDelivery(null);
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>

            {/* Customer Info */}
            <Card variant="outlined" className="!p-4">
              <p className="text-xs text-gray-500 font-bold uppercase mb-3">Customer</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900">{selectedDelivery.customer.name}</p>
                  <p className="text-sm text-gray-500">{selectedDelivery.customer.phone}</p>
                </div>
                <button className="p-2 bg-green-100 text-green-600 rounded-full">
                  <Phone size={18} />
                </button>
              </div>
            </Card>

            {/* Pusher Info */}
            {selectedDelivery.pusher && (
              <Card variant="outlined" className="!p-4">
                <p className="text-xs text-gray-500 font-bold uppercase mb-3">Pusher</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900">{selectedDelivery.pusher.name}</p>
                    <p className="text-sm text-gray-500">{selectedDelivery.pusher.phone}</p>
                  </div>
                  <button className="p-2 bg-green-100 text-green-600 rounded-full">
                    <Phone size={18} />
                  </button>
                </div>
              </Card>
            )}

            {/* Route */}
            <Card variant="outlined" className="!p-4">
              <p className="text-xs text-gray-500 font-bold uppercase mb-3">Route</p>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-pushr-blue rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <MapPin className="text-white" size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900">{selectedDelivery.pickup}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-pushr-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <MapPin className="text-white" size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900">{selectedDelivery.dropoff}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Payment */}
            <Card variant="outlined" className="!p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Payment</p>
                  <p className="text-2xl font-black text-pushr-blue">K{selectedDelivery.price}</p>
                </div>
                <Badge 
                  color={selectedDelivery.paymentStatus === 'paid' ? 'green' : 'yellow'}
                  size="lg"
                >
                  {selectedDelivery.paymentStatus}
                </Badge>
              </div>
            </Card>
          </div>
        </Sheet>
      )}
    </div>
  );
};

