interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  label: string;
  options: Option[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
}

export function Select({ label, options, value, onChange, error }: SelectProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-[var(--color-brand-text)]">
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        className={`
          w-full border rounded-lg p-3 transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent
          ${error ? "border-red-500" : "border-gray-300"}
        `}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}