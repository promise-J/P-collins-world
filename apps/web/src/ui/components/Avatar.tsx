import { useState } from 'react';

interface AvatarProps {
  src?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
}

export function Avatar({ src, name, size = "md" }: AvatarProps) {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  };

  // Check if src is valid (not empty and not just whitespace)
  const hasValidSrc = src && src.trim() !== '';

  // Show image if we have a valid src and no error
  if (hasValidSrc && !imgError) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={`
          ${sizeClasses[size]}
          rounded-full object-cover
        `}
        onError={() => setImgError(true)}
      />
    );
  }

  // Fallback: show initials
  const getInitials = () => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const initials = getInitials();

  return (
    <div
      className={`
        ${sizeClasses[size]}
        rounded-full bg-gradient-to-br from-[var(--color-brand-primary)] to-[var(--color-brand-primary-dark)]
        text-white flex items-center justify-center font-semibold
      `}
    >
      {initials}
    </div>
  );
}