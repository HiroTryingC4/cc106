import React from 'react';

const ToggleSwitch = ({ 
  id, 
  checked, 
  onChange, 
  label, 
  description,
  disabled = false 
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-900 mb-1">
            {label}
          </label>
        )}
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
      </div>
      
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange({ target: { checked: !checked } })}
        className={`
          relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${checked ? 'bg-blue-600' : 'bg-gray-200'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <span className="sr-only">{label}</span>
        <span
          aria-hidden="true"
          className={`
            pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 
            transition duration-200 ease-in-out
            ${checked ? 'translate-x-6' : 'translate-x-0'}
          `}
        />
      </button>
    </div>
  );
};

export default ToggleSwitch;
