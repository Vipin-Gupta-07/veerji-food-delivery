'use client';
import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-4 pt-20">
      <div className="text-6xl mb-5">😵</div>
      <h1 className="font-display text-3xl font-extrabold text-brand-dark mb-3">Something went wrong</h1>
      <p className="text-gray-500 mb-2 max-w-md">
        An unexpected error occurred. Our team has been notified.
      </p>
      {process.env.NODE_ENV === 'development' && (
        <code className="text-xs text-red-500 bg-red-50 px-4 py-2 rounded-lg mb-6 max-w-lg block text-left">
          {error.message}
        </code>
      )}
      <div className="flex gap-4 mt-4">
        <button onClick={reset} className="btn-primary">
          Try Again
        </button>
        <button onClick={() => (window.location.href = '/')} className="btn-outline">
          Go Home
        </button>
      </div>
    </div>
  );
}
