import React, { useState } from 'react';
import { Card, StatCard, Badge, Button, Sheet } from '../components/UI';
import { AppBar } from '../components/AppBar';
import { AdminManageDeliveriesView } from './AdminManageDeliveriesView';
import { AdminManagePushersView } from './AdminManagePushersView';
import { AdminVerificationQueueView } from './AdminVerificationQueueView';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Package, DollarSign, AlertCircle, CheckCircle2, XCircle, Clock, MapPin, RefreshCw, Briefcase, CreditCard, Settings, HelpCircle, Shield } from 'lucide-react';

const WEEKLY_DATA = [
  { name: 'Mon', orders: 40, rev: 2400, deliveries: 38 },
  { name: 'Tue', orders: 30, rev: 1398, deliveries: 28 },
  { name: 'Wed', orders: 20, rev: 980, deliveries: 18 },
  { name: 'Thu', orders: 27, rev: 3908, deliveries: 25 },
  { name: 'Fri', orders: 18, rev: 4800, deliveries: 16 },
  { name: 'Sat', orders: 23, rev: 3800, deliveries: 21 },
  { name: 'Sun', orders: 34, rev: 4300, deliveries: 32 },
];

const CATEGORY_DATA = [
  { name: 'Bike', value: 45, color: '#4489F7' },
  { name: 'Walking', value: 25, color: '#F7C10F' },
  { name: 'Truck', value: 20, color: '#7EDE21' },
  { name: 'Wheelbarrow', value: 10, color: '#E11D1D' },
];

const PENDING_VERIFICATIONS = [
  { id: '1', name: 'John Doe', idNumber: '8299102', phone: '+260 977 123456', status: 'pending', date: '2024-01-15' },
  { id: '2', name: 'Jane Smith', idNumber: '8299103', phone: '+260 977 654321', status: 'pending', date: '2024-01-14' },
  { id: '3', name: 'Mike Johnson', idNumber: '8299104', phone: '+260 977 789012', status: 'pending', date: '2024-01-13' },
];

