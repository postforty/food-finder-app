"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase/client";
import {
  collection,
  getDocs,
  orderBy,
  query,
  doc,
  deleteDoc,
} from "firebase/firestore";

// 데이터 타입 정의 (나중에 별도 파일로 분리 가능)
interface Restaurant {
  id: string;
  name: string;
  category: string;
  address: string;
  rating?: number;
  imageUrl?: string;
  createdAt?: any;
}

export default function AdminRestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    restaurant: Restaurant | null;
  }>({
    isOpen: false,
    restaurant: null,
  });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const q = query(
          collection(db, "restaurants"),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const list: Restaurant[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          list.push({
            id: doc.id,
            name: data.name,
            category: data.category,
            address: data.address,
            rating: data.rating,
            imageUrl: data.imageUrl,
            createdAt: data.createdAt,
          });
        });
        setRestaurants(list);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRestaurants();
  }, []);

  // 삭제 확인 모달 열기
  const openDeleteModal = (restaurant: Restaurant) => {
    setDeleteModal({ isOpen: true, restaurant });
  };

  // 삭제 확인 모달 닫기
  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, restaurant: null });
  };

  // 맛집 삭제 함수
  const handleDeleteRestaurant = async () => {
    if (!deleteModal.restaurant) return;

    setDeleting(true);
    try {
      // Firestore에서 문서 삭제
      await deleteDoc(doc(db, "restaurants", deleteModal.restaurant.id));

      // 로컬 상태에서도 제거
      setRestaurants((prev) =>
        prev.filter((r) => r.id !== deleteModal.restaurant!.id)
      );

      // 모달 닫기
      closeDeleteModal();

      alert("맛집이 성공적으로 삭제되었습니다.");
    } catch (error) {
      console.error("Error deleting restaurant:", error);
      alert("삭제 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setDeleting(false);
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
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900">맛집 관리</h1>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium shadow-sm"
            title="홈으로 이동"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            홈으로
          </Link>
        </div>
        <Link
          href="/admin/restaurants/register"
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-sm flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          맛집 등록하기
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                이미지
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                이름
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                카테고리
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                주소
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                관리
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {restaurants.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-10 text-center text-gray-500"
                >
                  등록된 맛집이 없습니다.
                </td>
              </tr>
            ) : (
              restaurants.map((rest) => (
                <tr key={rest.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {rest.imageUrl ? (
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={rest.imageUrl}
                        alt={rest.name}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                        No Img
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {rest.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                      {rest.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                    {rest.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/admin/restaurants/${rest.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      수정
                    </Link>
                    <button
                      onClick={() => openDeleteModal(rest)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 삭제 확인 모달 */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">
                  맛집 삭제 확인
                </h3>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-500">
                <strong>{deleteModal.restaurant?.name}</strong>을(를) 정말
                삭제하시겠습니까?
              </p>
              <p className="text-sm text-red-600 mt-2">
                이 작업은 되돌릴 수 없습니다.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={closeDeleteModal}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
              >
                취소
              </button>
              <button
                onClick={handleDeleteRestaurant}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50 flex items-center"
              >
                {deleting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    삭제 중...
                  </>
                ) : (
                  "삭제"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
