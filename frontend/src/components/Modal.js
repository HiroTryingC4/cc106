import React, { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md md:max-w-2xl',
    lg: 'max-w-2xl md:max-w-4xl',
    xl: 'max-w-4xl md:max-w-6xl',
    full: 'max-w-full'
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Container - enables vertical scrolling */}
      <div className="fixed inset-0 overflow-y-auto">
        {/* Centering wrapper - no padding on mobile, padding on desktop */}
        <div className="flex min-h-full items-center justify-center p-0 md:p-4">
          {/* Modal - full screen on mobile, rounded on desktop */}
          <div className={`
            relative w-full
            ${sizes[size]}
            bg-white
            rounded-none md:rounded-lg
            shadow-xl
            m-0 md:m-4
            max-h-screen md:max-h-[90vh]
            overflow-y-auto
          `}>
            {/* Sticky Header - stays visible when scrolling on mobile */}
            <div className="sticky top-0 bg-white border-b px-4 py-3 md:px-6 md:py-4 z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content - responsive padding */}
            <div className="px-4 py-4 md:px-6 md:py-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
