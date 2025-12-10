"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Link from "next/link";
import Image from "next/image";

// 임시 데이터
const mockRestaurants = {
  "1": {
    id: "1",
    name: "맛있는 한식당",
    category: "korean",
    categoryName: "한식",
    rating: 4.8,
    reviews: 234,
    address: "서울시 강남구 테헤란로 123",
    phone: "02-1234-5678",
    distance: "500m",
    image: "🍲",
    tags: ["비빔밥", "된장찌개", "불고기"],
    description: "정통 한식을 맛볼 수 있는 곳입니다. 신선한 재료로 매일 아침 준비하는 정성스러운 한식 요리를 제공합니다.",
    hours: "매일 11:00 - 22:00",
    priceRange: "₩₩",
    menu: [
      { name: "비빔밥", price: "12,000원", description: "신선한 나물과 고추장" },
      { name: "된장찌개", price: "8,000원", description: "구수한 된장 맛" },
      { name: "불고기", price: "18,000원", description: "부드러운 소고기" },
    ],
  },
  "2": {
    id: "2",
    name: "스시 마스터",
    category: "japanese",
    categoryName: "일식",
    rating: 4.9,
    reviews: 189,
    address: "서울시 강남구 역삼동 456",
    phone: "02-2345-6789",
    distance: "1.2km",
    image: "🍣",
    tags: ["초밥", "사시미", "우동"],
    description: "신선한 해산물로 만드는 최고의 스시를 제공합니다. 일본에서 수련한 셰프가 직접 만듭니다.",
    hours: "화-일 12:00 - 23:00 (월요일 휴무)",
    priceRange: "₩₩₩",
    menu: [
      { name: "모듬초밥", price: "25,000원", description: "신선한 생선 10종" },
      { name: "사시미", price: "30,000원", description: "제철 회 모듬" },
      { name: "우동", price: "9,000원", description: "수제 면발" },
    ],
  },
  "3": {
    id: "3",
    name: "파스타 하우스",
    category: "western",
    categoryName: "양식",
    rating: 4.7,
    reviews: 156,
    address: "서울시 서초구 서초대로 789",
    phone: "02-3456-7890",
    distance: "800m",
    image: "🍝",
    tags: ["파스타", "피자", "리조또"],
    description: "이탈리아 정통 파스타 전문점입니다. 매일 아침 만드는 수제 파스타 면을 사용합니다.",
    hours: "매일 11:30 - 22:30",
    priceRange: "₩₩",
    menu: [
      { name: "까르보나라", price: "16,000원", description: "크리미한 크림 소스" },
      { name: "마르게리타 피자", price: "18,000원", description: "신선한 토마토와 모짜렐라" },
      { name: "리조또", price: "17,000원", description: "버섯 리조또" },
    ],
  },
};

const mockReviews = [
  {
    id: "1",
    userName: "김민수",
    userPhoto: null,
    rating: 5,
    date: "2024-12-08",
    comment: "정말 맛있었어요! 특히 비빔밥이 일품이었습니다. 재료도 신선하고 양도 푸짐해요.",
    helpful: 12,
  },
  {
    id: "2",
    userName: "이지은",
    userPhoto: null,
    rating: 4,
    date: "2024-12-05",
    comment: "분위기도 좋고 음식도 맛있었습니다. 다만 웨이팅이 조금 있었어요.",
    helpful: 8,
  },
  {
    id: "3",
    userName: "박철수",
    userPhoto: null,
    rating: 5,
    date: "2024-12-01",
    comment: "가족들과 함께 방문했는데 모두 만족했습니다. 다음에 또 올게요!",
    helpful: 15,
  },
];

