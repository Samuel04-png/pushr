import React from 'react';
import { Button } from './UI';
import { ArrowLeft, Bell, LogOut, Menu, Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useNotifications } from '../contexts/NotificationContext';
import { RoleSwitcher } from './RoleSwitcher';
import { Role } from '../types';

interface AppBarProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  showNotifications?: boolean;
  notificationCount?: number | undefined;
  onNotificationsClick?: () => void;
  showLogout?: boolean;
  onLogout?: () => void;
  showMenu?: boolean;
  onMenuClick?: () => void;
  showDarkMode?: boolean;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  rightAction?: React.ReactNode;
  variant?: 'default' | 'transparent' | 'gradient';
  showRoleSwitcher?: boolean;
  currentRole?: Role;
  onRoleChange?: (role: Role) => void;
  availableRoles?: Role[];
}

export const AppBar: React.FC<AppBarProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  showNotifications = true,
  notificationCount,
  onNotificationsClick,
  showLogout = true,
  onLogout,
  showMenu = false,
  onMenuClick,
  showDarkMode = true,
  theme: themeProp,
  onToggleTheme: onToggleThemeProp,
  rightAction,
  variant = 'default',
  showRoleSwitcher = false,
  currentRole,
  onRoleChange,
  availableRoles = [],
}) => {
  const { theme: contextTheme, toggleTheme: contextToggleTheme } = useTheme();
  const { unreadCount: contextUnreadCount, setShowNotificationCenter } = useNotifications();
  const theme = themeProp ?? contextTheme ?? 'light';
  const finalToggleTheme = onToggleThemeProp ?? contextToggleTheme;
  const finalNotificationCount = notificationCount ?? contextUnreadCount;
  const handleNotificationsClick = onNotificationsClick ?? (() => setShowNotificationCenter(true));
  
  const baseStyles = `sticky top-0 z-30 w-full transition-all duration-300 animate-slide-down ${
    variant === 'transparent' 
      ? 'bg-white/80 backdrop-blur-md shadow-sm' 
      : variant === 'gradient'
      ? 'bg-gradient-to-r from-pushr-blue to-indigo-600 text-white shadow-lg'
      : 'bg-white dark:bg-pushr-gray-900 shadow-md'
  }`;

  const textColor = variant === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white';

  return (
    <div className={baseStyles}>
      <div className="max-w-md mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Left Side */}
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {showBack && onBack && (
              <button
                onClick={() => {
                  onBack();
                  if ('vibrate' in navigator) navigator.vibrate(10);
                }}
                className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-pushr-gray-800 transition-colors touch-feedback active:scale-95 flex-shrink-0 ${
                  variant === 'gradient' ? 'hover:bg-white/20' : ''
                }`}
              >
                <ArrowLeft 
                  size={20} 
                  className={variant === 'gradient' ? 'text-white' : 'text-gray-700 dark:text-gray-300'} 
                />
              </button>
            )}
            
            {showMenu && onMenuClick && (
              <button
                onClick={() => {
                  onMenuClick();
                  if ('vibrate' in navigator) navigator.vibrate(10);
                }}
                className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-pushr-gray-800 transition-colors touch-feedback active:scale-95 flex-shrink-0 ${
                  variant === 'gradient' ? 'hover:bg-white/20' : ''
                }`}
              >
                <Menu 
                  size={20} 
                  className={variant === 'gradient' ? 'text-white' : 'text-gray-700 dark:text-gray-300'} 
                />
              </button>
            )}

            {/* Title */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h1 className={`text-lg sm:text-xl font-black truncate ${textColor}`}>
                  {title}
                </h1>
                {showRoleSwitcher && currentRole && onRoleChange && (
                  <RoleSwitcher
                    currentRole={currentRole}
                    availableRoles={availableRoles}
                    onRoleChange={onRoleChange}
                    compact={true}
                  />
                )}
              </div>
              {subtitle && (
                <p className={`text-xs sm:text-sm font-medium truncate ${
                  variant === 'gradient' ? 'text-white/90' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-1.5 flex-shrink-0 ml-3">
            {rightAction && rightAction}
            
            {showDarkMode && finalToggleTheme && (
              <button
                onClick={() => {
                  finalToggleTheme();
                  if ('vibrate' in navigator) navigator.vibrate(5);
                }}
                className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-pushr-gray-800 transition-colors touch-feedback active:scale-95 ${
                  variant === 'gradient' ? 'hover:bg-white/20' : ''
                }`}
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <Moon 
                    size={18} 
                    className={variant === 'gradient' ? 'text-white' : 'text-gray-700 dark:text-gray-300'} 
                  />
                ) : (
                  <Sun 
                    size={18} 
                    className={variant === 'gradient' ? 'text-white' : 'text-gray-700 dark:text-gray-300'} 
                  />
                )}
              </button>
            )}
            
            {showNotifications && (
              <button
                onClick={() => {
                  handleNotificationsClick();
                  if ('vibrate' in navigator) navigator.vibrate(10);
                }}
                className={`relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-pushr-gray-800 transition-colors touch-feedback active:scale-95 ${
                  variant === 'gradient' ? 'hover:bg-white/20' : ''
                }`}
                title="Notifications"
              >
                <Bell 
                  size={18} 
                  className={variant === 'gradient' ? 'text-white' : 'text-gray-700 dark:text-gray-300'} 
                />
                {finalNotificationCount > 0 && (
                  <span className={`absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg ${
                    variant === 'gradient' 
                      ? 'bg-white text-pushr-blue' 
                      : 'bg-pushr-danger text-white'
                  }`}>
                    {finalNotificationCount > 9 ? '9+' : finalNotificationCount}
                  </span>
                )}
              </button>
            )}

            {showLogout && onLogout && (
              <button
                onClick={() => {
                  onLogout();
                  if ('vibrate' in navigator) navigator.vibrate(15);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors touch-feedback active:scale-95 ${
                  variant === 'gradient' 
                    ? 'hover:bg-white/20 text-white' 
                    : 'text-pushr-danger dark:text-red-400'
                }`}
                title="Logout"
              >
                LOGOUT
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

