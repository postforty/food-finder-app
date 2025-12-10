"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

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
    phone: "02-1234-5678",
    image: "🍲",
    status: "active",
  },
  {
    id: "2",
    name: "스시 마스터",
    category: "japanese",
    categoryName: "일식",
    rating: 4.9,
    reviews: 189,
    address: "서울시 강남구 역삼동 456",
    phone: "02-2345-6789",
    image: "🍣",
    status: "active",
  },
  {
    id: "3",
    name: "파스타 하우스",
    category: "western",
    categoryName: "양식",
    rating: 4.7,
    reviews: 156,
    address: "서울시 서초구 서초대로 789",
    phone: "02-3456-7890",
    image: "🍝",
    status: "active",
  },
];

export default function AdminDashboard() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [restaurants, setRestaurants] = useState(mockRestaurants);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/admin/login");
    }
  }, [user, loading, router]);

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

  if (!user) {
    return null;
  }

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || restaurant.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = (id: string) => {
    if (confirm("정말 이 음식점을 삭제하시겠습니까?")) {
      setRestaurants(restaurants.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🍽️</span>
                </div>
                <span className="text-xl font-bold gradient-text hidden sm:block">
                  Food Finder Admin
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              {user.photoURL && (
                <Image
                  src={user.photoURL}
                  alt={user.displayName || "Admin"}
                  width={40}
                  height={40}
                  className="rounded-full ring-2 ring-[var(--primary)] ring-offset-2"
                />
              )}
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-[var(--foreground)]">
                  {user.displayName}
                </p>
                <p className="text-xs text-[var(--foreground-muted)]">관리자</p>
              </div>
              <button
                onClick={signOut}
                className="btn px-4 py-2 bg-[var(--surface)] hover:bg-[var(--border)] text-[var(--foreground)] rounded-full font-medium transition-all duration-200"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-2">
            음식점 관리
          </h1>
          <p className="text-[var(--foreground-muted)]">
            등록된 음식점을 관리하고 새로운 음식점을 추가하세요
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-[var(--surface-elevated)] rounded-2xl p-6 shadow-md border border-[var(--border)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--foreground-muted)] mb-1">전체 음식점</p>
                <p className="text-3xl font-bold text-[var(--foreground)]">{restaurants.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-2xl">
                🏪
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[var(--surface-elevated)] rounded-2xl p-6 shadow-md border border-[var(--border)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--foreground-muted)] mb-1">평균 평점</p>
                <p className="text-3xl font-bold text-[var(--foreground)]">
                  {(restaurants.reduce((acc, r) => acc + r.rating, 0) / restaurants.length).toFixed(1)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--secondary)] to-[var(--primary)] flex items-center justify-center text-2xl">
                ⭐
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[var(--surface-elevated)] rounded-2xl p-6 shadow-md border border-[var(--border)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--foreground-muted)] mb-1">전체 리뷰</p>
                <p className="text-3xl font-bold text-[var(--foreground)]">
                  {restaurants.reduce((acc, r) => acc + r.reviews, 0)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--primary)] flex items-center justify-center text-2xl">
                💬
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white dark:bg-[var(--surface-elevated)] rounded-2xl p-6 shadow-md border border-[var(--border)] mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="음식점 이름 또는 주소 검색..."
                  className="w-full pl-12 pr-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl outline-none focus:border-[var(--primary)] transition-colors text-[var(--foreground)]"
                />
              </div>
            </div>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl outline-none focus:border-[var(--primary)] transition-colors text-[var(--foreground)] cursor-pointer"
            >
              <option value="all">전체 카테고리</option>
              <option value="korean">한식</option>
              <option value="chinese">중식</option>
              <option value="japanese">일식</option>
              <option value="western">양식</option>
              <option value="cafe">카페</option>
              <option value="dessert">디저트</option>
            </select>

            {/* Add Button */}
            <Link
              href="/admin/restaurants/new"
              className="btn px-6 py-3 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span className="text-xl">➕</span>
              <span>음식점 추가</span>
            </Link>
          </div>
        </div>

        {/* Restaurant List */}
        <div className="space-y-4">
          {filteredRestaurants.length === 0 ? (
            <div className="bg-white dark:bg-[var(--surface-elevated)] rounded-2xl p-12 text-center shadow-md border border-[var(--border)]">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
                음식점을 찾을 수 없습니다
              </h3>
              <p className="text-[var(--foreground-muted)]">
                검색 조건을 변경하거나 새로운 음식점을 추가해보세요
              </p>
            </div>
          ) : (
            filteredRestaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-white dark:bg-[var(--surface-elevated)] rounded-2xl p-6 shadow-md border border-[var(--border)] hover:shadow-lg transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Image */}
                  <div className="w-full sm:w-32 h-32 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-6xl flex-shrink-0">
                    {restaurant.image}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-[var(--foreground)] mb-1">
                          {restaurant.name}
                        </h3>
                        <span className="inline-block px-3 py-1 bg-[var(--surface)] text-[var(--foreground-muted)] text-sm rounded-full">
                          {restaurant.categoryName}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[var(--secondary)]">⭐</span>
                        <span className="font-semibold text-[var(--foreground)]">
                          {restaurant.rating}
                        </span>
                        <span className="text-[var(--foreground-muted)] text-sm">
                          ({restaurant.reviews})
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
                        <span>📍</span>
                        <span className="text-sm">{restaurant.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
                        <span>📞</span>
                        <span className="text-sm">{restaurant.phone}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Link
                        href={`/admin/restaurants/${restaurant.id}`}
                        className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg font-medium hover:bg-[var(--primary-dark)] transition-colors"
                      >
                        수정
                      </Link>
                      <button
                        onClick={() => handleDelete(restaurant.id)}
                        className="px-4 py-2 bg-[var(--error)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
