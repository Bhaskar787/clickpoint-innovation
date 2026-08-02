"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User, Key, Eye, EyeOff, Lock, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const MAX_ATTEMPTS = 4;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes lock

export default function AdminPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState<number>(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);

  // Load existing attempt & lockout state from localStorage on mount
  useEffect(() => {
    const savedAttempts = parseInt(localStorage.getItem("login_attempts") || "0", 10);
    const savedLockout = parseInt(localStorage.getItem("login_locked_until") || "0", 10);

    if (savedLockout > Date.now()) {
      setLockedUntil(savedLockout);
      setAttempts(MAX_ATTEMPTS);
    } else {
      setAttempts(savedAttempts);
      localStorage.removeItem("login_locked_until");
    }
  }, []);

  // Timer loop for active lockout countdown
  useEffect(() => {
    if (!lockedUntil) {
      setRemainingSeconds(0);
      return;
    }

    const updateTimer = () => {
      const diff = Math.max(0, Math.ceil((lockedUntil - Date.now()) / 1000));
      setRemainingSeconds(diff);

      if (diff <= 0) {
        setLockedUntil(null);
        setAttempts(0);
        localStorage.removeItem("login_attempts");
        localStorage.removeItem("login_locked_until");
        setError(null);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [lockedUntil]);

  const formatRemainingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (lockedUntil && lockedUntil > Date.now()) {
      const lockMsg = `Account temporarily locked due to 4 failed attempts. Try again in ${formatRemainingTime(remainingSeconds)}.`;
      setError(lockMsg);
      toast.warning("Account Locked Out", { description: lockMsg });
      return;
    }

    setLoading(true);

    try {
      const { data, error: signInError } = await authClient.signIn.email({
        email,
        password,
      });

      if (signInError) {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        localStorage.setItem("login_attempts", newAttempts.toString());

        let errorMsg = "";
        if (newAttempts >= MAX_ATTEMPTS) {
          const lockTime = Date.now() + LOCKOUT_DURATION_MS;
          setLockedUntil(lockTime);
          localStorage.setItem("login_locked_until", lockTime.toString());
          errorMsg = `Too many failed login attempts (4/4). Form locked out for 15 minutes.`;
          toast.error("Security Lockout", { description: errorMsg });
        } else {
          errorMsg = `${signInError.message || "Invalid email or password"}. Attempt ${newAttempts} of ${MAX_ATTEMPTS} (${MAX_ATTEMPTS - newAttempts} attempt${MAX_ATTEMPTS - newAttempts === 1 ? "" : "s"} remaining).`;
          toast.error("Login Failed", { description: errorMsg });
        }
        setError(errorMsg);
        return;
      }

      // Successful login reset attempt counters
      localStorage.removeItem("login_attempts");
      localStorage.removeItem("login_locked_until");

      // Extract & Store Admin Session Token in Database + LocalStorage
      const token = (data as any)?.token || (data as any)?.session?.token;
      if (token) {
        localStorage.setItem("admin_token", token);
      } else {
        const activeSession = await authClient.getSession();
        if (activeSession?.data?.session?.token) {
          localStorage.setItem("admin_token", activeSession.data.session.token);
        }
      }

      // Store Admin User in LocalStorage
      if (data?.user) {
        localStorage.setItem("admin_user", JSON.stringify(data.user));
      }

      // Single Sonner Toast for Login Success
      toast.success("Login Successful!", {
        description: "Welcome back! Redirecting to admin dashboard...",
      });

      setTimeout(() => {
        router.push("/admin/dashboard");
        router.refresh();
      }, 1000);
    } catch {
      const netError = "Network error. Please check your connection and try again.";
      setError(netError);
      toast.error("Network Error", { description: netError });
    } finally {
      setLoading(false);
    }
  }

  const isLocked = Boolean(lockedUntil && lockedUntil > Date.now());

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f9fa] dark:bg-[#0b0f19] px-4 py-12 transition-colors">
      <div className="w-full max-w-[440px] flex flex-col items-center">
        
        {/* Clickpoint Logo Header */}
        <div className="mb-6 flex items-center justify-center">
          <Image
            src="/images/clickpointfinal.png"
            alt="Clickpoint Innovation"
            width={1236}
            height={317}
            priority
            className="h-11 w-auto drop-shadow-sm hover:scale-105 transition-transform"
          />
        </div>

        {/* Form Card */}
        <div className="w-full rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131927] p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
          
          {/* Header Title */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Log In
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Get access to admin account
            </p>
          </div>

          {/* Lockout Warning Banner */}
          {isLocked && (
            <div className="mb-5 p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
              <Lock className="h-4 w-4 shrink-0" />
              <span>Too many failed attempts (4/4). Lockout active for {formatRemainingTime(remainingSeconds)}.</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                EMAIL ADDRESS
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400">
                  <User className="h-4 w-4" />
                </span>
                <input
                  id="email"
                  type="email"
                  autoComplete="username"
                  required
                  disabled={isLocked}
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] pl-10 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                PASSWORD
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400">
                  <Key className="h-4 w-4" />
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  disabled={isLocked}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f19] pl-10 pr-10 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-700 dark:bg-[#0b0f19]"
                />
                <span className="text-xs font-medium">Remember me</span>
              </label>
            </div>

            {/* In-form Error Message fallback */}
            {error && !isLocked && (
              <p role="alert" className="text-xs text-red-600 dark:text-red-400 font-medium">
                {error}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || isLocked}
              className="mt-2 w-full rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold text-sm py-3 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                  <span>Logging in...</span>
                </>
              ) : isLocked ? (
                `Locked (${formatRemainingTime(remainingSeconds)})`
              ) : (
                "Log In"
              )}
            </button>
          </form>

        </div>

      </div>
    </main>
  );
}
