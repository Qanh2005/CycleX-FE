// app/seller/inspection-response/components/InspectorRequestCard.tsx
// S-42 – Displays the inspector's request with date, message, and required checklist

'use client';

import React from 'react';
import { type InspectionRequest } from '../types';

interface InspectorRequestCardProps {
    request: InspectionRequest;
}

export function InspectorRequestCard({ request }: InspectorRequestCardProps) {
    return (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {request.inspectorName.charAt(0)}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900 text-sm">{request.inspectorName}</p>
                        <p className="text-xs text-gray-500">Inspector</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold
                        ${request.status === 'OPEN' ? 'bg-yellow-100 text-yellow-700' :
                            request.status === 'RESPONDED' ? 'bg-blue-100 text-blue-700' :
                                'bg-green-100 text-green-700'}`}
                    >
                        {request.status === 'OPEN' ? 'Đang chờ phản hồi' :
                            request.status === 'RESPONDED' ? 'Đã phản hồi' : 'Đã giải quyết'}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">
                        {new Date(request.requestedDate).toLocaleDateString('vi-VN')}
                    </p>
                </div>
            </div>

            {/* Message */}
            <div className="bg-white rounded-lg p-4 mb-4 border border-blue-100">
                <p className="text-sm text-gray-700 leading-relaxed">{request.message}</p>
            </div>

            {/* Required checklist */}
            <div>
                <p className="text-sm font-semibold text-gray-800 mb-3">📋 Thông tin cần bổ sung:</p>
                <div className="space-y-2">
                    {request.requiredItems.map((item, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex-shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5">
                                {i + 1}
                            </span>
                            {item}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
