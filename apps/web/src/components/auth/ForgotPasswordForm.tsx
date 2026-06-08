import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import z from "zod";

import { forgotPasswordSchema } from "@/schemas/auth.schema";
import { AuthService } from "@/services/auth.service";
import { Button, FormInput } from "@/ui"; // 1. FIX: Added missing UI element imports

// 2. Infer the TypeScript types directly from your Zod schema
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  // 3. Bind the inferred type schema to your form state configuration
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "", // 4. FIX: Added default value to keep component inputs controlled
    },
  });

  // 5. Explicitly type the mutation execution scope
  const mutation = useMutation({
    mutationFn: (data: ForgotPasswordFormValues) => AuthService.forgotPassword(data),
    onSuccess: (response) => {
      console.log("Reset email sent successfully!", response);
      // Pro-tip: Trigger a toast notice telling the user to check their email inbox
    },
    onError: (error) => {
      console.error("Failed to process request:", error);
    },
  });

  return (
    // 6. FIX: Encapsulated the handleSubmit statement cleanly inside curly braces {}
    <form
      onSubmit={form.handleSubmit((data) => {
        mutation.mutate(data);
      })}
      className="space-y-4"
    >
      <FormInput
        control={form.control}
        name="email"
        label="Email"
        placeholder="Enter your registered email"
        type="email"
      />

      {/* 7. FIX: Explicitly set type="submit" so the form submits when clicked */}
      <Button type="submit" loading={mutation.isPending}>
        Send Reset Link
      </Button>
    </form>
  );
}
