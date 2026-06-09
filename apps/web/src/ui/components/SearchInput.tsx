import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

export function SearchInput({
  value,
  onChange
}: Props) {
  return (
    <div className="relative">
      <Search
        size={18}
        className="
          absolute
          left-3
          top-3
        "
      />

      <input
        value={value}
        onChange={onChange}
        placeholder="Search..."
        className="
          w-full
          border
          rounded-lg
          pl-10
          p-3
        "
      />
    </div>
  );
}