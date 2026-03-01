// app/seller/listings/[id]/page.tsx
// S-15 – Listing Detail (Seller View)
// Shows full listing info with approval status, inspection status, related transactions, and CTAs

'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { StatusBadge } from '@/app/components/ui/StatusBadge';
import { findSellerListingById } from '@/app/mocks/sellerListingDetail';
import { formatPrice } from '@/app/utils/format';

interface PageProps {
    params: Promise<{ id: string }>;
}

const INSPECTION_LABEL: Record<string, string> = {
    NOT_STARTED: '⏸️ Chưa bắt đầu',
    IN_PROGRESS: '🔍 Đang kiểm tra',
    COMPLETED: '✅ Đã hoàn thành',
};

export default function SellerListingDetailPage({ params }: PageProps) {
    const router = useRouter();
    const { id } = use(params);
    const listing = findSellerListingById(Number(id));

    if (!listing) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">😞</div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy tin đăng</h1>
                    <Link href="/seller/my-listings" className="text-blue-600 hover:underline">
                        ← Quay lại Tin Đăng Của Tôi
                    </Link>
                </div>
            </div>
        );
    }

    const canEdit = listing.status === 'DRAFT' || listing.status === 'REJECT' || listing.status === 'NEED_MORE_INFO';
    const canResubmit = listing.status === 'REJECT';
    const needsInfo = listing.status === 'NEED_MORE_INFO';

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
            <div className="max-w-5xl mx-auto">
                {/* Back nav */}
                <div className="flex items-center gap-3 mb-6">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition text-sm font-medium"
                    >
                        ← Quay lại
                    </button>
                    <span className="text-gray-400">/</span>
                    <Link href="/seller/my-listings" className="text-sm text-gray-500 hover:text-blue-600 transition">
                        Tin Đăng Của Tôi
                    </Link>
                    <span className="text-gray-400">/</span>
                    <span className="text-sm text-gray-800 font-medium truncate">{listing.brand} {listing.model}</span>
                </div>

                {/* Layout: 2 columns on desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left – Images + basic info */}
                    <div className="lg:col-span-2 space-y-5">
                        {/* Image gallery */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            {listing.images.length > 0 ? (
                                <div className="grid grid-cols-3 gap-1 p-1">
                                    {listing.images.map((img, i) => (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            key={i}
                                            src={img}
                                            alt={`Ảnh ${i + 1}`}
                                            className={`object-cover rounded ${i === 0 ? 'col-span-2 row-span-2 h-64' : 'h-32'} w-full`}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="h-48 flex items-center justify-center bg-gray-100 text-gray-400">
                                    <span className="text-4xl">🚲</span>
                                </div>
                            )}
                        </div>

                        {/* Bike Details */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                            <div className="flex items-start justify-between mb-4">
                                <h1 className="text-2xl font-bold text-gray-900">{listing.title}</h1>
                                <StatusBadge status={listing.status} size="lg" showLabel />
                            </div>
                            <p className="text-3xl font-bold text-[#FF8A00] mb-4">
                                {formatPrice(listing.price)}
                            </p>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 text-sm">
                                {[
                                    { label: 'Thương hiệu', value: listing.brand },
                                    { label: 'Dòng xe', value: listing.model },
                                    { label: 'Năm', value: String(listing.year) },
                                    { label: 'Danh mục', value: listing.category },
                                    { label: 'Tình trạng', value: listing.condition === 'new' ? 'Mới' : 'Đã dùng' },
                                    { label: 'Địa điểm', value: listing.location },
                                ].map((item) => (
                                    <div key={item.label}>
                                        <p className="text-gray-500 text-xs mb-0.5">{item.label}</p>
                                        <p className="font-semibold text-gray-800">{item.value}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-100 pt-4">
                                <p className="text-sm font-semibold text-gray-700 mb-2">Mô tả</p>
                                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                                    {listing.description || '(Chưa có mô tả)'}
                                </p>
                            </div>

                            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
                                <span>👁 {listing.views} lượt xem</span>
                                <span>💬 {listing.inquiries} yêu cầu</span>
                                <span>📦 {listing.shipping ? 'Có ship' : 'Không ship'}</span>
                            </div>
                        </div>

                        {/* Rejection Reason */}
                        {listing.status === 'REJECT' && listing.rejectionReason && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                                <p className="font-bold text-red-700 mb-2">❌ Lý Do Từ Chối</p>
                                <p className="text-sm text-gray-700">{listing.rejectionReason}</p>
                            </div>
                        )}

                        {/* Need More Info */}
                        {needsInfo && listing.infoRequest && (
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                                <p className="font-bold text-blue-700 mb-2">📋 Yêu Cầu Bổ Sung Thông Tin</p>
                                <p className="text-sm text-gray-600 mb-3">{listing.infoRequest.message}</p>
                                <ul className="space-y-1.5 mb-4">
                                    {listing.infoRequest.requiredItems.map((item, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                            <span className="text-blue-500 mt-0.5">•</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href={`/seller/inspection-response?listingId=${listing.id}`}
                                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                                >
                                    Phản Hồi Inspector →
                                </Link>
                            </div>
                        )}

                        {/* Approval History */}
                        {listing.approvalHistory.length > 0 && (
                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                                <h2 className="font-bold text-gray-900 mb-4">📜 Lịch Sử Duyệt</h2>
                                <div className="space-y-3">
                                    {listing.approvalHistory.map((entry, i) => (
                                        <div key={i} className="flex items-start gap-3 text-sm border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                                            <span className="text-gray-400 text-xs mt-0.5 w-24 flex-shrink-0">
                                                {new Date(entry.date).toLocaleDateString('vi-VN')}
                                            </span>
                                            <StatusBadge status={entry.result} size="sm" showLabel />
                                            <span className="text-gray-600 flex-1">{entry.note}</span>
                                            {entry.reviewedBy && (
                                                <span className="text-gray-400 text-xs">bởi {entry.reviewedBy}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right – Status panel */}
                    <div className="space-y-5">
                        {/* Inspection Status */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                            <h2 className="font-bold text-gray-900 mb-3">🔍 Trạng Thái Kiểm Tra</h2>
                            <p className="text-sm font-medium text-gray-700">
                                {INSPECTION_LABEL[listing.inspectionStatus] ?? listing.inspectionStatus}
                            </p>
                            <Link
                                href="/seller/listing-status"
                                className="mt-3 block text-center text-sm text-blue-600 hover:underline"
                            >
                                Xem Vòng Đời →
                            </Link>
                        </div>

                        {/* Related Transactions */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                            <h2 className="font-bold text-gray-900 mb-3">💰 Giao Dịch Liên Quan</h2>
                            {listing.relatedTransactions.length === 0 ? (
                                <p className="text-sm text-gray-400">Chưa có giao dịch nào.</p>
                            ) : (
                                <div className="space-y-3">
                                    {listing.relatedTransactions.map((tx) => (
                                        <div key={tx.id} className="text-sm border border-gray-100 rounded-lg p-3">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-medium text-gray-800">{tx.buyerName}</span>
                                                <StatusBadge status={tx.status} size="sm" />
                                            </div>
                                            <p className="text-[#FF8A00] font-bold">{formatPrice(tx.amount)}</p>
                                            <p className="text-xs text-gray-400">
                                                {new Date(tx.createdDate).toLocaleDateString('vi-VN')}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-3">
                            <h2 className="font-bold text-gray-900 mb-1">Thao Tác</h2>
                            {canEdit && (
                                <Link
                                    href={`/seller/edit-listing/${listing.id}`}
                                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-[#FF8A00] text-white rounded-lg text-sm font-semibold hover:bg-[#FF7A00] transition"
                                >
                                    ✏️ Chỉnh Sửa Tin
                                </Link>
                            )}
                            {canResubmit && (
                                <Link
                                    href={`/seller/edit-listing/${listing.id}`}
                                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition"
                                >
                                    🔄 Nộp Lại
                                </Link>
                            )}
                            {needsInfo && (
                                <Link
                                    href={`/seller/listings/${listing.id}/need-more-info`}
                                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                                >
                                    📋 Bổ Sung Thông Tin
                                </Link>
                            )}
                            <Link
                                href="/seller/listing-status"
                                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
                            >
                                🔄 Trạng Thái Vòng Đời
                            </Link>
                            <Link
                                href="/seller/my-listings"
                                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
                            >
                                ← Tất Cả Tin Đăng
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
