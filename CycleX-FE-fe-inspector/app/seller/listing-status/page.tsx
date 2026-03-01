// app/seller/listing-status/page.tsx
// S-17 – Listing Status View
// Shows lifecycle timeline, approval history, inspector notes, status-based CTAs

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { StatusBadge } from '@/app/components/ui/StatusBadge';
import { MOCK_SELLER_LISTINGS, type ApprovalStatus } from '@/app/mocks/sellerListingDetail';
import { formatPrice } from '@/app/utils/format';

const STATUS_CONFIG: Record<ApprovalStatus | string, { label: string; color: string }> = {
  DRAFT: { label: 'Bản Nháp', color: 'bg-gray-100 text-gray-700' },
  PENDING: { label: 'Chờ Duyệt', color: 'bg-yellow-100 text-yellow-700' },
  APPROVE: { label: 'Đã Duyệt', color: 'bg-green-100 text-green-700' },
  ACTIVE: { label: 'Hoạt Động', color: 'bg-green-100 text-green-700' },
  REJECT: { label: 'Bị Từ Chối', color: 'bg-red-100 text-red-700' },
  NEED_MORE_INFO: { label: 'Cần Bổ Sung', color: 'bg-blue-100 text-blue-700' },
};

const LIFECYCLE_STEPS: ApprovalStatus[] = ['DRAFT', 'PENDING', 'APPROVE'];

function getLifecycleIndex(status: ApprovalStatus): number {
  if (status === 'APPROVE') return 2;
  if (status === 'PENDING' || status === 'NEED_MORE_INFO') return 1;
  if (status === 'REJECT') return 2; // end-state at same level as APPROVE
  return 0;
}

