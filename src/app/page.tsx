"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Link from "next/link";
import { useFavorites } from "@/context/FavoritesContext";
import { db } from "@/lib/firebase/client";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

interface Restaurant {
  id: string;
  name: string;
  category: string;
  reviews?: number;
  blogReviews?: number;
  address: string;
  imageUrl?: string;
  description?: string;
  mapUrl?: string;
  tags?: string[];
}

const categoryEmojis: Record<string, string> = {
  "한식": "🍚",
  "중식": "🥟",
  "일식": "🍣",
  "양식": "🍝",
  "카페": "☕",
  "디저트": "🍰",
  "분식": "🍜",
  "치킨": "🍗",
  "피자": "🍕",
};

export default function RestaurantsPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"reviews" | "name">("reviews");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch restaurants from Firestore
  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const q = query(collection(db, "restaurants"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const list: Restaurant[] = [];
        const categorySet = new Set<string>();

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          list.push({
            id: doc.id,
            name: data.name || "",
            category: data.category || "",
            reviews: typeof data.reviews === 'number' ? data.reviews : 0,
            blogReviews: typeof data.blogReviews === 'number' ? data.blogReviews : 0,
            address: data.address || "",
            imageUrl: data.imageUrl || "",
            description: data.description || "",
            mapUrl: data.mapUrl || "",
            tags: data.tags || [],
          });
          if (data.category) {
            categorySet.add(data.category);
          }
        });

        setRestaurants(list);
        setCategories(["all", ...Array.from(categorySet)]);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  const filteredRestaurants = restaurants
    .filter((restaurant) => {
      const matchesCategory = selectedCategory === "all" || restaurant.category === selectedCategory;
      const matchesSearch = 
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (restaurant.tags && restaurant.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "reviews") {
        return (b.reviews || 0) - (a.reviews || 0);
      }
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  const handleFavoriteClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

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
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white shadow-md"
                    : "bg-[var(--surface)] text-[var(--foreground-muted)] hover:bg-[var(--border)]"
                }`}
              >
                <span className="text-xl">{categoryEmojis[category] || "🍽️"}</span>
                <span>{category === "all" ? "전체" : category}</span>
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
                onChange={(e) => setSortBy(e.target.value as "reviews" | "name")}
                className="px-3 py-1.5 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)] cursor-pointer"
              >
                <option value="reviews">리뷰 많은순</option>
                <option value="name">이름순</option>
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
                  href={restaurant.mapUrl || `#`}
                  target={restaurant.mapUrl ? "_blank" : undefined}
                  rel={restaurant.mapUrl ? "noopener noreferrer" : undefined}
                  className="card-hover bg-white dark:bg-[var(--surface-elevated)] rounded-2xl overflow-hidden shadow-lg border border-[var(--border)] animate-fadeIn"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Restaurant Image */}
                  <div className="relative h-48 bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center">
                    {restaurant.imageUrl ? (
                      <img 
                        src={restaurant.imageUrl} 
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-8xl">{categoryEmojis[restaurant.category] || "🍽️"}</span>
                    )}
                    <div className="absolute top-4 left-4 bg-white dark:bg-[var(--surface)] px-3 py-1 rounded-full text-sm font-semibold text-[var(--foreground)] shadow-md">
                      {restaurant.category}
                    </div>
                    <button 
                      onClick={(e) => handleFavoriteClick(e, restaurant.id)}
                      className="absolute top-4 right-4 p-2 bg-white dark:bg-[var(--surface)] rounded-full shadow-md hover:scale-110 transition-transform"
                    >
                      <svg 
                        className={`w-6 h-6 transition-colors ${
                          isFavorite(restaurant.id) 
                            ? "text-red-500 fill-current" 
                            : "text-gray-400"
                        }`} 
                        fill={isFavorite(restaurant.id) ? "currentColor" : "none"}
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
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
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1 text-sm text-[var(--foreground-muted)]">
                        <span>👥 방문자 리뷰</span>
                        <span className="font-semibold text-[var(--foreground)]">
                          {restaurant.reviews}
                        </span>
                      </div>
                      {restaurant.blogReviews && restaurant.blogReviews > 0 && (
                        <>
                          <span className="text-[var(--foreground-subtle)]">•</span>
                          <div className="flex items-center gap-1 text-sm text-[var(--foreground-muted)]">
                            <span>📝 블로그 리뷰</span>
                            <span className="font-semibold text-[var(--foreground)]">
                              {restaurant.blogReviews}
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    {restaurant.description && (
                      <p className="text-sm text-[var(--foreground-muted)] mb-4 line-clamp-2">
                        {restaurant.description}
                      </p>
                    )}

                    {restaurant.tags && restaurant.tags.length > 0 && (
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
                    )}
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
          <p className="text-sm text-[var(--foreground-muted)] mt-6">
            &copy; 2025 Food Finder. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
