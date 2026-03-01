// app/seller/inspection-response/hooks/useInspectionResponse.ts
// S-42 – State management hook for Inspection Response screen

import { useState, useCallback } from 'react';
import { type UploadedDocument, type SellerResponse, type InspectionRequest } from '../types';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

function buildMockRequest(listingId: number): InspectionRequest {
    return {
        id: 1,
        listingId,
        listingTitle: 'Merida Scultura 400 – Cần Bổ Sung',
        inspectorName: 'Inspector A',
        requestedDate: new Date(Date.now() - 86400000).toISOString(),
        message: 'Vui lòng cung cấp thêm thông tin để chúng tôi có thể duyệt tin đăng của bạn.',
        requiredItems: [
            'Số serial của xe (thường ở dưới gầm khung)',
            'Hóa đơn mua hàng hoặc biên lai',
            'Ảnh rõ hơn của bộ groupset',
            'Ảnh của bánh trước và bánh sau',
        ],
        status: 'OPEN',
    };
}

function validateFile(file: File): string | undefined {
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return 'Chỉ chấp nhận ảnh JPG/PNG/WebP và PDF.';
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
        return 'Kích thước file tối đa là 5MB.';
    }
    return undefined;
}

export function useInspectionResponse(listingId: number) {
    const [request] = useState<InspectionRequest>(() => buildMockRequest(listingId));
    const [responseText, setResponseText] = useState('');
    const [documents, setDocuments] = useState<UploadedDocument[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const addFiles = useCallback((files: FileList | File[]) => {
        const fileArray = Array.from(files);
        const newDocs: UploadedDocument[] = fileArray.map((file) => ({
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            file,
            previewUrl: URL.createObjectURL(file),
            name: file.name,
            size: file.size,
            type: file.type,
            uploadError: validateFile(file),
        }));
        setDocuments((prev) => [...prev, ...newDocs]);
    }, []);

    const removeDocument = useCallback((id: string) => {
        setDocuments((prev) => {
            const doc = prev.find((d) => d.id === id);
            if (doc) URL.revokeObjectURL(doc.previewUrl);
            return prev.filter((d) => d.id !== id);
        });
    }, []);

    const retryDocument = useCallback((id: string, file: File) => {
        setDocuments((prev) =>
            prev.map((d) =>
                d.id === id
                    ? {
                        ...d,
                        file,
                        previewUrl: URL.createObjectURL(file),
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        uploadError: validateFile(file),
                    }
                    : d
            )
        );
    }, []);

    const submitResponse = useCallback(async () => {
        if (!responseText.trim()) {
            setSubmitError('Vui lòng nhập nội dung phản hồi.');
            return;
        }
        const hasErrors = documents.some((d) => d.uploadError);
        if (hasErrors) {
            setSubmitError('Vui lòng xóa các file lỗi trước khi gửi.');
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);

        // Simulate API latency
        await new Promise((resolve) => setTimeout(resolve, 1200));

        setIsSubmitting(false);
        setSubmitSuccess(true);
    }, [responseText, documents]);

    return {
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
    };
}
