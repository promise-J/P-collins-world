import { useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/ui/components/Button";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { UserRole } from "@/enum/role.enum";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/config/firebase.config";

interface GoogleSignInButtonProps {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  className?: string;
  preselectedRole?: UserRole;
}

export function GoogleSignInButton({ 
  variant = "ghost", 
  className = "",
  preselectedRole = UserRole.USER
}: GoogleSignInButtonProps) {
  const { googleLogin } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Get the ID token
      const idToken = await user.getIdToken();
      
      // Send the data with the preselected role
      const response = await googleLogin({
        firebaseId: user.uid,
        email: user.email,
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ')[1] || '',
        avatar: user.photoURL || '',
        idToken: idToken,
        role: preselectedRole, // Use the preselected role from the page
      });

      if (response.success) {
        toast.success('Google login successful!');
        window.location.replace('/dashboard')
      } else if (response.requiresRoleSelection) {
        navigate('/role-selection?mode=login');
      }
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Button
      type="button"
      variant={'ghost'}
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className={`w-full flex items-center justify-center gap-2 ${className}`}
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="currentColor"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="currentColor"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="currentColor"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      {isLoading ? "Signing in..." : "Continue with Google"}
    </Button>
  );
}