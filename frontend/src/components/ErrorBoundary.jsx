import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-center p-6">
          <div className="space-y-6">
            <h1 className="text-4xl font-black text-primary tracking-tighter uppercase italic">System Failure</h1>
            <p className="text-text-muted max-w-md mx-auto">
              A strategic error has occurred in the ShuttleElite network. Our assets are working to resolve the issue.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-primary text-black font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-transform"
            >
              Re-initialize Session
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
