interface AvatarProps {
  src?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
}

export function Avatar({ src, name, size = "md" }: AvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`
          ${sizeClasses[size]}
          rounded-full object-cover
        `}
      />
    );
  }

  const initials =
    name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2) || "?";

  return (
    <div
      className={`
        ${sizeClasses[size]}
        rounded-full bg-[var(--color-brand-primary)]
        text-white flex items-center justify-center font-medium
      `}
    >
      {initials}
    </div>
  );
}