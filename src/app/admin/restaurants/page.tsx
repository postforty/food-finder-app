'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase/client';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

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

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const q = query(collection(db, 'restaurants'), orderBy('createdAt', 'desc'));
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
        <h1 className="text-3xl font-bold text-gray-900">맛집 관리</h1>
        <Link 
          href="/admin/restaurants/register" 
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-sm flex items-center"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            맛집 등록하기
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이미지</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이름</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">카테고리</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">주소</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {restaurants.length === 0 ? (
                <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                        등록된 맛집이 없습니다.
                    </td>
                </tr>
            ) : (
                restaurants.map((rest) => (
                <tr key={rest.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                    {rest.imageUrl ? (
                        <img className="h-10 w-10 rounded-full object-cover" src={rest.imageUrl} alt={rest.name} />
                    ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">No Img</div>
                    )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{rest.name}</div>
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
                    <Link href={`/admin/restaurants/${rest.id}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-4">수정</Link>
                    <button className="text-red-600 hover:text-red-900">삭제</button>
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
