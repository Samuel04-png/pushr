import React, { useState } from 'react';
import { AppBar } from '../components/AppBar';
import { Button, Card, Badge, Input, Alert } from '../components/UI';
import { useToast } from '../hooks/useToast';
import { Upload, CheckCircle2, XCircle, Camera, IdCard, Phone, MessageSquare, Clock, Shield, ArrowRight, User, MapPin, DollarSign, Bike, Truck, Archive, User as UserIcon, Plus, X } from 'lucide-react';
import { CATEGORIES, CategoryId } from '../types';

type VerificationStep = 'documents' | 'selfie' | 'profile' | 'submitted' | 'approved' | 'rejected';

interface VerificationData {
  idFront: {
    file?: File | string;
    preview?: string;
    status: 'pending' | 'uploaded' | 'verified' | 'rejected';
  };
  idBack: {
    file?: File | string;
    preview?: string;
    status: 'pending' | 'uploaded' | 'verified' | 'rejected';
  };
  selfie: {
    file?: File | string;
    preview?: string;
    status: 'pending' | 'uploaded' | 'verified' | 'rejected';
  };
  profile: {
    categories: CategoryId[];
    bio: string;
    phone: string;
    serviceFees?: string;
    serviceRadius?: string;
  };
}

interface PusherVerificationViewProps {
  user: any;
  onBack: () => void;
  onSubmit?: (data: VerificationData) => Promise<void>;
  verificationStatus?: 'not_applied' | 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
}

