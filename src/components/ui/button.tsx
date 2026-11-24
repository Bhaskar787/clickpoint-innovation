import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-[14px] font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-violet-600 text-white hover:bg-violet-700 shadow-sm dark:bg-violet-600 dark:text-white dark:hover:bg-violet-500",
        primary:
          "bg-violet-600 text-white hover:bg-violet-700 shadow-sm dark:bg-violet-600 dark:text-white dark:hover:bg-violet-500",
        ember:
          "bg-[#f58220] text-white hover:bg-[#e07318] shadow-sm dark:bg-[#f58220] dark:text-white dark:hover:bg-[#e07318]",
        outline:
          "border border-slate-300 dark:border-white/[0.18] text-slate-800 dark:text-slate-200 bg-transparent hover:bg-slate-100/80 dark:hover:bg-white/[0.06] hover:text-slate-900 dark:hover:text-white",
        ghost:
          "text-slate-800 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-white/[0.06] hover:text-slate-900 dark:hover:text-white",
      },
      size: {
        default: "h-11 px-5 text-[14px]",
        sm: "h-10 px-4 text-[14px]",
        lg: "h-[46px] px-6 text-[15px]",
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
