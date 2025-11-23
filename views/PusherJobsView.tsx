import React, { useState, useEffect } from 'react';
import { User, Role } from '../types';
import { Button, Card, Badge, Alert, StatCard, Sheet } from '../components/UI';
import { AppBar } from '../components/AppBar';
import { RoleSwitcher } from '../components/RoleSwitcher';
import { MapPin, Zap, Navigation, AlertCircle, Sparkles, Package, DollarSign, TrendingUp, Clock, Star, Target, Award, Trophy, Calendar, ArrowRight, CheckCircle2, Phone, MessageSquare, Info } from 'lucide-react';
import { getPusherOptimizationTip } from '../services/geminiService';
import { PusherActiveDeliveryView } from './PusherActiveDeliveryView';

const MOCK_JOBS = [
  {
    id: '1',
    type: 'Food Delivery',
    category: 'bike',
    pickup: 'Arcades Mall',
    dropoff: 'Roma Park',
    distance: '2.5 km',
    price: 45,
    weight: '< 5kg',
    eta: '15 mins',
    customerRating: 4.9,
    priority: false,
    title: 'Food Delivery',
    load: 'Small',
  },
  {
    id: '2',
    type: 'Document',
    category: 'walking',
    pickup: 'Cairo Road',
    dropoff: 'East Park Mall',
    distance: '1.8 km',
    price: 25,
    weight: '< 2kg',
    eta: '10 mins',
    customerRating: 4.8,
    priority: true,
    title: 'Document',
    load: 'Small',
  },
  {
    id: '3',
    type: 'Package',
    category: 'bike',
    pickup: 'Manda Hill',
    dropoff: 'Woodlands',
    distance: '4.2 km',
    price: 65,
    weight: '< 10kg',
    eta: '20 mins',
    customerRating: 5.0,
    priority: false,
    title: 'Package',
    load: 'Medium',
  }
];

interface PusherJobsViewProps {
  user: User;
  floatBalance: number;
  isOnline: boolean;
  onAcceptJob: (job: any) => void;
  onToggleOnline: () => void;
  onGoToFloat: () => void;
  onRoleChange?: (role: Role) => void;
}

