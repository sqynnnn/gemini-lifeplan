// services/firebase.ts (最终修复版本 - 使用 Vite/生产环境标准)

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";        
import { getFirestore } from "firebase/firestore"; 

// Type declarations for Vite's import.meta.env to satisfy TypeScript
interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly [key: string]: string | undefined;
}

declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

// ----------------------------------------------------
// ✅ 核心修复：使用 import.meta.env 配合 VITE_ 前缀
// ----------------------------------------------------
const firebaseConfig = {
  // 所有的变量名都改为 VITE_FIREBASE_...
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY, 
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig as any); 
export const auth = getAuth(app); 
export const db = getFirestore(app);