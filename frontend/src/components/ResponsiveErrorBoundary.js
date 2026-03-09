import React from 'react';
import { getBreakpoint, getViewportDimensions } from '../utils/responsive';

/**
 * Error boundary specifically for responsive component failures
 * Logs breakpoint and viewport information for debugging
 * Provides a fallback UI that works across all breakpoints
 */
class ResponsiveErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      breakpoint: null,
      viewport: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Capture breakpoint and viewport information for debugging
    const breakpoint = getBreakpoint();
    const viewport = getViewportDimensions();
    
    console.error('Responsive component error:', {
      error,
      errorInfo,
      breakpoint,
      viewport,
      timestamp: new Date().toISOString(),
    });

    this.setState({ breakpoint, viewport });
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null,
      breakpoint: null,
      viewport: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 md:p-6 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 text-red-600 text-xl">⚠️</div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm md:text-base font-semibold text-red-800 mb-2">
                Content Display Error
              </h3>
              <p className="text-xs md:text-sm text-red-700 mb-4">
                We encountered an issue displaying this content. Please try again.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bg-red-100 rounded p-2 mb-4">
                  <p className="text-xs font-mono text-red-900 break-all">
                    {this.state.error.toString()}
                  </p>
                  {this.state.breakpoint && (
                    <p className="text-xs text-red-700 mt-2">
                      Breakpoint: {this.state.breakpoint} | 
                      Viewport: {this.state.viewport?.width}x{this.state.viewport?.height}
                    </p>
                  )}
                </div>
              )}
              
              <button
                onClick={this.handleRetry}
                className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors min-h-touch"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ResponsiveErrorBoundary;
