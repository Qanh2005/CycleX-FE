// app/seller/inspection-response/page.tsx
// S-42 – Inspection Response Screen (Seller)
// Seller replies to inspector's request, uploads supporting documents, and submits

'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { InspectorRequestCard } from './components/InspectorRequestCard';
import { ResponseForm } from './components/ResponseForm';
import { UploadDocuments } from './components/UploadDocuments';
import { useInspectionResponse } from './hooks/useInspectionResponse';

export const dynamic = 'force-dynamic';

function InspectionResponseContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const listingId = Number(searchParams.get('listingId') ?? '5');

    const {
        request,
        responseText,
        setResponseText,
        documents,
        addFiles,
        removeDocument,
        retryDocument,
        submitResponse,
        isSubmitting,
        submitSuccess,
        submitError,
    } = useInspectionResponse(listingId);

    if (submitSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center max-w-md w-full">
                    <div className="text-5xl mb-4">🎉</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Phản Hồi Đã Gửi!</h2>
                    <p className="text-gray-500 text-sm mb-6">
                        Inspector sẽ xem xét phản hồi của bạn và cập nhật trạng thái tin đăng sớm nhất có thể.
                    </p>
                    <div className="flex flex-col gap-3">
                        <Link
                            href={`/seller/listings/${listingId}`}
                            className="px-6 py-3 bg-[#FF8A00] text-white rounded-lg font-semibold hover:bg-[#FF7A00] transition text-sm"
                        >
                            Xem Chi Tiết Tin Đăng
                        </Link>
                        <Link
                            href="/seller/my-listings"
                            className="px-6 py-3 border border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition text-sm"
                        >
                            ← Tất Cả Tin Đăng
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
            <div className="max-w-2xl mx-auto">
                {/* Back + Title */}
                <div className="flex items-center gap-3 mb-6">
                    <button
                        onClick={() => router.back()}
                        className="text-gray-600 hover:text-gray-900 transition text-sm"
                    >
                        ←
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Phản Hồi Inspector</h1>
                        <p className="text-sm text-gray-500 mt-0.5">Tin đăng #{listingId} · {request.listingTitle}</p>
                    </div>
                </div>

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
                    <Link href="/seller/my-listings" className="hover:text-blue-600 transition">Tin Đăng</Link>
                    <span>›</span>
                    <Link href={`/seller/listings/${listingId}`} className="hover:text-blue-600 transition">Chi Tiết</Link>
                    <span>›</span>
                    <span className="text-gray-600">Phản Hồi Inspector</span>
                </div>

                {/* Main Content */}
                <div className="space-y-5">
                    {/* Inspector's Request */}
                    <InspectorRequestCard request={request} />

                    {/* Document Upload */}
                    <UploadDocuments
                        documents={documents}
                        onFilesAdded={addFiles}
                        onRemove={removeDocument}
                        onRetry={retryDocument}
                    />

                    {/* Response Form + Submit */}
                    <ResponseForm
                        value={responseText}
                        onChange={setResponseText}
                        onSubmit={submitResponse}
                        isSubmitting={isSubmitting}
                        error={submitError}
                    />
                </div>
            </div>
        </div>
    );
}

export default function InspectionResponsePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-500">Đang tải...</div>
            </div>
        }>
            <InspectionResponseContent />
        </Suspense>
    );
}