const ListingStatusPage: React.FC = () => {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const stats = {
    active: MOCK_SELLER_LISTINGS.filter((l) => l.status === 'APPROVE').length,
    pending: MOCK_SELLER_LISTINGS.filter((l) => l.status === 'PENDING').length,
    rejected: MOCK_SELLER_LISTINGS.filter((l) => l.status === 'REJECT').length,
    draft: MOCK_SELLER_LISTINGS.filter((l) => l.status === 'DRAFT').length,
    needInfo: MOCK_SELLER_LISTINGS.filter((l) => l.status === 'NEED_MORE_INFO').length,
  };

  const toggleExpand = (id: number) =>
    setExpandedId((prev) => (prev === id ? null : id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-white/80 transition text-gray-600"
          >
            ←
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Trạng Thái Tin Đăng</h1>
            <p className="text-gray-500 text-sm mt-1">Theo dõi vòng đời và lịch sử duyệt của mọi tin đăng</p>
          </div>
        </div>

        {/* Quick link back to My Listings */}
        <div className="flex justify-end mb-6">
          <Link
            href="/seller/my-listings"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Về Tin Đăng Của Tôi
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Đã Duyệt', value: stats.active, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
            { label: 'Chờ Duyệt', value: stats.pending, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
            { label: 'Từ Chối', value: stats.rejected, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
            { label: 'Bản Nháp', value: stats.draft, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' },
            { label: 'Cần Bổ Sung', value: stats.needInfo, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
          ].map((s) => (
            <div key={s.label} className={`rounded-xl p-4 border ${s.bg} ${s.border}`}>
              <p className="text-xs font-semibold text-gray-600 mb-1">{s.label}</p>
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Listing List */}
        <div className="space-y-4">
          {MOCK_SELLER_LISTINGS.map((listing) => {
            const isExpanded = expandedId === listing.id;
            const lifecycleIdx = getLifecycleIndex(listing.status);
            const isRejected = listing.status === 'REJECT';

            return (
              <div
                key={listing.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
              >
                {/* Row Header */}
                <div
                  className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => toggleExpand(listing.id)}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{listing.brand} {listing.model}</p>
                      <p className="text-sm text-gray-500">{formatPrice(listing.price)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <StatusBadge status={listing.status} showLabel />
                    <span className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t border-gray-100 px-5 pb-5 pt-4 space-y-5">
                    {/* Lifecycle Timeline */}
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Vòng Đời</p>
                      <div className="flex items-center gap-0">
                        {LIFECYCLE_STEPS.map((step, idx) => {
                          const isDone = idx < lifecycleIdx;
                          const isCurrent = idx === lifecycleIdx;
                          const stepCfg = STATUS_CONFIG[idx === 2 && isRejected ? 'REJECT' : step];
                          return (
                            <React.Fragment key={step}>
                              <div className={`flex flex-col items-center`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2
                                                                    ${isDone ? 'bg-green-500 border-green-500 text-white' :
                                    isCurrent && isRejected ? 'bg-red-100 border-red-400 text-red-600' :
                                      isCurrent ? 'bg-[#FF8A00] border-[#FF8A00] text-white' :
                                        'bg-gray-100 border-gray-300 text-gray-400'}`}
                                >
                                  {isDone ? '✓' : idx + 1}
                                </div>
                                <span className="text-[10px] mt-1 text-gray-500 text-center w-16">
                                  {idx === 2 && isRejected ? 'Từ Chối' : stepCfg?.label}
                                </span>
                              </div>
                              {idx < LIFECYCLE_STEPS.length - 1 && (
                                <div className={`flex-1 h-0.5 mb-4 mx-1 ${idx < lifecycleIdx ? 'bg-green-400' : 'bg-gray-200'}`} />
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>

                    {/* Rejection reason */}
                    {listing.status === 'REJECT' && listing.rejectionReason && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-sm font-semibold text-red-700 mb-1">❌ Lý Do Từ Chối</p>
                        <p className="text-sm text-gray-700">{listing.rejectionReason}</p>
                      </div>
                    )}

                    {/* Need more info */}
                    {listing.status === 'NEED_MORE_INFO' && listing.infoRequest && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm font-semibold text-blue-700 mb-1">📋 Yêu Cầu Bổ Sung Thông Tin</p>
                        <p className="text-sm text-gray-700 mb-2">{listing.infoRequest.message}</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {listing.infoRequest.requiredItems.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-blue-500 mt-0.5">•</span> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Approval History */}
                    {listing.approvalHistory.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Lịch Sử Duyệt</p>
                        <div className="space-y-2">
                          {listing.approvalHistory.map((entry, i) => (
                            <div key={i} className="flex items-start gap-3 text-sm">
                              <span className="text-gray-400 text-xs mt-0.5 w-20 flex-shrink-0">
                                {new Date(entry.date).toLocaleDateString('vi-VN')}
                              </span>
                              <StatusBadge status={entry.result} size="sm" showLabel />
                              <span className="text-gray-600">{entry.note}</span>
                              {entry.reviewedBy && (
                                <span className="text-gray-400 text-xs ml-auto">bởi {entry.reviewedBy}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Inspector Notes */}
                    {listing.inspectionStatus && listing.inspectionStatus !== 'NOT_STARTED' && (
                      <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                        <span className="font-medium text-gray-700">Trạng thái kiểm tra: </span>
                        {listing.inspectionStatus === 'IN_PROGRESS' ? '🔍 Đang kiểm tra' : '✅ Đã hoàn thành'}
                      </div>
                    )}

                    {/* CTAs */}
                    <div className="flex gap-3 pt-1 flex-wrap">
                      {(listing.status === 'DRAFT' || listing.status === 'REJECT') && (
                        <Link
                          href={`/seller/edit-listing/${listing.id}`}
                          className="px-4 py-2 bg-[#FF8A00] text-white rounded-lg text-sm font-semibold hover:bg-[#FF7A00] transition"
                        >
                          ✏️ Chỉnh Sửa
                        </Link>
                      )}
                      {listing.status === 'REJECT' && (
                        <Link
                          href={`/seller/edit-listing/${listing.id}`}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition"
                        >
                          🔄 Nộp Lại
                        </Link>
                      )}
                      {listing.status === 'NEED_MORE_INFO' && (
                        <Link
                          href={`/seller/listings/${listing.id}/need-more-info`}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                        >
                          📋 Bổ Sung Thông Tin
                        </Link>
                      )}
                      <Link
                        href={`/seller/listings/${listing.id}`}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
                      >
                        👁 Xem Chi Tiết
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ListingStatusPage;
