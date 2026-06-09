interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({ label, error, icon, ...props }: Props) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-[var(--color-brand-text)]">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          {...props}
          className={`
            w-full border rounded-lg p-3 transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent
            ${error ? "border-red-500" : "border-gray-300"}
            ${icon ? "pl-10" : "pl-3"}
          `}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}