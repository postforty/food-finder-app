"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function Footer() {
  const { user, isAdmin, signInWithGoogle } = useAuth();

  return (
    <footer className="bg-[var(--surface)] border-t border-[var(--border)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo & Description */}
          <div className="text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center">
                <span className="text-xl">🍽️</span>
              </div>
              <span className="text-lg font-bold gradient-text">
                Food Finder
              </span>
            </div>
            <p className="text-sm text-[var(--foreground-muted)] max-w-md">
              맛있는 음식점을 찾고 공유하는 플랫폼입니다.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-sm">
            <Link
              href="/"
              className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
            >
              홈
            </Link>
            <Link
              href="/favorites"
              className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
            >
              즐겨찾기
            </Link>

            {/* Admin Button */}
            {user && isAdmin ? (
              <Link
                href="/admin/restaurants"
                className="flex items-center gap-2 px-3 py-1.5 bg-[var(--primary)] hover:bg-[var(--primary)]/80 text-white rounded-lg font-medium transition-all duration-200 text-xs"
                title="관리자 페이지"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                관리자
              </Link>
            ) : !user ? (
              <button
                onClick={signInWithGoogle}
                className="flex items-center gap-2 px-3 py-1.5 bg-[var(--surface-elevated)] hover:bg-[var(--border)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] rounded-lg font-medium transition-all duration-200 text-xs border border-[var(--border)]"
                title="관리자 로그인"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10,17 15,12 10,7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                관리자
              </button>
            ) : null}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-6 border-t border-[var(--border)] text-center">
          <p className="text-xs text-[var(--foreground-muted)]">
            © 2025 Food Finder. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
