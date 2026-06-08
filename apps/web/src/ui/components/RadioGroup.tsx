interface RadioOption {
    label: string;
    value: string;
  }
  
  interface Props {
    options: RadioOption[];
    value: string;
    onChange: (value: string) => void;
  }
  
  export function RadioGroup({
    options,
    value,
    onChange
  }: Props) {
    return (
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex gap-2"
          >
            <input
              type="radio"
              checked={
                value === option.value
              }
              onChange={() =>
                onChange(option.value)
              }
            />
  
            {option.label}
          </label>
        ))}
      </div>
    );
  }