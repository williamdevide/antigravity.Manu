import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBl-H37rOhQ__abuKkIgKg6LSmaSn7_qwU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "antigravitymanu-44a47.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "antigravitymanu-44a47",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "antigravitymanu-44a47.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "207324288929",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:207324288929:web:1899896d12b7a13fa85de0"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Ativa persistência offline quando suportado pelo navegador
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      // Múltiplas abas abertas simultaneamente
      console.warn('[Firebase] Persistência offline habilitada apenas na primeira aba');
    } else if (err.code === 'unimplemented') {
      console.warn('[Firebase] Navegador não suporta IndexedDb persistence');
    }
  });
}

export default app;
