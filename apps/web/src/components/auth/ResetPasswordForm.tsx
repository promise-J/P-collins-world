import { resetPasswordSchema } from "@/schemas/auth.schema";
import { Button, FormInput } from "@/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export function ResetPasswordForm() {
  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  return (
    <form>
      <FormInput
        control={form.control}
        name="password"
        label="Password"
        type="password"
      />

      <FormInput
        control={form.control}
        name="confirmPassword"
        label="Confirm Password"
        type="password"
      />

      <Button>Reset Password</Button>
    </form>
  );
}
