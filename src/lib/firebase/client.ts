import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// 디버깅: 환경 변수 로드 상태 확인
console.log("🔥 Firebase Config Debug:", {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "✅ Loaded" : "❌ Missing",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "❌ Using fallback",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "❌ Using fallback",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "❌ Using fallback",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "❌ Using fallback",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? "✅ Loaded" : "❌ Missing",
});

console.log("🔥 Final Firebase Config:", firebaseConfig);

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
