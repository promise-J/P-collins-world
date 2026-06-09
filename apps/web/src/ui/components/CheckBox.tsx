interface Props {
    checked: boolean;
    label: string;
    onChange: (
      e: React.ChangeEvent<HTMLInputElement>
    ) => void;
  }
  
  export function Checkbox({
    checked,
    label,
    onChange
  }: Props) {
    return (
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
        />
  
        {label}
      </label>
    );
  }