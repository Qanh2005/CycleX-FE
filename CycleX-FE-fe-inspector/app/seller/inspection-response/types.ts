// app/seller/inspection-response/types.ts
// S-42 – Types for Inspection Response Screen

export interface InspectionRequest {
    id: number;
    listingId: number;
    listingTitle: string;
    inspectorName: string;
    requestedDate: string;
    message: string;
    requiredItems: string[];
    status: 'OPEN' | 'RESPONDED' | 'RESOLVED';
}

export interface UploadedDocument {
    id: string;
    file: File;
    previewUrl: string;
    name: string;
    size: number;
    type: string;
    uploadError?: string;
}

export interface SellerResponse {
    responseText: string;
    documents: UploadedDocument[];
}
