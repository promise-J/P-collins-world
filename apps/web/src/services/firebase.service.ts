import { auth, googleProvider, signInWithPopup, signOut } from '@/config/firebase.config';
import { api } from '@/lib/axios';

export class FirebaseService {
  static async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Get Firebase ID token
      const idToken = await user.getIdToken();
      
      // Send token to your backend to authenticate/create user
      const response = await api.post('/auth/google', {
        firebaseId: user.uid,
        email: user.email,
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ')[1] || '',
        avatar: user.photoURL,
        idToken: idToken,
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      throw new Error(error.message || 'Google sign in failed');
    }
  }
  
  static async logout() {
    await signOut(auth);
  }
}