export const PusherVerificationView = ({ 
  user, 
  onBack,
  onSubmit,
  verificationStatus = 'not_applied',
  rejectionReason
}: PusherVerificationViewProps) => {
  const { showToast } = useToast();
  const [step, setStep] = useState<VerificationStep>(
    verificationStatus === 'approved' ? 'approved' :
    verificationStatus === 'rejected' ? 'rejected' :
    verificationStatus === 'pending' ? 'submitted' :
    'documents'
  );
  const [uploading, setUploading] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [verificationData, setVerificationData] = useState<VerificationData>({
    idFront: { status: 'pending' },
    idBack: { status: 'pending' },
    selfie: { status: 'pending' },
    profile: {
      categories: [],
      bio: '',
      phone: user.phone || '',
      serviceFees: '',
      serviceRadius: '',
    },
  });

  const handleFileUpload = (type: 'idFront' | 'idBack' | 'selfie', file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file (JPG or PNG)', 'error');
      return;
    }
    
    // Validate file size (8MB max)
    if (file.size > 8 * 1024 * 1024) {
      showToast('File size must be less than 8MB', 'error');
      return;
    }

    setUploading(type);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setVerificationData(prev => ({
        ...prev,
        [type]: {
          file: file,
          preview: reader.result as string,
          status: 'uploaded' as const,
        }
      }));
      setUploading(null);
      if ('vibrate' in navigator) navigator.vibrate(20);
      showToast(`${type === 'selfie' ? 'Selfie' : 'Document'} uploaded successfully`, 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleNext = () => {
    if (step === 'documents') {
      if (verificationData.idFront.status !== 'uploaded' || verificationData.idBack.status !== 'uploaded') {
        showToast('Please upload both front and back of your ID document', 'error');
        return;
      }
      setStep('selfie');
    } else if (step === 'selfie') {
      if (verificationData.selfie.status !== 'uploaded') {
        showToast('Please upload your selfie photo', 'error');
        return;
      }
      setStep('profile');
    } else if (step === 'profile') {
      const { profile } = verificationData;
      if (profile.categories.length === 0) {
        showToast('Please select at least one delivery category', 'error');
        return;
      }
      if (!profile.bio.trim() || profile.bio.length > 250) {
        showToast('Please provide a bio (max 250 characters)', 'error');
        return;
      }
      if (!profile.phone.trim()) {
        showToast('Please provide your contact phone number', 'error');
        return;
      }
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmit?.(verificationData);
      setStep('submitted');
      if ('vibrate' in navigator) navigator.vibrate(30);
      showToast('Verification submitted successfully! We\'ll review your application within 24-48 hours.', 'success');
    } catch (error) {
      showToast('Submission failed. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleCategory = (categoryId: CategoryId) => {
    setVerificationData(prev => {
      const categories = prev.profile.categories.includes(categoryId)
        ? prev.profile.categories.filter(c => c !== categoryId)
        : [...prev.profile.categories, categoryId];
      
      if ('vibrate' in navigator) navigator.vibrate(10);
      return {
        ...prev,
        profile: { ...prev.profile, categories }
      };
    });
  };

  const steps = [
    { id: 'documents', label: 'Documents', icon: IdCard },
    { id: 'selfie', label: 'Selfie', icon: Camera },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'submitted', label: 'Review', icon: CheckCircle2 },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === step);

  // Submitted/Approved/Rejected Status Views
  if (step === 'submitted' || step === 'approved' || step === 'rejected') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
        <AppBar
          title="Verification Status"
          showBack
          onBack={onBack}
          showLogout={false}
        />

        <div className="p-4 sm:p-6 space-y-6">
          <Card variant="elevated" className="!p-8 text-center">
            {step === 'approved' ? (
              <>
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
                  <CheckCircle2 className="text-pushr-success" size={48} />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-3">Verification Approved!</h2>
                <p className="text-gray-600 mb-6">
                  Congratulations! You're now a verified Pushr. You can start accepting deliveries and earning.
                </p>
                <Badge color="green" size="lg" className="mb-6">
                  <Shield size={16} className="mr-2" />
                  Verified Pushr
                </Badge>
                <Button
                  onClick={onBack}
                  icon={<ArrowRight size={18} />}
                >
                  Start Accepting Jobs
                </Button>
              </>
            ) : step === 'rejected' ? (
              <>
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
                  <XCircle className="text-pushr-danger" size={48} />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-3">Verification Rejected</h2>
                {rejectionReason && (
                  <Alert
                    type="error"
                    message={rejectionReason}
                    className="mb-6 text-left"
                  />
                )}
                <p className="text-gray-600 mb-6">
                  Your verification request was rejected. Please review your documents and try again.
                </p>
                <Button
                  onClick={() => {
                    setStep('documents');
                    setVerificationData({
                      idFront: { status: 'pending' },
                      idBack: { status: 'pending' },
                      selfie: { status: 'pending' },
                      profile: {
                        categories: [],
                        bio: '',
                        phone: user.phone || '',
                        serviceFees: '',
                        serviceRadius: '',
                      },
                    });
                  }}
                  variant="outline"
                >
                  Resubmit Application
                </Button>
              </>
            ) : (
              <>
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
                  <Clock className="text-pushr-blue" size={48} />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-3">Verification Submitted</h2>
                <p className="text-gray-600 mb-2">
                  Your verification request has been submitted successfully!
                </p>
                <p className="text-gray-500 text-sm mb-6">
                  We'll review your application and notify you within 24-48 hours.
                </p>
                <Badge color="blue" size="lg">
                  <Clock size={16} className="mr-2" />
                  Under Review
                </Badge>
              </>
            )}
          </Card>

          <Button
            onClick={onBack}
            variant="outline"
            fullWidth={false}
            className="mx-auto"
          >
            Back to Profile
          </Button>
        </div>
      </div>
    );
  }

  // Multi-step Form
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
      <AppBar
        title="Become a Pushr"
        subtitle={`Step ${currentStepIndex + 1} of ${steps.length}`}
        showBack
        onBack={onBack}
        showLogout={false}
      />

      <div className="p-4 sm:p-6 space-y-6">
        {/* Progress Stepper */}
        <Card variant="outlined" className="!p-4">
          <div className="flex items-center justify-between">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              const isActive = idx === currentStepIndex;
              const isCompleted = idx < currentStepIndex;
              
              return (
                <div key={s.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isCompleted ? 'bg-pushr-success text-white' :
                      isActive ? 'bg-pushr-blue text-white shadow-lg scale-110' :
                      'bg-gray-200 text-gray-400'
                    }`}>
                      <Icon size={18} />
                    </div>
                    <p className={`text-xs font-bold mt-2 text-center ${
                      isActive ? 'text-pushr-blue' : isCompleted ? 'text-pushr-success' : 'text-gray-400'
                    }`}>
                      {s.label}
                    </p>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`h-1 flex-1 mx-2 transition-all duration-300 ${
                      isCompleted ? 'bg-pushr-success' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Step 1: Documents */}
        {step === 'documents' && (
          <div className="space-y-6 animate-slide-up">
            <Card variant="elevated" className="!p-6">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <IdCard className="text-pushr-blue" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-1">Upload National ID Documents</h3>
                  <p className="text-sm text-gray-600">
                    Please upload clear photos of both the front and back of your National ID / IC / NRC document.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Front ID */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Front of ID <span className="text-pushr-danger">*</span>
                  </label>
                  {verificationData.idFront.preview ? (
                    <div className="relative bg-green-50 border-2 border-green-200 p-4 rounded-2xl">
                      <img 
                        src={verificationData.idFront.preview} 
                        alt="ID Front" 
                        className="w-full h-48 object-contain rounded-xl mb-2"
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="text-pushr-success" size={20} />
                          <span className="text-sm font-semibold text-gray-900">Front uploaded</span>
                        </div>
                        <button
                          onClick={() => {
                            setVerificationData(prev => ({
                              ...prev,
                              idFront: { status: 'pending' }
                            }));
                          }}
                          className="p-2 hover:bg-green-100 rounded-full transition-colors"
                        >
                          <X size={18} className="text-gray-400" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="block">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/jpg"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload('idFront', file);
                        }}
                        disabled={uploading === 'idFront'}
                      />
                      <div className={`w-full p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center space-y-3 transition-all touch-feedback active:scale-98 ${
                        uploading === 'idFront'
                          ? 'border-pushr-blue bg-blue-50 cursor-wait'
                          : 'border-gray-300 hover:border-pushr-blue hover:bg-blue-50 cursor-pointer'
                      }`}>
                        {uploading === 'idFront' ? (
                          <>
                            <div className="w-12 h-12 border-4 border-pushr-blue border-t-transparent rounded-full animate-spin"></div>
                            <span className="font-semibold text-gray-900">Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="text-gray-400" size={32} />
                            <span className="font-semibold text-gray-700">Upload Front of ID</span>
                            <span className="text-xs text-gray-500">JPG or PNG (Max 8MB)</span>
                          </>
                        )}
                      </div>
                    </label>
                  )}
                </div>

                {/* Back ID */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Back of ID <span className="text-pushr-danger">*</span>
                  </label>
                  {verificationData.idBack.preview ? (
                    <div className="relative bg-green-50 border-2 border-green-200 p-4 rounded-2xl">
                      <img 
                        src={verificationData.idBack.preview} 
                        alt="ID Back" 
                        className="w-full h-48 object-contain rounded-xl mb-2"
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="text-pushr-success" size={20} />
                          <span className="text-sm font-semibold text-gray-900">Back uploaded</span>
                        </div>
                        <button
                          onClick={() => {
                            setVerificationData(prev => ({
                              ...prev,
                              idBack: { status: 'pending' }
                            }));
                          }}
                          className="p-2 hover:bg-green-100 rounded-full transition-colors"
                        >
                          <X size={18} className="text-gray-400" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="block">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/jpg"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload('idBack', file);
                        }}
                        disabled={uploading === 'idBack'}
                      />
                      <div className={`w-full p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center space-y-3 transition-all touch-feedback active:scale-98 ${
                        uploading === 'idBack'
                          ? 'border-pushr-blue bg-blue-50 cursor-wait'
                          : 'border-gray-300 hover:border-pushr-blue hover:bg-blue-50 cursor-pointer'
                      }`}>
                        {uploading === 'idBack' ? (
                          <>
                            <div className="w-12 h-12 border-4 border-pushr-blue border-t-transparent rounded-full animate-spin"></div>
                            <span className="font-semibold text-gray-900">Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="text-gray-400" size={32} />
                            <span className="font-semibold text-gray-700">Upload Back of ID</span>
                            <span className="text-xs text-gray-500">JPG or PNG (Max 8MB)</span>
                          </>
                        )}
                      </div>
                    </label>
                  )}
                </div>
              </div>
            </Card>

            <Button
              onClick={handleNext}
              disabled={verificationData.idFront.status !== 'uploaded' || verificationData.idBack.status !== 'uploaded' || uploading !== null}
              icon={<ArrowRight size={18} />}
            >
              Continue to Selfie
            </Button>
          </div>
        )}

        {/* Step 2: Selfie */}
        {step === 'selfie' && (
          <div className="space-y-6 animate-slide-up">
            <Card variant="elevated" className="!p-6">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Camera className="text-purple-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-1">Upload Selfie Photo</h3>
                  <p className="text-sm text-gray-600">
                    Please take a clear selfie photo. Make sure your face is clearly visible and well-lit.
                  </p>
                </div>
              </div>

              {verificationData.selfie.preview ? (
                <div className="relative bg-green-50 border-2 border-green-200 p-4 rounded-2xl">
                  <img 
                    src={verificationData.selfie.preview} 
                    alt="Selfie" 
                    className="w-full h-64 object-cover rounded-xl mb-2"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="text-pushr-success" size={20} />
                      <span className="text-sm font-semibold text-gray-900">Selfie uploaded</span>
                    </div>
                    <button
                      onClick={() => {
                        setVerificationData(prev => ({
                          ...prev,
                          selfie: { status: 'pending' }
                        }));
                      }}
                      className="p-2 hover:bg-green-100 rounded-full transition-colors"
                    >
                      <X size={18} className="text-gray-400" />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="block">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    capture="user"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload('selfie', file);
                    }}
                    disabled={uploading === 'selfie'}
                  />
                  <div className={`w-full p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center space-y-3 transition-all touch-feedback active:scale-98 ${
                    uploading === 'selfie'
                      ? 'border-pushr-blue bg-blue-50 cursor-wait'
                      : 'border-gray-300 hover:border-pushr-blue hover:bg-blue-50 cursor-pointer'
                  }`}>
                    {uploading === 'selfie' ? (
                      <>
                        <div className="w-12 h-12 border-4 border-pushr-blue border-t-transparent rounded-full animate-spin"></div>
                        <span className="font-semibold text-gray-900">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Camera className="text-gray-400" size={32} />
                        <span className="font-semibold text-gray-700">Take or Upload Selfie</span>
                        <span className="text-xs text-gray-500">JPG or PNG (Max 8MB)</span>
                      </>
                    )}
                  </div>
                </label>
              )}
            </Card>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setStep('documents')}
                fullWidth={false}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={verificationData.selfie.status !== 'uploaded' || uploading !== null}
                icon={<ArrowRight size={18} />}
                fullWidth={false}
                className="flex-1"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Profile */}
        {step === 'profile' && (
          <div className="space-y-6 animate-slide-up">
            <Card variant="elevated" className="!p-6">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <User className="text-orange-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-1">Complete Your Profile</h3>
                  <p className="text-sm text-gray-600">
                    Tell us about yourself and the services you'll provide.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {/* Categories */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Delivery Categories <span className="text-pushr-danger">*</span>
                    <span className="text-xs font-normal text-gray-500 ml-2">(Select all that apply)</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {CATEGORIES.map(category => {
                      const isSelected = verificationData.profile.categories.includes(category.id);
                      const Icon = category.id === 'bike' ? Bike : 
                                   category.id === 'truck' ? Truck :
                                   category.id === 'wheelbarrow' ? Archive : UserIcon;
                      
                      return (
                        <button
                          key={category.id}
                          onClick={() => toggleCategory(category.id)}
                          className={`p-4 rounded-2xl border-2 transition-all touch-feedback active:scale-95 ${
                            isSelected
                              ? 'border-pushr-blue bg-blue-50 shadow-md'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <Icon className={`mx-auto mb-2 ${isSelected ? 'text-pushr-blue' : 'text-gray-400'}`} size={24} />
                          <p className={`font-semibold text-sm ${isSelected ? 'text-pushr-blue' : 'text-gray-700'}`}>
                            {category.name}
                          </p>
                          {isSelected && (
                            <CheckCircle2 className="absolute top-2 right-2 text-pushr-blue" size={16} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Short Description / Bio <span className="text-pushr-danger">*</span>
                    <span className="text-xs font-normal text-gray-500 ml-2">
                      ({verificationData.profile.bio.length}/250 characters)
                    </span>
                  </label>
                  <textarea
                    value={verificationData.profile.bio}
                    onChange={(e) => {
                      if (e.target.value.length <= 250) {
                        setVerificationData(prev => ({
                          ...prev,
                          profile: { ...prev.profile, bio: e.target.value }
                        }));
                      }
                    }}
                    placeholder="Tell customers about yourself and your delivery experience..."
                    rows={4}
                    className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-pushr-blue focus:ring-2 focus:ring-pushr-blue/20 outline-none resize-none"
                    required
                  />
                </div>

                {/* Contact */}
                <Input
                  label="Contact / Phone"
                  value={verificationData.profile.phone}
                  onChange={(val) => setVerificationData(prev => ({
                    ...prev,
                    profile: { ...prev.profile, phone: val }
                  }))}
                  placeholder="+260 XXX XXX XXX"
                  type="tel"
                  icon={<Phone size={18} />}
                  required
                />

                {/* Optional Fields */}
                <div className="pt-4 border-t border-gray-200 space-y-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Optional Information</p>
                  
                  <Input
                    label="Example Service Fees"
                    value={verificationData.profile.serviceFees || ''}
                    onChange={(val) => setVerificationData(prev => ({
                      ...prev,
                      profile: { ...prev.profile, serviceFees: val }
                    }))}
                    placeholder="e.g., K50 - K200"
                    icon={<DollarSign size={18} />}
                  />

                  <Input
                    label="Service Radius (km)"
                    value={verificationData.profile.serviceRadius || ''}
                    onChange={(val) => setVerificationData(prev => ({
                      ...prev,
                      profile: { ...prev.profile, serviceRadius: val }
                    }))}
                    placeholder="e.g., 10"
                    icon={<MapPin size={18} />}
                    type="number"
                  />
                </div>
              </div>
            </Card>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setStep('selfie')}
                fullWidth={false}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                isLoading={submitting}
                disabled={submitting}
                icon={<CheckCircle2 size={18} />}
                fullWidth={false}
                className="flex-1"
              >
                Submit Application
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
