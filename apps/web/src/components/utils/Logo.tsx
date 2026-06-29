import { Link } from "react-router-dom";

interface LogoProps {
  variant?: "full" | "icon" | "premium";
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  className?: string;
}

export function Logo({ 
  variant = "full", 
  size = "md", 
  showTagline = true,
  className = ""
}: LogoProps) {
  const sizeClasses = {
    sm: {
      container: "h-8",
      icon: "w-8 h-8",
      text: "text-lg",
      tagline: "text-[8px]",
    },
    md: {
      container: "h-10",
      icon: "w-10 h-10",
      text: "text-2xl",
      tagline: "text-[10px]",
    },
    lg: {
      container: "h-14",
      icon: "w-14 h-14",
      text: "text-3xl",
      tagline: "text-xs",
    },
  };

  const s = sizeClasses[size];

  if (variant === "icon") {
    return (
      <Link to="/" className={`inline-flex items-center ${className}`}>
        <div className={`${s.icon} rounded-xl bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-primary-dark)] flex items-center justify-center shadow-md`}>
          <span className="text-white font-bold text-xl">P</span>
        </div>
      </Link>
    );
  }

  if (variant === "premium") {
    return (
      <Link to="/" className={`inline-flex items-center gap-3 ${className}`}>
        <div className={`${s.icon} rounded-full bg-gradient-to-br from-[var(--color-brand-primary)] via-[var(--color-brand-secondary)] to-[var(--color-brand-text)] flex items-center justify-center shadow-lg relative`}>
          <span className="text-white font-serif font-bold text-2xl">P</span>
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[var(--color-brand-secondary)]"></span>
          <span className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-[var(--color-brand-secondary)]"></span>
        </div>
        <div className="flex flex-col">
          <span className={`font-serif font-bold text-[var(--color-brand-text)] ${s.text}`}>
            P Collins
          </span>
          {showTagline && (
            <span className={`text-[var(--color-brand-primary)] tracking-widest font-semibold ${s.tagline}`}>
              MARKETPLACE · SAVINGS · REAL ESTATE
            </span>
          )}
        </div>
      </Link>
    );
  }

  // Default full variant
  return (
    <Link to="/" className={`inline-flex items-center gap-2 ${className}`}>
      <div className={`${s.icon} rounded-xl bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-primary-dark)] flex items-center justify-center shadow-md`}>
        <span className="text-white font-bold text-xl">P</span>
      </div>
      <div className="flex flex-col">
        <span className={`font-bold text-[var(--color-brand-text)] ${s.text}`}>
          P Collins
        </span>
        {showTagline && (
          <span className={`text-[var(--color-brand-primary)] tracking-widest font-medium ${s.tagline}`}>
            MARKETPLACE · SAVINGS · REAL ESTATE
          </span>
        )}
      </div>
    </Link>
  );
}