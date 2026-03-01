// app/seller/listings/[id]/need-more-info/page.tsx
// S-19 – Listing Need More Info
// Shows inspector's info request and allows seller to respond or navigate to Inspection Response chat

'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { findSellerListingById } from '@/app/mocks/sellerListingDetail';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function NeedMoreInfoPage({ params }: PageProps) {
    const router = useRouter();
    const { id } = use(params);
    const listing = findSellerListingById(Number(id));

    const [additionalInfo, setAdditionalInfo] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

    if (!listing || listing.status !== 'NEED_MORE_INFO' || !listing.infoRequest) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-5xl mb-4">🔍</div>
                    <h1 className="text-xl font-bold text-gray-800 mb-2">Không tìm thấy yêu cầu bổ sung</h1>
                    <Link href="/seller/my-listings" className="text-blue-600 hover:underline text-sm">
                        ← Quay lại Tin Đăng
                    </Link>
                </div>
            </div>
        );
    }

    const { infoRequest } = listing;

    const toggleCheck = (index: number) => {
        setCheckedItems((prev) => {
            const next = new Set(prev);
            if (next.has(index)) next.delete(index);
            else next.add(index);
            return next;
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitted(true);
        }, 1000);
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center max-w-md w-full">
                    <div className="text-5xl mb-4">✅</div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Đã Gửi Thành Công!</h2>
                    <p className="text-gray-500 text-sm mb-6">
                        Thông tin bổ sung đã được gửi đến Inspector. Chúng tôi sẽ xem xét và phản hồi sớm nhất.
                    </p>
                    <div className="flex flex-col gap-3">
                        <Link
                            href={`/seller/listings/${listing.id}`}
                            className="px-6 py-3 bg-[#FF8A00] text-white rounded-lg font-semibold hover:bg-[#FF7A00] transition text-sm"
                        >
                            Xem Chi Tiết Tin Đăng
                        </Link>
                        <Link
                            href="/seller/my-listings"
                            className="px-6 py-3 border border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition text-sm"
                        >
                            Quay Lại Tin Đăng
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
            <div className="max-w-2xl mx-auto">
                {/* Back nav */}
                <div className="flex items-center gap-3 mb-6">
                    <button
                        onClick={() => router.back()}
                        className="text-gray-600 hover:text-gray-900 transition text-sm"
                    >
                        ← Quay lại
                    </button>
                </div>

                {/* Listing info header */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl">📋</div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">Yêu Cầu Bổ Sung Thông Tin</h1>
                            <p className="text-sm text-gray-500">{listing.brand} {listing.model}</p>
                        </div>
                    </div>
                </div>

                {/* Inspector Request Card */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-5">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-blue-700 font-bold text-sm">🔍 Từ Inspector:</span>
                        <span className="text-blue-600 text-sm font-medium">{infoRequest.requestedBy}</span>
                        <span className="text-gray-400 text-xs ml-auto">
                            {new Date(infoRequest.requestedDate).toLocaleDateString('vi-VN')}
                        </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-4">{infoRequest.message}</p>
                    <p className="text-sm font-semibold text-gray-800 mb-3">Các mục cần bổ sung:</p>
                    <div className="space-y-2">
                        {infoRequest.requiredItems.map((item, i) => (
                            <label key={i} className="flex items-start gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={checkedItems.has(i)}
                                    onChange={() => toggleCheck(i)}
                                    className="mt-0.5 w-4 h-4 rounded border-gray-400 accent-blue-600"
                                />
                                <span className={`text-sm leading-relaxed ${checkedItems.has(i) ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                                    {item}
                                </span>
                            </label>
                        ))}
                    </div>

                    {/* Navigate to Inspection Response (S-42) */}
                    <div className="mt-5 pt-4 border-t border-blue-200">
                        <p className="text-xs text-blue-600 mb-2">Cần thảo luận thêm với Inspector?</p>
                        <Link
                            href={`/seller/inspection-response?listingId=${listing.id}`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                        >
                            💬 Mở Kênh Phản Hồi Inspector →
                        </Link>
                    </div>
                </div>

                {/* Submission Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h2 className="font-bold text-gray-900 mb-4">📝 Cập Nhật Thông Tin</h2>
                    <p className="text-sm text-gray-500 mb-4">
                        Mô tả các thông tin bổ sung bạn đã cung cấp hoặc cần làm rõ.
                    </p>
                    <textarea
                        value={additionalInfo}
                        onChange={(e) => setAdditionalInfo(e.target.value)}
                        placeholder="Ví dụ: Tôi đã cung cấp số serial, hóa đơn mua hàng, và thêm ảnh rõ hơn cho phần groupset..."
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8A00] text-sm resize-none mb-4"
                    />

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={isSubmitting || additionalInfo.trim().length === 0}
                            className="flex-1 px-6 py-3 bg-[#FF8A00] text-white rounded-lg font-semibold hover:bg-[#FF7A00] transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                            {isSubmitting ? 'Đang gửi...' : '🚀 Gửi Thông Tin Bổ Sung'}
                        </button>
                        <Link
                            href={`/seller/edit-listing/${listing.id}`}
                            className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition text-sm text-center"
                        >
                            ✏️ Chỉnh Sửa Tin
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
