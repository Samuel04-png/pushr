import React, { useState } from 'react';
import { Card, Badge, Button, Sheet, Input, StatCard } from '../components/UI';
import { AppBar } from '../components/AppBar';
import { Users, Search, Filter, Star, DollarSign, AlertCircle, CheckCircle2, XCircle, Eye, Shield, Ban, TrendingUp, Zap } from 'lucide-react';
import { ConfirmationModal } from '../components/ConfirmationModal';

const MOCK_PUSHERS = [
  {
    id: 'P001',
    name: 'Kennedy M.',
    phone: '+260 977 789012',
    email: 'kennedy@example.com',
    rating: 4.9,
    totalDeliveries: 142,
    totalEarnings: 12500,
    floatBalance: 3,
    isOnline: true,
    verificationStatus: 'verified' as const,
    documents: {
      id: 'uploaded',
      vehicle: 'uploaded',
      license: 'uploaded'
    },
    createdAt: Date.now() - 86400000 * 90,
  },
  {
    id: 'P002',
    name: 'Mwila J.',
    phone: '+260 977 123456',
    email: 'mwila@example.com',
    rating: 4.8,
    totalDeliveries: 98,
    totalEarnings: 8900,
    floatBalance: 5,
    isOnline: false,
    verificationStatus: 'pending' as const,
    documents: {
      id: 'uploaded',
      vehicle: 'pending',
      license: 'uploaded'
    },
    createdAt: Date.now() - 86400000 * 30,
  },
  {
    id: 'P003',
    name: 'Sarah K.',
    phone: '+260 977 234567',
    email: 'sarah@example.com',
    rating: 5.0,
    totalDeliveries: 201,
    totalEarnings: 18900,
    floatBalance: 12,
    isOnline: true,
    verificationStatus: 'verified' as const,
    documents: {
      id: 'uploaded',
      vehicle: 'uploaded',
      license: 'uploaded'
    },
    createdAt: Date.now() - 86400000 * 120,
  },
];

