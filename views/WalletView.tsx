import React, { useState } from 'react';
import { User, MOCK_TRANSACTIONS } from '../types';
import { Card, Button, Badge, Input, Sheet, StatCard, Alert } from '../components/UI';
import { AppBar } from '../components/AppBar';
import { EmptyState } from '../components/EmptyState';
import { useToast } from '../hooks/useToast';
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, History, Search, Filter, TrendingUp, TrendingDown, Calendar, CreditCard, DollarSign } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const MONTHLY_DATA = [
  { month: 'Jan', spent: 240, earned: 0 },
  { month: 'Feb', spent: 380, earned: 0 },
  { month: 'Mar', spent: 520, earned: 0 },
  { month: 'Apr', spent: 310, earned: 0 },
  { month: 'May', spent: 450, earned: 200 },
  { month: 'Jun', spent: 390, earned: 0 },
];

const PAYMENT_METHODS = [
  { id: 'mtn', name: 'MTN Money', icon: 'MTN', color: 'bg-yellow-400', textColor: 'text-yellow-900', active: true, balance: '••••1234' },
  { id: 'airtel', name: 'Airtel Money', icon: 'AIR', color: 'bg-red-500', textColor: 'text-white', active: false },
  { id: 'zamtel', name: 'Zamtel Money', icon: 'ZAM', color: 'bg-blue-500', textColor: 'text-white', active: false },
];