export const AdminView = () => {
  const [adminView, setAdminView] = useState<'dashboard' | 'deliveries' | 'pushers' | 'payments' | 'settings' | 'verifications'>('dashboard');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
    if ('vibrate' in navigator) navigator.vibrate(20);
  };


  // Route to different admin views
  if (adminView === 'deliveries') {
    return <AdminManageDeliveriesView onBack={() => setAdminView('dashboard')} />;
  }

  if (adminView === 'pushers') {
    return <AdminManagePushersView onBack={() => setAdminView('dashboard')} />;
  }

  if (adminView === 'verifications') {
    return <AdminVerificationQueueView onBack={() => setAdminView('dashboard')} />;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 bg-gradient-to-b from-gray-50 to-white min-h-screen animate-fade-in pb-6 sm:pb-8">
      <AppBar
        title="Pushr Admin"
        subtitle="Dashboard Overview"
        showBack={false}
        showNotifications={true}
        notificationCount={3}
        onNotificationsClick={() => alert('Notifications')}
        showLogout={true}
        onLogout={() => {
          if (confirm('Logout from admin?')) {
            window.location.reload();
          }
        }}
        rightAction={
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              className={`p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors touch-feedback active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center ${
                refreshing ? 'animate-spin' : ''
              }`}
            >
              <RefreshCw size={18} className="text-gray-700" />
            </button>
            <Badge color="blue" size="sm">Super Admin</Badge>
          </div>
        }
      />

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <button
          onClick={() => setAdminView('deliveries')}
          className="p-4 sm:p-5 bg-white rounded-2xl border-2 border-gray-100 hover:border-pushr-blue hover:shadow-lg transition-all touch-feedback active:scale-95 text-left"
        >
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
            <Package className="text-pushr-blue" size={20} />
          </div>
          <h3 className="font-bold text-gray-900 text-sm sm:text-base">Deliveries</h3>
          <p className="text-xs text-gray-500 mt-1">Manage orders</p>
        </button>

        <button
          onClick={() => setAdminView('pushers')}
          className="p-4 sm:p-5 bg-white rounded-2xl border-2 border-gray-100 hover:border-pushr-blue hover:shadow-lg transition-all touch-feedback active:scale-95 text-left"
        >
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-3">
            <Users className="text-pushr-success" size={20} />
          </div>
          <h3 className="font-bold text-gray-900 text-sm sm:text-base">Pushers</h3>
          <p className="text-xs text-gray-500 mt-1">Manage workers</p>
        </button>

        <button
          onClick={() => setAdminView('verifications')}
          className="p-4 sm:p-5 bg-white rounded-2xl border-2 border-gray-100 hover:border-pushr-blue hover:shadow-lg transition-all touch-feedback active:scale-95 text-left relative"
        >
          {PENDING_VERIFICATIONS.length > 0 && (
            <span className="absolute top-2 right-2 w-5 h-5 bg-pushr-danger rounded-full flex items-center justify-center text-white text-[10px] font-bold">
              {PENDING_VERIFICATIONS.length}
            </span>
          )}
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mb-3">
            <Shield className="text-pushr-warning" size={20} />
          </div>
          <h3 className="font-bold text-gray-900 text-sm sm:text-base">Verifications</h3>
          <p className="text-xs text-gray-500 mt-1">Review applications</p>
        </button>

        <button
          onClick={() => alert('Payments management coming soon')}
          className="p-4 sm:p-5 bg-white rounded-2xl border-2 border-gray-100 hover:border-pushr-blue hover:shadow-lg transition-all touch-feedback active:scale-95 text-left"
        >
          <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center mb-3">
            <CreditCard className="text-pushr-accent" size={20} />
          </div>
          <h3 className="font-bold text-gray-900 text-sm sm:text-base">Payments</h3>
          <p className="text-xs text-gray-500 mt-1">Manage finances</p>
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <StatCard 
          title="Total Revenue" 
          value="K24,500"
          change={12}
          trend="up"
          icon={<DollarSign size={18} />}
          color="green"
        />
        <StatCard 
          title="Active Pushers" 
          value="142"
          icon={<Users size={18} />}
          color="blue"
        />
        <StatCard 
          title="Today's Orders" 
          value="34"
          change={8}
          trend="up"
          icon={<Package size={18} />}
          color="orange"
        />
        <StatCard 
          title="Pending Reviews" 
          value={PENDING_VERIFICATIONS.length}
          icon={<AlertCircle size={18} />}
          color="red"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {/* Weekly Orders */}
        <Card variant="elevated" className="!p-4 sm:!p-5 md:!p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base sm:text-lg text-gray-900">Weekly Orders</h3>
            <Badge color="blue" size="sm">This Week</Badge>
          </div>
          <div className="h-56 sm:h-64 lg:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} stroke="#9CA3AF" />
                <YAxis axisLine={false} tickLine={false} fontSize={12} stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: 'none', 
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar dataKey="orders" fill="#4489F7" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Revenue Trend */}
        <Card variant="elevated" className="!p-4 sm:!p-5 md:!p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base sm:text-lg text-gray-900">Revenue Trend</h3>
            <Badge color="orange" size="sm">↑ 12%</Badge>
          </div>
          <div className="h-56 sm:h-64 lg:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={WEEKLY_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} stroke="#9CA3AF" />
                <YAxis axisLine={false} tickLine={false} fontSize={12} stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: 'none', 
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="rev" 
                  stroke="#F7C10F" 
                  strokeWidth={3} 
                  dot={{ fill: '#F7C10F', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Category Distribution */}
      <Card variant="elevated" className="!p-4 sm:!p-5 md:!p-6">
        <h3 className="font-bold text-base sm:text-lg mb-4 text-gray-900">Delivery Category Distribution</h3>
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="h-40 w-40 sm:h-48 sm:w-48 lg:h-56 lg:w-56 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {CATEGORY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-3">
            {CATEGORY_DATA.map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: cat.color }}
                  ></div>
                  <span className="font-semibold text-gray-900">{cat.name}</span>
                </div>
                <span className="font-bold text-gray-900">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Pending Verifications Quick View */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="font-bold text-base sm:text-lg text-gray-900">Pending Verifications</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAdminView('verifications')}
            icon={<Shield size={16} />}
            fullWidth={false}
          >
            View All
          </Button>
        </div>
        
        {PENDING_VERIFICATIONS.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {PENDING_VERIFICATIONS.slice(0, 3).map(user => (
              <Card 
                key={user.id} 
                variant="elevated" 
                className="!p-4 sm:!p-5 hover:shadow-lg transition-all touch-feedback active:scale-98 cursor-pointer"
                onClick={() => setAdminView('verifications')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-pushr-blue to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-lg flex-shrink-0">
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-sm sm:text-base md:text-lg truncate">{user.name}</h4>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-0.5 sm:space-y-0 mt-1">
                        <p className="text-[10px] sm:text-xs text-gray-500 font-mono truncate">ID: {user.idNumber}</p>
                        <span className="hidden sm:inline text-gray-300">•</span>
                        <p className="text-[10px] sm:text-xs text-gray-500 truncate">{user.phone}</p>
                      </div>
                      <div className="flex items-center space-x-2 mt-2 flex-wrap gap-1">
                        <Badge color="yellow" size="sm">
                          <Clock size={8} className="mr-1" />
                          Pending
                        </Badge>
                        <span className="text-[10px] sm:text-xs text-gray-400">{user.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            {PENDING_VERIFICATIONS.length > 3 && (
              <Button
                variant="outline"
                onClick={() => setAdminView('verifications')}
                fullWidth={true}
              >
                View {PENDING_VERIFICATIONS.length - 3} more...
              </Button>
            )}
          </div>
        ) : (
          <Card variant="outlined" className="!p-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-pushr-success mx-auto mb-3" />
            <p className="text-gray-600 font-medium">All verifications complete!</p>
            <p className="text-sm text-gray-400 mt-1">No pending reviews</p>
          </Card>
        )}
      </div>
    </div>
  );
};
