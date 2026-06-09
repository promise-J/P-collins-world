import {
    Controller,
    Control
  } from "react-hook-form";
  
  import { Select } from "../components/Select";
  
  interface Option {
    label: string;
    value: string;
  }
  
  interface Props {
    name: string;
    label: string;
    options: Option[];
    control: Control<any>;
  }
  
  export function FormSelect({
    name,
    label,
    options,
    control
  }: Props) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            label={label}
            options={options}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
    );
  }