export const WalletView = ({ user }: { user: User }) => {
  const { showToast } = useToast();
  const [showTopUp, setShowTopUp] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'credit' | 'debit'>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  const filteredTransactions = MOCK_TRANSACTIONS.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const totalSpent = MOCK_TRANSACTIONS
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalEarned = MOCK_TRANSACTIONS
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="pb-24 animate-fade-in min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <AppBar 
        title="My Wallet" 
        subtitle={`Balance: K${user.walletBalance?.toFixed(2)}`}
        showBack={false}
        showLogout={false}
      />
      
      <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
        {/* Balance Card */}
        <Card variant="elevated" className="!p-0 overflow-hidden relative">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 sm:p-8 text-white relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-pushr-blue/30 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-pushr-accent/20 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-400 font-medium text-sm uppercase tracking-wider">Total Balance</p>
                <Wallet className="w-6 h-6 text-pushr-accent" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-black mb-6 tracking-tight">K {user.walletBalance?.toFixed(2)}</h1>
              
              <div className="flex space-x-3">
                <Button 
                  variant="ghost"
                  className="flex-1 !bg-white/10 hover:!bg-white/20 !text-white !border-white/20 backdrop-blur-md"
                  onClick={() => setShowTopUp(true)}
                  icon={<Plus size={18} />}
                  fullWidth={false}
                >
                  Top Up
                </Button>
                <Button 
                  variant="ghost"
                  className="flex-1 !bg-pushr-blue !text-white !border-transparent hover:!bg-[#3A7AE5] shadow-lg shadow-blue-500/30"
                  onClick={() => setShowWithdraw(true)}
                  icon={<Wallet size={18} />}
                  fullWidth={false}
                >
                  Withdraw
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
          <StatCard 
            title="Total Spent" 
            value={`K${totalSpent}`}
            icon={<TrendingDown size={18} />}
            color="red"
            trend="down"
          />
          <StatCard 
            title="Total Earned" 
            value={`K${totalEarned}`}
            icon={<TrendingUp size={18} />}
            color="green"
            trend="up"
          />
        </div>

        {/* Spending Chart */}
        <Card variant="elevated" className="!p-5 sm:!p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-gray-900">Spending Trend</h3>
            <div className="flex space-x-2">
              {(['week', 'month', 'year'] as const).map(period => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors touch-feedback ${
                    selectedPeriod === period
                      ? 'bg-pushr-blue text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MONTHLY_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} stroke="#9CA3AF" />
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
                  dataKey="spent" 
                  stroke="#E11D1D" 
                  strokeWidth={3} 
                  dot={{ fill: '#E11D1D', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Payment Methods */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-gray-900">Payment Methods</h3>
            <button 
              className="text-pushr-blue text-sm font-bold active:scale-95 touch-feedback"
              onClick={() => {
                showToast('Payment method feature coming soon!', 'info');
                if ('vibrate' in navigator) navigator.vibrate(10);
              }}
            >
              Add +
            </button>
          </div>
          <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-2 -mx-4 sm:-mx-6 px-4 sm:px-6">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.id}
                onClick={() => {
                  showToast(`${method.name} selected`, 'success');
                  if ('vibrate' in navigator) navigator.vibrate(10);
                }}
                className={`min-w-[160px] flex flex-col items-center justify-center space-y-3 p-6 rounded-3xl border-2 transition-all touch-feedback active:scale-95 ${
                  method.active
                    ? 'border-pushr-blue bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg shadow-blue-500/20'
                    : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-md'
                }`}
              >
                <div className={`w-12 h-12 ${method.color} rounded-full flex items-center justify-center font-bold text-xs ${method.textColor} shadow-md`}>
                  {method.icon}
                </div>
                <span className="font-bold text-sm text-gray-900">{method.name}</span>
                {method.active && (
                  <Badge color="green" size="sm">Active</Badge>
                )}
                {method.balance && method.active && (
                  <span className="text-xs text-gray-500 font-mono">{method.balance}</span>
                )}
              </button>
            ))}
            <button 
              className="min-w-[80px] rounded-3xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-pushr-blue hover:text-pushr-blue transition-colors touch-feedback active:scale-95"
              onClick={() => {
                showToast('Add payment method feature coming soon!', 'info');
                if ('vibrate' in navigator) navigator.vibrate(10);
              }}
            >
              <Plus size={24} />
            </button>
          </div>
        </div>

        {/* Transactions Header */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-gray-900">Transactions</h3>
            <button className="text-pushr-blue text-sm font-bold active:scale-95 touch-feedback">
              See All
            </button>
          </div>

          {/* Search and Filter */}
          <div className="space-y-3 mb-4">
            <Input
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search transactions..."
              icon={<Search size={18} />}
            />
            <div className="flex space-x-2">
              {(['all', 'credit', 'debit'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all touch-feedback active:scale-95 ${
                    filterType === type
                      ? 'bg-pushr-blue text-white shadow-lg shadow-blue-500/30'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {type === 'all' ? 'All' : type === 'credit' ? 'Income' : 'Expenses'}
                </button>
              ))}
            </div>
          </div>
          
          {/* Transactions List */}
          <div className="space-y-3">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map(t => (
                <Card 
                  key={t.id} 
                  className="!p-4 hover:shadow-md transition-all touch-feedback active:scale-98"
                  onClick={() => {
                    showToast(`Viewing transaction: ${t.description}`, 'info');
                    if ('vibrate' in navigator) navigator.vibrate(10);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                        t.type === 'credit' 
                          ? 'bg-gradient-to-br from-green-100 to-emerald-100 text-pushr-success' 
                          : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600'
                      }`}>
                        {t.type === 'credit' ? (
                          <ArrowDownLeft size={20} className="text-pushr-success" />
                        ) : (
                          <ArrowUpRight size={20} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 text-sm sm:text-base truncate">{t.description}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <p className="text-xs text-gray-500">{t.date}</p>
                          <span className="text-gray-300">•</span>
                          <Badge 
                            color={t.status === 'success' ? 'green' : t.status === 'pending' ? 'yellow' : 'red'} 
                            size="sm"
                          >
                            {t.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4 flex-shrink-0">
                      <span className={`font-bold text-lg sm:text-xl block ${
                        t.type === 'credit' ? 'text-pushr-success' : 'text-gray-900'
                      }`}>
                        {t.type === 'credit' ? '+' : '-'}K{t.amount}
                      </span>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <EmptyState
                icon="card"
                title={searchQuery || filterType !== 'all' ? "No transactions found" : "No transactions yet"}
                message={searchQuery || filterType !== 'all' ? "Try adjusting your search or filters" : "Your transaction history will appear here once you start using your wallet"}
              />
            )}
          </div>
        </div>
      </div>

      {/* Top Up Sheet */}
      <Sheet 
        isOpen={showTopUp} 
        onClose={() => setShowTopUp(false)}
        title="Top Up Wallet"
        size="md"
      >
        <div className="space-y-4">
          <Alert
            type="info"
            message="Choose amount and payment method to top up your wallet"
          />
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (ZMW)</label>
            <Input
              type="number"
              value=""
              onChange={() => {}}
              placeholder="Enter amount"
              icon={<CreditCard size={18} />}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method</label>
            <div className="space-y-2">
              {PAYMENT_METHODS.filter(m => m.active).map(method => (
                <button
                  key={method.id}
                  className="w-full p-4 rounded-2xl border-2 border-gray-200 hover:border-pushr-blue transition-colors text-left touch-feedback active:scale-98"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${method.color} rounded-full flex items-center justify-center font-bold text-xs ${method.textColor}`}>
                      {method.icon}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{method.name}</p>
                      {method.balance && <p className="text-xs text-gray-500 font-mono">{method.balance}</p>}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <Button onClick={() => {
            setShowTopUp(false);
            if ('vibrate' in navigator) navigator.vibrate(30);
            alert('Top up successful!');
          }}>
            Top Up K100
          </Button>
        </div>
      </Sheet>

      {/* Withdraw Sheet */}
      <Sheet 
        isOpen={showWithdraw} 
        onClose={() => setShowWithdraw(false)}
        title="Withdraw Funds"
        size="md"
      >
        <div className="space-y-4">
          <Alert
            type="info"
            message="Withdraw to your registered mobile money account"
          />
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (ZMW)</label>
            <Input
              type="number"
              value=""
              onChange={() => {}}
              placeholder="Enter amount"
              icon={<DollarSign size={18} />}
            />
            <p className="text-xs text-gray-500 mt-1">Available: K{user.walletBalance?.toFixed(2)}</p>
          </div>

          <Button onClick={() => {
            setShowWithdraw(false);
            if ('vibrate' in navigator) navigator.vibrate(30);
            alert('Withdrawal request submitted!');
          }}>
            Withdraw Now
          </Button>
        </div>
      </Sheet>
    </div>
  );
};
