interface Props {
  value: string;

  onChange: (value: string) => void;
}

export function ProductSearch({
  value,

  onChange,
}: Props) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search products"
      className="
     w-full
     rounded-xl
     border
     p-4
    "
    />
  );
}