export const PusherJobsView = ({
  user,
  floatBalance,
  isOnline,
  onAcceptJob,
  onToggleOnline,
  onGoToFloat,
  onRoleChange,
}: PusherJobsViewProps) => {
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [activeJob, setActiveJob] = useState<any>(null);
  const [aiTip, setAiTip] = useState<string>('');
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    getPusherOptimizationTip({ rating: user.rating || 4.8, jobs: 142 }).then(setAiTip);
  }, [user.rating]);

  const handleAcceptJob = (job: any) => {
    if (floatBalance <= 0) {
      alert('You need more float to accept jobs. Please top up first.');
      onGoToFloat();
      if ('vibrate' in navigator) navigator.vibrate([50, 50, 50]);
      return;
    }

    if (!isOnline) {
      alert('You must be online to accept jobs.');
      return;
    }

    setActiveJob(job);
    onAcceptJob(job);
    setSelectedJob(null);
    if ('vibrate' in navigator) navigator.vibrate(30);
  };

  // Active Job View
  if (activeJob) {
    return (
      <PusherActiveDeliveryView
        delivery={{
          id: activeJob.id,
          pickup: activeJob.pickup,
          dropoff: activeJob.dropoff,
          customer: {
            name: 'Mwila J.',
            phone: '+260 977 123456'
          },
          price: activeJob.price,
          category: activeJob.category,
          status: 'accepted'
        }}
        onPickup={(proof) => {
          console.log('Pickup proof:', proof);
        }}
        onDeliver={(proof) => {
          console.log('Delivery proof:', proof);
          setActiveJob(null);
        }}
        onCancel={() => {
          setActiveJob(null);
        }}
      />
    );
  }

  // Jobs List View
  return (
    <div className="pb-24 sm:pb-32 space-y-4 sm:space-y-6 animate-fade-in min-h-screen bg-gradient-to-b from-green-50/30 via-white to-white">
      {/* Enhanced Header */}
      <div className="relative -m-4 sm:-m-6 mb-4 sm:mb-6 p-4 sm:p-6 md:p-8 bg-gradient-to-br from-pushr-success via-green-600 to-emerald-700 rounded-b-3xl text-white overflow-visible">
        <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-white/10 rounded-full -mr-24 sm:-mr-32 -mt-24 sm:-mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-36 sm:w-48 h-36 sm:h-48 bg-pushr-accent/20 rounded-full -ml-18 sm:-ml-24 -mb-18 sm:-mb-24 blur-2xl"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1.5 sm:space-x-2 mb-1.5 sm:mb-2 flex-wrap gap-1.5 sm:gap-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black truncate">Available Jobs</h1>
                {onRoleChange && (
                  <RoleSwitcher
                    currentRole={user.role}
                    availableRoles={['customer', 'pusher']}
                    onRoleChange={onRoleChange}
                    compact={false}
                  />
                )}
              </div>
              <p className="text-white/90 text-sm sm:text-base font-medium truncate">
                {isOnline ? "Jobs near you" : "Turn online to see jobs"}
              </p>
            </div>
            <button
              onClick={onToggleOnline}
              className={`px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm transition-all touch-feedback active:scale-95 shadow-lg flex-shrink-0 min-h-[44px] ${
                isOnline
                  ? 'bg-white text-pushr-success shadow-white/30'
                  : 'bg-white/20 text-white border-2 border-white/30'
              }`}
            >
              <span className="hidden sm:inline">{isOnline ? '🟢 Online' : '⚪ Offline'}</span>
              <span className="sm:hidden">{isOnline ? '🟢' : '⚪'}</span>
            </button>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-4 sm:mt-6">
            <div className="bg-white/20 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/30">
              <p className="text-white/80 text-[10px] sm:text-xs font-semibold mb-0.5 sm:mb-1">Today</p>
              <p className="text-xl sm:text-2xl font-black">K125</p>
              <p className="text-white/70 text-[10px] sm:text-xs mt-0.5 sm:mt-1">↑ 15%</p>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/30">
              <p className="text-white/80 text-[10px] sm:text-xs font-semibold mb-0.5 sm:mb-1">This Week</p>
              <p className="text-xl sm:text-2xl font-black">K890</p>
              <p className="text-white/70 text-[10px] sm:text-xs mt-0.5 sm:mt-1">↑ 23%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-3 sm:px-4 md:px-6 space-y-4 sm:space-y-6">

      {/* Low Float Warning */}
      {floatBalance <= 0 && (
        <Alert
          type="error"
          title="No Float Available"
          message="You need to purchase float to accept jobs. Tap below to buy float."
          className="animate-slide-down"
        />
      )}

      {floatBalance < 3 && floatBalance > 0 && (
        <Alert
          type="warning"
          title="Low Float Balance"
          message={`You have ${floatBalance} job${floatBalance !== 1 ? 's' : ''} remaining. Consider topping up.`}
          className="animate-slide-down"
        />
      )}


      {/* AI Tip */}
      {aiTip && (
        <Card variant="outlined" className="!p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 animate-slide-up">
          <div className="flex items-start space-x-3">
            <Sparkles className="text-pushr-blue flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-bold text-gray-900 text-sm mb-1">AI Optimization Tip</p>
              <p className="text-sm text-gray-700 leading-relaxed">{aiTip}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Jobs List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-gray-900">Nearby Jobs</h3>
          <Badge color="blue" size="sm">{MOCK_JOBS.length} available</Badge>
        </div>

        {!isOnline ? (
          <Card variant="outlined" className="!p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium mb-2">You're Offline</p>
            <p className="text-sm text-gray-400 mb-4">Turn online to see available jobs</p>
            <Button
              onClick={onToggleOnline}
              icon={<Zap size={18} />}
              size="md"
              fullWidth={false}
              className="mx-auto"
            >
              Go Online
            </Button>
          </Card>
        ) : MOCK_JOBS.length > 0 ? (
          <div className="space-y-4">
            {MOCK_JOBS.map((job) => (
              <Card
                key={job.id}
                variant="elevated"
                className="!p-5 overflow-hidden hover:shadow-lg transition-all duration-300 group touch-feedback active:scale-98"
                onClick={() => setSelectedJob(job)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-pushr-blue/10 p-3 rounded-2xl text-pushr-blue group-hover:bg-pushr-blue group-hover:text-white transition-colors">
                      <Package size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-pushr-gray-900 text-lg">{job.title}</p>
                      <p className="text-xs text-pushr-gray-500 font-medium bg-pushr-gray-100 px-2 py-1 rounded-md inline-block mt-1">
                        {job.load} • {job.weight}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-2xl text-pushr-gray-900">K{job.price}</span>
                    {job.priority && (
                      <Badge color="orange" size="sm" className="mt-1">Priority</Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3 relative pl-4 border-l-2 border-pushr-gray-100 ml-2 mb-5">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center text-pushr-gray-600 text-sm">
                      <MapPin size={14} className="mr-2 text-pushr-blue" />
                      <span className="font-bold text-pushr-gray-900 mr-2">From:</span> {job.pickup}
                    </div>
                    <div className="flex items-center text-pushr-gray-600 text-sm">
                      <MapPin size={14} className="mr-2 text-pushr-accent" />
                      <span className="font-bold text-pushr-gray-900 mr-2">To:</span> {job.dropoff}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <MapPin size={12} className="mr-1" /> {job.distance}
                    </span>
                    <span className="flex items-center">
                      <Clock size={12} className="mr-1" /> {job.eta}
                    </span>
                    <span className="flex items-center">
                      <Star size={12} className="mr-1 fill-yellow-400 text-yellow-400" /> {job.customerRating}
                    </span>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAcceptJob(job);
                    }}
                    disabled={floatBalance <= 0 || !isOnline}
                    size="sm"
                    fullWidth={false}
                    icon={<CheckCircle2 size={16} />}
                  >
                    Accept
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card variant="outlined" className="!p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium mb-2">No Jobs Available</p>
            <p className="text-sm text-gray-400">Check back later for new delivery requests</p>
          </Card>
        )}
      </div>

      {/* Job Details Sheet */}
      {selectedJob && (
        <Sheet
          isOpen={!!selectedJob}
          onClose={() => setSelectedJob(null)}
          title="Job Details"
          size="md"
        >
          <div className="space-y-6">
            <Card variant="outlined" className="!p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-xl text-gray-900">{selectedJob.title}</h3>
                  <p className="text-sm text-gray-500">{selectedJob.type}</p>
                </div>
                <span className="font-black text-3xl text-pushr-blue">K{selectedJob.price}</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Distance</span>
                  <span className="font-semibold text-gray-900">{selectedJob.distance}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Estimated Time</span>
                  <span className="font-semibold text-gray-900">{selectedJob.eta}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Weight</span>
                  <span className="font-semibold text-gray-900">{selectedJob.weight}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Customer Rating</span>
                  <div className="flex items-center space-x-1">
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-900">{selectedJob.customerRating}</span>
                  </div>
                </div>
              </div>
            </Card>

            <div className="space-y-3">
              <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Pickup</p>
                <p className="font-bold text-gray-900">{selectedJob.pickup}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Dropoff</p>
                <p className="font-bold text-gray-900">{selectedJob.dropoff}</p>
              </div>
            </div>

            <Button
              onClick={() => {
                handleAcceptJob(selectedJob);
              }}
              disabled={floatBalance <= 0 || !isOnline}
              icon={<CheckCircle2 size={18} />}
            >
              Accept This Job
            </Button>
          </div>
        </Sheet>
      )}
      </div>
    </div>
  );
};

