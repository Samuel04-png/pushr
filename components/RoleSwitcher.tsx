import React, { useState } from 'react';
import { Briefcase, ShoppingBag, ChevronDown, Check } from 'lucide-react';
import { Role } from '../types';

interface RoleSwitcherProps {
  currentRole: Role;
  availableRoles: Role[];
  onRoleChange: (role: Role) => void;
  compact?: boolean;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({
  currentRole,
  availableRoles,
  onRoleChange,
  compact = false
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const roleConfig = {
    customer: {
      label: 'Customer',
      icon: ShoppingBag,
      color: 'text-pushr-blue',
      bgColor: 'bg-blue-50',
      activeBg: 'bg-pushr-blue',
      borderColor: 'border-blue-200',
    },
    pusher: {
      label: 'Pusher',
      icon: Briefcase,
      color: 'text-pushr-success',
      bgColor: 'bg-green-50',
      activeBg: 'bg-pushr-success',
      borderColor: 'border-green-200',
    },
  };

  const currentConfig = roleConfig[currentRole as keyof typeof roleConfig];
  if (!currentConfig) return null;

  const CurrentIcon = currentConfig.icon;
  const testRoles: Role[] = ['customer', 'pusher'];
  const rolesToShow = availableRoles.length > 0 
    ? [...new Set([...availableRoles, ...testRoles])].filter(r => r !== 'guest' && r !== 'admin')
    : testRoles;

  // Compact version for AppBar
  if (compact) {
    return (
      <div className="relative z-50">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
            if ('vibrate' in navigator) navigator.vibrate(10);
          }}
          className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg transition-all touch-feedback active:scale-95 ${
            isOpen
              ? `${currentConfig.bgColor} ${currentConfig.borderColor} border`
              : 'hover:bg-gray-100/80'
          }`}
        >
          <CurrentIcon className={currentConfig.color} size={14} />
          <span className={`text-xs font-bold ${currentConfig.color} hidden sm:inline`}>
            {currentConfig.label}
          </span>
          <ChevronDown
            size={12}
            className={`${currentConfig.color} transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-[9998]"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 z-[9999] overflow-hidden animate-slide-down" style={{ position: 'absolute' }}>
              <div className="p-2">
                {rolesToShow.map((role) => {
                  const config = roleConfig[role as keyof typeof roleConfig];
                  if (!config) return null;
                  const Icon = config.icon;
                  const isActive = role === currentRole;

                  return (
                    <button
                      key={role}
                      onClick={(e) => {
                        e.stopPropagation();
                        onRoleChange(role);
                        setIsOpen(false);
                        if ('vibrate' in navigator) navigator.vibrate(20);
                      }}
                      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all touch-feedback active:scale-95 ${
                        isActive
                          ? `${config.bgColor} ${config.borderColor} border`
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isActive ? config.bgColor : 'bg-gray-100'
                      }`}>
                        <Icon className={isActive ? config.color : 'text-gray-400'} size={16} />
                      </div>
                      <div className="flex-1 text-left">
                        <p className={`font-bold text-sm ${isActive ? config.color : 'text-gray-900'}`}>
                          {config.label}
                        </p>
                        <p className="text-xs text-gray-500">
                          {role === 'customer' && 'Order deliveries'}
                          {role === 'pusher' && 'Accept jobs & earn'}
                        </p>
                      </div>
                      {isActive && (
                        <Check className={config.color} size={16} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Full version for header sections
  return (
    <div className="relative z-50">
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if ('vibrate' in navigator) navigator.vibrate(10);
        }}
        className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border transition-all touch-feedback active:scale-95 ${
          isOpen
            ? `${currentConfig.borderColor} ${currentConfig.bgColor} shadow-md`
            : 'border-white/30 bg-white/10 hover:bg-white/20 backdrop-blur-sm'
        }`}
      >
        <CurrentIcon className="text-white" size={14} />
        <span className="text-xs font-bold text-white">
          {currentConfig.label}
        </span>
        <ChevronDown
          size={12}
          className={`text-white/80 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[9998]"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 z-[9999] overflow-hidden animate-slide-down" style={{ position: 'absolute' }}>
            <div className="p-2">
              {rolesToShow.map((role) => {
                const config = roleConfig[role as keyof typeof roleConfig];
                if (!config) return null;
                const Icon = config.icon;
                const isActive = role === currentRole;

                return (
                  <button
                    key={role}
                    onClick={() => {
                      onRoleChange(role);
                      setIsOpen(false);
                      if ('vibrate' in navigator) navigator.vibrate(20);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all touch-feedback active:scale-95 ${
                      isActive
                        ? `${config.bgColor} ${config.borderColor} border`
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isActive ? config.bgColor : 'bg-gray-100'
                    }`}>
                      <Icon className={isActive ? config.color : 'text-gray-400'} size={16} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className={`font-bold text-sm ${isActive ? config.color : 'text-gray-900'}`}>
                        {config.label}
                      </p>
                      <p className="text-xs text-gray-500">
                        {role === 'customer' && 'Order deliveries'}
                        {role === 'pusher' && 'Accept jobs & earn'}
                      </p>
                    </div>
                    {isActive && (
                      <Check className={config.color} size={16} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
