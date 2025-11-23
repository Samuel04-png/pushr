import React from 'react';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({ checked, onChange, disabled = false }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 touch-feedback active:scale-95 ${
        checked ? 'bg-pushr-blue' : 'bg-gray-300'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-200 ${
          checked ? 'translate-x-7' : 'translate-x-1'
        }`}
      />
    </button>
  );
};

