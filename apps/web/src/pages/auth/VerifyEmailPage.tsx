import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { AuthCard } from '@/components/auth/AuthCard';
import { Button } from '@/ui/components/Button';
import { Spinner } from '@/ui/feedback/Spinner';
import { CheckCircle, XCircle, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export default function VerifyEmailPage() {
  const { token } = useParams<{ token: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyEmail, resendVerification, isLoading } = useAuthStore();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [resendLoading, setResendLoading] = useState(false);
  
  const email = (location.state as any)?.email || '';
  
  // Create a unique key for this token verification
  const storageKey = `verified_${token}`;
  const hasVerified = sessionStorage.getItem(storageKey) === 'true';

  useEffect(() => {
    // Only verify if not already verified in this session
    if (token && !hasVerified) {
      // Mark as verified immediately to prevent multiple calls
      sessionStorage.setItem(storageKey, 'true');
      handleVerification();
    } else if (hasVerified) {
      // Already verified, show success and redirect
      setStatus('success');
      // Auto redirect after 2 seconds
      setTimeout(() => {
        navigate('/login');
        sessionStorage.removeItem(storageKey);
      }, 2000);
    }
  }, [token]);

  const handleVerification = async () => {
    if (!token) {
      setStatus('error');
      return;
    }
    
    try {
      const success = await verifyEmail(token);
      setStatus(success ? 'success' : 'error');
      if (success) {
        toast.success('Email verified successfully! You can now log in.');
        // Auto redirect after 2 seconds
        setTimeout(() => {
          navigate('/login');
          sessionStorage.removeItem(storageKey);
        }, 2000);
      } else {
        toast.error('Verification failed. Please try again.');
        // Clear on failure so they can retry
        sessionStorage.removeItem(storageKey);
      }
    } catch (error) {
      setStatus('error');
      toast.error('Verification failed. Please try again.');
      sessionStorage.removeItem(storageKey);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error('Email address not found');
      return;
    }
    setResendLoading(true);
    try {
      const result = await resendVerification(email);
      if (result.success) {
        toast.success('Verification email resent! Please check your inbox.');
      } else {
        toast.error(result.message || 'Failed to resend verification email');
      }
    } catch (error) {
      toast.error('Failed to resend verification email');
    } finally {
      setResendLoading(false);
    }
  };

  // Handle manual redirect when user clicks the button
  const handleRedirectToLogin = () => {
    navigate('/login');
    sessionStorage.removeItem(storageKey);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Verifying your email...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <AuthCard
        title={status === 'success' ? 'Email Verified!' : 'Verification Failed'}
        subtitle={status === 'success' ? 'Your email has been successfully verified' : 'Unable to verify your email'}
      >
        <div className="text-center space-y-4">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${
            status === 'success' ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {status === 'success' ? (
              <CheckCircle size={48} className="text-green-600" />
            ) : (
              <XCircle size={48} className="text-red-600" />
            )}
          </div>

          {status === 'success' ? (
            <>
              <p className="text-gray-600">
                Thank you for verifying your email address. You can now sign in to your account.
              </p>
              <Button onClick={handleRedirectToLogin} className="w-full">
                Sign In Now
              </Button>
            </>
          ) : (
            <>
              <p className="text-gray-600">
                The verification link may have expired or is invalid.
              </p>
              <p className="text-sm text-gray-500">
                Please request a new verification link.
              </p>
              {email && (
                <Button
                  onClick={handleResend}
                  disabled={resendLoading}
                  variant="secondary"
                  className="w-full"
                >
                  {resendLoading ? <Spinner size="sm" /> : (
                    <>
                      <Mail size={18} className="mr-2" />
                      Resend Verification Email
                    </>
                  )}
                </Button>
              )}
              <button
                onClick={handleRedirectToLogin}
                className="text-sm text-[var(--color-brand-primary)] hover:underline"
              >
                Back to Sign In
              </button>
            </>
          )}
        </div>
      </AuthCard>
    </div>
  );
}