"use client";

import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass border-b border-[var(--border)]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center shadow-lg group-hover:shadow-[var(--shadow-glow)] transition-all duration-300">
              <span className="text-2xl">🍽️</span>
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:block">
              Food Finder
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors duration-200 font-medium"
            >
              홈
            </Link>
            <Link
              href="/restaurants"
              className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors duration-200 font-medium"
            >
              음식점 찾기
            </Link>
            {user && (
              <Link
                href="/favorites"
                className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors duration-200 font-medium"
              >
                즐겨찾기
              </Link>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            {loading ? (
              <div className="w-24 h-10 skeleton rounded-full"></div>
            ) : user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2">
                  {user.photoURL && (
                    <Image
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      width={32}
                      height={32}
                      className="rounded-full ring-2 ring-[var(--primary)] ring-offset-2"
                    />
                  )}
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    {user.displayName}
                  </span>
                </div>
                <button
                  onClick={signOut}
                  className="btn px-4 py-2 bg-[var(--surface)] hover:bg-[var(--border)] text-[var(--foreground)] rounded-full font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="btn px-6 py-2.5 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-200"
              >
                로그인
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-[var(--surface)] transition-colors"
              aria-label="메뉴 열기"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-[var(--border)] animate-fadeIn">
            <div className="flex flex-col gap-3">
              <Link
                href="/"
                className="px-4 py-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] rounded-lg transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                홈
              </Link>
              <Link
                href="/restaurants"
                className="px-4 py-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] rounded-lg transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                음식점 찾기
              </Link>
              {user && (
                <Link
                  href="/favorites"
                  className="px-4 py-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] rounded-lg transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  즐겨찾기
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
