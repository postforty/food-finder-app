"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  crawlAndSaveRestaurant,
  getRestaurant,
  updateRestaurant,
} from "@/app/actions/restaurant-actions"; // Server Actions

export default function EditRestaurantPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [crawling, setCrawling] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    address: "",
    description: "",
    phone: "",
    businessHours: "",
    mapUrl: "",
    imageUrl: "",
    rating: 0,
    reviews: "",
    blogReviews: "",
  });

  useEffect(() => {
    if (!id) return;
    async function loadData() {
      try {
        // Fetch data using server action to ensure we get Firestore data correctly
        // Note: Client SDK could be used too, but server action is cleaner with Admin SDK setup
        const res = await getRestaurant(id);
        if (res.success && res.data) {
          setFormData({
            name: res.data.name || "",
            category: res.data.category || "",
            address: res.data.address || "",
            description: res.data.description || "",
            phone: res.data.phone || "",
            businessHours: res.data.businessHours || "",
            mapUrl: res.data.mapUrl || "",
            imageUrl: res.data.imageUrl || "",
            rating: res.data.rating || 0,
            reviews: res.data.reviews?.toString() || "",
            blogReviews: res.data.blogReviews?.toString() || "",
          });
        } else {
          setError("데이터를 불러오는데 실패했습니다.");
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      const submitData = {
        ...formData,
        rating: Number(formData.rating) || 0,
        reviews: Number(formData.reviews) || 0,
        blogReviews: Number(formData.blogReviews) || 0,
      };
      const res = await updateRestaurant(id, submitData);
      if (res.success) {
        setSuccessMessage("성공적으로 수정되었습니다.");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError(res.error);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleReCrawl = async () => {
    if (!formData.mapUrl) {
      setError("네이버 지도 URL이 없습니다.");
      return;
    }
    if (
      !confirm(
        "정말 다시 크롤링하시겠습니까? 기존 정보가 덮어씌워질 수 있습니다."
      )
    )
      return;

    setCrawling(true);
    setError("");
    setSuccessMessage("");

    try {
      const res = await crawlAndSaveRestaurant(formData.mapUrl, id);
      if (res.success) {
        setFormData((prev) => ({
          ...prev,
          ...res.data,
        }));
        setSuccessMessage("크롤링하여 정보를 업데이트했습니다.");
      } else {
        setError(res.error);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCrawling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center p-6">
      <div className="w-full max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">맛집 정보 수정</h1>
          <Link
            href="/admin/restaurants"
            className="text-sm text-gray-500 hover:text-gray-900 underline"
          >
            목록으로 돌아가기
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Image & Crawl */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-700 mb-4">이미지</h3>
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 mb-4 flex items-center justify-center">
                {formData.imageUrl ? (
                  <img
                    src={formData.imageUrl}
                    alt={formData.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400">이미지 없음</span>
                )}
              </div>
              <div className="mb-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  이미지 URL
                </label>
                <input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-700 mb-4">재크롤링</h3>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                URL을 변경했거나 최신 정보로 업데이트하려면 아래 버튼을
                누르세요.
              </p>
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  네이버 지도 URL
                </label>
                <input
                  type="text"
                  name="mapUrl"
                  value={formData.mapUrl}
                  onChange={handleChange}
                  placeholder="https://map.naver.com/..."
                  className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-orange-500"
                />
              </div>
              <button
                type="button"
                onClick={handleReCrawl}
                disabled={crawling}
                className={`w-full py-2 px-4 rounded-lg text-white font-medium text-sm transition-colors ${
                  crawling ? "bg-gray-400" : "bg-gray-800 hover:bg-gray-900"
                }`}
              >
                {crawling ? "크롤링 중..." : "URL로 정보 덮어쓰기"}
              </button>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <form onSubmit={handleManualSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      이름
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      카테고리
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    주소
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    설명
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      전화번호
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      영업시간
                    </label>
                    <input
                      type="text"
                      name="businessHours"
                      value={formData.businessHours}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      방문자 리뷰 수
                    </label>
                    <input
                      type="text"
                      name="reviews"
                      value={formData.reviews}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      블로그 리뷰 수
                    </label>
                    <input
                      type="text"
                      name="blogReviews"
                      value={formData.blogReviews}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end space-x-3">
                  <Link
                    href="/admin/restaurants"
                    className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    취소
                  </Link>
                  <button
                    type="submit"
                    disabled={saving}
                    className={`px-5 py-2.5 rounded-lg text-white font-medium shadow-md transition-all ${
                      saving
                        ? "bg-orange-300 cursor-not-allowed"
                        : "bg-orange-500 hover:bg-orange-600 hover:shadow-lg"
                    }`}
                  >
                    {saving ? "저장 중..." : "수정사항 저장"}
                  </button>
                </div>
              </form>
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg animate-fadeIn">
                <strong>오류:</strong> {error}
              </div>
            )}
            {successMessage && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg animate-fadeIn">
                <strong>성공:</strong> {successMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
