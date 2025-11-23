import React, { useState } from 'react';
import { AppBar } from '../components/AppBar';
import { Card, Button, Badge, Alert, Input } from '../components/UI';
import { useToast } from '../hooks/useToast';
import { CheckCircle2, XCircle, Clock, ArrowLeft, Eye, FileText, User, Phone, Calendar, MessageSquare, Shield } from 'lucide-react';

interface VerificationApplication {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  submittedAt: number;
  status: 'pending' | 'approved' | 'rejected';
  documents: {
    idFront?: string;
    idBack?: string;
    selfie?: string;
  };
  profile: {
    categories: string[];
    bio: string;
    phone: string;
    serviceFees?: string;
    serviceRadius?: string;
  };
  rejectionReason?: string;
}

const MOCK_VERIFICATIONS: VerificationApplication[] = [
  {
    id: 'v1',
    userId: 'u1',
    userName: 'John Doe',
    userPhone: '+260 977 123456',
    submittedAt: Date.now() - 86400000,
    status: 'pending',
    documents: {
      idFront: '/images/Logopushr.png',
      idBack: '/images/Logopushr.png',
      selfie: '/images/Logopushr.png',
    },
    profile: {
      categories: ['bike', 'walking'],
      bio: 'Experienced delivery person with 3 years of experience in Lusaka.',
      phone: '+260 977 123456',
      serviceFees: 'K50 - K200',
      serviceRadius: '10',
    },
  },
  {
    id: 'v2',
    userId: 'u2',
    userName: 'Jane Smith',
    userPhone: '+260 977 654321',
    submittedAt: Date.now() - 172800000,
    status: 'pending',
    documents: {
      idFront: '/images/Logopushr.png',
      idBack: '/images/Logopushr.png',
      selfie: '/images/Logopushr.png',
    },
    profile: {
      categories: ['truck'],
      bio: 'Professional mover with truck available for large deliveries.',
      phone: '+260 977 654321',
      serviceFees: 'K150 - K500',
      serviceRadius: '25',
    },
  },
];

