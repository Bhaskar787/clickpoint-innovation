"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Boundary caught:", error);
  }, [error]);

  return (
    <html>
      <body className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-6 font-sans">
        <div className="max-w-md text-center space-y-4">
          <h2 className="text-2xl font-bold">Application Error</h2>
          <p className="text-sm text-slate-400">
            A critical application error occurred.
          </p>
          <button
            onClick={() => reset()}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
