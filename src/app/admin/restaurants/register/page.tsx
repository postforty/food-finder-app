'use client'

import { useState } from 'react';
import { crawlAndSaveRestaurant } from '@/app/actions/restaurant-actions';
import Link from 'next/link';

export default function RegisterRestaurantPage() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const res = await crawlAndSaveRestaurant(url);
            if (res.success) {
                setResult(res.data);
                setUrl(''); 
            } else {
                setError(res.error);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-3xl">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900">맛집 등록</h1>
                    <Link href="/admin/restaurants" className="text-sm text-gray-500 hover:text-gray-900 underline">
                        목록으로 돌아가기
                    </Link>
                </div>
                
                <div className="bg-white shadow-xl rounded-2xl p-8 mb-8 border border-gray-100">
                    <p className="text-gray-600 mb-6">
                        네이버 지도의 식당 상세 페이지 URL을 입력하세요. 자동으로 정보를 수집하여 등록합니다.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">네이버 지도 URL</label>
                            <input 
                                type="text" 
                                value={url} 
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://map.naver.com/p/entry/place/..."
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black"
                                required 
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
                                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
                            }`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    크롤링 및 저장 중...
                                </span>
                            ) : '등록하기'}
                        </button>
                    </form>
    
                    {error && (
                        <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                            <strong>오류 발생:</strong> {error}
                        </div>
                    )}
                </div>
    
                {result && (
                    <div className="bg-white shadow-xl rounded-2xl p-8 animate-fadeIn text-gray-800 border border-green-100">
                        <div className="flex items-center mb-6 pb-4 border-b border-gray-100">
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-green-800">성공적으로 등록되었습니다!</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                            <div>
                                <span className="font-semibold block text-gray-500 mb-1">이름</span>
                                <span className="text-xl font-bold text-gray-900">{result.name}</span>
                            </div>
                            <div>
                                <span className="font-semibold block text-gray-500 mb-1">카테고리</span>
                                <span className="text-lg text-gray-800">{result.category}</span>
                            </div>
                            <div className="col-span-1 md:col-span-2">
                                 <span className="font-semibold block text-gray-500 mb-1">주소</span>
                                 <span className="text-gray-800">{result.address}</span>
                            </div>
                             <div className="col-span-1 md:col-span-2">
                                 <span className="font-semibold block text-gray-500 mb-1">설명</span>
                                 <p className="whitespace-pre-wrap text-gray-700 p-3 bg-gray-50 rounded-lg border border-gray-100 max-h-40 overflow-y-auto leading-relaxed">{result.description}</p>
                            </div>
                             <div className="col-span-1 md:col-span-2">
                                 <span className="font-semibold block text-gray-500 mb-2">이미지 미리보기</span>
                                 {result.imageUrl ? (
                                    <div className="relative w-full h-80 bg-gray-100 rounded-xl overflow-hidden shadow-inner">
                                        <img 
                                            src={result.imageUrl} 
                                            alt={result.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
                                            }}
                                        />
                                    </div>
                                 ) : (
                                    <div className="h-20 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-300 text-gray-400">
                                        이미지 없음
                                    </div>
                                 )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
