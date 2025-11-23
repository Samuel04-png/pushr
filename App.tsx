import React, { useState } from 'react';
import { Role, User } from './types';
import { BottomNav, Button } from './components/UI';
import { CustomerView } from './views/CustomerView';
import { PusherView } from './views/PusherView';
import { PusherJobsView } from './views/PusherJobsView';
import { PusherFloatView } from './views/PusherFloatView';
import { AdminView } from './views/AdminView';
import { OnboardingView } from './views/OnboardingView';
import { ActivityView } from './views/ActivityView';
import { WalletView } from './views/WalletView';
import { ProfileView } from './views/ProfileView';
import { PusherProfileView } from './views/PusherProfileView';
import { LoginView } from './views/LoginView';
import { SignupView } from './views/SignupView';
import { ForgotPasswordView } from './views/ForgotPasswordView';
import { ThemeProvider, useTheme } from './hooks/useTheme';
import { NotificationCenter } from './components/NotificationCenter';
import { NotificationProvider, useNotifications } from './contexts/NotificationContext';
import { RoleSwitcher } from './components/RoleSwitcher';

// Extended User interface to support multiple roles
interface MultiRoleUser extends User {
  availableRoles: Role[];
}

const MOCK_USERS: Record<Role, User> = {
  customer: { id: 'c1', name: 'Mwila J.', role: 'customer', avatar: 'https://i.pravatar.cc/150?u=mwila', walletBalance: 150.00 },
  pusher: { id: 'p1', name: 'Kennedy M.', role: 'pusher', avatar: 'https://i.pravatar.cc/150?u=kennedy', floatJobsRemaining: 3, rating: 4.9 },
  admin: { id: 'a1', name: 'Admin User', role: 'admin', avatar: 'https://i.pravatar.cc/150?u=admin' },
  guest: { id: 'g1', name: 'Guest', role: 'guest', avatar: '' }
};

// Create a multi-role user (can be both customer and pusher)
const createMultiRoleUser = (baseUser: User, roles: Role[]): MultiRoleUser => ({
  ...baseUser,
  availableRoles: roles,
});

const AuthScreen = ({ onLogin }: { onLogin: (role: Role) => void }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 relative overflow-hidden animate-in fade-in duration-700">
      {/* Brand Background Elements */}
      <div className="absolute top-[-10%] left-[-20%] w-[400px] h-[400px] bg-pushr-blue/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-20%] w-[400px] h-[400px] bg-pushr-yellow/10 rounded-full blur-[100px]"></div>

      <div className="mb-12 text-center z-10">
        <div className="w-24 h-24 bg-white rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-blue-500/20 transform -rotate-6 hover:rotate-0 transition-transform duration-500 overflow-hidden p-2">
          <img 
            src="/images/Logopushr.png" 
            alt="Pushr Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <h1 className="text-5xl font-black text-gray-900 mb-3 tracking-tight">Pushr</h1>
        <p className="text-gray-500 text-lg font-medium">Your World, Delivered.</p>
      </div>

      <div className="w-full max-w-xs space-y-4 z-10">
        <Button onClick={() => onLogin('customer')} className="shadow-xl shadow-blue-500/20">Continue as Customer</Button>
        <Button variant="outline" onClick={() => onLogin('pusher')}>I am a Pusher</Button>
        <button onClick={() => onLogin('admin')} className="w-full py-4 text-xs font-bold text-gray-400 hover:text-pushr-blue transition-colors uppercase tracking-widest">Admin Login</button>
      </div>
    </div>
  );
};

