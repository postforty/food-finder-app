"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Link from "next/link";

const categories = [
  { id: "korean", name: "한식", emoji: "🍚", color: "from-red-500 to-orange-500" },
  { id: "chinese", name: "중식", emoji: "🥟", color: "from-yellow-500 to-red-500" },
  { id: "japanese", name: "일식", emoji: "🍣", color: "from-pink-500 to-red-500" },
  { id: "western", name: "양식", emoji: "🍝", color: "from-orange-500 to-yellow-500" },
  { id: "cafe", name: "카페", emoji: "☕", color: "from-amber-500 to-orange-500" },
  { id: "dessert", name: "디저트", emoji: "🍰", color: "from-pink-500 to-purple-500" },
];

const featuredRestaurants = [
  {
    id: 1,
    name: "맛있는 한식당",
    category: "한식",
    rating: 4.8,
    reviews: 234,
    image: "🍲",
    distance: "500m",
    tags: ["비빔밥", "된장찌개", "불고기"],
  },
  {
    id: 2,
    name: "스시 마스터",
    category: "일식",
    rating: 4.9,
    reviews: 189,
    image: "🍣",
    distance: "1.2km",
    tags: ["초밥", "사시미", "우동"],
  },
  {
    id: 3,
    name: "파스타 하우스",
    category: "양식",
    rating: 4.7,
    reviews: 156,
    image: "🍝",
    distance: "800m",
    tags: ["파스타", "피자", "리조또"],
  },
];