export const AdminVerificationQueueView = ({ onBack }: { onBack: () => void }) => {
  const { showToast } = useToast();
  const [verifications, setVerifications] = useState<VerificationApplication[]>(MOCK_VERIFICATIONS);
  const [selectedApp, setSelectedApp] = useState<VerificationApplication | null>(null);
  const [rejectionComment, setRejectionComment] = useState('');
  const [processing, setProcessing] = useState<string | null>(null);

  const handleApprove = async (appId: string) => {
    setProcessing(appId);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setVerifications(prev => prev.map(v => 
        v.id === appId ? { ...v, status: 'approved' as const } : v
      ));
      
      if ('vibrate' in navigator) navigator.vibrate(30);
      showToast('Verification approved successfully!', 'success');
      
      // In real app, send notification/email to user
    } catch (error) {
      showToast('Failed to approve verification', 'error');
    } finally {
      setProcessing(null);
      setSelectedApp(null);
    }
  };

  const handleReject = async (appId: string) => {
    if (!rejectionComment.trim()) {
      showToast('Please provide a reason for rejection', 'error');
      return;
    }

    setProcessing(appId);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setVerifications(prev => prev.map(v => 
        v.id === appId ? { ...v, status: 'rejected' as const, rejectionReason: rejectionComment } : v
      ));
      
      if ('vibrate' in navigator) navigator.vibrate(50);
      showToast('Verification rejected', 'warning');
      
      // In real app, send notification/email to user with rejection reason
      setRejectionComment('');
      setSelectedApp(null);
    } catch (error) {
      showToast('Failed to reject verification', 'error');
    } finally {
      setProcessing(null);
    }
  };

  const pendingCount = verifications.filter(v => v.status === 'pending').length;

  if (selectedApp) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-6 sm:pb-8">
        <AppBar
          title="Review Application"
          showBack
          onBack={() => setSelectedApp(null)}
          showLogout={false}
        />

        <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
          {/* Applicant Info */}
          <Card variant="elevated" className="!p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-pushr-blue to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {selectedApp.userName.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900">{selectedApp.userName}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Phone size={14} className="text-gray-400" />
                  <p className="text-sm text-gray-500">{selectedApp.userPhone}</p>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge color="yellow" size="sm">
                    <Clock size={10} className="mr-1" />
                    Pending
                  </Badge>
                  <span className="text-xs text-gray-400">
                    Submitted {new Date(selectedApp.submittedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Documents */}
          <Card variant="elevated" className="!p-6">
            <h4 className="font-bold text-lg mb-4 flex items-center">
              <FileText size={20} className="mr-2 text-pushr-blue" />
              Verification Documents
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {selectedApp.documents.idFront && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase">ID Front</p>
                  <div className="relative aspect-[3/2] bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200">
                    <img 
                      src={selectedApp.documents.idFront} 
                      alt="ID Front"
                      className="w-full h-full object-contain"
                    />
                    <button
                      onClick={() => window.open(selectedApp.documents.idFront, '_blank')}
                      className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center"
                    >
                      <Eye className="text-white opacity-0 hover:opacity-100 transition-opacity" size={24} />
                    </button>
                  </div>
                </div>
              )}
              {selectedApp.documents.idBack && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase">ID Back</p>
                  <div className="relative aspect-[3/2] bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200">
                    <img 
                      src={selectedApp.documents.idBack} 
                      alt="ID Back"
                      className="w-full h-full object-contain"
                    />
                    <button
                      onClick={() => window.open(selectedApp.documents.idBack, '_blank')}
                      className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center"
                    >
                      <Eye className="text-white opacity-0 hover:opacity-100 transition-opacity" size={24} />
                    </button>
                  </div>
                </div>
              )}
              {selectedApp.documents.selfie && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Selfie</p>
                  <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200">
                    <img 
                      src={selectedApp.documents.selfie} 
                      alt="Selfie"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => window.open(selectedApp.documents.selfie, '_blank')}
                      className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center"
                    >
                      <Eye className="text-white opacity-0 hover:opacity-100 transition-opacity" size={24} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Profile Info */}
          <Card variant="elevated" className="!p-6">
            <h4 className="font-bold text-lg mb-4 flex items-center">
              <User size={20} className="mr-2 text-pushr-blue" />
              Profile Information
            </h4>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Categories</p>
                <div className="flex flex-wrap gap-2">
                  {selectedApp.profile.categories.map(cat => (
                    <Badge key={cat} color="blue" size="sm">{cat}</Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Bio</p>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-xl">{selectedApp.profile.bio}</p>
              </div>

              {selectedApp.profile.serviceFees && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Service Fees</p>
                  <p className="text-sm text-gray-700">{selectedApp.profile.serviceFees}</p>
                </div>
              )}

              {selectedApp.profile.serviceRadius && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Service Radius</p>
                  <p className="text-sm text-gray-700">{selectedApp.profile.serviceRadius} km</p>
                </div>
              )}
            </div>
          </Card>

          {/* Rejection Comment */}
          {selectedApp.status === 'pending' && (
            <Card variant="outlined" className="!p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Rejection Reason (if rejecting)
              </label>
              <textarea
                value={rejectionComment}
                onChange={(e) => setRejectionComment(e.target.value)}
                placeholder="Provide a reason for rejection (optional but recommended)..."
                rows={3}
                className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-pushr-blue focus:ring-2 focus:ring-pushr-blue/20 outline-none resize-none"
              />
            </Card>
          )}

          {/* Actions */}
          {selectedApp.status === 'pending' && (
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setSelectedApp(null)}
                fullWidth={false}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => handleReject(selectedApp.id)}
                disabled={processing === selectedApp.id}
                isLoading={processing === selectedApp.id}
                icon={<XCircle size={18} />}
                fullWidth={false}
                className="flex-1"
              >
                Reject
              </Button>
              <Button
                onClick={() => handleApprove(selectedApp.id)}
                disabled={processing === selectedApp.id}
                isLoading={processing === selectedApp.id}
                icon={<CheckCircle2 size={18} />}
                fullWidth={false}
                className="flex-1"
              >
                Approve
              </Button>
            </div>
          )}

          {selectedApp.status === 'approved' && (
            <Alert
              type="success"
              message="This application has been approved."
              className="mb-4"
            />
          )}

          {selectedApp.status === 'rejected' && selectedApp.rejectionReason && (
            <Alert
              type="error"
              message={`Rejected: ${selectedApp.rejectionReason}`}
              className="mb-4"
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
      <AppBar
        title="Verification Queue"
        subtitle={`${pendingCount} pending review${pendingCount !== 1 ? 's' : ''}`}
        showBack
        onBack={onBack}
        showLogout={false}
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
        {verifications.length === 0 ? (
          <Card variant="outlined" className="!p-8 text-center">
            <CheckCircle2 className="w-16 h-16 text-pushr-success mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">All Caught Up!</h3>
            <p className="text-gray-600">No pending verification applications.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {verifications.map(app => (
              <Card
                key={app.id}
                variant="elevated"
                className="!p-4 sm:!p-5 hover:shadow-lg transition-all touch-feedback active:scale-98 cursor-pointer"
                onClick={() => setSelectedApp(app)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-pushr-blue to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0">
                      {app.userName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-sm sm:text-base md:text-lg truncate">{app.userName}</h4>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-0.5 sm:space-y-0 mt-1">
                        <div className="flex items-center space-x-1">
                          <Phone size={10} className="sm:w-3 sm:h-3 text-gray-400" />
                          <p className="text-[10px] sm:text-xs text-gray-500 truncate">{app.userPhone}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-2 flex-wrap gap-1">
                        <Badge 
                          color={app.status === 'approved' ? 'green' : app.status === 'rejected' ? 'red' : 'yellow'} 
                          size="sm"
                        >
                          {app.status === 'approved' ? (
                            <>
                              <CheckCircle2 size={8} className="mr-1" />
                              Approved
                            </>
                          ) : app.status === 'rejected' ? (
                            <>
                              <XCircle size={8} className="mr-1" />
                              Rejected
                            </>
                          ) : (
                            <>
                              <Clock size={8} className="mr-1" />
                              Pending
                            </>
                          )}
                        </Badge>
                        <span className="text-[10px] sm:text-xs text-gray-400">
                          {new Date(app.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 sm:ml-4 flex-shrink-0 justify-end sm:justify-start">
                    {app.status === 'pending' && (
                      <>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedApp(app);
                          }}
                          icon={<XCircle size={12} className="sm:w-3.5 sm:h-3.5" />}
                          fullWidth={false}
                          className="text-xs sm:text-sm"
                        >
                          <span className="hidden sm:inline">Reject</span>
                          <span className="sm:hidden">✕</span>
                        </Button>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApprove(app.id);
                          }}
                          disabled={processing === app.id}
                          icon={<CheckCircle2 size={12} className="sm:w-3.5 sm:h-3.5" />}
                          fullWidth={false}
                          className="text-xs sm:text-sm"
                        >
                          <span className="hidden sm:inline">Approve</span>
                          <span className="sm:hidden">✓</span>
                        </Button>
                      </>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedApp(app);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    >
                      <Eye size={16} className="sm:w-[18px] sm:h-[18px] text-gray-400" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

