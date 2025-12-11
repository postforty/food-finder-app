'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase/client';
import { collection, getDocs } from 'firebase/firestore';

interface CategoryData {
    id: string;
    name: string;
    emoji: string;
    count: number;
}

// 이모지 매핑 (기본값)
const categoryEmojis: Record<string, string> = {
    "한식": "🍚",
    "중식": "🥟",
    "일식": "🍣",
    "양식": "🍝",
    "카페": "☕",
    "디저트": "🍰",
    "분식": "떡",
    "치킨": "🍗",
    "피자": "🍕",
    "아시아음식": "🍜",
    "패스트푸드": "🍔",
    "술집": "🍺",
    "고기요리": "🥩",
};

export default function FilteredCategories() {
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCategories() {
            try {
                // Fetch all restaurants to count categories
                // Note: For large datasets, aggregation queries are better, but for MVP this is fine.
                const querySnapshot = await getDocs(collection(db, 'restaurants'));
                const categoryMap = new Map<string, number>();

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const category = data.category;
                    if (category) {
                        // Normalize? (trim)
                        const cleanCategory = category.trim();
                        categoryMap.set(cleanCategory, (categoryMap.get(cleanCategory) || 0) + 1);
                    }
                });

                const list: CategoryData[] = [];
                categoryMap.forEach((count, name) => {
                    list.push({
                        id: name, // URL friendly? maybe encodeURIComponent
                        name: name,
                        emoji: categoryEmojis[name] || "🍽️", // Default emoji
                        count: count
                    });
                });
                
                // Sort by count desc
                list.sort((a, b) => b.count - a.count);

                setCategories(list);
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchCategories();
    }, []);

    if (loading) {
        return (
            <section className="py-24 px-4 bg-[var(--surface-elevated)]/30">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 mt-16">
                             {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-40 bg-gray-200 rounded-2xl"></div>
                             ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (categories.length === 0) {
        return null; // Don't show if no categories
    }

    return (
        <section className="py-24 px-4 bg-[var(--surface-elevated)]/30">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-6">
                        카테고리별 탐색
                    </h2>
                    <p className="text-lg text-[var(--foreground-muted)]">
                        등록된 맛집들의 카테고리입니다
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                    {categories.map((category, index) => (
                        <Link
                            key={category.id}
                            href={`/restaurants?category=${encodeURIComponent(category.name)}`}
                            className="card-hover group"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="bg-white dark:bg-[var(--surface-elevated)] rounded-2xl p-8 text-center shadow-lg border border-[var(--border)] hover:border-[var(--primary)] transition-all duration-300 h-full flex flex-col items-center justify-center relative overflow-hidden">
                                <div className={`text-5xl mb-4 group-hover:scale-110 transition-transform duration-300 inline-block`}>
                                    {category.emoji}
                                </div>
                                <h3 className="font-semibold text-lg text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors mb-1">
                                    {category.name}
                                </h3>
                                <span className="text-xs text-[var(--foreground-muted)] bg-[var(--surface)] px-2 py-1 rounded-full">
                                    {category.count}곳
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
