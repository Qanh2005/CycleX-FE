// app/seller/edit-listing/[id]/page.tsx
// S-16 – Edit Listing Page

'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { findSellerListingById } from '@/app/mocks/sellerListingDetail';
import EditListingForm from './components/EditListingForm';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function EditListingPage({ params }: PageProps) {
    const router = useRouter();
    const { id } = use(params);
    const listing = findSellerListingById(Number(id));

    if (!listing) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6">
                <div className="text-6xl mb-4">😞</div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy tin đăng</h1>
                <Link href="/seller/my-listings" className="text-blue-600 hover:underline">
                    ← Quay lại Tin Đăng Của Tôi
                </Link>
            </div>
        );
    }

    const canEdit = listing.status === 'DRAFT' || listing.status === 'REJECT' || listing.status === 'NEED_MORE_INFO';

    if (!canEdit) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                        ⚠️
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Không Thể Chỉnh Sửa</h2>
                    <p className="text-gray-500 text-sm mb-6">
                        Tin đăng này đang ở trạng thái <strong>{listing.status}</strong> nên không thể chỉnh sửa. Chỉ có thể chỉnh sửa bản nháp, tin bị từ chối hoặc tin yêu cầu bổ sung thông tin.
                    </p>
                    <Link
                        href={`/seller/listings/${listing.id}`}
                        className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        Xem Chi Tiết
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 rounded-full hover:bg-black/5 flex items-center justify-center transition"
                    >
                        ←
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {listing.status === 'REJECT' ? 'Sửa Lỗi Tin Đăng' : 'Chỉnh Sửa Tin Đăng'}
                        </h1>
                        <p className="text-gray-500 mt-1">Cập nhật thông tin về chiếc xe của bạn</p>
                    </div>
                </div>

                <EditListingForm listing={listing} />
            </div>
        </div>
    );
}
