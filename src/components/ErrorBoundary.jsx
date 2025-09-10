import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <h1 className="text-2xl font-bold text-red-600">Something went wrong.</h1>
          <p className="text-gray-600 mt-2">
            Please refresh the page or go back to the Home page.
          </p>
          <a
            href="/"
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Go Home
          </a>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
