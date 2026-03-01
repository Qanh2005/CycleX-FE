// app/seller/draft-listings/page.tsx
// S-18 – Draft Listings
// Lists all draft listings, allows editing, submitting, and deleting drafts

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import { StatusBadge } from '@/app/components/ui/StatusBadge';
import {
  MOCK_SELLER_LISTINGS,
  type SellerListingDetail,
} from '@/app/mocks/sellerListingDetail';
import { formatPrice } from '@/app/utils/format';

const DraftListingsPage: React.FC = () => {
  const router = useRouter();
  const { isLoggedIn, isLoading } = useAuth();

  // Local in-memory draft list (resets on reload — mock only)
  const [drafts, setDrafts] = useState<SellerListingDetail[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [submittingId, setSubmittingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/login?returnUrl=/seller/draft-listings');
    }
  }, [isLoggedIn, isLoading, router]);

  // Load drafts from mock on mount
  useEffect(() => {
    setDrafts(MOCK_SELLER_LISTINGS.filter((l) => l.status === 'DRAFT'));
  }, []);

  if (isLoading) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center">
        <p className="text-gray-600">Đang tải...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center">
        <p className="text-gray-600">Đang chuyển hướng đến trang đăng nhập...</p>
      </div>
    );
  }

  const handleDelete = (id: number) => {
    setDeletingId(id);
    setTimeout(() => {
      setDrafts((prev) => prev.filter((d) => d.id !== id));
      setDeletingId(null);
      setConfirmDeleteId(null);
    }, 600);
  };

  const handleSubmit = (id: number) => {
    setSubmittingId(id);
    setTimeout(() => {
      // In real app: call API to submit for review
      setDrafts((prev) => prev.filter((d) => d.id !== id));
      setSubmittingId(null);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg hover:bg-white/80 transition text-gray-600"
            >
              ←
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bản Nháp</h1>
              <p className="text-gray-500 text-sm mt-1">
                {drafts.length} tin chưa hoàn thành
              </p>
            </div>
          </div>
          <Link
            href="/seller/create-listing"
            className="px-5 py-2.5 bg-[#FF8A00] text-white rounded-lg font-semibold hover:bg-[#FF7A00] transition text-sm"
          >
            ➕ Đăng Tin Mới
          </Link>
        </div>

        {/* Draft List */}
        {drafts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="text-5xl mb-4">📝</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Không có bản nháp nào</h2>
            <p className="text-gray-500 mb-6">Bắt đầu tạo tin đăng mới và lưu nháp bất cứ lúc nào.</p>
            <Link
              href="/seller/create-listing"
              className="inline-block px-6 py-3 bg-[#FF8A00] text-white rounded-lg font-semibold hover:bg-[#FF7A00] transition"
            >
              Tạo Tin Mới
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden"
              >
                {/* Image placeholder */}
                <div className="relative h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  {draft.images.length > 0 ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={draft.images[0]}
                      alt={`${draft.brand} ${draft.model}`}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  )}
                  <div className="absolute top-3 right-3">
                    <StatusBadge status="DRAFT" showLabel />
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-1 truncate">
                    {draft.brand} {draft.model}
                  </h3>
                  <p className="text-sm text-gray-500 mb-1">{draft.category} • {draft.condition}</p>
                  <p className="text-[#FF8A00] font-bold text-lg mb-3">
                    {formatPrice(draft.price)}
                  </p>
                  <p className="text-xs text-gray-400 mb-4">
                    Đã lưu: {new Date(draft.updatedDate).toLocaleDateString('vi-VN')}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2 flex-col">
                    <div className="flex gap-2">
                      <Link
                        href={`/seller/edit-listing/${draft.id}`}
                        className="flex-1 px-3 py-2 bg-[#FF8A00] text-white rounded-lg text-sm font-semibold hover:bg-[#FF7A00] transition text-center"
                      >
                        ✏️ Tiếp Tục
                      </Link>
                      <button
                        onClick={() => setConfirmDeleteId(draft.id)}
                        className="px-3 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 transition"
                        disabled={deletingId === draft.id}
                      >
                        {deletingId === draft.id ? '...' : '🗑️'}
                      </button>
                    </div>
                    <button
                      onClick={() => handleSubmit(draft.id)}
                      disabled={submittingId === draft.id}
                      className="w-full px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submittingId === draft.id ? 'Đang gửi...' : '🚀 Gửi Duyệt'}
                    </button>
                  </div>
                </div>

                {/* Delete confirmation */}
                {confirmDeleteId === draft.id && (
                  <div className="px-4 pb-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
                      <p className="text-red-700 font-medium mb-2">Xác nhận xóa bản nháp này?</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(draft.id)}
                          className="flex-1 px-3 py-1.5 bg-red-600 text-white rounded text-xs font-semibold hover:bg-red-700 transition"
                        >
                          Xóa
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="flex-1 px-3 py-1.5 border border-gray-300 text-gray-700 rounded text-xs font-semibold hover:bg-gray-50 transition"
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DraftListingsPage;
