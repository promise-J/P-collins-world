import { FormInput } from "@/ui";
import { useForm } from "react-hook-form";

interface LoginFormInputs {
  email: string;
}

export function LoginForm() {
  // 1. Initialize React Hook Form
  const { control, handleSubmit } = useForm<LoginFormInputs>({
    defaultValues: { email: "" }
  });

  const onSubmit = (data: LoginFormInputs) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* 2. 🟢 FIX: Pass 'name' and 'control'. Remove manual value/onChange. */}
      <FormInput
        name="email"
        label="Email Address"
        type="email"
        control={control}
        placeholder="you@example.com"
      />
      <button type="submit">Submit</button>
    </form>
  );
}
