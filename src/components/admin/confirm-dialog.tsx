"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, AlertTriangle, RefreshCcw, Info, X } from "lucide-react";

export interface ConfirmOptions {
  title?: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info" | "default";
  icon?: "trash" | "alert" | "refresh" | "info";
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmDialogContext = createContext<ConfirmContextType | null>(null);

export function useConfirm(): ConfirmContextType {
  const context = useContext(ConfirmDialogContext);
  if (!context) {
    // Graceful fallback if invoked outside provider
    return {
      confirm: async (options: ConfirmOptions) => {
        if (typeof window !== "undefined") {
          return window.confirm(
            typeof options.message === "string"
              ? options.message
              : options.title || "Are you sure?"
          );
        }
        return false;
      },
    };
  }
  return context;
}

export function ConfirmDialogProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<{
    isOpen: boolean;
    options: ConfirmOptions;
    resolve: ((value: boolean) => void) | null;
  }>({
    isOpen: false,
    options: { message: "" },
    resolve: null,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      setState({
        isOpen: true,
        options,
        resolve,
      });
    });
  }, []);

  const handleClose = useCallback(
    (result: boolean) => {
      if (state.resolve) {
        state.resolve(result);
      }
      setState((prev) => ({ ...prev, isOpen: false, resolve: null }));
    },
    [state]
  );

  useEffect(() => {
    if (!state.isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.isOpen, handleClose]);

  const { options, isOpen } = state;
  const variant = options.variant || "danger";
  const title = options.title || (variant === "warning" ? "Confirm Action" : "Confirm Deletion");
  const confirmText = options.confirmText || (variant === "warning" ? "Confirm" : "Delete");
  const cancelText = options.cancelText || "Cancel";

  const renderIcon = () => {
    const iconType = options.icon || (variant === "warning" ? "alert" : "trash");
    switch (iconType) {
      case "trash":
        return <Trash2 className="w-5 h-5 text-rose-600 dark:text-rose-400" />;
      case "refresh":
        return <RefreshCcw className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case "alert":
      default:
        return <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
    }
  };

  const getIconWrapperClass = () => {
    switch (variant) {
      case "warning":
        return "bg-amber-100 dark:bg-amber-950/60 ring-8 ring-amber-50 dark:ring-amber-950/30";
      case "info":
        return "bg-blue-100 dark:bg-blue-950/60 ring-8 ring-blue-50 dark:ring-blue-950/30";
      case "danger":
      default:
        return "bg-rose-100 dark:bg-rose-950/60 ring-8 ring-rose-50 dark:ring-rose-950/30";
    }
  };

  const getTopBarClass = () => {
    switch (variant) {
      case "warning":
        return "bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500";
      case "info":
        return "bg-gradient-to-r from-blue-500 via-indigo-600 to-cyan-500";
      case "danger":
      default:
        return "bg-gradient-to-r from-rose-500 via-rose-600 to-red-600";
    }
  };

  const getConfirmButtonClass = () => {
    switch (variant) {
      case "warning":
        return "bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/25";
      case "info":
        return "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25";
      case "danger":
      default:
        return "bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/25";
    }
  };

  return (
    <ConfirmDialogContext.Provider value={{ confirm }}>
      {children}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <div
                className="fixed inset-0 z-[99999] flex items-center justify-center p-4 overflow-y-auto"
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-dialog-title"
              >
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => handleClose(false)}
                  className="fixed inset-0 bg-black/65 backdrop-blur-sm"
                />

                {/* Dialog Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 12 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="relative w-full max-w-md bg-white dark:bg-[#0f172a] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10"
                >
                  {/* Top Accent Strip */}
                  <div className={`h-1.5 w-full ${getTopBarClass()}`} />

                  {/* Close button */}
                  <button
                    onClick={() => handleClose(false)}
                    className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${getIconWrapperClass()}`}
                      >
                        {renderIcon()}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pr-4">
                        <h3
                          id="confirm-dialog-title"
                          className="text-base font-bold text-slate-900 dark:text-white"
                        >
                          {title}
                        </h3>
                        <div className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed break-words">
                          {options.message}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                      <button
                        type="button"
                        onClick={() => handleClose(false)}
                        className="px-4 py-2.5 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-200/60 dark:border-slate-700/60 transition-colors"
                      >
                        {cancelText}
                      </button>
                      <button
                        type="button"
                        autoFocus
                        onClick={() => handleClose(true)}
                        className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all ${getConfirmButtonClass()}`}
                      >
                        {confirmText}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </ConfirmDialogContext.Provider>
  );
}
