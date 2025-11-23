import React, { useState, useEffect } from 'react';
import { Button } from '../components/UI';
import { ArrowRight, CheckCircle2, Sparkles, Package, MapPin, Zap } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    title: "Move Anything, Anytime",
    desc: "From envelopes to furniture. Connect with local Runners, Pushers, and Movers instantly.",
    image: "https://images.unsplash.com/photo-1605218457336-96c744f42077?auto=format&fit=crop&w=600&q=80",
    icon: Package,
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 2,
    title: "Smart Pricing with AI",
    desc: "Our Gemini AI finds you the best vehicle for your load at the fairest price. No haggling.",
    image: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&w=600&q=80",
    icon: Sparkles,
    color: 'from-purple-500 to-pink-600'
  },
  {
    id: 3,
    title: "Track in Real-Time",
    desc: "Watch your delivery move on the map. Chat with your Pusher securely within the app.",
    image: "https://images.unsplash.com/photo-1569388330292-79cc1ec67252?auto=format&fit=crop&w=600&q=80",
    icon: MapPin,
    color: 'from-green-500 to-teal-600'
  }
];

export const OnboardingView = ({ onComplete }: { onComplete: () => void }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [currentSlide]);

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide(prev => prev + 1);
        if ('vibrate' in navigator) navigator.vibrate(10);
      }, 150);
    } else {
      if ('vibrate' in navigator) navigator.vibrate(30);
      onComplete();
    }
  };

  const handleSkip = () => {
    if ('vibrate' in navigator) navigator.vibrate(20);
    onComplete();
  };

  const currentSlideData = SLIDES[currentSlide];
  const Icon = currentSlideData.icon;

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Animated Background Accents */}
      <div className="absolute top-[-10%] right-[-20%] w-[400px] h-[400px] bg-pushr-blue/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] left-[-20%] w-[400px] h-[400px] bg-pushr-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      
      {/* Skip Button */}
      <button
        onClick={handleSkip}
        className="absolute top-6 right-6 z-20 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full text-sm font-bold text-gray-600 hover:bg-white transition-colors shadow-lg touch-feedback active:scale-95"
      >
        Skip
      </button>

      {/* Slide Content */}
      <div className="flex-1 z-10 flex flex-col justify-center px-6 sm:px-8 pt-16 pb-24">
        {/* Icon Animation */}
        <div className="flex justify-center mb-6 animate-slide-down">
          <div className={`w-24 h-24 bg-gradient-to-br ${currentSlideData.color} rounded-3xl flex items-center justify-center text-white shadow-2xl transform rotate-[-6deg] hover:rotate-0 transition-transform duration-500 float-animation`}>
            <Icon size={48} className="drop-shadow-lg" />
          </div>
        </div>

        {/* Image Container */}
        <div className={`w-full aspect-square max-w-md mx-auto mb-8 rounded-[40px] overflow-hidden shadow-2xl relative transform transition-all duration-700 ${
          isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
        }`}>
          <img 
            src={currentSlideData.image} 
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isAnimating ? 'scale-110' : 'scale-100'
            }`}
            alt="Onboarding"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          
          {/* Progress Indicator Overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex space-x-2 justify-center">
              {SLIDES.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    idx === currentSlide 
                      ? 'w-8 bg-white shadow-lg' 
                      : idx < currentSlide
                        ? 'w-1.5 bg-white/60'
                        : 'w-1.5 bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className={`space-y-4 min-h-[140px] text-center animate-fade-in transition-all duration-500 ${
          isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
        }`} key={currentSlide}>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
            {currentSlideData.title}
          </h1>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-md mx-auto px-4">
            {currentSlideData.desc}
          </p>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="p-6 sm:p-8 pb-safe z-10 bg-gradient-to-t from-white via-white/90 to-transparent">
        <div className="flex justify-between items-center max-w-md mx-auto">
          {/* Dot Indicators */}
          <div className="flex space-x-2">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (idx !== currentSlide) {
                    setIsAnimating(true);
                    setTimeout(() => {
                      setCurrentSlide(idx);
                      if ('vibrate' in navigator) navigator.vibrate(10);
                    }, 150);
                  }
                }}
                className={`h-2 rounded-full transition-all duration-300 touch-feedback active:scale-125 ${
                  idx === currentSlide 
                    ? 'w-8 bg-pushr-blue shadow-lg shadow-blue-500/50' 
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          {/* Next/Complete Button */}
          <button 
            onClick={handleNext}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-pushr-blue to-indigo-600 text-white flex items-center justify-center shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/60 transition-all touch-feedback active:scale-90 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 transform scale-0 group-hover:scale-100 transition-transform duration-300 rounded-full"></div>
            {currentSlide === SLIDES.length - 1 ? (
              <CheckCircle2 size={28} className="relative z-10" />
            ) : (
              <ArrowRight size={28} className="relative z-10 transform group-hover:translate-x-1 transition-transform" />
            )}
          </button>
        </div>

        {/* Final CTA */}
        {currentSlide === SLIDES.length - 1 && (
          <div className="mt-6 text-center animate-slide-up">
            <p className="text-sm text-gray-500 mb-3">Ready to get started?</p>
            <Button
              onClick={onComplete}
              className="max-w-xs mx-auto"
              icon={<Zap size={18} />}
            >
              Get Started
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
