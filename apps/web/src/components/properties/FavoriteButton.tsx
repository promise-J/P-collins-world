import { Heart } from "lucide-react";

interface Props {
  favorite: boolean;
  onClick: () => void;
  size?: number;
}

export function FavoriteButton({ favorite, onClick, size = 24 }: Props) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
    >
      <Heart
        size={size}
        fill={favorite ? "var(--color-brand-primary)" : "transparent"}
        stroke={favorite ? "var(--color-brand-primary)" : "currentColor"}
        className={favorite ? "text-[var(--color-brand-primary)]" : "text-gray-400"}
      />
    </button>
  );
}