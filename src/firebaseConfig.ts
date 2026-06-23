import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDaJMuAiRsw9Hf1EYSBNxrRPZLLFKyg438",
  authDomain: "fir-auth-app-38719.firebaseapp.com",
  projectId: "fir-auth-app-38719",
  storageBucket: "fir-auth-app-38719.firebasestorage.app",
  messagingSenderId: "802619354968",
  appId: "1:802619354968:web:20ad9de16296eed41e7f2d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
