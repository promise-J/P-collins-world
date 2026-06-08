import {
    Controller,
    Control
  } from "react-hook-form";
import { TextArea } from "../components/Textarea";
  
  
  interface Props {
    name: string;
    label: string;
    control: Control<any>;
  }
  
  export function FormTextArea({
    name,
    label,
    control
  }: Props) {
    return (
      <Controller
        name={name}
        control={control}
        render={({
          field,
          fieldState
        }) => (
          <TextArea
            {...field}
            label={label}
            error={fieldState.error?.message}
          />
        )}
      />
    );
  }