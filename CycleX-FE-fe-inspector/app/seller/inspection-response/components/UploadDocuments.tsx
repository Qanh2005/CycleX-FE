// app/seller/inspection-response/components/UploadDocuments.tsx
// S-42 – File/image upload with preview, validation, remove, and retry

'use client';

import React, { useRef, useCallback } from 'react';
import { type UploadedDocument } from '../types';

interface UploadDocumentsProps {
    documents: UploadedDocument[];
    onFilesAdded: (files: FileList | File[]) => void;
    onRemove: (id: string) => void;
    onRetry: (id: string, file: File) => void;
}

const ALLOWED_TYPES_LABEL = 'JPG, PNG, WebP, PDF';
const MAX_SIZE_LABEL = '5MB';

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function UploadDocuments({ documents, onFilesAdded, onRemove, onRetry }: UploadDocumentsProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            if (e.dataTransfer.files.length > 0) {
                onFilesAdded(e.dataTransfer.files);
            }
        },
        [onFilesAdded]
    );

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onFilesAdded(e.target.files);
            e.target.value = '';
        }
    };

    const handleRetry = (doc: UploadedDocument) => {
        // Simulate re-selecting a file: reuse the existing file object
        onRetry(doc.id, doc.file);
    };

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-1">📎 Đính Kèm Tài Liệu / Ảnh</h2>
            <p className="text-sm text-gray-500 mb-4">
                Thêm ảnh hoặc tài liệu để hỗ trợ cho phản hồi của bạn.
                Định dạng: {ALLOWED_TYPES_LABEL}. Tối đa {MAX_SIZE_LABEL}/file.
            </p>

            {/* Drop zone */}
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => inputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-[#FF8A00] hover:bg-orange-50/30 transition-all group"
            >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📁</div>
                <p className="text-sm text-gray-600 font-medium">Kéo thả file vào đây</p>
                <p className="text-xs text-gray-400 mt-1">hoặc click để chọn file</p>
            </div>

            <input
                ref={inputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,application/pdf"
                className="hidden"
                onChange={handleFileChange}
            />

            {/* Document preview list */}
            {documents.length > 0 && (
                <div className="mt-4 space-y-3">
                    {documents.map((doc) => {
                        const isImage = doc.type.startsWith('image/');
                        const hasError = Boolean(doc.uploadError);

                        return (
                            <div
                                key={doc.id}
                                className={`flex items-center gap-3 p-3 rounded-lg border ${hasError
                                        ? 'border-red-200 bg-red-50'
                                        : 'border-gray-100 bg-gray-50'
                                    }`}
                            >
                                {/* Preview */}
                                <div className="w-12 h-12 rounded-lg flex-shrink-0 overflow-hidden bg-gray-200 flex items-center justify-center">
                                    {isImage && !hasError ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={doc.previewUrl}
                                            alt={doc.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-2xl">{hasError ? '❌' : '📄'}</span>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                                    {hasError ? (
                                        <p className="text-xs text-red-600">{doc.uploadError}</p>
                                    ) : (
                                        <p className="text-xs text-gray-400">{formatFileSize(doc.size)}</p>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    {hasError && (
                                        <button
                                            onClick={() => handleRetry(doc)}
                                            className="text-xs px-2.5 py-1 bg-orange-100 text-orange-700 rounded font-medium hover:bg-orange-200 transition"
                                        >
                                            Thử lại
                                        </button>
                                    )}
                                    <button
                                        onClick={() => onRemove(doc.id)}
                                        className="text-gray-400 hover:text-red-500 transition p-1"
                                        aria-label="Xóa file"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
