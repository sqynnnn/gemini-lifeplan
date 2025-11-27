// services/firebase.ts (修复读取问题版本)

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";        
import { getFirestore } from "firebase/firestore"; 

// 🎯 核心修改：确保密钥存在，否则使用一个假密钥
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "TEMPORARY_DUMMY_KEY"; 

// services/firebase.ts (恢复到最终版本)

// 找到这部分代码，并替换为以下内容：
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY, // ⬅️ 恢复为读取环境变量
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
// ...

// 检查配置是否加载成功（在 Console 中会显示）
console.log("Firebase API Key Loaded:", API_KEY.substring(0, 5) + '...');

const app = initializeApp(firebaseConfig as any); 
export const auth = getAuth(app); 
export const db = getFirestore(app);