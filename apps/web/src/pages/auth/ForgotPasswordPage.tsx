import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { AuthCard } from '@/components/auth/AuthCard';
import { Button } from '@/ui/components/Button';
import { FormInput } from '@/ui/forms/FormInput';
import { Spinner } from '@/ui/feedback/Spinner';
import { Mail, CheckCircle, ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { forgotPassword, isLoading, error, clearError } = useAuthStore();
  const [isSent, setIsSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    clearError();
    const result = await forgotPassword(data.email);
    
    if (result.success) {
      setIsSent(true);
      setSubmittedEmail(data.email);
      toast.success(result.message || 'Password reset link sent to your email');
    } else {
      toast.error(result.message || error || 'Failed to send reset email');
    }
  };

  if (isSent) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <AuthCard
          title="Check Your Email"
          subtitle="We've sent you a password reset link"
        >
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--color-brand-text)]">Email Sent!</h3>
            <p className="text-gray-600">
              We sent a password reset link to <strong className="text-[var(--color-brand-primary)]">{submittedEmail}</strong>
            </p>
            <div className="bg-blue-50 rounded-lg p-4 text-left">
              <p className="text-sm text-blue-700">📧 What to do next:</p>
              <ol className="text-sm text-blue-600 ml-4 list-decimal mt-1">
                <li>Open your email inbox</li>
                <li>Click the password reset link in the email</li>
                <li>Create a new password</li>
              </ol>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsSent(false);
                  onSubmit({ email: submittedEmail });
                }}
                className="text-sm text-[var(--color-brand-primary)] hover:underline"
              >
                Didn't receive the email? Click here to resend
              </button>
              <Link to="/login" className="text-sm text-gray-500 hover:text-[var(--color-brand-primary)]">
                <ArrowLeft size={16} className="inline mr-1" />
                Back to Sign In
              </Link>
            </div>
          </div>
        </AuthCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <AuthCard
        title="Forgot Password?"
        subtitle="Enter your email to reset your password"
        footer={
          <Link to="/login" className="text-sm text-[var(--color-brand-primary)] hover:underline">
            <ArrowLeft size={16} className="inline mr-1" />
            Back to Sign In
          </Link>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="text-left">
            <p className="text-sm text-gray-500 mb-4">
              We'll send you a link to reset your password. Please check your email.
            </p>
          </div>

          <FormInput
            control={control}
            name="email"
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            icon={<Mail size={18} />}
            error={errors.email?.message}
          />

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 text-center">{error}</p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Spinner size="sm" className="mx-auto" /> : 'Send Reset Link'}
          </Button>

          <p className="text-xs text-gray-400 text-center">
            The link will expire in 1 hour for security reasons.
          </p>
        </form>
      </AuthCard>
    </div>
  );
}