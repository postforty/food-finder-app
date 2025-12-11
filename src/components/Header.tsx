"use client";

import { useAuth } from "@/context/AuthContext";
import { useFavorites } from "@/context/FavoritesContext";
import Image from "next/image";
import Link from "next/link";
export default function Header() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const { favorites } = useFavorites();

  // 즐겨찾기가 있는지 확인
  const hasFavorites = favorites.length > 0;

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

          {/* Navigation */}
          <div className="flex items-center gap-6">
            {hasFavorites && (
              <Link
                href="/favorites"
                className="flex items-center gap-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-all duration-200 font-medium group"
              >
                <svg
                  className="w-5 h-5 fill-current group-hover:scale-110 transition-transform duration-200"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <span>즐겨찾기</span>
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
                관리자
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
