"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Link from "next/link";

const categories = [
  { id: "all", name: "전체", emoji: "🍽️" },
  { id: "korean", name: "한식", emoji: "🍚" },
  { id: "chinese", name: "중식", emoji: "🥟" },
  { id: "japanese", name: "일식", emoji: "🍣" },
  { id: "western", name: "양식", emoji: "🍝" },
  { id: "cafe", name: "카페", emoji: "☕" },
  { id: "dessert", name: "디저트", emoji: "🍰" },
];

// 임시 데이터 (나중에 Firestore로 교체)
const mockRestaurants = [
  {
    id: "1",
    name: "맛있는 한식당",
    category: "korean",
    categoryName: "한식",
    rating: 4.8,
    reviews: 234,
    address: "서울시 강남구 테헤란로 123",
    distance: "500m",
    image: "🍲",
    tags: ["비빔밥", "된장찌개", "불고기"],
    description: "정통 한식을 맛볼 수 있는 곳",
  },
  {
    id: "2",
    name: "스시 마스터",
    category: "japanese",
    categoryName: "일식",
    rating: 4.9,
    reviews: 189,
    address: "서울시 강남구 역삼동 456",
    distance: "1.2km",
    image: "🍣",
    tags: ["초밥", "사시미", "우동"],
    description: "신선한 해산물로 만드는 최고의 스시",
  },
  {
    id: "3",
    name: "파스타 하우스",
    category: "western",
    categoryName: "양식",
    rating: 4.7,
    reviews: 156,
    address: "서울시 서초구 서초대로 789",
    distance: "800m",
    image: "🍝",
    tags: ["파스타", "피자", "리조또"],
    description: "이탈리아 정통 파스타 전문점",
  },
  {
    id: "4",
    name: "차이나 타운",
    category: "chinese",
    categoryName: "중식",
    rating: 4.6,
    reviews: 203,
    address: "서울시 강남구 논현동 321",
    distance: "1.5km",
    image: "🥟",
    tags: ["짜장면", "짬뽕", "탕수육"],
    description: "중국 본토의 맛을 그대로",
  },
  {
    id: "5",
    name: "카페 모카",
    category: "cafe",
    categoryName: "카페",
    rating: 4.5,
    reviews: 178,
    address: "서울시 강남구 신사동 654",
    distance: "600m",
    image: "☕",
    tags: ["아메리카노", "라떼", "디저트"],
    description: "아늑한 분위기의 프리미엄 카페",
  },
  {
    id: "6",
    name: "스위트 베이커리",
    category: "dessert",
    categoryName: "디저트",
    rating: 4.8,
    reviews: 145,
    address: "서울시 강남구 청담동 987",
    distance: "900m",
    image: "🍰",
    tags: ["케이크", "마카롱", "타르트"],
    description: "매일 아침 구워내는 신선한 빵",
  },
];

export default function RestaurantsPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"rating" | "reviews" | "distance">("rating");

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  const filteredRestaurants = mockRestaurants
    .filter((restaurant) => {
      const matchesCategory = selectedCategory === "all" || restaurant.category === selectedCategory;
      const matchesSearch = 
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "reviews") return b.reviews - a.reviews;
      if (sortBy === "distance") {
        const distA = parseFloat(a.distance);
        const distB = parseFloat(b.distance);
        return distA - distB;
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[var(--surface)] to-[var(--background)] py-12 px-4 border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 animate-fadeIn">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="gradient-text" style={{ fontFamily: 'var(--font-display)' }}>
                음식점 찾기
              </span>
            </h1>
            <p className="text-lg text-[var(--foreground-muted)]">
              {filteredRestaurants.length}개의 맛집이 당신을 기다립니다
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto animate-scaleIn">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div className="relative flex items-center bg-white dark:bg-[var(--surface-elevated)] rounded-2xl shadow-lg overflow-hidden">
                <span className="pl-6 text-2xl">🔍</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="음식점, 메뉴, 지역 검색..."
                  className="flex-1 px-4 py-4 text-lg bg-transparent outline-none text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="sticky top-16 z-40 bg-[var(--background)] border-b border-[var(--border)] py-4 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Category Filter */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white shadow-md"
                    : "bg-[var(--surface)] text-[var(--foreground-muted)] hover:bg-[var(--border)]"
                }`}
              >
                <span className="text-xl">{category.emoji}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-[var(--foreground-muted)]">
              {filteredRestaurants.length}개의 결과
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--foreground-muted)]">정렬:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "rating" | "reviews" | "distance")}
                className="px-3 py-1.5 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)] cursor-pointer"
              >
                <option value="rating">평점 높은순</option>
                <option value="reviews">리뷰 많은순</option>
                <option value="distance">거리순</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Restaurant Grid */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {filteredRestaurants.length === 0 ? (
            <div className="text-center py-20 animate-fadeIn">
              <div className="text-8xl mb-6">🔍</div>
              <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
                검색 결과가 없습니다
              </h2>
              <p className="text-[var(--foreground-muted)] mb-6">
                다른 검색어나 카테고리를 시도해보세요
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="btn px-6 py-3 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200"
              >
                전체 보기
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant, index) => (
                <Link
                  key={restaurant.id}
                  href={`/restaurants/${restaurant.id}`}
                  className="card-hover bg-white dark:bg-[var(--surface-elevated)] rounded-2xl overflow-hidden shadow-lg border border-[var(--border)] animate-fadeIn"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Restaurant Image */}
                  <div className="relative h-48 bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center">
                    <span className="text-8xl animate-float">{restaurant.image}</span>
                    <div className="absolute top-4 left-4 bg-white dark:bg-[var(--surface)] px-3 py-1 rounded-full text-sm font-semibold text-[var(--foreground)] shadow-md">
                      {restaurant.categoryName}
                    </div>
                    <div className="absolute top-4 right-4 bg-white dark:bg-[var(--surface)] px-3 py-1 rounded-full text-sm font-semibold text-[var(--foreground)] shadow-md">
                      {restaurant.distance}
                    </div>
                  </div>

                  {/* Restaurant Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-[var(--foreground)] mb-1 truncate">
                          {restaurant.name}
                        </h3>
                        <p className="text-sm text-[var(--foreground-muted)] truncate">
                          {restaurant.address}
                        </p>
                      </div>
                      <button className="p-2 hover:bg-[var(--surface)] rounded-full transition-colors flex-shrink-0 ml-2">
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

                    <p className="text-sm text-[var(--foreground-muted)] mb-4 line-clamp-2">
                      {restaurant.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {restaurant.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-[var(--surface)] text-[var(--foreground-muted)] text-sm rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--surface)] border-t border-[var(--border)] py-12 px-4 mt-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl">🍽️</span>
            <span className="text-xl font-bold gradient-text">Food Finder</span>
          </div>
          <p className="text-[var(--foreground-muted)] mb-4">
            최고의 맛집을 찾는 가장 쉬운 방법
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-[var(--foreground-muted)]">
            <Link href="/about" className="hover:text-[var(--primary)] transition-colors">소개</Link>
            <Link href="/contact" className="hover:text-[var(--primary)] transition-colors">문의</Link>
            <Link href="/privacy" className="hover:text-[var(--primary)] transition-colors">개인정보처리방침</Link>
          </div>
          <p className="text-sm text-[var(--foreground-muted)] mt-6">
            &copy; 2024 Food Finder. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
