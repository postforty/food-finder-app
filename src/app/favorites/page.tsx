"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Link from "next/link";
import { useFavorites } from "@/context/FavoritesContext";
import { db } from "@/lib/firebase/client";
import { doc, getDoc } from "firebase/firestore";

interface Restaurant {
  id: string;
  name: string;
  category: string;
  address: string;
  mapUrl?: string;
  visitorReviewCount?: number;
  blogReviewCount?: number;
  imageUrl?: string;
}

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFavoriteRestaurants() {
      if (favorites.length === 0) {
        setRestaurants([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const restaurantPromises = favorites.map(async (id) => {
          const docRef = doc(db, "restaurants", id);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            return {
              id: docSnap.id,
              ...docSnap.data(),
            } as Restaurant;
          }
          return null;
        });

        const results = await Promise.all(restaurantPromises);
        const validRestaurants = results.filter((r): r is Restaurant => r !== null);
        setRestaurants(validRestaurants);
      } catch (error) {
        console.error("Error fetching favorite restaurants:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFavoriteRestaurants();
  }, [favorites]);

  const handleRemoveFavorite = (id: string) => {
    if (confirm("즐겨찾기에서 제거하시겠습니까?")) {
      removeFavorite(id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[var(--foreground-muted)]">로딩 중...</p>
          </div>
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
            <div className="text-6xl mb-4">❤️</div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="gradient-text" style={{ fontFamily: 'var(--font-display)' }}>
                즐겨찾기
              </span>
            </h1>
            <p className="text-lg text-[var(--foreground-muted)]">
              {restaurants.length}개의 맛집을 저장했습니다
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {restaurants.length === 0 ? (
          <div className="text-center py-20 animate-fadeIn">
            <div className="text-8xl mb-6">💔</div>
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
              아직 즐겨찾기한 음식점이 없습니다
            </h2>
            <p className="text-[var(--foreground-muted)] mb-6">
              마음에 드는 음식점을 즐겨찾기에 추가해보세요
            </p>
            <Link
              href="/"
              className="btn inline-block px-6 py-3 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200"
            >
              음식점 둘러보기
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant, index) => (
              <div
                key={restaurant.id}
                className="card-hover bg-white dark:bg-[var(--surface-elevated)] rounded-2xl overflow-hidden shadow-lg border border-[var(--border)] animate-fadeIn"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Restaurant Image */}
                <div className="relative h-48 bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center overflow-hidden">
                  {restaurant.imageUrl ? (
                    <img 
                      src={restaurant.imageUrl} 
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-8xl animate-float">🍽️</span>
                  )}
                  <div className="absolute top-4 left-4 bg-white dark:bg-[var(--surface)] px-3 py-1 rounded-full text-sm font-semibold text-[var(--foreground)] shadow-md">
                    {restaurant.category}
                  </div>
                  <button
                    onClick={() => handleRemoveFavorite(restaurant.id)}
                    className="absolute bottom-4 right-4 p-2 bg-white/90 dark:bg-black/50 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-black/70 transition-all duration-200 shadow-lg"
                  >
                    <svg className="w-6 h-6 text-[var(--accent)] fill-current" viewBox="0 0 24 24">
                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>

                {/* Restaurant Info */}
                <Link 
                  href={restaurant.mapUrl || "#"} 
                  target={restaurant.mapUrl ? "_blank" : undefined}
                  rel={restaurant.mapUrl ? "noopener noreferrer" : undefined}
                  className="block p-6"
                >
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-[var(--foreground)] mb-1 truncate">
                      {restaurant.name}
                    </h3>
                    <p className="text-sm text-[var(--foreground-muted)] truncate">
                      {restaurant.address}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    {restaurant.visitorReviewCount !== undefined && (
                      <>
                        <div className="flex items-center gap-1">
                          <span className="text-[var(--secondary)]">👥</span>
                          <span className="text-sm text-[var(--foreground-muted)]">
                            방문자 {restaurant.visitorReviewCount}
                          </span>
                        </div>
                        <span className="text-[var(--foreground-subtle)]">•</span>
                      </>
                    )}
                    {restaurant.blogReviewCount !== undefined && (
                      <div className="flex items-center gap-1">
                        <span className="text-[var(--secondary)]">📝</span>
                        <span className="text-sm text-[var(--foreground-muted)]">
                          블로그 {restaurant.blogReviewCount}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[var(--surface)] border-t border-[var(--border)] py-12 px-4 mt-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl">🍽️</span>
            <span className="text-xl font-bold gradient-text">Food Finder</span>
          </div>
          <p className="text-[var(--foreground-muted)]">
            최고의 맛집을 찾는 가장 쉬운 방법
          </p>
        </div>
      </footer>
    </div>
  );
}
