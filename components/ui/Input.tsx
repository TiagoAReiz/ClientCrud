import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function Input({ label, error, id, ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="text-xs font-bold tracking-widest uppercase text-on-surface/60 ml-1"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={`w-full bg-primary-fixed/30 border-0 border-b-2 focus:ring-0 px-4 py-4 text-sm text-on-surface placeholder:text-on-surface-variant/50 rounded-xl transition-colors duration-200 ${
          error
            ? 'border-error focus:border-error'
            : 'border-primary/20 focus:border-primary'
        }`}
        {...props}
      />
      {error && <p className="text-xs text-error ml-1">{error}</p>}
    </div>
  );
}
