"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 로딩이 완료되고 관리자가 아닌 경우 홈으로 리다이렉트
    if (!loading && (!user || !isAdmin)) {
      router.push("/");
    }
  }, [user, loading, isAdmin, router]);

  // 로딩 중일 때 로딩 스피너 표시
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--foreground-muted)]">인증 확인 중...</p>
        </div>
      </div>
    );
  }

  // 사용자가 로그인되지 않았거나 관리자가 아닌 경우 아무것도 렌더링하지 않음 (리다이렉트 중)
  if (!user || !isAdmin) {
    return null;
  }

  // 로그인된 관리자에게만 admin 콘텐츠 표시
  return <>{children}</>;
}
