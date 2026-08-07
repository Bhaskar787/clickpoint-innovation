"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-6">
      <div className="max-w-md text-center space-y-4">
        <h2 className="text-2xl font-bold">Something went wrong!</h2>
        <p className="text-sm text-slate-400">
          An unexpected error occurred. Please try again or return to homepage.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
