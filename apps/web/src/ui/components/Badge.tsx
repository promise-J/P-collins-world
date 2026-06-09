type BadgeVariant = "success" | "warning" | "danger" | "default" | "primary" | "secondary";

interface Props {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

export function Badge({ children, variant = "default" }: Props) {
  const variants = {
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    danger: "bg-red-100 text-red-700",
    default: "bg-gray-100 text-gray-700",
    primary: "bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]",
    secondary: "bg-[var(--color-brand-secondary)]/10 text-[var(--color-brand-secondary)]",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}