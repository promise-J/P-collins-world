import admin from 'firebase-admin';
import { env } from './env';

// Initialize Firebase Admin

if (!admin.apps.length) {
    console.log(env.FIREBASE_SERVICE_ACCOUNT)
    const serviceAccount = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT ?? "");
  
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

export const firebaseAdmin = admin;