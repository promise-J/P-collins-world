import clsx from "clsx";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading,
  className,
  onClick,
  type = "button",
  ...props
}: Props) {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || props.disabled}
      className={clsx(
        "rounded-lg font-medium transition-all duration-200 cursor-pointer",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        sizeClasses[size],
        {
          "bg-[var(--color-brand-primary)] text-white hover:bg-[var(--color-brand-primary-dark)] focus:ring-[var(--color-brand-primary)]": variant === "primary",
          "bg-[var(--color-brand-secondary)] text-[var(--color-brand-text)] hover:bg-[var(--color-brand-secondary-dark)] focus:ring-[var(--color-brand-secondary)]": variant === "secondary",
          "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500": variant === "danger",
          "border-2 border-[var(--color-brand-primary)] text-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary)] hover:text-white": variant === "ghost",
          "opacity-50 cursor-not-allowed": loading || props.disabled,
        },
        className
      )}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}