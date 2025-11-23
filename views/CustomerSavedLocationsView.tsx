import React, { useState } from 'react';
import { AppBar } from '../components/AppBar';
import { Card, Button, Input, Badge } from '../components/UI';
import { MapPin, Plus, Home, Briefcase, Edit2, Trash2, X } from 'lucide-react';

const MOCK_SAVED_LOCATIONS = [
  { id: '1', name: 'Home', address: 'Kabulonga, Lusaka', type: 'home', icon: '🏠' },
  { id: '2', name: 'Work', address: 'Cairo Road, Lusaka', type: 'work', icon: '💼' },
  { id: '3', name: 'Garden City', address: 'Garden City Mall, Lusaka', type: 'other', icon: '📍' },
];

export const CustomerSavedLocationsView = ({ onBack }: { onBack: () => void }) => {
  const [locations, setLocations] = useState(MOCK_SAVED_LOCATIONS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', address: '', type: 'other' as 'home' | 'work' | 'other' });

  const handleAdd = () => {
    if (!formData.name || !formData.address) return;
    
    const newLocation = {
      id: Date.now().toString(),
      ...formData,
      icon: formData.type === 'home' ? '🏠' : formData.type === 'work' ? '💼' : '📍',
    };
    
    setLocations(prev => [...prev, newLocation]);
    setFormData({ name: '', address: '', type: 'other' });
    setShowAddForm(false);
    if ('vibrate' in navigator) navigator.vibrate(20);
  };

  const handleDelete = (id: string) => {
    setLocations(prev => prev.filter(loc => loc.id !== id));
    if ('vibrate' in navigator) navigator.vibrate(10);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
      <AppBar
        title="Saved Locations"
        showBack
        onBack={onBack}
        showLogout={false}
      />

      <div className="p-4 sm:p-6 space-y-6">
        {/* Add Location Button */}
        <Button
          onClick={() => setShowAddForm(true)}
          icon={<Plus size={18} />}
          variant="secondary"
        >
          Add New Location
        </Button>

        {/* Add Location Form */}
        {showAddForm && (
          <Card variant="elevated" className="!p-6 animate-slide-down">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Add Location</h3>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setFormData({ name: '', address: '', type: 'other' });
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <Input
                label="Location Name"
                value={formData.name}
                onChange={(val) => setFormData(prev => ({ ...prev, name: val }))}
                placeholder="e.g., Home, Work"
                icon={<MapPin size={18} />}
              />

              <Input
                label="Address"
                value={formData.address}
                onChange={(val) => setFormData(prev => ({ ...prev, address: val }))}
                placeholder="Enter full address"
                icon={<MapPin size={18} />}
              />

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'home', label: 'Home', icon: '🏠' },
                    { value: 'work', label: 'Work', icon: '💼' },
                    { value: 'other', label: 'Other', icon: '📍' },
                  ].map(type => (
                    <button
                      key={type.value}
                      onClick={() => setFormData(prev => ({ ...prev, type: type.value as any }))}
                      className={`p-3 rounded-2xl border-2 transition-all touch-feedback active:scale-95 ${
                        formData.type === type.value
                          ? 'border-pushr-blue bg-blue-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <span className="text-2xl mb-1 block">{type.icon}</span>
                      <span className="text-xs font-semibold text-gray-900">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setFormData({ name: '', address: '', type: 'other' });
                  }}
                  fullWidth={false}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAdd}
                  fullWidth={false}
                  className="flex-1"
                >
                  Save
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Locations List */}
        <div className="space-y-3">
          {locations.map(location => (
            <Card
              key={location.id}
              variant="elevated"
              className="!p-5 hover:shadow-lg transition-all touch-feedback active:scale-98"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pushr-blue to-purple-600 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                  {location.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-bold text-gray-900">{location.name}</h4>
                    {location.type !== 'other' && (
                      <Badge color={location.type === 'home' ? 'blue' : 'orange'} size="sm">
                        {location.type === 'home' ? 'Home' : 'Work'}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{location.address}</p>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    onClick={() => handleDelete(location.id)}
                    className="p-2 hover:bg-red-50 rounded-full transition-colors touch-feedback active:scale-95"
                  >
                    <Trash2 size={18} className="text-red-500" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {locations.length === 0 && (
          <Card variant="outlined" className="!p-12 text-center">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium mb-2">No Saved Locations</p>
            <p className="text-sm text-gray-400 mb-4">Save your frequently used addresses for faster ordering</p>
            <Button
              onClick={() => setShowAddForm(true)}
              icon={<Plus size={18} />}
              size="md"
              fullWidth={false}
              className="mx-auto"
            >
              Add Location
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