export const AdminManagePushersView = ({ onBack }: { onBack: () => void }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'pending' | 'rejected' | 'online' | 'offline'>('all');
  const [selectedPusher, setSelectedPusher] = useState<any>(null);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);

  const filteredPushers = MOCK_PUSHERS.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' ||
      (filterStatus === 'verified' && p.verificationStatus === 'verified') ||
      (filterStatus === 'pending' && p.verificationStatus === 'pending') ||
      (filterStatus === 'rejected' && p.verificationStatus === 'rejected') ||
      (filterStatus === 'online' && p.isOnline) ||
      (filterStatus === 'offline' && !p.isOnline);
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: MOCK_PUSHERS.length,
    verified: MOCK_PUSHERS.filter(p => p.verificationStatus === 'verified').length,
    pending: MOCK_PUSHERS.filter(p => p.verificationStatus === 'pending').length,
    online: MOCK_PUSHERS.filter(p => p.isOnline).length,
    totalEarnings: MOCK_PUSHERS.reduce((sum, p) => sum + p.totalEarnings, 0),
  };

  const handleApprove = (pusherId: string) => {
    alert(`Pusher ${pusherId} approved!`);
    setShowApproveModal(false);
    setSelectedPusher(null);
    if ('vibrate' in navigator) navigator.vibrate(30);
  };

  const handleReject = (pusherId: string) => {
    alert(`Pusher ${pusherId} rejected!`);
    setSelectedPusher(null);
    if ('vibrate' in navigator) navigator.vibrate(20);
  };

  const handleSuspend = (pusherId: string) => {
    alert(`Pusher ${pusherId} suspended!`);
    setShowSuspendModal(false);
    setSelectedPusher(null);
    if ('vibrate' in navigator) navigator.vibrate(50);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 pb-6 sm:pb-8 space-y-4 sm:space-y-6 animate-fade-in min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <AppBar 
        title="Manage Pushers"
        subtitle={`${filteredPushers.length} pushers`}
        showBack={true}
        onBack={onBack}
        showLogout={false}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <StatCard title="Total" value={stats.total} icon={<Users size={18} />} color="blue" />
        <StatCard title="Online" value={stats.online} icon={<Zap size={18} />} color="green" />
        <StatCard title="Verified" value={stats.verified} icon={<CheckCircle2 size={18} />} color="green" />
        <StatCard title="Pending" value={stats.pending} icon={<AlertCircle size={18} />} color="yellow" />
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        <Input
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by name, phone, or ID..."
          icon={<Search size={18} />}
          className="!mb-0"
        />
        <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-2">
          {(['all', 'verified', 'pending', 'online', 'offline'] as const).map(status => (
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

      {/* Pushers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {filteredPushers.length > 0 ? (
          filteredPushers.map(pusher => (
            <Card
              key={pusher.id}
              variant="elevated"
              className="!p-5 hover:shadow-lg transition-all touch-feedback active:scale-98"
              onClick={() => setSelectedPusher(pusher)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-pushr-blue to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
                      {pusher.name.charAt(0)}
                    </div>
                    {pusher.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-pushr-success rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-bold text-gray-900">{pusher.name}</h4>
                      <Badge 
                        color={
                          pusher.verificationStatus === 'verified' ? 'green' :
                          pusher.verificationStatus === 'pending' ? 'yellow' : 'red'
                        }
                        size="sm"
                      >
                        {pusher.verificationStatus}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{pusher.rating}</span>
                      <span>•</span>
                      <span>{pusher.totalDeliveries} deliveries</span>
                    </div>
                  </div>
                </div>
                <div className="text-right ml-4 flex-shrink-0">
                  <span className="block font-bold text-lg text-pushr-blue">K{pusher.totalEarnings.toLocaleString()}</span>
                  <Badge color={pusher.isOnline ? 'green' : 'gray'} size="sm" className="mt-1">
                    {pusher.isOnline ? 'Online' : 'Offline'}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Zap size={14} className="mr-1" />
                    {pusher.floatBalance} float
                  </span>
                  <span>•</span>
                  <span>{pusher.phone}</span>
                </div>
                <Eye className="w-5 h-5 text-gray-400" />
              </div>
            </Card>
          ))
        ) : (
          <Card variant="outlined" className="!p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No pushers found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
          </Card>
        )}
      </div>

      {/* Pusher Details Sheet */}
      {selectedPusher && (
        <Sheet
          isOpen={!!selectedPusher}
          onClose={() => setSelectedPusher(null)}
          title={`Pusher #${selectedPusher.id}`}
          size="lg"
        >
          <div className="space-y-6">
            {/* Status and Actions */}
            <div className="flex items-center justify-between">
              <Badge 
                color={
                  selectedPusher.verificationStatus === 'verified' ? 'green' :
                  selectedPusher.verificationStatus === 'pending' ? 'yellow' : 'red'
                }
                size="lg"
              >
                {selectedPusher.verificationStatus}
              </Badge>
              <div className="flex space-x-2">
                {selectedPusher.verificationStatus === 'pending' && (
                  <>
                    <Button
                      variant="success"
                      size="sm"
                      fullWidth={false}
                      onClick={() => setShowApproveModal(true)}
                      icon={<CheckCircle2 size={16} />}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      fullWidth={false}
                      onClick={() => handleReject(selectedPusher.id)}
                      icon={<XCircle size={16} />}
                    >
                      Reject
                    </Button>
                  </>
                )}
                {selectedPusher.verificationStatus === 'verified' && (
                  <Button
                    variant="danger"
                    size="sm"
                    fullWidth={false}
                    onClick={() => setShowSuspendModal(true)}
                    icon={<Ban size={16} />}
                  >
                    Suspend
                  </Button>
                )}
              </div>
            </div>

            {/* Pusher Info */}
            <Card variant="outlined" className="!p-5">
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Personal Information</p>
                  <p className="font-bold text-gray-900 text-lg">{selectedPusher.name}</p>
                  <p className="text-sm text-gray-600">{selectedPusher.phone}</p>
                  <p className="text-sm text-gray-600">{selectedPusher.email}</p>
                </div>

                <div className="h-px bg-gray-200"></div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase mb-1">Rating</p>
                    <div className="flex items-center space-x-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-gray-900">{selectedPusher.rating}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase mb-1">Total Deliveries</p>
                    <p className="font-bold text-gray-900">{selectedPusher.totalDeliveries}</p>
                  </div>
                </div>

                <div className="h-px bg-gray-200"></div>

                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Total Earnings</p>
                  <p className="text-2xl font-black text-pushr-blue">K{selectedPusher.totalEarnings.toLocaleString()}</p>
                </div>

                <div className="h-px bg-gray-200"></div>

                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Float Balance</p>
                  <p className="text-xl font-black text-gray-900">{selectedPusher.floatBalance} jobs</p>
                </div>
              </div>
            </Card>

            {/* Documents */}
            <Card variant="outlined" className="!p-5">
              <p className="text-xs text-gray-500 font-bold uppercase mb-3">Verification Documents</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">National ID</span>
                  <Badge color={selectedPusher.documents.id === 'uploaded' ? 'green' : 'yellow'} size="sm">
                    {selectedPusher.documents.id === 'uploaded' ? 'Verified' : 'Pending'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Vehicle Registration</span>
                  <Badge color={selectedPusher.documents.vehicle === 'uploaded' ? 'green' : 'yellow'} size="sm">
                    {selectedPusher.documents.vehicle === 'uploaded' ? 'Verified' : 'Pending'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Driver License</span>
                  <Badge color={selectedPusher.documents.license === 'uploaded' ? 'green' : 'yellow'} size="sm">
                    {selectedPusher.documents.license === 'uploaded' ? 'Verified' : 'Pending'}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <div className="flex space-x-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => alert(`View ${selectedPusher.name} details`)}
                icon={<Eye size={18} />}
                fullWidth={false}
              >
                View Details
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => alert(`Contact ${selectedPusher.name}`)}
                icon={<DollarSign size={18} />}
                fullWidth={false}
              >
                Earnings
              </Button>
            </div>
          </div>
        </Sheet>
      )}

      {/* Approval Confirmation Modal */}
      {showApproveModal && selectedPusher && (
        <ConfirmationModal
          isOpen={showApproveModal}
          onClose={() => setShowApproveModal(false)}
          onConfirm={() => handleApprove(selectedPusher.id)}
          title="Approve Pusher Verification"
          message={`Are you sure you want to approve ${selectedPusher.name}? This will allow them to accept deliveries.`}
          type="success"
          confirmLabel="Approve"
          cancelLabel="Cancel"
        />
      )}

      {/* Suspend Confirmation Modal */}
      {showSuspendModal && selectedPusher && (
        <ConfirmationModal
          isOpen={showSuspendModal}
          onClose={() => setShowSuspendModal(false)}
          onConfirm={() => handleSuspend(selectedPusher.id)}
          title="Suspend Pusher"
          message={`Are you sure you want to suspend ${selectedPusher.name}? They will not be able to accept new deliveries.`}
          type="danger"
          confirmLabel="Suspend"
          cancelLabel="Cancel"
        />
      )}
    </div>
  );
};