function AppContent() {
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [currentUser, setCurrentUser] = useState<MultiRoleUser | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const { showNotificationCenter, setShowNotificationCenter } = useNotifications();
  const [authView, setAuthView] = useState<'login' | 'signup' | 'forgot-password'>('login');
  const [pusherFloatBalance, setPusherFloatBalance] = useState(2);
  const [pusherIsOnline, setPusherIsOnline] = useState(true);

  const handleLogin = async (email: string, password: string, selectedRole?: Role) => {
    // Simulate login - replace with actual Firebase auth
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Handle admin login separately
    if (selectedRole === 'admin') {
      const adminUser = MOCK_USERS.admin;
      setCurrentUser({ ...adminUser, availableRoles: ['admin'] });
      return; // Admin doesn't use tabs
    }
    
    // Create a user with both customer and pusher roles (like Fiverr)
    // TESTING MODE: Always give users both roles for easy testing
    const baseUser = MOCK_USERS.customer;
    const multiRoleUser = createMultiRoleUser(baseUser, ['customer', 'pusher']);
    
    // Set initial role based on selection or default to customer
    if (selectedRole && multiRoleUser.availableRoles.includes(selectedRole)) {
      multiRoleUser.role = selectedRole;
    }
    
    setCurrentUser(multiRoleUser);
    setActiveTab(multiRoleUser.role === 'customer' ? 'home' : 'jobs');
  };

  const handleSignup = async (data: any) => {
    // Simulate signup - replace with actual Firebase auth
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // TESTING MODE: Always give new users both customer and pusher roles
    const baseUser = MOCK_USERS[data.role] || MOCK_USERS.customer;
    const multiRoleUser = createMultiRoleUser(baseUser, ['customer', 'pusher']);
    multiRoleUser.role = data.role || 'customer';
    
    setCurrentUser(multiRoleUser);
    setActiveTab(multiRoleUser.role === 'customer' ? 'home' : 'jobs');
  };

  const handleRoleSwitch = (newRole: Role) => {
    if (!currentUser) return;
    
    // TESTING MODE: Allow switching to any role without verification checks
    // Ensure user has the role in availableRoles, add it if not present
    let updatedRoles = currentUser.availableRoles || [];
    if (!updatedRoles.includes(newRole) && newRole !== 'admin' && newRole !== 'guest') {
      updatedRoles = [...updatedRoles, newRole];
    }
    
    const updatedUser = { 
      ...currentUser, 
      role: newRole,
      availableRoles: updatedRoles
    };
    setCurrentUser(updatedUser);
    
    // Switch to appropriate tab for the role
    if (newRole === 'customer') {
      setActiveTab('home');
    } else if (newRole === 'pusher') {
      setActiveTab('jobs');
    }
    
    if ('vibrate' in navigator) navigator.vibrate(20);
  };

  // 1. Onboarding Flow
  if (!hasOnboarded) {
    return <OnboardingView onComplete={() => setHasOnboarded(true)} />;
  }

  // 2. Auth Flow
  if (!currentUser) {
    if (authView === 'login') {
      return (
        <LoginView
          onLogin={(email, password, role) => handleLogin(email, password, role)}
          onSignup={() => setAuthView('signup')}
          onForgotPassword={() => setAuthView('forgot-password')}
        />
      );
    }
    if (authView === 'signup') {
      return (
        <SignupView
          onSignup={handleSignup}
          onLogin={() => setAuthView('login')}
          onChooseRole={() => {}}
        />
      );
    }
    if (authView === 'forgot-password') {
      return (
        <ForgotPasswordView
          onBack={() => setAuthView('login')}
        />
      );
    }
  }

  // 3. Main App Router
  const renderContent = () => {
    if (currentUser.role === 'admin') return <AdminView />;
    
    if (currentUser.role === 'pusher') {
      switch(activeTab) {
        case 'jobs':
          return (
            <PusherJobsView
              user={currentUser}
              floatBalance={pusherFloatBalance}
              isOnline={pusherIsOnline}
              onAcceptJob={(job) => {
                setPusherFloatBalance(prev => prev - 1);
                // Navigate to active delivery view
              }}
              onToggleOnline={() => setPusherIsOnline(prev => !prev)}
              onGoToFloat={() => setActiveTab('float')}
              onRoleChange={handleRoleSwitch}
            />
          );
        case 'float':
          return (
            <PusherFloatView
              user={currentUser}
              floatBalance={pusherFloatBalance}
              earnings={{
                available: 850,
                pending: 125,
                total: 12500
              }}
              onBuyFloat={() => {
                // Handle float purchase
                setPusherFloatBalance(prev => prev + 5);
              }}
              onWithdrawEarnings={() => {
                // Handle earnings withdrawal
                alert('Withdrawal processing...');
              }}
            />
          );
        case 'earnings': return <WalletView user={currentUser} />;
        case 'profile': return <ProfileView user={currentUser} onLogout={() => { setCurrentUser(null); setHasOnboarded(false); setAuthView('login'); }} />;
        default: return (
          <PusherJobsView
            user={currentUser}
            floatBalance={pusherFloatBalance}
            isOnline={pusherIsOnline}
            onAcceptJob={(job) => {
              setPusherFloatBalance(prev => prev - 1);
            }}
            onToggleOnline={() => setPusherIsOnline(prev => !prev)}
            onGoToFloat={() => setActiveTab('float')}
            onRoleChange={handleRoleSwitch}
          />
        );
      }
    }

    // Customer Views
    switch(activeTab) {
      case 'home': return <CustomerView user={currentUser} onRoleChange={handleRoleSwitch} />;
      case 'activity': return <ActivityView />;
      case 'profile': 
        if (currentUser.role === 'pusher') {
          return <PusherProfileView user={currentUser} onLogout={() => { setCurrentUser(null); setHasOnboarded(false); setAuthView('login'); }} />;
        }
        return <ProfileView user={currentUser} onLogout={() => { setCurrentUser(null); setHasOnboarded(false); setAuthView('login'); }} />;
      default: return <CustomerView user={currentUser} onRoleChange={handleRoleSwitch} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <div className={`w-full ${currentUser?.role === 'admin' ? 'max-w-full' : 'max-w-md'} mx-auto bg-white min-h-screen shadow-2xl relative overflow-hidden flex flex-col`} style={{ minWidth: '320px' }}>
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
          {renderContent()}
        </div>

        {/* Navigation - Only for mobile users (Customer/Pusher) */}
        {currentUser && currentUser.role !== 'admin' && (
          <BottomNav 
            role={currentUser.role as 'customer' | 'pusher'} 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />
        )}

        {/* Notification Center */}
        <NotificationCenter 
          isOpen={showNotificationCenter} 
          onClose={() => setShowNotificationCenter(false)} 
        />

      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </ThemeProvider>
  );
}