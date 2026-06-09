interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function PropertySearch({ value, onChange }: Props) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search location, city, title..."
      className="w-full rounded-xl border p-4"/>
  );
}
