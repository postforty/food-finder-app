"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useFavorites } from "@/context/FavoritesContext";
import { db } from "@/lib/firebase/client";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";

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
  한식: "🍚",
  중식: "🥟",
  일식: "🍣",
  양식: "🍝",
  카페: "☕",
  디저트: "🍰",
  분식: "🍜",
  치킨: "🍗",
  피자: "🍕",
};

function RestaurantsPageContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const { isFavorite, toggleFavorite } = useFavorites();

  const [selectedCategory, setSelectedCategory] = useState(
    categoryParam || "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"reviews" | "name">("reviews");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);

  const ITEMS_PER_PAGE = 12; // 한 번에 로드할 아이템 수

  // Fetch initial restaurants from Firestore
  useEffect(() => {
    async function fetchInitialRestaurants() {
      try {
        // 카테고리 목록을 위한 전체 데이터 조회 (카테고리만)
        const allDocsQuery = query(collection(db, "restaurants"));
        const allDocsSnapshot = await getDocs(allDocsQuery);
        const categorySet = new Set<string>();

        allDocsSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.category) {
            categorySet.add(data.category);
          }
        });
        setCategories(["all", ...Array.from(categorySet)]);

        // 초기 데이터 로드 (페이지네이션)
        const q = query(
          collection(db, "restaurants"),
          orderBy("createdAt", "desc"),
          limit(ITEMS_PER_PAGE)
        );
        const querySnapshot = await getDocs(q);
        const list: Restaurant[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          list.push({
            id: doc.id,
            name: data.name || "",
            category: data.category || "",
            reviews: typeof data.reviews === "number" ? data.reviews : 0,
            blogReviews:
              typeof data.blogReviews === "number" ? data.blogReviews : 0,
            address: data.address || "",
            imageUrl: data.imageUrl || "",
            description: data.description || "",
            mapUrl: data.mapUrl || "",
            tags: data.tags || [],
          });
        });

        setRestaurants(list);

        // 마지막 문서 저장 (다음 페이지 로드용)
        const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
        setLastDoc(lastVisible);

        // 더 로드할 데이터가 있는지 확인
        setHasMore(querySnapshot.docs.length === ITEMS_PER_PAGE);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchInitialRestaurants();
  }, []);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  // 검색어 디바운싱 (500ms 지연)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load more restaurants
  const loadMoreRestaurants = async () => {
    if (!hasMore || loadingMore || !lastDoc) return;

    setLoadingMore(true);
    try {
      const q = query(
        collection(db, "restaurants"),
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(ITEMS_PER_PAGE)
      );
      const querySnapshot = await getDocs(q);
      const newList: Restaurant[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        newList.push({
          id: doc.id,
          name: data.name || "",
          category: data.category || "",
          reviews: typeof data.reviews === "number" ? data.reviews : 0,
          blogReviews:
            typeof data.blogReviews === "number" ? data.blogReviews : 0,
          address: data.address || "",
          imageUrl: data.imageUrl || "",
          description: data.description || "",
          mapUrl: data.mapUrl || "",
          tags: data.tags || [],
        });
      });

      if (newList.length > 0) {
        setRestaurants((prev) => [...prev, ...newList]);
        const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
        setLastDoc(lastVisible);
        setHasMore(querySnapshot.docs.length === ITEMS_PER_PAGE);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more restaurants:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loadingMore) {
          loadMoreRestaurants();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      }
    );

    const sentinel = document.getElementById("scroll-sentinel");
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [hasMore, loadingMore, lastDoc]);

  // 필터링과 정렬을 메모이제이션으로 최적화
  const filteredRestaurants = useMemo(() => {
    return restaurants
      .filter((restaurant) => {
        const matchesCategory =
          selectedCategory === "all" ||
          restaurant.category === selectedCategory;
        const matchesSearch =
          restaurant.name
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase()) ||
          restaurant.address
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase()) ||
          (restaurant.tags &&
            restaurant.tags.some((tag) =>
              tag.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
            ));
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "reviews") {
          return (b.reviews || 0) - (a.reviews || 0);
        }
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return 0;
      });
  }, [restaurants, selectedCategory, debouncedSearchQuery, sortBy]);

  const handleRandomPick = () => {
    if (filteredRestaurants.length === 0) {
      alert("선택할 수 있는 식당이 없습니다!");
      return;
    }

    setIsSpinning(true);
    setSelectedRestaurant(null);

    // 1.5초 동안 스피닝 애니메이션 후 결과 표시
    setTimeout(() => {
      const randomIndex = Math.floor(
        Math.random() * filteredRestaurants.length
      );
      setSelectedRestaurant(filteredRestaurants[randomIndex]);
      setIsSpinning(false);
    }, 1500);
  };

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
              <span
                className="gradient-text"
                style={{ fontFamily: "var(--font-display)" }}
              >
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
            {/* Random Roulette Button */}
            <button
              onClick={handleRandomPick}
              disabled={isSpinning || filteredRestaurants.length === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all duration-200 ${
                isSpinning
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg animate-pulse"
                  : "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md hover:shadow-lg hover:scale-105"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              title="랜덤으로 식당 선택하기"
            >
              <span className={`text-xl ${isSpinning ? "animate-spin" : ""}`}>
                🎰
              </span>
              <span>{isSpinning ? "선택 중..." : "랜덤 룰렛"}</span>
            </button>

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
                <span className="text-xl">
                  {categoryEmojis[category] || "🍽️"}
                </span>
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
              <span className="text-sm text-[var(--foreground-muted)]">
                정렬:
              </span>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "reviews" | "name")
                }
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
            <>
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
                        <span className="text-8xl">
                          {categoryEmojis[restaurant.category] || "🍽️"}
                        </span>
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
                          fill={
                            isFavorite(restaurant.id) ? "currentColor" : "none"
                          }
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
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
                        {restaurant.blogReviews &&
                          restaurant.blogReviews > 0 && (
                            <>
                              <span className="text-[var(--foreground-subtle)]">
                                •
                              </span>
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

              {/* Infinite Scroll Sentinel */}
              <div className="mt-8">
                {/* Load More Button (fallback for manual loading) */}
                {hasMore && !loadingMore && (
                  <div className="text-center">
                    <button
                      onClick={loadMoreRestaurants}
                      className="btn px-6 py-3 bg-[var(--surface)] hover:bg-[var(--border)] text-[var(--foreground)] rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      더 보기
                    </button>
                  </div>
                )}

                {/* Loading More Indicator */}
                {loadingMore && (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center gap-3">
                      <div className="w-6 h-6 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-[var(--foreground-muted)]">
                        더 많은 맛집을 불러오는 중...
                      </span>
                    </div>
                  </div>
                )}

                {/* Intersection Observer Sentinel */}
                <div id="scroll-sentinel" className="h-4"></div>

                {/* No More Data Indicator */}
                {!hasMore && restaurants.length > ITEMS_PER_PAGE && (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">🎉</div>
                    <p className="text-[var(--foreground-muted)]">
                      모든 맛집을 확인했습니다! ({restaurants.length}개)
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Random Selection Modal */}
      {selectedRestaurant && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fadeIn"
          onClick={() => setSelectedRestaurant(null)}
        >
          <div
            className="bg-white dark:bg-[var(--surface-elevated)] rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative">
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={() => setSelectedRestaurant(null)}
                  className="p-2 bg-white dark:bg-[var(--surface)] rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Restaurant Image */}
              <div className="relative h-56 bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center">
                {selectedRestaurant.imageUrl ? (
                  <img
                    src={selectedRestaurant.imageUrl}
                    alt={selectedRestaurant.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-9xl">
                    {categoryEmojis[selectedRestaurant.category] || "🍽️"}
                  </span>
                )}
                <div className="absolute bottom-4 left-4 bg-white dark:bg-[var(--surface)] px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  {selectedRestaurant.category}
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-bold mb-4 shadow-lg">
                  <span className="text-2xl">🎉</span>
                  <span>오늘의 추천!</span>
                </div>
                <h2 className="text-3xl font-bold text-[var(--foreground)] mb-2">
                  {selectedRestaurant.name}
                </h2>
                <p className="text-[var(--foreground-muted)] flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {selectedRestaurant.address}
                </p>
              </div>

              {/* Reviews */}
              <div className="flex items-center justify-center gap-4 mb-6 p-4 bg-[var(--surface)] rounded-xl">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--foreground)]">
                    {selectedRestaurant.reviews}
                  </div>
                  <div className="text-xs text-[var(--foreground-muted)]">
                    👥 방문자 리뷰
                  </div>
                </div>
                {selectedRestaurant.blogReviews &&
                  selectedRestaurant.blogReviews > 0 && (
                    <>
                      <div className="w-px h-12 bg-[var(--border)]"></div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[var(--foreground)]">
                          {selectedRestaurant.blogReviews}
                        </div>
                        <div className="text-xs text-[var(--foreground-muted)]">
                          📝 블로그 리뷰
                        </div>
                      </div>
                    </>
                  )}
              </div>

              {/* Description */}
              {selectedRestaurant.description && (
                <p className="text-sm text-[var(--foreground-muted)] mb-6 text-center">
                  {selectedRestaurant.description}
                </p>
              )}

              {/* Tags */}
              {selectedRestaurant.tags &&
                selectedRestaurant.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center mb-6">
                    {selectedRestaurant.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-[var(--surface)] text-[var(--foreground-muted)] text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={(e) => {
                    handleFavoriteClick(e, selectedRestaurant.id);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[var(--surface)] hover:bg-[var(--border)] rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <svg
                    className={`w-5 h-5 transition-colors ${
                      isFavorite(selectedRestaurant.id)
                        ? "text-red-500 fill-current"
                        : "text-gray-400"
                    }`}
                    fill={
                      isFavorite(selectedRestaurant.id)
                        ? "currentColor"
                        : "none"
                    }
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span>
                    {isFavorite(selectedRestaurant.id)
                      ? "즐겨찾기 해제"
                      : "즐겨찾기"}
                  </span>
                </button>
                {selectedRestaurant.mapUrl && (
                  <a
                    href={selectedRestaurant.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>지도 보기</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function RestaurantsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--background)]">
          <Header />
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        </div>
      }
    >
      <RestaurantsPageContent />
    </Suspense>
  );
}
