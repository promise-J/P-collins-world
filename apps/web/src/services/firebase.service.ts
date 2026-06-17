import { auth, googleProvider, signInWithPopup, signOut } from '@/config/firebase.config';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';

export class FirebaseService {
  static async signInWithGoogle(data?: {
    role?: string;
    businessName?: string;
    firebaseId?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    idToken?: string;
  }) {
    try {
      if (data?.role && data?.firebaseId) {
        const response = await api.post('/auth/google', {
          firebaseId: data.firebaseId,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          avatar: data.avatar,
          idToken: data.idToken,
          role: data.role,
          businessName: data.businessName,
        });
        return response.data;
      }

      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const idToken = await user.getIdToken();
      
      const response = await api.post('/auth/google', {
        firebaseId: user.uid,
        email: user.email,
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ')[1] || '',
        avatar: user.photoURL || '',
        idToken: idToken,
        role: data?.role || 'USER',
      });
      
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Something went wrong'
      toast.error(errorMessage)
    }
  }
  
  static async logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Firebase logout error:', error);
    }
  }
}