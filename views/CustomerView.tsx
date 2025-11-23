import React, { useState, useEffect } from 'react';
import { User, CATEGORIES, CategoryId, Role } from '../types';
import { Button, Card, Input, Badge, Sheet, Alert, StatCard } from '../components/UI';
import { AppBar } from '../components/AppBar';
import { RoleSwitcher } from '../components/RoleSwitcher';
import { MapPin, Sparkles, Bike, Truck, User as UserIcon, Archive, Search, Star, Clock, ArrowRight, MessageSquare, Navigation2, Zap, TrendingUp, Gift, Bell, Target, Award, Trophy, Heart, Check } from 'lucide-react';
import { analyzeDeliveryRequest } from '../services/geminiService';
import { ChatView } from './ChatView';

// Mock recent locations and favorites
const RECENT_LOCATIONS = [
  'Manda Hill Mall',
  'East Park Mall',
  'UNZA Main Campus',
  'Woodlands, Lusaka',
  'Arcades Shopping Mall'
];

const FAVORITE_LOCATIONS = [
  { name: 'Home', address: 'Kabulonga, Lusaka', icon: '🏠' },
  { name: 'Work', address: 'Cairo Road, Lusaka', icon: '💼' },
];

export const CustomerView = ({ 
  user, 
  onRoleChange 
}: { 
  user: User;
  onRoleChange?: (role: Role) => void;
}) => {
  const [step, setStep] = useState<'home' | 'category' | 'confirm' | 'tracking'>('home');
  const [request, setRequest] = useState({
    pickup: '',
    dropoff: '',
    description: '',
    category: 'bike' as CategoryId,
    receiverName: '',
    receiverPhone: '',
    specialInstructions: ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{category: string, price: number, reason: string} | null>(null);
  const [showAiChat, setShowAiChat] = useState(false);
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDropoffSuggestions, setShowDropoffSuggestions] = useState(false);
  const [activeInput, setActiveInput] = useState<'pickup' | 'dropoff' | null>(null);
  const [streakDays, setStreakDays] = useState(7); // Easter egg
  const [totalSavings, setTotalSavings] = useState(245); // Easter egg
  const [showCelebration, setShowCelebration] = useState(false);
  const [consecutiveOrders, setConsecutiveOrders] = useState(0); // Easter egg counter

  // Easter egg: Celebrate milestones
  useEffect(() => {
    if (consecutiveOrders > 0 && consecutiveOrders % 5 === 0) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [consecutiveOrders]);

  // Location autocomplete simulation
  const getLocationSuggestions = (query: string) => {
    if (!query) return [...FAVORITE_LOCATIONS, ...RECENT_LOCATIONS.map(loc => ({ name: loc, address: loc, icon: '📍' }))];
    
    const allLocations = [...FAVORITE_LOCATIONS, ...RECENT_LOCATIONS.map(loc => ({ name: loc, address: loc, icon: '📍' }))];
    return allLocations.filter(loc => 
      loc.name.toLowerCase().includes(query.toLowerCase()) || 
      loc.address.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleLocationSelect = (location: string, type: 'pickup' | 'dropoff') => {
    setRequest(prev => ({ ...prev, [type]: location }));
    setActiveInput(null);
    setShowPickupSuggestions(false);
    setShowDropoffSuggestions(false);
  };

  const handleAIAnalysis = async () => {
    if(!request.description) return;
    setIsAnalyzing(true);
    const suggestion = await analyzeDeliveryRequest(request.description, 5.2);
    setAiSuggestion({
      category: suggestion.recommendedCategory,
      price: suggestion.estimatedPrice,
      reason: suggestion.reasoning
    });
    setRequest(prev => ({ ...prev, category: suggestion.recommendedCategory as CategoryId }));
    setIsAnalyzing(false);
    setShowAiChat(false);
    setStep('category');
    
    // Easter egg: Increment order counter
    setConsecutiveOrders(prev => prev + 1);
  };

  const getIcon = (id: string) => {
    switch(id) {
      case 'bike': return <Bike className="w-6 h-6" />;
      case 'truck': return <Truck className="w-6 h-6" />;
      case 'wheelbarrow': return <Archive className="w-6 h-6" />;
      default: return <UserIcon className="w-6 h-6" />;
    }
  };

  const getCategoryGradient = (id: string) => {
    switch(id) {
      case 'walking': return 'from-blue-50 to-indigo-50';
      case 'wheelbarrow': return 'from-orange-50 to-amber-50';
      case 'bike': return 'from-green-50 to-teal-50';
      case 'truck': return 'from-purple-50 to-pink-50';
      default: return 'from-gray-50 to-gray-100';
    }
  };

  // Home / Location Step
  if (step === 'home') {
    const pickupSuggestions = getLocationSuggestions(request.pickup);
    const dropoffSuggestions = getLocationSuggestions(request.dropoff);

    return (
      <div className="p-3 sm:p-4 md:p-6 pb-24 sm:pb-32 space-y-4 sm:space-y-6 animate-fade-in bg-gradient-to-b from-blue-50/30 via-white to-white">
        {/* Celebration Modal */}
        {showCelebration && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
            <div className="bg-white rounded-3xl p-8 mx-4 text-center animate-scale-in shadow-2xl">
              <div className="w-20 h-20 bg-gradient-to-br from-pushr-accent to-pushr-blue rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <Trophy className="text-white" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">🎉 Amazing! 🎉</h3>
              <p className="text-gray-600 mb-4">You've made {consecutiveOrders} orders with Pushr!</p>
              <Badge color="orange">Milestone Unlocked</Badge>
            </div>
          </div>
        )}

        {/* Enhanced Header with Gradient Background */}
        <div className="relative -m-4 sm:-m-6 mb-4 sm:mb-6 p-4 sm:p-6 md:p-8 bg-gradient-to-br from-pushr-blue via-blue-600 to-indigo-700 rounded-b-3xl text-white" style={{ overflow: 'visible' }}>
          <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-white/10 rounded-full -mr-24 sm:-mr-32 -mt-24 sm:-mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-36 sm:w-48 h-36 sm:h-48 bg-pushr-accent/20 rounded-full -ml-18 sm:-ml-24 -mb-18 sm:-mb-24 blur-2xl"></div>
          <div className="relative z-10" style={{ overflow: 'visible' }}>
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1.5 sm:space-x-2 mb-1.5 sm:mb-2 flex-wrap gap-1.5 sm:gap-2">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-black truncate">Hello, {user.name.split(' ')[0]}! 👋</h1>
                  {streakDays > 0 && (
                    <span className="inline-flex items-center bg-white/20 text-white border border-white/30 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-bold">
                      <Zap size={8} className="sm:w-[10px] sm:h-[10px] mr-0.5 sm:mr-1" />
                      <span className="hidden xs:inline">{streakDays} day streak</span>
                      <span className="xs:hidden">{streakDays}d</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <p className="text-white/90 text-sm sm:text-base font-medium">Ready to push something?</p>
                  {onRoleChange && (
                    <RoleSwitcher
                      currentRole={user.role}
                      availableRoles={['customer', 'pusher']}
                      onRoleChange={onRoleChange}
                      compact={false}
                    />
                  )}
                </div>
              </div>
              <div className="relative ml-2 sm:ml-3 flex-shrink-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white/20 backdrop-blur-md rounded-full overflow-hidden border-2 border-white/30 shadow-xl ring-2 ring-white/20">
                  <img src={user.avatar} className="w-full h-full object-cover" alt="Avatar"/>
                </div>
                {streakDays > 5 && (
                  <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-pushr-accent rounded-full flex items-center justify-center shadow-lg animate-pulse border-2 border-white">
                    <Award size={10} className="sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 text-white" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <StatCard 
            title="Total Orders" 
            value={consecutiveOrders || '0'}
            icon={<Target size={16} className="sm:w-[18px] sm:h-[18px]" />}
            color="blue"
          />
          <StatCard 
            title="Active Streak" 
            value={`${streakDays} days`}
            icon={<Zap size={16} className="sm:w-[18px] sm:h-[18px]" />}
            color="orange"
          />
        </div>

        {/* Main Action Card */}
        <Card className="relative !p-4 sm:!p-5 md:!p-6 overflow-visible" variant="elevated">
          <div className="absolute inset-0 bg-gradient-to-br from-pushr-blue/10 to-pushr-accent/10 rounded-3xl blur-xl -z-10"></div>
          <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center">
            <Navigation2 className="w-4 h-4 sm:w-5 sm:h-5 text-pushr-blue mr-1.5 sm:mr-2 flex-shrink-0" />
            <span className="truncate">Where are we going?</span>
          </h2>
          <div className="space-y-2.5 sm:space-y-3">
            {/* Pickup Location */}
            <div className="relative">
              <div className="bg-gradient-to-r from-pushr-blue/5 to-transparent p-3 sm:p-4 rounded-xl sm:rounded-2xl flex items-center space-x-2 sm:space-x-3 border-2 border-gray-100 focus-within:border-pushr-blue focus-within:ring-2 focus-within:ring-pushr-blue/20 transition-all">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-pushr-blue rounded-full ring-3 sm:ring-4 ring-blue-100 flex-shrink-0"></div>
                <input 
                  className="bg-transparent w-full font-medium text-sm sm:text-base outline-none placeholder-gray-400"
                  placeholder="Pickup Location"
                  value={request.pickup}
                  onChange={(e) => {
                    setRequest({...request, pickup: e.target.value});
                    setShowPickupSuggestions(true);
                  }}
                  onFocus={() => {
                    setActiveInput('pickup');
                    setShowPickupSuggestions(true);
                  }}
                />
                <button
                  onClick={() => {
                    // Use current location
                    setRequest({...request, pickup: 'Current Location'});
                    if ('vibrate' in navigator) navigator.vibrate(10);
                  }}
                  className="p-2 bg-pushr-blue/10 rounded-xl text-pushr-blue hover:bg-pushr-blue/20 transition-colors touch-feedback"
                  title="Use Current Location"
                >
                  <Navigation2 size={16} />
                </button>
              </div>
              
              {/* Pickup Suggestions Dropdown */}
              {showPickupSuggestions && activeInput === 'pickup' && pickupSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 max-h-60 overflow-y-auto z-20 animate-slide-down">
                  {pickupSuggestions.map((location, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleLocationSelect(location.address, 'pickup')}
                      className="w-full p-4 flex items-center space-x-3 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left border-b border-gray-100 last:border-0 touch-feedback"
                    >
                      <span className="text-xl">{location.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm">{location.name}</p>
                        {location.address !== location.name && (
                          <p className="text-xs text-gray-500 truncate">{location.address}</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dropoff Location */}
            <div className="relative">
              <div className="bg-gradient-to-r from-pushr-accent/5 to-transparent p-4 rounded-2xl flex items-center space-x-3 border-2 border-gray-100 focus-within:border-pushr-accent focus-within:ring-2 focus-within:ring-pushr-accent/20 transition-all">
                <div className="w-3 h-3 bg-pushr-accent rounded-full ring-4 ring-yellow-100 flex-shrink-0"></div>
                <input 
                  className="bg-transparent w-full font-medium text-sm sm:text-base outline-none placeholder-gray-400"
                  placeholder="Dropoff Destination"
                  value={request.dropoff}
                  onChange={(e) => {
                    setRequest({...request, dropoff: e.target.value});
                    setShowDropoffSuggestions(true);
                  }}
                  onFocus={() => {
                    setActiveInput('dropoff');
                    setShowDropoffSuggestions(true);
                  }}
                />
              </div>
              
              {/* Dropoff Suggestions Dropdown */}
              {showDropoffSuggestions && activeInput === 'dropoff' && dropoffSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 max-h-60 overflow-y-auto z-20 animate-slide-down">
                  {dropoffSuggestions.map((location, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleLocationSelect(location.address, 'dropoff')}
                      className="w-full p-4 flex items-center space-x-3 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left border-b border-gray-100 last:border-0 touch-feedback"
                    >
                      <span className="text-xl">{location.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm">{location.name}</p>
                        {location.address !== location.name && (
                          <p className="text-xs text-gray-500 truncate">{location.address}</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Button 
            className="mt-5" 
            onClick={() => {
              if (request.pickup && request.dropoff) {
                setStep('category');
                if ('vibrate' in navigator) navigator.vibrate(20);
              }
            }}
            disabled={!request.pickup || !request.dropoff}
            icon={<Search size={20} />}
          >
            Find a Pusher
          </Button>
        </Card>

        {/* AI Suggestion Banner with Easter Egg */}
        <div className="bg-gradient-to-r from-pushr-blue via-purple-500 to-pink-500 p-[1.5px] rounded-2xl relative overflow-hidden group cursor-pointer" onClick={() => setShowAiChat(true)}>
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl"></div>
          <div className="relative z-10 p-5">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center space-x-2">
                <Badge color="blue">AI Suggestion</Badge>
                <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
              </div>
              <Gift className="w-5 h-5 text-pushr-accent animate-bounce-slow" />
            </div>
            <p className="font-bold text-gray-900 mb-1 text-sm sm:text-base">Furniture move to Woodlands?</p>
            <p className="text-xs sm:text-sm text-gray-600 mb-3">Usually you do this on Fridays. Save 15% if you book a Truck now.</p>
            <button className="text-sm font-bold text-pushr-blue flex items-center group-hover:translate-x-1 transition-transform">
              Check Deal <ArrowRight size={14} className="ml-1" />
            </button>
          </div>
        </div>

        {/* Categories Horizontal Scroll */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-gray-900">Categories</h3>
            <button className="text-pushr-blue text-sm font-bold active:scale-95 touch-feedback">
              See All
            </button>
          </div>
          <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-4 -mx-4 sm:-mx-6 px-4 sm:px-6">
            {CATEGORIES.map((cat, idx) => (
              <button
                key={cat.id}
                onClick={() => {
                  setRequest({...request, category: cat.id as CategoryId});
                  setStep('category');
                }}
                className={`min-w-[130px] sm:min-w-[140px] bg-gradient-to-br ${getCategoryGradient(cat.id)} p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center space-y-3 active:scale-95 transition-all touch-feedback hover:shadow-md`}
              >
                <div className="w-14 h-14 bg-white/80 rounded-2xl flex items-center justify-center text-pushr-blue shadow-sm">
                  {getIcon(cat.id)}
                </div>
                <span className="font-bold text-gray-900 text-sm sm:text-base">{cat.name}</span>
                <span className="text-xs text-gray-500 bg-white/60 px-2 py-1 rounded-full font-medium">{cat.limit}</span>
                <span className="text-xs font-bold text-pushr-blue">From K{cat.basePrice}</span>
              </button>
            ))}
          </div>
        </div>

        {/* AI Chat FAB */}
        <button 
          onClick={() => {
            setShowAiChat(true);
            if ('vibrate' in navigator) navigator.vibrate(10);
          }}
          className="fixed bottom-28 right-4 sm:right-6 w-14 h-14 bg-gradient-to-br from-pushr-blue to-purple-600 text-white rounded-full shadow-2xl shadow-pushr-blue/40 flex items-center justify-center z-30 float-animation touch-feedback active:scale-90 transition-transform"
          title="Ask Pushr AI"
        >
          <Sparkles size={24} className="drop-shadow-lg" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-pushr-accent rounded-full border-2 border-white animate-pulse"></div>
        </button>

        {/* AI Chat Sheet */}
        <Sheet 
          isOpen={showAiChat} 
          onClose={() => {
            setShowAiChat(false);
            setActiveInput(null);
          }}
          title="Ask Pushr AI"
          size="md"
        >
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-pushr-blue to-purple-600 rounded-2xl mx-auto flex items-center justify-center text-white shadow-lg float-animation">
              <Sparkles size={32} />
            </div>
            <p className="text-gray-600 text-sm">Describe your item, and I'll find the best vehicle and price for you.</p>
            
            <div className="bg-gray-50 p-4 rounded-2xl text-left border-2 border-transparent focus-within:border-pushr-blue transition-colors">
              <textarea 
                className="w-full bg-transparent border-none focus:ring-0 resize-none text-gray-900 placeholder-gray-400 text-sm sm:text-base"
                placeholder="e.g., I need to move a fridge from Kabulonga to Roma..."
                rows={4}
                value={request.description}
                onChange={(e) => setRequest({...request, description: e.target.value})}
              />
            </div>
            
            <Button 
              onClick={handleAIAnalysis} 
              isLoading={isAnalyzing}
              disabled={!request.description.trim()}
              icon={<Sparkles size={18} />}
            >
              Analyze & Find Deal
            </Button>
          </div>
        </Sheet>
      </div>
    );
  }

  // Category Selection
  if (step === 'category') {
    return (
      <div className="p-4 sm:p-6 pb-32 space-y-6 animate-fade-in bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <AppBar 
          title="Choose Vehicle" 
          subtitle="Select the best fit for your load"
          showBack
          onBack={() => setStep('home')}
          showLogout={false}
        />

        {aiSuggestion && (
          <Alert
            type="info"
            title="AI Recommended"
            message={`${aiSuggestion.category.toUpperCase()}: ${aiSuggestion.reason}. Estimated price: K${aiSuggestion.price}`}
          />
        )}

        <div className="space-y-4">
          {CATEGORIES.map((cat, idx) => {
            const isSelected = request.category === cat.id;
            const isRecommended = aiSuggestion?.category === cat.id;
            
            return (
              <button 
                key={cat.id}
                onClick={() => {
                  setRequest({...request, category: cat.id as CategoryId});
                  setTimeout(() => setStep('confirm'), 200);
                  if ('vibrate' in navigator) navigator.vibrate(15);
                }}
                className={`w-full p-5 rounded-3xl border-2 text-left transition-all relative overflow-hidden group touch-feedback active:scale-98 ${
                  isSelected 
                    ? 'border-pushr-blue bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl shadow-blue-500/20 scale-[1.01]' 
                    : isRecommended
                      ? 'border-pushr-accent bg-gradient-to-br from-yellow-50 to-orange-50 shadow-lg'
                      : 'border-gray-100 bg-white shadow-sm hover:border-gray-200 hover:shadow-md'
                }`}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {isRecommended && !isSelected && (
                  <div className="absolute top-2 right-2">
                    <Badge color="orange" size="sm">
                      <Star size={8} className="mr-1" />
                      Recommended
                    </Badge>
                  </div>
                )}
                
                <div className="flex justify-between items-center relative z-10">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-sm ${
                      isSelected 
                        ? 'bg-pushr-blue text-white scale-110' 
                        : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                    }`}>
                      {getIcon(cat.id)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-gray-900 text-lg">{cat.name}</h3>
                        {isSelected && <Check className="text-pushr-blue" size={18} />}
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5">{cat.desc}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge color="gray" size="sm">{cat.limit}</Badge>
                        <span className="text-xs text-gray-500">~15 min</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <span className={`block font-bold text-xl sm:text-2xl ${isSelected ? 'text-pushr-blue' : 'text-gray-900'}`}>
                      K{cat.basePrice}
                    </span>
                    <span className="text-xs text-gray-500">from</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Confirm Order
  if (step === 'confirm') {
    const selectedCategory = CATEGORIES.find(c => c.id === request.category);
    const estimatedPrice = selectedCategory?.basePrice || 45;
    const estimatedTime = 15;
    const estimatedDistance = 5.2;

    return (
      <div className="p-4 sm:p-6 pb-32 h-screen flex flex-col bg-white animate-slide-up">
        <AppBar 
          title="Confirm Order"
          showBack
          onBack={() => setStep('category')}
          showLogout={false}
        />
        
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 mt-4">
          {/* Map Preview */}
          <div className="w-full h-[280px] sm:h-[320px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl mb-6 relative overflow-hidden shadow-inner">
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(#94a3b8 2px, transparent 2px)', backgroundSize: '24px 24px' }}></div>
            
            {/* Route Visualization */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-32 h-32 bg-pushr-blue/10 rounded-full animate-ping absolute"></div>
              <div className="w-4 h-4 bg-pushr-blue rounded-full relative z-10 shadow-xl border-4 border-white"></div>
            </div>
            
            {/* Route Info Card */}
            <div className="absolute bottom-4 left-4 right-4 glass rounded-2xl p-4 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-4 text-xs font-semibold text-gray-600">
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1.5" /> {estimatedTime} mins
                  </div>
                  <div className="flex items-center">
                    <MapPin size={14} className="mr-1.5" /> {estimatedDistance} km
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <span className="font-bold text-gray-900 truncate">{request.pickup || 'Current Location'}</span>
                <ArrowRight size={14} className="text-gray-400 flex-shrink-0" />
                <span className="font-bold text-gray-900 truncate">{request.dropoff || 'Destination'}</span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <Card variant="elevated" className="!p-5 sm:!p-6">
            <h3 className="text-xl font-bold mb-5 text-gray-900">Order Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Service Type</span>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-pushr-blue/10 rounded-lg flex items-center justify-center text-pushr-blue">
                    {getIcon(request.category)}
                  </div>
                  <span className="font-bold text-gray-900 capitalize">{selectedCategory?.name || request.category}</span>
                </div>
              </div>

              {request.description && (
                <div className="flex justify-between items-start">
                  <span className="text-gray-600 font-medium">Description</span>
                  <span className="text-sm text-gray-700 text-right max-w-[60%]">{request.description}</span>
                </div>
              )}

              <div className="h-px bg-gray-200 my-2"></div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Payment Method</span>
                <span className="font-bold text-pushr-blue">MTN Money ••••</span>
              </div>

              <div className="h-px bg-gray-200 my-2"></div>

              <div className="flex justify-between items-center text-xl sm:text-2xl pt-2">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-black text-pushr-blue">K{estimatedPrice}.00</span>
              </div>
            </div>
          </Card>

          {/* Additional Options */}
          <div className="space-y-3">
            <Input
              label="Receiver Name (Optional)"
              value={request.receiverName}
              onChange={(val) => setRequest({...request, receiverName: val})}
              placeholder="Who will receive this?"
            />
            <Input
              label="Special Instructions (Optional)"
              value={request.specialInstructions}
              onChange={(val) => setRequest({...request, specialInstructions: val})}
              placeholder="Any special requests?"
              type="textarea"
            />
          </div>
        </div>

        <div className="mt-6 space-y-3 pt-4 border-t border-gray-100">
          <Button 
            onClick={() => {
              setStep('tracking');
              if ('vibrate' in navigator) navigator.vibrate(30);
            }}
            icon={<Check size={20} />}
          >
            Confirm & Pay K{estimatedPrice}.00
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => setStep('category')}
            fullWidth={false}
            className="mx-auto"
          >
            Back
          </Button>
        </div>
      </div>
    );
  }

  // Tracking View
  return (
    <div className="relative h-screen bg-gray-200 overflow-hidden">
      {/* Full Screen Map Mock */}
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#64748b 2px, transparent 2px)', backgroundSize: '30px 30px' }}>
        <div className="absolute top-20 left-10 bg-white p-2 rounded-full shadow-lg animate-bounce-slow">
          <MapPin className="text-pushr-danger" size={20} />
        </div>
        <div className="absolute bottom-1/3 right-20 bg-white p-2 rounded-full shadow-lg animate-bounce-slow" style={{ animationDelay: '0.5s' }}>
          <div className="w-4 h-4 bg-pushr-blue rounded-full"></div>
        </div>
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <path 
            d="M50 90 Q 200 400 300 600" 
            stroke="#4489F7" 
            strokeWidth="6" 
            fill="none" 
            strokeDasharray="12,12" 
            className="animate-pulse" 
            strokeLinecap="round" 
          />
        </svg>
      </div>

      <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-10">
        <button 
          onClick={() => setStep('home')} 
          className="bg-white/95 backdrop-blur-md p-3 rounded-full shadow-xl active:scale-95 transition-transform touch-feedback"
        >
          <ArrowRight className="rotate-180" size={20} />
        </button>
      </div>

      {/* Bottom Sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[40px] shadow-2xl p-6 sm:p-8 pb-safe animate-slide-up">
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-gray-900">Arriving in 8 mins</h2>
            <p className="text-gray-500 font-medium mt-1 text-sm sm:text-base">Pusher is on the way to pickup</p>
          </div>
          <div className="w-16 h-16 bg-gradient-to-br from-pushr-success to-pushr-teal text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-xl shadow-green-500/30 ml-4 flex-shrink-0">
            8m
          </div>
        </div>

        {/* Pusher Card */}
        <div className="flex items-center space-x-4 p-5 bg-gradient-to-r from-gray-50 to-white rounded-3xl mb-6 border border-gray-100 shadow-sm">
          <div className="relative">
            <img 
              src="https://randomuser.me/api/portraits/men/32.jpg" 
              className="w-16 h-16 rounded-2xl object-cover shadow-md ring-2 ring-pushr-blue/20" 
              alt="Driver" 
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-pushr-success rounded-full border-2 border-white"></div>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-gray-900 text-lg">Kennedy M.</h4>
            <div className="flex items-center text-gray-600 text-sm font-medium mt-1 space-x-2">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                <span className="font-semibold">4.9</span>
              </div>
              <span>•</span>
              <span>142 deliveries</span>
              <span>•</span>
              <Badge color="green" size="sm">Verified</Badge>
            </div>
          </div>
          <div className="flex space-x-2 flex-shrink-0">
            <button 
              onClick={() => {
                if ('vibrate' in navigator) navigator.vibrate(20);
                alert('Calling Kennedy...');
              }} 
              className="w-12 h-12 rounded-2xl bg-white border-2 border-gray-200 text-gray-900 flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all touch-feedback shadow-sm"
            >
              <div className="w-5 h-5 border-2 border-gray-900 rounded-full"></div>
            </button>
            <button 
              onClick={() => {
                if ('vibrate' in navigator) navigator.vibrate(20);
                alert('Opening chat...');
              }}
              className="w-12 h-12 rounded-2xl bg-pushr-blue text-white flex items-center justify-center shadow-lg shadow-blue-500/30 active:scale-95 transition-transform touch-feedback"
            >
              <MessageSquare size={20} />
            </button>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            className="flex-1" 
            onClick={() => setStep('home')}
            fullWidth={false}
          >
            Cancel
          </Button>
          <Button 
            className="flex-[2]" 
            onClick={() => {
              if ('vibrate' in navigator) navigator.vibrate(30);
              alert('Status shared!');
            }}
            icon={<ArrowRight size={18} />}
            fullWidth={false}
          >
            Share Status
          </Button>
        </div>
      </div>
    </div>
  );
};
