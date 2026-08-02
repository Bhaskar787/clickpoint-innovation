import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-violet-600 text-white hover:bg-violet-700 shadow-lg shadow-violet-600/20 dark:bg-violet-600 dark:text-white dark:hover:bg-violet-500 dark:shadow-violet-600/30",
        primary:
          "bg-gradient-to-r from-violet-600 to-violet-500 text-white hover:from-violet-700 hover:to-violet-600 shadow-lg shadow-violet-500/25 dark:from-violet-600 dark:to-violet-500 dark:text-white",
        ember:
          "bg-[#f58220] text-white hover:bg-[#e07318] shadow-lg shadow-amber-500/25 dark:bg-[#f58220] dark:text-white dark:hover:bg-[#e07318]",
        outline:
          "border border-slate-300 text-slate-800 bg-transparent hover:bg-violet-50 hover:text-violet-700 hover:border-violet-300 dark:border-slate-700 dark:text-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 dark:hover:text-white dark:hover:border-slate-600",
        ghost:
          "text-slate-800 hover:bg-violet-50 hover:text-violet-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4 text-xs",
        lg: "h-14 px-8 text-base",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
