"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

// 허용된 관리자 이메일 목록 가져오기
const getAdminEmails = (): string[] => {
  const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS;
  return adminEmails ? adminEmails.split(",").map((email) => email.trim()) : [];
};

// 관리자 권한 체크 함수
const checkIsAdmin = (userEmail: string | null): boolean => {
  if (!userEmail) return false;
  const adminEmails = getAdminEmails();
  return adminEmails.includes(userEmail);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsAdmin(checkIsAdmin(user?.email || null));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();

    try {
      // 모든 환경에서 팝업 방식 사용 (Next.js 서버에서 안정적)
      const result = await signInWithPopup(auth, provider);
      const userEmail = result.user.email;

      // 관리자 권한 체크
      if (!checkIsAdmin(userEmail)) {
        await firebaseSignOut(auth);
        alert("관리자 권한이 없습니다. 시스템 관리자에게 문의하세요.");
        router.push("/");
        return;
      }

      // 관리자인 경우 admin 페이지로 이동
      router.push("/admin/restaurants");
    } catch (error) {
      console.error("Error signing in with Google", error);
      alert("로그인 중 오류가 발생했습니다.");
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      // 로그아웃 후 메인 페이지로 이동
      router.push("/");
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, isAdmin, signInWithGoogle, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
