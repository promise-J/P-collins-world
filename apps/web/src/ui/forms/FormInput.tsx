import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Input } from "../components/Input";

interface Props<T extends FieldValues> {
  name: Path<T>;
  label: string;
  control: Control<T>;
  placeholder?: string;
  type?: string;
  icon?: React.ReactNode;
  error?: string;
}

export function FormInput<T extends FieldValues>({
  name,
  label,
  control,
  placeholder,
  type = "text",
  icon,
  error: externalError,
}: Props<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Input
          {...field}
          value={field.value ?? ""}
          type={type}
          label={label}
          placeholder={placeholder}
          icon={icon}
          error={externalError || fieldState.error?.message}
        />
      )}
    />
  );
}