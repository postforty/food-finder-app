"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const { user, loading, isAdmin, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // 이미 로그인된 관리자인 경우 대시보드로 리다이렉트
  if (!loading && user && isAdmin) {
    router.push("/admin/dashboard");
    return null;
  }

  // 로그인은 되어있지만 관리자가 아닌 경우 홈으로 리다이렉트
  if (!loading && user && !isAdmin) {
    router.push("/");
    return null;
  }

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await signInWithGoogle();
      // signInWithGoogle에서 권한 체크와 리다이렉트를 처리함
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--foreground-muted)]">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--surface)] via-[var(--background)] to-[var(--surface)] px-4">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--primary)] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
        <div
          className="absolute bottom-20 right-10 w-72 h-72 bg-[var(--accent)] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo & Title */}
        <div className="text-center mb-8 animate-fadeIn">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center shadow-xl">
              <span className="text-4xl">🍽️</span>
            </div>
          </Link>
          <h1 className="text-4xl font-bold mb-2">
            <span
              className="gradient-text"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Admin Login
            </span>
          </h1>
          <p className="text-[var(--foreground-muted)] text-lg">
            관리자 전용 로그인
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-[var(--surface-elevated)] rounded-3xl shadow-2xl p-8 border border-[var(--border)] animate-scaleIn">
          <div className="space-y-6">
            {/* Info Message */}
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">ℹ️</span>
                <div>
                  <h3 className="font-semibold text-[var(--foreground)] mb-1">
                    관리자 인증 필요
                  </h3>
                  <p className="text-sm text-[var(--foreground-muted)]">
                    Food Finder 백오피스에 접근하려면 Google 계정으로
                    로그인해주세요.
                  </p>
                </div>
              </div>
            </div>

            {/* Google Login Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
              className="btn w-full py-4 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isLoggingIn ? (
                <>
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>로그인 중...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span>Google로 로그인</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--border)]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-[var(--surface-elevated)] text-[var(--foreground-muted)]">
                  또는
                </span>
              </div>
            </div>

            {/* Back to Home */}
            <Link
              href="/"
              className="block w-full py-3 text-center border-2 border-[var(--border)] hover:border-[var(--primary)] text-[var(--foreground)] rounded-xl font-medium transition-all duration-200 hover:bg-[var(--surface)]"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-[var(--foreground-muted)] mt-6">
          관리자 권한이 필요한 페이지입니다.
          <br />
          문제가 있으시면 시스템 관리자에게 문의하세요.
        </p>
      </div>
    </div>
  );
}
