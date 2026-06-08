import { ReactNode, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const variants = {
    primary: 'bg-primary text-[#0b1120] hover:brightness-110 focus:ring-primary/50 shadow-[0_0_15px_rgba(0,245,255,0.15)] font-semibold',
    secondary: 'bg-secondary text-white hover:brightness-110 focus:ring-secondary/50',
    outline: 'bg-transparent border border-white/10 text-text-primary hover:bg-white/5 focus:ring-primary/30',
    ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-white/5 focus:ring-primary/20',
    danger: 'bg-danger text-white hover:brightness-110 focus:ring-danger/50',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-custom-sm',
    md: 'px-4 py-2 text-sm rounded-custom-md',
    lg: 'px-6 py-3 text-base rounded-custom-lg',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
}

