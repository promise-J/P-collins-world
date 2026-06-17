import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import z from "zod";

import { AuthService } from "../../services/auth.service";
import { Button, FormInput } from "@/ui";
import { registerSchema } from "@/schemas/auth.schema";

// 1. Infer the TypeScript type details straight from your Zod verification engine
type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  // 2. Bind the inferred type schema to your React Hook Form setup
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  // 3. Explicitly type your API submission payload target
  const mutation = useMutation({
    mutationFn: (data: RegisterFormValues) => AuthService.register(data),
    onSuccess: (response) => {
      console.log("Registration successful!", response);
      // Pro-tip: You can use your useAuthStore here to log the user in immediately!
    },
    onError: (error) => {
      console.error("Registration failedee:", error);
    }
  });

  return (
    // 4. FIX: Encapsulated the handleSubmit statement cleanly inside curly braces {}
    <form
      onSubmit={form.handleSubmit((data) => {
        mutation.mutate(data);
      })}
      className="space-y-4" // Clean layout spacing
    >
      <FormInput
        control={form.control}
        name="firstName"
        label="First Name"
        placeholder="John"
      />

      <FormInput
        control={form.control}
        name="lastName"
        label="Last Name"
        placeholder="Doe"
      />

      <FormInput
        control={form.control}
        name="email"
        label="Email"
        placeholder="john.doe@example.com"
        type="email"
      />

      <FormInput
        control={form.control}
        name="password"
        label="Password"
        placeholder="••••••••"
        type="password"
      />

      <FormInput
        control={form.control}
        name="confirmPassword"
        label="Confirm Password"
        placeholder="••••••••"
        type="password"
      />

      {/* 5. Set type="submit" explicitly to allow form capture triggers */}
      <Button type="submit" loading={mutation.isPending}>
        Register
      </Button>
    </form>
  );
}
