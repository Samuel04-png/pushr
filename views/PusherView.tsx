import React, { useState, useEffect } from 'react';
import { User, MOCK_FLOAT_PACKAGES } from '../types';
import { Button, Card, Badge, Header, Alert, StatCard, Sheet } from '../components/UI';
import { MapPin, Zap, Navigation, AlertCircle, Sparkles, Package, DollarSign, TrendingUp, Clock, Star, Target, Award, Trophy, Calendar, ArrowRight, CheckCircle2, Phone, MessageSquare, Info } from 'lucide-react';
import { getPusherOptimizationTip } from '../services/geminiService';

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
    priority: false
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
    priority: true
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
    priority: false
  }
];

export const PusherView = ({ user }: { user: User }) => {
  const [tab, setTab] = useState('jobs');
  const [isOnline, setIsOnline] = useState(true);
  const [floatBalance, setFloatBalance] = useState(user.floatJobsRemaining || 2);
  const [activeJob, setActiveJob] = useState<any>(null);
  const [aiTip, setAiTip] = useState<string>('');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [earnings, setEarnings] = useState({
    today: 125,
    week: 890,
    month: 3450,
    total: 12500
  });
  const [jobsCompleted, setJobsCompleted] = useState(142);
  const [showCelebration, setShowCelebration] = useState(false);
  const [levelUpCount, setLevelUpCount] = useState(0);

  React.useEffect(() => {
    getPusherOptimizationTip({ rating: 4.8, jobs: jobsCompleted }).then(setAiTip);
  }, [jobsCompleted]);

  // Easter egg: Level up celebration
  useEffect(() => {
    if (jobsCompleted > 0 && jobsCompleted % 50 === 0) {
      setShowCelebration(true);
      setLevelUpCount(jobsCompleted / 50);
      setTimeout(() => setShowCelebration(false), 4000);
    }
  }, [jobsCompleted]);

  const acceptJob = (job: any) => {
    if (floatBalance <= 0) {
      setTab('float');
      if ('vibrate' in navigator) navigator.vibrate([50, 50, 50]);
      return;
    }
    setFloatBalance(prev => prev - 1);
    setActiveJob(job);
    setJobsCompleted(prev => prev + 1);
    if ('vibrate' in navigator) navigator.vibrate(30);
  };

  const toggleOnline = () => {
    setIsOnline(!isOnline);
    if ('vibrate' in navigator) navigator.vibrate(10);
  };

  // Float Purchase View
  if (tab === 'float') {
    return (
      <div className="p-4 sm:p-6 pb-32 animate-fade-in min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header 
          title="Top Up Float" 
          subtitle="Purchase job credits to accept more deliveries"
          onBack={() => setTab('jobs')}
        />

        <div className="mt-6">
          {/* Current Balance Card */}
          <Card variant="elevated" className="!p-6 sm:!p-8 text-center relative overflow-hidden mb-6">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pushr-blue via-pushr-accent to-pushr-success"></div>
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-pushr-blue/10 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-pushr-blue to-pushr-accent rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Zap className="text-white" size={28} />
              </div>
              <span className="text-gray-500 text-xs uppercase font-bold tracking-widest">Current Balance</span>
              <div className={`text-5xl sm:text-6xl font-black mt-4 mb-2 transition-colors duration-300 ${
                floatBalance < 3 ? 'text-pushr-danger animate-pulse' : floatBalance < 5 ? 'text-pushr-warning' : 'text-gray-900'
              }`}>
                {floatBalance}
              </div>
              <span className="text-base sm:text-lg text-gray-500 font-medium">jobs remaining</span>
              
              {floatBalance < 3 && (
                <Alert
                  type="warning"
                  message="Low balance! Top up to continue accepting jobs."
                  className="mt-4"
                />
              )}
            </div>
          </Card>

          {/* Float Packages */}
          <div className="space-y-4">
            {MOCK_FLOAT_PACKAGES.map((pkg, idx) => {
              const isPopular = pkg.id === 'pro';
              const savings = pkg.jobs > 5 ? Math.round((pkg.price / pkg.jobs) * 5 - pkg.price / pkg.jobs) : 0;
              
              return (
                <button 
                  key={pkg.id}
                  onClick={() => {
                    setFloatBalance(prev => prev + pkg.jobs);
                    if ('vibrate' in navigator) navigator.vibrate(30);
                  }}
                  className={`w-full bg-white p-5 rounded-3xl shadow-sm border-2 flex items-center justify-between transition-all active:scale-98 touch-feedback group ${
                    isPopular 
                      ? 'border-pushr-accent shadow-lg shadow-pushr-accent/20 relative overflow-hidden' 
                      : 'border-gray-100 hover:border-pushr-blue hover:shadow-md'
                  }`}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  {isPopular && (
                    <div className="absolute top-2 right-2">
                      <Badge color="orange" size="sm">Popular</Badge>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div className={`w-16 h-16 ${pkg.color} rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:rotate-3 transition-transform flex-shrink-0`}>
                      {pkg.jobs}
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <h4 className="font-bold text-lg sm:text-xl text-gray-900 flex items-center">
                        {pkg.name}
                        {isPopular && <Sparkles size={16} className="ml-2 text-pushr-accent" />}
                      </h4>
                      <p className="text-gray-500 text-sm font-medium mt-1">
                        K{(pkg.price / pkg.jobs).toFixed(2)} per job
                      </p>
                      {savings > 0 && (
                        <p className="text-pushr-success text-xs font-bold mt-1">
                          Save K{savings} vs Starter Pack
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-4 flex-shrink-0">
                    <span className="block font-bold text-xl sm:text-2xl text-gray-900">K{pkg.price}</span>
                    {isPopular && (
                      <div className="mt-1">
                        <Badge color="green" size="sm">Best Value</Badge>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8">
            <Button variant="ghost" onClick={() => setTab('jobs')} fullWidth={false} className="mx-auto">
              Back to Jobs
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Active Job View
  if (activeJob) {
    return (
      <div className="h-full flex flex-col bg-gray-50">
        {/* Navigation View */}
        <div className="h-[55%] bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
          
          {/* Navigation Card */}
          <div className="absolute top-4 left-4 right-4 glass rounded-2xl p-4 text-white shadow-xl z-10">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-pushr-blue rounded-2xl flex items-center justify-center shadow-lg">
                <Navigation className="transform -rotate-45" size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg sm:text-xl">Turn Right</h3>
                <p className="text-gray-300 text-sm">in 200m on Cairo Rd</p>
                <div className="flex items-center space-x-4 mt-2 text-xs">
                  <span className="flex items-center">
                    <Clock size={12} className="mr-1" /> 8 mins
                  </span>
                  <span className="flex items-center">
                    <MapPin size={12} className="mr-1" /> 2.1 km
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Route Visualization */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
            <svg width="200" height="100" viewBox="0 0 200 100" className="opacity-50">
              <path 
                d="M 10 50 Q 100 10 190 50" 
                stroke="#4489F7" 
                strokeWidth="4" 
                fill="none" 
                strokeDasharray="8,8"
                className="animate-pulse"
              />
              <circle cx="10" cy="50" r="6" fill="#E11D1D" />
              <circle cx="190" cy="50" r="6" fill="#7EDE21" />
            </svg>
          </div>
        </div>
        
        {/* Delivery Details */}
        <div className="flex-1 bg-white rounded-t-[40px] -mt-8 relative z-10 p-6 sm:p-8 shadow-2xl flex flex-col">
          <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Current Delivery</h2>
            <Badge color="green">In Progress</Badge>
          </div>
          
          <div className="space-y-6 flex-1 relative mb-6">
            {/* Connecting Line */}
            <div className="absolute left-[11px] top-3 bottom-20 w-0.5 bg-gradient-to-b from-pushr-blue to-pushr-accent"></div>
            
            {/* Pickup */}
            <div className="flex items-start space-x-4 relative z-10">
              <div className="w-6 h-6 bg-white border-4 border-pushr-blue rounded-full shadow-lg flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-2 h-2 bg-pushr-blue rounded-full animate-pulse"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-bold tracking-wider mb-1 uppercase">Pickup</p>
                <p className="font-bold text-lg sm:text-xl text-gray-900">{activeJob.pickup}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge color="blue" size="sm">Pickup Here</Badge>
                </div>
              </div>
            </div>

            {/* Dropoff */}
            <div className="flex items-start space-x-4 relative z-10">
              <div className="w-6 h-6 bg-white border-4 border-pushr-accent rounded-full shadow-lg flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-2 h-2 bg-pushr-accent rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-bold tracking-wider mb-1 uppercase">Dropoff</p>
                <p className="font-bold text-lg sm:text-xl text-gray-900">{activeJob.dropoff}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge color="orange" size="sm">Destination</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Card */}
          <div className="bg-gradient-to-r from-pushr-success/10 to-green-50 border-2 border-pushr-success/20 p-5 rounded-2xl mb-6 flex justify-between items-center shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="bg-pushr-success p-3 rounded-full text-white shadow-lg">
                <DollarSign size={20} />
              </div>
              <div>
                <span className="text-green-800 font-bold block">Collect Cash</span>
                <span className="text-green-600 text-xs">Payment on delivery</span>
              </div>
            </div>
            <span className="text-green-800 font-black text-2xl sm:text-3xl">K{activeJob.price}</span>
          </div>

          <Button 
            onClick={() => {
              setActiveJob(null);
              if ('vibrate' in navigator) navigator.vibrate(50);
            }}
            icon={<CheckCircle2 size={20} />}
            variant="success"
          >
            Complete Delivery
          </Button>
        </div>
      </div>
    );
  }

  // Earnings View
  if (tab === 'earnings') {
    return (
      <div className="p-4 sm:p-6 pb-32 space-y-6 animate-fade-in">
        <Header title="Earnings" subtitle="Track your delivery income" />

        {/* Earnings Summary */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <StatCard 
            title="Today" 
            value={`K${earnings.today}`}
            icon={<Calendar size={18} />}
            color="blue"
            trend="up"
            change={15}
          />
          <StatCard 
            title="This Week" 
            value={`K${earnings.week}`}
            icon={<TrendingUp size={18} />}
            color="green"
            trend="up"
            change={23}
          />
        </div>

        {/* Total Earnings Card */}
        <Card variant="elevated" className="!p-6 bg-gradient-to-br from-pushr-blue to-purple-600 text-white relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <p className="text-white/80 text-sm font-medium mb-2">Total Earnings</p>
            <h2 className="text-4xl sm:text-5xl font-black mb-4">K{earnings.total.toLocaleString()}</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Star className="w-5 h-5 fill-current" />
                <span className="font-bold">4.9</span>
              </div>
              <span>•</span>
              <span>{jobsCompleted} deliveries</span>
            </div>
          </div>
        </Card>

        {/* Withdraw Button */}
        <Button 
          icon={<DollarSign size={20} />}
          onClick={() => alert('Withdrawal feature coming soon!')}
        >
          Withdraw Earnings
        </Button>

        {/* Earnings History */}
        <div>
          <h3 className="font-bold text-lg mb-4 text-gray-900">Recent Earnings</h3>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i} className="!p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-pushr-success">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Delivery #{142 - i}</p>
                      <p className="text-xs text-gray-500">Today, {14 + i}:30</p>
                    </div>
                  </div>
                  <span className="font-bold text-lg text-gray-900">K{45 + i * 5}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div className="p-4 sm:p-6 pb-32 space-y-6 animate-fade-in">
      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
          <div className="bg-white rounded-3xl p-8 mx-4 text-center animate-scale-in shadow-2xl">
            <div className="w-24 h-24 bg-gradient-to-br from-pushr-accent to-pushr-blue rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Trophy className="text-white" size={48} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">🎉 Level Up! 🎉</h3>
            <p className="text-gray-600 mb-4">You've completed {jobsCompleted} deliveries!</p>
            <Badge color="orange" size="lg">Level {levelUpCount}</Badge>
          </div>
        </div>
      )}

      {/* Header & Status Toggle */}
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">Good afternoon, {user.name.split(' ')[0]}</p>
        </div>
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 ml-3 flex-shrink-0">
          <button 
            onClick={toggleOnline}
            className={`relative w-14 h-8 rounded-full transition-all duration-300 touch-feedback ${
              isOnline ? 'bg-pushr-success' : 'bg-gray-300'
            }`}
          >
            <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform duration-300 ${
              isOnline ? 'translate-x-6' : ''
            }`}></div>
            <span className={`absolute top-1/2 transform -translate-y-1/2 text-xs font-bold ${
              isOnline ? 'left-1.5 text-white' : 'right-1.5 text-gray-500'
            }`}>
              {isOnline ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>
      </div>

      {/* Float Card */}
      <button 
        onClick={() => setTab('float')}
        className="group bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 sm:p-8 rounded-3xl text-white shadow-2xl shadow-gray-900/30 relative overflow-hidden touch-feedback active:scale-98 w-full text-left"
      >
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-pushr-blue/20 rounded-full blur-3xl group-hover:bg-pushr-blue/30 transition-colors"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-pushr-accent" />
              <span className="text-gray-400 font-medium text-sm uppercase tracking-wider">Float Balance</span>
            </div>
            <Badge color="orange" variant="outlined" size="sm">
              <ArrowRight size={10} className="mr-1" />
              Top Up
            </Badge>
          </div>
          <div className="flex items-end justify-between">
            <h2 className={`text-5xl sm:text-6xl font-black transition-colors duration-300 ${
              floatBalance < 3 ? 'text-pushr-danger' : floatBalance < 5 ? 'text-pushr-warning' : ''
            }`}>
              {floatBalance}
            </h2>
            <span className="text-gray-400 text-sm sm:text-base mb-2">jobs remaining</span>
          </div>
        </div>
      </button>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <StatCard 
          title="Today" 
          value={`K${earnings.today}`}
          icon={<TrendingUp size={18} />}
          color="green"
        />
        <StatCard 
          title="Jobs Done" 
          value={jobsCompleted}
          icon={<Target size={18} />}
          color="blue"
        />
      </div>

      {/* AI Tip */}
      {aiTip && (
        <Alert
          type="info"
          title={
            <div className="flex items-center space-x-2">
              <Sparkles size={16} className="text-pushr-blue" />
              <span>AI Tip</span>
            </div>
          }
          message={aiTip}
        />
      )}

      {/* Nearby Jobs */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg sm:text-xl text-gray-900">Nearby Jobs</h3>
          <button className="text-pushr-blue text-sm font-bold active:scale-95 touch-feedback">
            See All
          </button>
        </div>
        
        {isOnline ? (
          <div className="space-y-4">
            {MOCK_JOBS.map((job, idx) => (
              <Card 
                key={job.id} 
                variant="elevated"
                className="!p-0 overflow-hidden animate-slide-up touch-feedback"
                style={{ animationDelay: `${idx * 100}ms` }}
                onClick={() => setSelectedJob(job)}
              >
                {job.priority && (
                  <div className="bg-gradient-to-r from-pushr-accent to-orange-500 px-4 py-1 text-center">
                    <span className="text-white text-xs font-bold uppercase tracking-wider">High Priority</span>
                  </div>
                )}
                
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="bg-pushr-blue/10 p-3 rounded-2xl text-pushr-blue flex-shrink-0">
                        <Package size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-base sm:text-lg">{job.type}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge color="gray" size="sm">{job.weight}</Badge>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500 flex items-center">
                            <Star size={10} className="mr-1 fill-yellow-400 text-yellow-400" />
                            {job.customerRating}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-3 flex-shrink-0">
                      <span className="font-black text-xl sm:text-2xl text-gray-900">K{job.price}</span>
                      {job.priority && (
                        <p className="text-xs text-pushr-accent font-bold mt-1">+Bonus</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-5 pl-4 border-l-2 border-gray-100">
                    <div className="flex items-center text-gray-700 text-sm">
                      <div className="w-2 h-2 bg-pushr-blue rounded-full mr-2 flex-shrink-0"></div>
                      <span className="font-semibold mr-2">From:</span>
                      <span className="truncate">{job.pickup}</span>
                    </div>
                    <div className="flex items-center text-gray-700 text-sm">
                      <div className="w-2 h-2 bg-pushr-accent rounded-full mr-2 flex-shrink-0"></div>
                      <span className="font-semibold mr-2">To:</span>
                      <span className="truncate">{job.dropoff}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <MapPin size={12} className="mr-1" /> {job.distance}
                      </span>
                      <span className="flex items-center">
                        <Clock size={12} className="mr-1" /> {job.eta}
                      </span>
                    </div>
                  </div>

                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      acceptJob(job);
                    }}
                    disabled={floatBalance <= 0}
                    fullWidth={true}
                    icon={<CheckCircle2 size={18} />}
                  >
                    {floatBalance <= 0 ? 'Need More Float' : 'Accept Job'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card variant="outlined" className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Zap size={24} />
            </div>
            <p className="text-gray-600 font-semibold mb-2">You are currently offline</p>
            <p className="text-sm text-gray-500 mb-4">Go online to start earning</p>
            <Button 
              onClick={toggleOnline}
              variant="outline"
              fullWidth={false}
              className="mx-auto"
            >
              Go Online
            </Button>
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
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-lg">{selectedJob.type}</h4>
              <span className="font-black text-2xl text-pushr-blue">K{selectedJob.price}</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                <MapPin className="text-pushr-blue" size={20} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500">Pickup</p>
                  <p className="font-semibold text-gray-900">{selectedJob.pickup}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                <MapPin className="text-pushr-accent" size={20} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500">Dropoff</p>
                  <p className="font-semibold text-gray-900">{selectedJob.dropoff}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Distance</p>
                <p className="font-bold text-gray-900">{selectedJob.distance}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">ETA</p>
                <p className="font-bold text-gray-900">{selectedJob.eta}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Weight</p>
                <p className="font-bold text-gray-900">{selectedJob.weight}</p>
              </div>
            </div>

            <Button 
              onClick={() => {
                acceptJob(selectedJob);
                setSelectedJob(null);
              }}
              disabled={floatBalance <= 0}
              icon={<CheckCircle2 size={18} />}
            >
              {floatBalance <= 0 ? 'Need More Float' : 'Accept This Job'}
            </Button>
          </div>
        </Sheet>
      )}
    </div>
  );
};
