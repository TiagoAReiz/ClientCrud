import { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'tonal';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  isLoading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-primary text-on-primary hover:opacity-90 active:scale-[0.98] shadow-[0px_8px_24px_rgba(0,61,155,0.2)] disabled:opacity-50',
  tonal:
    'bg-primary-fixed text-primary hover:bg-primary-fixed-dim active:scale-[0.98] disabled:opacity-50',
  secondary:
    'bg-surface-container-low text-on-surface-variant hover:bg-surface-container active:scale-[0.98] disabled:opacity-40',
  danger:
    'bg-error text-on-error hover:opacity-90 active:scale-[0.98] shadow-lg shadow-error/20 disabled:opacity-50',
  ghost: 'text-primary hover:bg-primary-fixed active:scale-95',
};

export default function Button({
  variant = 'primary',
  isLoading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-bold transition-all focus:outline-none disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
