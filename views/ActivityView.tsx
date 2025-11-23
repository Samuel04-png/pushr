import React, { useState } from 'react';
import { User, CATEGORIES } from '../types';
import { Card, Badge, Input, Sheet, Button } from '../components/UI';
import { AppBar } from '../components/AppBar';
import { EmptyState } from '../components/EmptyState';
import { useToast } from '../hooks/useToast';
import { Package, MapPin, ChevronRight, Search, Filter, Calendar, Clock, Star, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

const MOCK_HISTORY = [
  { 
    id: '101', 
    date: 'Today, 12:00', 
    time: '12:30 PM',
    pickup: 'Garden City', 
    dropoff: 'UNILUS', 
    price: 45, 
    status: 'delivered', 
    category: 'bike',
    pusher: { name: 'Kennedy M.', rating: 4.9, avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    rating: 5,
    receipt: true
  },
  { 
    id: '102', 
    date: 'Yesterday', 
    time: '3:45 PM',
    pickup: 'Woodlands', 
    dropoff: 'Kabulonga', 
    price: 150, 
    status: 'cancelled', 
    category: 'truck',
    pusher: { name: 'Mwila J.', rating: 4.8 },
    rating: null,
    receipt: false
  },
  { 
    id: '103', 
    date: '20 Nov', 
    time: '10:15 AM',
    pickup: 'Downtown', 
    dropoff: 'Cairo Rd', 
    price: 25, 
    status: 'delivered', 
    category: 'wheelbarrow',
    pusher: { name: 'John D.', rating: 5.0 },
    rating: 5,
    receipt: true
  },
  { 
    id: '104', 
    date: '19 Nov', 
    time: '4:20 PM',
    pickup: 'Manda Hill', 
    dropoff: 'East Park', 
    price: 65, 
    status: 'delivered', 
    category: 'bike',
    pusher: { name: 'Sarah K.', rating: 4.9 },
    rating: 5,
    receipt: true
  },
];

const STATUS_CONFIG = {
  delivered: { color: 'green', icon: CheckCircle2, label: 'Delivered' },
  cancelled: { color: 'red', icon: XCircle, label: 'Cancelled' },
  pending: { color: 'yellow', icon: Clock, label: 'Pending' },
  'in-progress': { color: 'blue', icon: Package, label: 'In Progress' },
};

export const ActivityView = () => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'delivered' | 'cancelled' | 'pending'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'status'>('date');

  const filteredOrders = MOCK_HISTORY
    .filter(order => {
      const matchesSearch = 
        order.pickup.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.dropoff.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.includes(searchQuery);
      const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return b.price - a.price;
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

  const getIcon = (category: string) => {
    const cat = CATEGORIES.find(c => c.id === category);
    switch(category) {
      case 'bike': return '🚲';
      case 'truck': return '🚚';
      case 'wheelbarrow': return '🛒';
      case 'walking': return '🚶';
      default: return '📦';
    }
  };

  const StatusIcon = ({ status }: { status: string }) => {
    const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
    const Icon = config.icon;
    return <Icon className={`text-${config.color}-600`} size={16} />;
  };

  return (
    <div className="pb-24 animate-fade-in min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <AppBar 
        title="My Activity" 
        subtitle={`${filteredOrders.length} orders`}
        showBack={false}
        showLogout={true}
        notificationCount={0}
      />
      
      <div className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" size={20} />
          <Input
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search orders by location or ID..."
            className="!pl-12 !mb-0"
          />
        </div>

        {/* Filters */}
        <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-2">
          {(['all', 'delivered', 'cancelled', 'pending'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all touch-feedback active:scale-95 whitespace-nowrap flex-shrink-0 ${
                filterStatus === status
                  ? 'bg-pushr-blue text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 font-medium">Sort by:</span>
          <div className="flex space-x-2">
            {(['date', 'price', 'status'] as const).map(option => (
              <button
                key={option}
                onClick={() => setSortBy(option)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all touch-feedback active:scale-95 ${
                  sortBy === option
                    ? 'bg-pushr-blue text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => {
              const cat = CATEGORIES.find(c => c.id === order.category);
              const statusConfig = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
              const StatusIcon = statusConfig.icon;

              return (
                <Card
                  key={order.id}
                  className="!p-0 overflow-hidden touch-feedback active:scale-98 hover:shadow-lg transition-all"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="p-4 sm:p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm ${
                          order.status === 'delivered' 
                            ? 'bg-gradient-to-br from-blue-50 to-indigo-50' 
                            : order.status === 'cancelled'
                            ? 'bg-gray-100'
                            : 'bg-yellow-50'
                        }`}>
                          {getIcon(order.category)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-bold text-gray-900 text-base sm:text-lg">{cat?.name || 'Delivery'}</h4>
                            <StatusIcon status={order.status} />
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Calendar size={12} />
                            <span>{order.date}</span>
                            <span>•</span>
                            <Clock size={12} />
                            <span>{order.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-3 flex-shrink-0">
                        <span className="font-bold text-lg sm:text-xl text-gray-900 block">K{order.price}</span>
                        <Badge 
                          color={statusConfig.color as 'green' | 'red' | 'yellow' | 'blue'} 
                          size="sm"
                          className="mt-1"
                        >
                          {statusConfig.label}
                        </Badge>
                      </div>
                    </div>

                    {/* Route */}
                    <div className="space-y-2 mb-4 pl-4 border-l-2 border-gray-100">
                      <div className="flex items-center text-gray-700 text-sm">
                        <div className="w-2 h-2 bg-pushr-blue rounded-full mr-2 flex-shrink-0"></div>
                        <span className="font-semibold mr-2">From:</span>
                        <span className="truncate">{order.pickup}</span>
                      </div>
                      <div className="flex items-center text-gray-700 text-sm">
                        <div className="w-2 h-2 bg-pushr-accent rounded-full mr-2 flex-shrink-0"></div>
                        <span className="font-semibold mr-2">To:</span>
                        <span className="truncate">{order.dropoff}</span>
                      </div>
                    </div>

                    {/* Pusher Info & Actions */}
                    {order.status === 'delivered' && order.pusher && (
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-2">
                          {order.pusher.avatar && (
                            <img 
                              src={order.pusher.avatar} 
                              className="w-8 h-8 rounded-full object-cover ring-2 ring-pushr-blue/20"
                              alt={order.pusher.name}
                            />
                          )}
                          <div>
                            <p className="text-xs font-semibold text-gray-900">{order.pusher.name}</p>
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs text-gray-500">{order.pusher.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {order.rating && (
                            <div className="flex items-center space-x-1">
                              <span className="text-xs text-gray-500">Your rating:</span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i}
                                    className={`w-3 h-3 ${i < order.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                          {order.receipt && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                showToast('Receipt downloaded successfully!', 'success');
                                if ('vibrate' in navigator) navigator.vibrate(20);
                              }}
                              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-bold text-gray-700 transition-colors touch-feedback active:scale-95"
                            >
                              Receipt
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    <ChevronRight className="absolute top-4 right-4 text-gray-300" size={20} />
                  </div>
                </Card>
              );
            })
          ) : (
            <EmptyState
              icon="package"
              title={searchQuery || filterStatus !== 'all' ? "No orders found" : "No orders yet"}
              message={searchQuery || filterStatus !== 'all' ? "Try adjusting your search or filters" : "Your delivery history will appear here once you make your first order"}
              actionLabel={searchQuery || filterStatus !== 'all' ? undefined : "Create Order"}
              onAction={searchQuery || filterStatus !== 'all' ? undefined : () => {
                showToast('Navigate to home to create an order', 'info');
              }}
            />
          )}
        </div>
      </div>

      {/* Order Details Sheet */}
      {selectedOrder && (
        <Sheet
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title="Order Details"
          size="lg"
        >
          <div className="space-y-6">
            {/* Order Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {CATEGORIES.find(c => c.id === selectedOrder.category)?.name || 'Delivery'}
                </h3>
                <p className="text-sm text-gray-500">Order #{selectedOrder.id}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-pushr-blue">K{selectedOrder.price}</span>
                <Badge 
                  color={STATUS_CONFIG[selectedOrder.status as keyof typeof STATUS_CONFIG]?.color as 'green' | 'red' | 'yellow'}
                  size="md"
                  className="mt-2"
                >
                  {STATUS_CONFIG[selectedOrder.status as keyof typeof STATUS_CONFIG]?.label}
                </Badge>
              </div>
            </div>

            {/* Route Details */}
            <div className="space-y-4 p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-pushr-blue rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Pickup</p>
                  <p className="font-bold text-gray-900">{selectedOrder.pickup}</p>
                  <p className="text-xs text-gray-500 mt-1">{selectedOrder.date} • {selectedOrder.time}</p>
                </div>
              </div>
              
              <div className="w-px h-6 bg-gray-300 ml-4"></div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-pushr-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Dropoff</p>
                  <p className="font-bold text-gray-900">{selectedOrder.dropoff}</p>
                </div>
              </div>
            </div>

            {/* Pusher Info */}
            {selectedOrder.pusher && (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-3">Delivered By</p>
                <div className="flex items-center space-x-3">
                  {selectedOrder.pusher.avatar && (
                    <img 
                      src={selectedOrder.pusher.avatar} 
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-pushr-blue/20"
                      alt={selectedOrder.pusher.name}
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">{selectedOrder.pusher.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-700 font-semibold">{selectedOrder.pusher.rating}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth={false}
                    className="!px-4"
                    onClick={() => alert(`Calling ${selectedOrder.pusher.name}...`)}
                  >
                    Contact
                  </Button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              {selectedOrder.receipt && (
                <Button
                  variant="outline"
                  icon={<Package size={18} />}
                  onClick={() => {
                    showToast('Receipt downloaded successfully!', 'success');
                    if ('vibrate' in navigator) navigator.vibrate(20);
                  }}
                >
                  Download Receipt
                </Button>
              )}
              {selectedOrder.status === 'delivered' && !selectedOrder.rating && (
                <Button
                  icon={<Star size={18} />}
                  onClick={() => {
                    showToast('Thank you for your rating!', 'success');
                    if ('vibrate' in navigator) navigator.vibrate(30);
                    setSelectedOrder(null);
                  }}
                >
                  Rate This Delivery
                </Button>
              )}
            </div>
          </div>
        </Sheet>
      )}
    </div>
  );
};
