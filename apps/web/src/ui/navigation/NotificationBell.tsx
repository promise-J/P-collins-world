import { Bell } from "lucide-react";

interface Props {
  count?: number;
}

export function NotificationBell({
  count = 0
}: Props) {
  return (
    <div className="relative">
      <Bell size={20} />

      {count > 0 && (
        <span
          className="
          absolute
          -right-2
          -top-2
          flex
          h-5
          w-5
          items-center
          justify-center
          rounded-full
          bg-red-500
          text-xs
          text-white
        "
        >
          {count}
        </span>
      )}
    </div>
  );
}