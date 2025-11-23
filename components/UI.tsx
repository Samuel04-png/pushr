import React, { useState } from 'react';
import { Loader2, ArrowLeft, X, Check, AlertCircle, Info, Star, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export const Button: React.FC<{
  children?: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success';
  className?: string;
  isLoading?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  fullWidth?: boolean;
}> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '', 
  isLoading = false,
  disabled = false,
  size = 'lg',
  icon,
  fullWidth = true
}) => {
  const [isPressed, setIsPressed] = useState(false);
  
  const baseStyles = `${fullWidth ? 'w-full' : 'px-6'} rounded-2xl font-semibold transition-all duration-200 active:scale-95 flex items-center justify-center shadow-sm relative overflow-hidden touch-feedback`;
  
  const sizes = {
    sm: "py-2 sm:py-2.5 text-xs sm:text-sm min-h-[40px] sm:min-h-[44px]",
    md: "py-3 sm:py-3.5 text-sm sm:text-base min-h-[44px] sm:min-h-[48px]",
    lg: "py-3.5 sm:py-4 text-base sm:text-lg min-h-[48px] sm:min-h-[52px]"
  };

  const variants = {
    primary: "bg-pushr-blue text-white hover:bg-[#3A7AE5] active:bg-[#346CD0] shadow-lg shadow-pushr-blue/30",
    secondary: "bg-pushr-accent text-gray-900 hover:bg-[#E6B10E] active:bg-[#D4A00D] shadow-lg shadow-pushr-accent/30",
    success: "bg-pushr-success text-white hover:bg-[#6FD11D] active:bg-[#64C11A] shadow-lg shadow-pushr-success/30",
    outline: "border-2 border-gray-200 text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100",
    danger: "bg-pushr-danger text-white hover:bg-[#CC1A1A] active:bg-[#B81717] shadow-lg shadow-pushr-danger/30",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 active:bg-gray-200 shadow-none"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled || isLoading}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${isPressed ? 'scale-95' : ''} ${className}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="animate-spin mr-2 w-5 h-5" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export const Card: React.FC<{ 
  children?: React.ReactNode, 
  className?: string, 
  onClick?: () => void,
  hover?: boolean;
  variant?: 'default' | 'elevated' | 'outlined';
}> = ({ children, className = '', onClick, hover = false, variant = 'default' }) => {
  const variants = {
    default: 'bg-white shadow-sm border border-gray-100',
    elevated: 'bg-white shadow-lg border border-gray-200',
    outlined: 'bg-white shadow-none border-2 border-gray-200'
  };
  
  return (
    <div 
      onClick={onClick}
      className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl transition-all duration-200 touch-feedback ${variants[variant]} ${onClick || hover ? 'cursor-pointer active:scale-[0.98] hover:shadow-md' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export const Input = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  icon,
  rightIcon,
  type = 'text',
  error,
  helperText,
  disabled = false,
  onFocus,
  onBlur
}: { 
  label?: string; 
  value: string; 
  onChange: (val: string) => void; 
  placeholder?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  type?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10 pointer-events-none flex items-center justify-center">
            <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
              {icon}
            </div>
          </div>
        )}
        <input 
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => { setIsFocused(true); onFocus?.(); }}
          onBlur={() => { setIsFocused(false); onBlur?.(); }}
          disabled={disabled}
          className={`w-full bg-gray-50 border-2 ${
            error 
              ? 'border-pushr-danger focus:border-pushr-danger' 
              : isFocused 
                ? 'border-pushr-blue focus:border-pushr-blue' 
                : 'border-transparent focus:border-gray-300'
          } text-gray-900 text-sm sm:text-base rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-pushr-blue/20 focus:bg-white transition-all duration-200 block py-3 sm:py-4 min-h-[44px] sm:min-h-[52px] ${icon ? 'pl-12 sm:pl-14 pr-3 sm:pr-4' : 'pl-3 sm:pl-4'} ${rightIcon ? 'pr-12 sm:pr-14' : 'pr-3 sm:pr-4'} shadow-inner disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-gray-400`}
          placeholder={placeholder}
        />
        {rightIcon && (
          <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10 pointer-events-auto flex items-center justify-center">
            <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
              {rightIcon}
            </div>
          </div>
        )}
      </div>
      {(error || helperText) && (
        <p className={`text-xs mt-1.5 ml-1 ${error ? 'text-pushr-danger' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export const Badge = ({ 
  children, 
  color = 'blue', 
  variant = 'default',
  size = 'md'
}: { 
  children?: React.ReactNode; 
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'orange' | 'gray';
  variant?: 'default' | 'outlined' | 'solid';
  size?: 'sm' | 'md' | 'lg';
}) => {
  const colors = {
    blue: variant === 'outlined' ? 'border-pushr-blue text-pushr-blue bg-blue-50' : variant === 'solid' ? 'bg-pushr-blue text-white border-pushr-blue' : 'bg-blue-100 text-blue-700',
    green: variant === 'outlined' ? 'border-pushr-success text-pushr-success bg-green-50' : variant === 'solid' ? 'bg-pushr-success text-white border-pushr-success' : 'bg-green-100 text-green-700',
    yellow: variant === 'outlined' ? 'border-pushr-warning text-pushr-warning bg-yellow-50' : variant === 'solid' ? 'bg-pushr-warning text-gray-900 border-pushr-warning' : 'bg-yellow-100 text-yellow-800',
    red: variant === 'outlined' ? 'border-pushr-danger text-pushr-danger bg-red-50' : variant === 'solid' ? 'bg-pushr-danger text-white border-pushr-danger' : 'bg-red-100 text-red-700',
    orange: variant === 'outlined' ? 'border-pushr-accent text-pushr-accent bg-orange-50' : variant === 'solid' ? 'bg-pushr-accent text-gray-900 border-pushr-accent' : 'bg-orange-100 text-orange-700',
    gray: variant === 'outlined' ? 'border-gray-400 text-gray-700 bg-gray-50' : variant === 'solid' ? 'bg-gray-700 text-white border-gray-700' : 'bg-gray-100 text-gray-700',
  };
  
  const sizes = {
    sm: 'text-[9px] px-2 py-0.5',
    md: 'text-[10px] px-2.5 py-1',
    lg: 'text-xs px-3 py-1.5'
  };
  
  return (
    <span className={`inline-flex items-center font-bold uppercase tracking-wider rounded-full border ${sizes[size]} ${colors[color]}`}>
      {children}
    </span>
  );
};

export const Sheet: React.FC<{ 
  children: React.ReactNode; 
  isOpen: boolean; 
  onClose: () => void;
  title?: string;
  showCloseButton?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'full';
}> = ({ children, isOpen, onClose, title, showCloseButton = true, size = 'md' }) => {
  if (!isOpen) return null;
  
  const sizes = {
    sm: 'max-h-[50vh]',
    md: 'max-h-[85vh]',
    lg: 'max-h-[90vh]',
    full: 'max-h-screen h-screen rounded-none'
  };
  
  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in duration-300" 
        onClick={onClose}
      />
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] z-50 shadow-2xl animate-slide-up duration-300 overflow-hidden ${sizes[size]}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-3 mb-4" />
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-4 sm:px-6 pb-3 sm:pb-4 border-b border-gray-100">
            {title && <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate flex-1 min-w-0 pr-2">{title}</h3>}
            {showCloseButton && (
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors touch-feedback active:scale-95 flex-shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <X size={18} className="sm:w-5 sm:h-5 text-gray-500" />
              </button>
            )}
          </div>
        )}
        <div className="overflow-y-auto no-scrollbar p-4 sm:p-6">
          {children}
        </div>
      </div>
    </>
  );
};

// Legacy Header component - use AppBar instead
export const Header = ({ 
  title, 
  onBack, 
  rightAction,
  subtitle,
  transparent = false
}: { 
  title?: string; 
  subtitle?: string; 
  onBack?: () => void; 
  rightAction?: React.ReactNode; 
  transparent?: boolean; 
}) => (
  <div className={`flex items-center justify-between p-4 ${transparent ? 'bg-transparent' : 'bg-white/90 backdrop-blur-md dark:bg-pushr-gray-900/90'} sticky top-0 z-30 border-b border-gray-100/50 dark:border-pushr-gray-800/50`}>
    <div className="flex items-center space-x-3 flex-1 min-w-0">
      {onBack && (
        <button 
          onClick={onBack} 
          className="p-2 bg-gray-100 dark:bg-pushr-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-pushr-gray-700 active:scale-95 transition-all touch-feedback flex-shrink-0"
        >
          <ArrowLeft size={20} className="text-gray-700 dark:text-gray-300" />
        </button>
      )}
      <div className="flex-1 min-w-0">
        {title && <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">{title}</h2>}
        {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{subtitle}</p>}
      </div>
    </div>
    {rightAction && <div className="flex-shrink-0 ml-3">{rightAction}</div>}
  </div>
);

export const BottomNav = ({ 
  role, 
  activeTab, 
  onTabChange 
}: { 
  role: 'customer' | 'pusher'; 
  activeTab: string; 
  onTabChange: (t: string) => void;
}) => {
  const tabs = role === 'customer' 
    ? [
      { id: 'home', label: 'Home', icon: 'Home' },
      { id: 'activity', label: 'Orders', icon: 'Clock' },
      { id: 'profile', label: 'Profile', icon: 'User' },
    ]
    : [
      { id: 'jobs', label: 'Jobs', icon: 'Briefcase' },
      { id: 'float', label: 'Float', icon: 'Zap' },
      { id: 'earnings', label: 'Money', icon: 'DollarSign' },
      { id: 'profile', label: 'Profile', icon: 'User' },
    ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 pb-safe pt-1.5 sm:pt-2 px-1 sm:px-2 flex justify-around items-center z-40 h-[64px] sm:h-[72px] shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button 
            key={tab.id}
            onClick={() => {
              onTabChange(tab.id);
              // Haptic feedback simulation
              if ('vibrate' in navigator) {
                navigator.vibrate(10);
              }
            }}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 relative touch-feedback`}
          >
            <div className={`relative p-2 rounded-2xl transition-all duration-300 ${isActive ? 'bg-pushr-blue/10 -translate-y-0.5' : ''}`}>
              <svg 
                width="22" height="22" viewBox="0 0 24 24" 
                stroke={isActive ? '#4489F7' : '#9CA3AF'} 
                fill={isActive ? '#4489F7' : 'none'}
                fillOpacity={isActive ? '0.1' : '0'}
                strokeWidth={isActive ? "2.5" : "2"} 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className={`sm:w-6 sm:h-6 transition-all duration-300 ${isActive ? 'scale-110' : 'scale-100'}`}
              >
                {tab.icon === 'Home' && <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />}
                {tab.icon === 'Clock' && <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>}
                {tab.icon === 'CreditCard' && <><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></>}
                {tab.icon === 'Briefcase' && <><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></>}
                {tab.icon === 'Zap' && <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />}
                {tab.icon === 'DollarSign' && <><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></>}
                {tab.icon === 'User' && <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>}
              </svg>
              {isActive && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-pushr-blue rounded-full animate-pulse" />
              )}
            </div>
            <span className={`text-[9px] sm:text-[10px] font-bold mt-0.5 sm:mt-1 transition-colors duration-300 ${isActive ? 'text-pushr-blue' : 'text-gray-400'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

// New enhanced components

export const Alert: React.FC<{
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  onClose?: () => void;
}> = ({ type = 'info', title, message, onClose }) => {
  const configs = {
    info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', icon: Info, iconColor: 'text-blue-600' },
    success: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', icon: Check, iconColor: 'text-green-600' },
    warning: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', icon: AlertCircle, iconColor: 'text-yellow-600' },
    error: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', icon: AlertCircle, iconColor: 'text-red-600' },
  };
  
  const config = configs[type];
  const Icon = config.icon;
  
  return (
    <div className={`${config.bg} ${config.border} border-2 rounded-2xl p-4 flex items-start space-x-3 animate-slide-down`}>
      <Icon className={`${config.iconColor} flex-shrink-0 mt-0.5`} size={20} />
      <div className="flex-1 min-w-0">
        {title && <h4 className={`font-bold text-sm ${config.text} mb-1`}>{title}</h4>}
        <p className={`text-sm ${config.text}`}>{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className="flex-shrink-0">
          <X size={16} className={config.iconColor} />
        </button>
      )}
    </div>
  );
};

export const StatCard: React.FC<{
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down';
  color?: string;
}> = ({ title, value, change, icon, trend, color = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
  };
  
  return (
    <Card className="!p-3 sm:!p-4">
      <div className="flex items-start justify-between mb-1.5 sm:mb-2">
        <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wide truncate flex-1 min-w-0 pr-1">{title}</p>
        {icon && (
          <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl ${colors[color]} flex-shrink-0`}>
            {icon}
          </div>
        )}
      </div>
      <div className="flex items-end justify-between gap-2">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{value}</h3>
        {change !== undefined && (
          <div className={`flex items-center space-x-0.5 sm:space-x-1 flex-shrink-0 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <TrendingUp size={12} className="sm:w-3.5 sm:h-3.5" /> : <TrendingDown size={12} className="sm:w-3.5 sm:h-3.5" />}
            <span className="text-[10px] sm:text-xs font-bold">{Math.abs(change)}%</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export const Skeleton: React.FC<{
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string;
  height?: string;
}> = ({ className = '', variant = 'text', width, height }) => {
  const baseStyles = 'skeleton rounded-2xl';
  const variants = {
    text: 'h-4',
    circular: 'rounded-full',
    rectangular: 'h-24',
  };
  
  return (
    <div 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={{ width: width || '100%', height: height }}
    />
  );
};