export default function RestaurantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [reviews, setReviews] = useState(mockReviews);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    const id = params.id as string;
    const data = mockRestaurants[id as keyof typeof mockRestaurants];
    if (data) {
      setRestaurant(data);
    } else {
      router.push("/restaurants");
    }
  }, [params.id, router]);

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--foreground-muted)]">로딩 중...</p>
        </div>
      </div>
    );
  }

  const handleToggleFavorite = () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }
    setIsFavorite(!isFavorite);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    const review = {
      id: Date.now().toString(),
      userName: user.displayName || "익명",
      userPhoto: user.photoURL,
      rating: newReview.rating,
      date: new Date().toISOString().split("T")[0],
      comment: newReview.comment,
      helpful: 0,
    };

    setReviews([review, ...reviews]);
    setNewReview({ rating: 5, comment: "" });
    setShowReviewForm(false);
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />

      {/* Hero Section */}
      <section className="relative h-80 bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center animate-fadeIn">
          <div className="text-9xl mb-4 animate-float">{restaurant.image}</div>
          <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-semibold mb-2">
            {restaurant.categoryName}
          </span>
        </div>
        
        {/* Back Button */}
        <Link
          href="/restaurants"
          className="absolute top-4 left-4 z-20 p-3 bg-white/90 dark:bg-black/50 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-black/70 transition-all duration-200 shadow-lg"
        >
          <svg className="w-6 h-6 text-[var(--foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>

        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-4 right-4 z-20 p-3 bg-white/90 dark:bg-black/50 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-black/70 transition-all duration-200 shadow-lg"
        >
          <svg 
            className={`w-6 h-6 transition-colors ${isFavorite ? 'text-[var(--accent)] fill-current' : 'text-[var(--foreground)]'}`} 
            fill={isFavorite ? "currentColor" : "none"} 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Restaurant Info Card */}
            <div className="bg-white dark:bg-[var(--surface-elevated)] rounded-2xl p-6 sm:p-8 shadow-lg border border-[var(--border)] animate-fadeIn">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-2">
                    {restaurant.name}
                  </h1>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <span className="text-[var(--secondary)] text-xl">⭐</span>
                      <span className="text-2xl font-bold text-[var(--foreground)]">
                        {restaurant.rating}
                      </span>
                    </div>
                    <span className="text-[var(--foreground-subtle)]">•</span>
                    <span className="text-[var(--foreground-muted)]">
                      리뷰 {restaurant.reviews}개
                    </span>
                    <span className="text-[var(--foreground-subtle)]">•</span>
                    <span className="text-[var(--foreground-muted)]">
                      {restaurant.priceRange}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-[var(--foreground-muted)] text-lg mb-6">
                {restaurant.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {restaurant.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-[var(--surface)] text-[var(--foreground)] rounded-full font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 gap-4 pt-6 border-t border-[var(--border)]">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="text-sm text-[var(--foreground-muted)] mb-1">주소</p>
                    <p className="text-[var(--foreground)] font-medium">{restaurant.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📞</span>
                  <div>
                    <p className="text-sm text-[var(--foreground-muted)] mb-1">전화번호</p>
                    <a href={`tel:${restaurant.phone}`} className="text-[var(--primary)] font-medium hover:underline">
                      {restaurant.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🕐</span>
                  <div>
                    <p className="text-sm text-[var(--foreground-muted)] mb-1">영업시간</p>
                    <p className="text-[var(--foreground)] font-medium">{restaurant.hours}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📏</span>
                  <div>
                    <p className="text-sm text-[var(--foreground-muted)] mb-1">거리</p>
                    <p className="text-[var(--foreground)] font-medium">{restaurant.distance}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Card */}
            <div className="bg-white dark:bg-[var(--surface-elevated)] rounded-2xl p-6 sm:p-8 shadow-lg border border-[var(--border)] animate-fadeIn" style={{ animationDelay: "100ms" }}>
              <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">메뉴</h2>
              <div className="space-y-4">
                {restaurant.menu.map((item: any) => (
                  <div key={item.name} className="flex items-start justify-between p-4 bg-[var(--surface)] rounded-xl hover:bg-[var(--border)] transition-colors">
                    <div className="flex-1">
                      <h3 className="font-semibold text-[var(--foreground)] mb-1">{item.name}</h3>
                      <p className="text-sm text-[var(--foreground-muted)]">{item.description}</p>
                    </div>
                    <span className="text-[var(--primary)] font-bold ml-4">{item.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white dark:bg-[var(--surface-elevated)] rounded-2xl p-6 sm:p-8 shadow-lg border border-[var(--border)] animate-fadeIn" style={{ animationDelay: "200ms" }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[var(--foreground)]">
                  리뷰 ({reviews.length})
                </h2>
                {user && !showReviewForm && (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="btn px-4 py-2 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    리뷰 작성
                  </button>
                )}
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <form onSubmit={handleSubmitReview} className="mb-6 p-6 bg-[var(--surface)] rounded-xl border border-[var(--border)]">
                  <h3 className="font-semibold text-[var(--foreground)] mb-4">리뷰 작성하기</h3>
                  
                  {/* Rating */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">평점</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          className="text-3xl transition-transform hover:scale-110"
                        >
                          {star <= newReview.rating ? "⭐" : "☆"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <div className="mb-4">
                    <label htmlFor="comment" className="block text-sm font-medium text-[var(--foreground)] mb-2">
                      리뷰 내용
                    </label>
                    <textarea
                      id="comment"
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      required
                      rows={4}
                      placeholder="음식점에 대한 솔직한 리뷰를 남겨주세요..."
                      className="w-full px-4 py-3 bg-white dark:bg-[var(--surface-elevated)] border border-[var(--border)] rounded-xl outline-none focus:border-[var(--primary)] transition-colors text-[var(--foreground)] resize-none"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="btn flex-1 py-3 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      리뷰 등록
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="flex-1 py-3 border-2 border-[var(--border)] hover:border-[var(--primary)] text-[var(--foreground)] rounded-xl font-semibold transition-all duration-200"
                    >
                      취소
                    </button>
                  </div>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="p-6 bg-[var(--surface)] rounded-xl border border-[var(--border)]">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {review.userName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-[var(--foreground)]">{review.userName}</h4>
                          <span className="text-sm text-[var(--foreground-muted)]">{review.date}</span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className="text-[var(--secondary)]">
                              {i < review.rating ? "⭐" : "☆"}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-[var(--foreground-muted)] mb-3">{review.comment}</p>
                    <button className="text-sm text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors">
                      👍 도움됨 ({review.helpful})
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Map Card */}
            <div className="bg-white dark:bg-[var(--surface-elevated)] rounded-2xl p-6 shadow-lg border border-[var(--border)] sticky top-24 animate-fadeIn" style={{ animationDelay: "300ms" }}>
              <h3 className="font-semibold text-[var(--foreground)] mb-4">위치</h3>
              <div className="aspect-square bg-gradient-to-br from-[var(--surface)] to-[var(--border)] rounded-xl flex items-center justify-center mb-4">
                <div className="text-center">
                  <span className="text-6xl mb-2 block">🗺️</span>
                  <p className="text-sm text-[var(--foreground-muted)]">지도 준비 중</p>
                </div>
              </div>
              <p className="text-sm text-[var(--foreground-muted)] mb-4">{restaurant.address}</p>
              <button className="w-full py-3 bg-[var(--surface)] hover:bg-[var(--border)] text-[var(--foreground)] rounded-xl font-medium transition-colors">
                길찾기
              </button>
            </div>

            {/* Share Card */}
            <div className="bg-white dark:bg-[var(--surface-elevated)] rounded-2xl p-6 shadow-lg border border-[var(--border)] animate-fadeIn" style={{ animationDelay: "400ms" }}>
              <h3 className="font-semibold text-[var(--foreground)] mb-4">공유하기</h3>
              <div className="grid grid-cols-3 gap-3">
                <button className="p-4 bg-[var(--surface)] hover:bg-[var(--border)] rounded-xl transition-colors text-center">
                  <span className="text-3xl block mb-1">📱</span>
                  <span className="text-xs text-[var(--foreground-muted)]">카카오톡</span>
                </button>
                <button className="p-4 bg-[var(--surface)] hover:bg-[var(--border)] rounded-xl transition-colors text-center">
                  <span className="text-3xl block mb-1">🔗</span>
                  <span className="text-xs text-[var(--foreground-muted)]">링크복사</span>
                </button>
                <button className="p-4 bg-[var(--surface)] hover:bg-[var(--border)] rounded-xl transition-colors text-center">
                  <span className="text-3xl block mb-1">📧</span>
                  <span className="text-xs text-[var(--foreground-muted)]">이메일</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