export default function Home() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[var(--surface)] to-[var(--background)] py-20 px-4">
        <div className="absolute inset-0 bg-[var(--gradient-hero)] pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="animate-fadeIn">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="gradient-text" style={{ fontFamily: 'var(--font-display)' }}>
                맛있는 음식,
              </span>
              <br />
              <span className="text-[var(--foreground)]">
                쉽게 찾아보세요
              </span>
            </h1>
            <p className="text-xl text-[var(--foreground-muted)] mb-10 max-w-2xl mx-auto">
              주변의 최고의 음식점을 발견하고, 리뷰를 확인하고, 즐겨찾기에 저장하세요
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="animate-scaleIn max-w-2xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div className="relative flex items-center bg-white dark:bg-[var(--surface-elevated)] rounded-2xl shadow-lg overflow-hidden">
                <span className="pl-6 text-2xl">🔍</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="음식점, 음식 종류, 지역 검색..."
                  className="flex-1 px-4 py-5 text-lg bg-transparent outline-none text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)]"
                />
                <button
                  type="submit"
                  className="btn m-2 px-8 py-3 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                >
                  검색
                </button>
              </div>
            </div>
          </form>

          {/* Quick Stats */}
          {user && (
            <div className="mt-12 grid grid-cols-3 gap-6 max-w-xl mx-auto animate-fadeIn">
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--primary)]">1,234</div>
                <div className="text-sm text-[var(--foreground-muted)] mt-1">음식점</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--accent)]">5,678</div>
                <div className="text-sm text-[var(--foreground-muted)] mt-1">리뷰</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--secondary)]">890</div>
                <div className="text-sm text-[var(--foreground-muted)] mt-1">사용자</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-4">
              카테고리별 탐색
            </h2>
            <p className="text-lg text-[var(--foreground-muted)]">
              원하는 음식 종류를 선택하세요
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                href={`/restaurants?category=${category.id}`}
                className="card-hover group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="bg-white dark:bg-[var(--surface-elevated)] rounded-2xl p-6 text-center shadow-md border border-[var(--border)] hover:border-[var(--primary)] transition-all duration-300">
                  <div className={`text-5xl mb-3 group-hover:scale-110 transition-transform duration-300 inline-block`}>
                    {category.emoji}
                  </div>
                  <h3 className="font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="py-16 px-4 bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-2">
                인기 음식점
              </h2>
              <p className="text-lg text-[var(--foreground-muted)]">
                지금 가장 인기있는 맛집들
              </p>
            </div>
            <Link
              href="/restaurants"
              className="hidden sm:flex items-center gap-2 text-[var(--primary)] font-semibold hover:gap-3 transition-all duration-200"
            >
              모두 보기
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRestaurants.map((restaurant, index) => (
              <div
                key={restaurant.id}
                className="card-hover bg-white dark:bg-[var(--surface-elevated)] rounded-2xl overflow-hidden shadow-lg border border-[var(--border)] animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Restaurant Image */}
                <div className="relative h-48 bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center">
                  <span className="text-8xl animate-float">{restaurant.image}</span>
                  <div className="absolute top-4 right-4 bg-white dark:bg-[var(--surface)] px-3 py-1 rounded-full text-sm font-semibold text-[var(--foreground)] shadow-md">
                    {restaurant.distance}
                  </div>
                </div>

                {/* Restaurant Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-[var(--foreground)] mb-1">
                        {restaurant.name}
                      </h3>
                      <p className="text-sm text-[var(--foreground-muted)]">
                        {restaurant.category}
                      </p>
                    </div>
                    <button className="p-2 hover:bg-[var(--surface)] rounded-full transition-colors">
                      <svg className="w-6 h-6 text-[var(--foreground-subtle)] hover:text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <span className="text-[var(--secondary)]">⭐</span>
                      <span className="font-semibold text-[var(--foreground)]">
                        {restaurant.rating}
                      </span>
                    </div>
                    <span className="text-[var(--foreground-subtle)]">•</span>
                    <span className="text-sm text-[var(--foreground-muted)]">
                      리뷰 {restaurant.reviews}개
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {restaurant.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-[var(--surface)] text-[var(--foreground-muted)] text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/restaurants"
              className="inline-flex items-center gap-2 text-[var(--primary)] font-semibold"
            >
              모두 보기
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] rounded-3xl blur-xl opacity-20"></div>
              <div className="relative bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] rounded-3xl p-12 shadow-2xl">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  지금 시작하세요
                </h2>
                <p className="text-xl text-white/90 mb-8">
                  로그인하고 나만의 맛집 리스트를 만들어보세요
                </p>
                <button
                  onClick={() => {
                    const header = document.querySelector('header');
                    header?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="btn px-8 py-4 bg-white text-[var(--primary)] rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  무료로 시작하기
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-[var(--surface)] border-t border-[var(--border)] py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🍽️</span>
                <span className="text-xl font-bold gradient-text">Food Finder</span>
              </div>
              <p className="text-[var(--foreground-muted)]">
                최고의 맛집을 찾는 가장 쉬운 방법
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--foreground)] mb-4">서비스</h3>
              <ul className="space-y-2 text-[var(--foreground-muted)]">
                <li><Link href="/restaurants" className="hover:text-[var(--primary)] transition-colors">음식점 찾기</Link></li>
                <li><Link href="/favorites" className="hover:text-[var(--primary)] transition-colors">즐겨찾기</Link></li>
                <li><Link href="/reviews" className="hover:text-[var(--primary)] transition-colors">리뷰</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--foreground)] mb-4">회사</h3>
              <ul className="space-y-2 text-[var(--foreground-muted)]">
                <li><Link href="/about" className="hover:text-[var(--primary)] transition-colors">소개</Link></li>
                <li><Link href="/contact" className="hover:text-[var(--primary)] transition-colors">문의</Link></li>
                <li><Link href="/careers" className="hover:text-[var(--primary)] transition-colors">채용</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--foreground)] mb-4">법적 고지</h3>
              <ul className="space-y-2 text-[var(--foreground-muted)]">
                <li><Link href="/privacy" className="hover:text-[var(--primary)] transition-colors">개인정보처리방침</Link></li>
                <li><Link href="/terms" className="hover:text-[var(--primary)] transition-colors">이용약관</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-[var(--border)] text-center text-[var(--foreground-muted)]">
            <p>&copy; 2024 Food Finder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

