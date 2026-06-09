import {
    Controller,
    Control
  } from "react-hook-form";
import { Checkbox } from "../components/CheckBox";
  
  
  interface Props {
    name: string;
    label: string;
    control: Control<any>;
  }
  
  export function FormCheckbox({
    name,
    label,
    control
  }: Props) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Checkbox
            label={label}
            checked={field.value}
            onChange={(e) =>
              field.onChange(
                e.target.checked
              )
            }
          />
        )}
      />
    );
  }