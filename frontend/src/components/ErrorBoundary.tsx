// src/components/ErrorBoundary.tsx
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

type State = { hasError: boolean; error?: Error };

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    console.error("Uncaught error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white p-10 rounded-2xl shadow-2xl text-center max-w-md w-full">
            <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
            <p className="text-lg text-gray-700">
              Please refresh the page or contact support.
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
