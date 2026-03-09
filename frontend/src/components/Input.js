import React from 'react';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  helperText,
  disabled = false,
  className = '',
  inputClassName = '',
  ...props
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label 
          htmlFor={name} 
          className="block text-base md:text-sm font-medium text-gray-700 mb-1.5 md:mb-1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`
          w-full 
          px-3 py-2 md:px-4 md:py-2.5
          text-base md:text-sm
          border rounded-lg
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
          min-h-[44px]
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          ${inputClassName}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-base md:text-sm text-red-500">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-base md:text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
