// app/seller/inspection-response/components/ResponseForm.tsx
// S-42 – Textarea for seller's reply text + submit button

'use client';

import React from 'react';

interface ResponseFormProps {
    value: string;
    onChange: (text: string) => void;
    onSubmit: () => void;
    isSubmitting: boolean;
    error: string | null;
}

const MIN_RESPONSE_LENGTH = 20;

export function ResponseForm({ value, onChange, onSubmit, isSubmitting, error }: ResponseFormProps) {
    const isValid = value.trim().length >= MIN_RESPONSE_LENGTH;

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-1">✍️ Nội Dung Phản Hồi</h2>
            <p className="text-sm text-gray-500 mb-4">
                Mô tả rõ ràng các thông tin bạn đã cung cấp và trả lời từng yêu cầu của Inspector.
            </p>

            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Ví dụ: Tôi đã chụp ảnh số serial xe ở dưới gầm khung (xem ảnh đính kèm). Hóa đơn mua hàng từ cửa hàng ABC ngày 10/01/2023 cũng được đính kèm..."
                rows={6}
                disabled={isSubmitting}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8A00] text-sm resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
            />

            <div className="flex items-center justify-between mt-2 mb-4">
                <span className={`text-xs ${isValid ? 'text-green-600' : 'text-gray-400'}`}>
                    {value.trim().length}/{MIN_RESPONSE_LENGTH} ký tự tối thiểu
                </span>
                {!isValid && value.length > 0 && (
                    <span className="text-xs text-orange-500">Cần ít nhất {MIN_RESPONSE_LENGTH} ký tự</span>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    ⚠️ {error}
                </div>
            )}

            <button
                onClick={onSubmit}
                disabled={isSubmitting || !isValid}
                className="w-full px-6 py-3 bg-[#FF8A00] text-white rounded-lg font-semibold hover:bg-[#FF7A00] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isSubmitting ? (
                    <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Đang gửi...
                    </>
                ) : (
                    '🚀 Gửi Phản Hồi'
                )}
            </button>
        </div>
    );
}
