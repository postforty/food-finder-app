"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function NewRestaurantPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "korean",
    address: "",
    phone: "",
    description: "",
    image: "🍽️",
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/admin/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--foreground-muted)]">로딩 중...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // TODO: Firestore에 저장
    console.log("Saving restaurant:", formData);

    // 임시: 2초 후 대시보드로 이동
    setTimeout(() => {
      router.push("/admin/dashboard");
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const emojiOptions = ["🍽️", "🍲", "🍣", "🍝", "🍕", "🍔", "🍜", "🥘", "🍱", "🥗", "🍛", "🍤", "🥟", "☕", "🍰"];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center shadow-lg">
                <span className="text-2xl">🍽️</span>
              </div>
              <span className="text-xl font-bold gradient-text hidden sm:block">
                Food Finder Admin
              </span>
            </Link>

            <Link
              href="/admin/dashboard"
              className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
            >
              ← 대시보드로 돌아가기
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-2">
            새 음식점 추가
          </h1>
          <p className="text-[var(--foreground-muted)]">
            음식점 정보를 입력하여 새로운 음식점을 등록하세요
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info Card */}
          <div className="bg-white dark:bg-[var(--surface-elevated)] rounded-2xl p-6 shadow-md border border-[var(--border)]">
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-6">기본 정보</h2>
            
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  음식점 이름 <span className="text-[var(--error)]">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="예: 맛있는 한식당"
                  className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl outline-none focus:border-[var(--primary)] transition-colors text-[var(--foreground)]"
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  카테고리 <span className="text-[var(--error)]">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl outline-none focus:border-[var(--primary)] transition-colors text-[var(--foreground)] cursor-pointer"
                >
                  <option value="korean">한식</option>
                  <option value="chinese">중식</option>
                  <option value="japanese">일식</option>
                  <option value="western">양식</option>
                  <option value="cafe">카페</option>
                  <option value="dessert">디저트</option>
                </select>
              </div>

              {/* Image Emoji */}
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  이미지 이모지
                </label>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                  {emojiOptions.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setFormData({ ...formData, image: emoji })}
                      className={`p-3 text-3xl rounded-xl border-2 transition-all duration-200 ${
                        formData.image === emoji
                          ? "border-[var(--primary)] bg-[var(--primary)]/10 scale-110"
                          : "border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--surface)]"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info Card */}
          <div className="bg-white dark:bg-[var(--surface-elevated)] rounded-2xl p-6 shadow-md border border-[var(--border)]">
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-6">연락처 정보</h2>
            
            <div className="space-y-4">
              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  주소 <span className="text-[var(--error)]">*</span>
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="예: 서울시 강남구 테헤란로 123"
                  className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl outline-none focus:border-[var(--primary)] transition-colors text-[var(--foreground)]"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  전화번호 <span className="text-[var(--error)]">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="예: 02-1234-5678"
                  className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl outline-none focus:border-[var(--primary)] transition-colors text-[var(--foreground)]"
                />
              </div>
            </div>
          </div>

          {/* Description Card */}
          <div className="bg-white dark:bg-[var(--surface-elevated)] rounded-2xl p-6 shadow-md border border-[var(--border)]">
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-6">상세 정보</h2>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-[var(--foreground)] mb-2">
                설명
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="음식점에 대한 간단한 설명을 입력하세요..."
                className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl outline-none focus:border-[var(--primary)] transition-colors text-[var(--foreground)] resize-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={isSaving}
              className="btn flex-1 py-4 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>저장 중...</span>
                </>
              ) : (
                <>
                  <span>✅</span>
                  <span>음식점 추가</span>
                </>
              )}
            </button>

            <Link
              href="/admin/dashboard"
              className="flex-1 py-4 text-center border-2 border-[var(--border)] hover:border-[var(--primary)] text-[var(--foreground)] rounded-xl font-semibold transition-all duration-200 hover:bg-[var(--surface)]"
            >
              취소
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
