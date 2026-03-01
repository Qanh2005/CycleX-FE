/**
 * Mock Data – Seller Listing Detail
 * Used by S-15 (Seller Listing Detail), S-16 (Edit Listing),
 * S-19 (Need More Info) screens.
 */

export type ApprovalStatus = 'DRAFT' | 'PENDING' | 'APPROVE' | 'REJECT' | 'NEED_MORE_INFO';
export type InspectionStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export interface ApprovalHistoryEntry {
    date: string;
    result: ApprovalStatus;
    note: string;
    reviewedBy?: string;
}

export interface RelatedTransaction {
    id: number;
    buyerName: string;
    amount: number;
    status: string;
    createdDate: string;
}

export interface InfoRequest {
    requestedBy: string;
    requestedDate: string;
    message: string;
    requiredItems: string[];
}

export interface SellerListingDetail {
    id: number;
    title: string;
    brand: string;
    model: string;
    year: number;
    category: string;
    condition: string;
    price: number;
    location: string;
    description: string;
    shipping: boolean;
    images: string[];
    status: ApprovalStatus;
    inspectionStatus: InspectionStatus;
    rejectionReason?: string;
    approvalHistory: ApprovalHistoryEntry[];
    relatedTransactions: RelatedTransaction[];
    infoRequest?: InfoRequest;
    createdDate: string;
    updatedDate: string;
    views: number;
    inquiries: number;
}

const BASE_IMAGES = [
    'https://placehold.co/800x600/e2e8f0/64748b?text=Bike+Image+1',
    'https://placehold.co/800x600/e2e8f0/64748b?text=Bike+Image+2',
    'https://placehold.co/800x600/e2e8f0/64748b?text=Bike+Image+3',
];

export const MOCK_SELLER_LISTINGS: SellerListingDetail[] = [
    {
        id: 1,
        title: 'Giant Escape 3 2022 – Như Mới',
        brand: 'Giant',
        model: 'Escape 3',
        year: 2022,
        category: 'Road Bike',
        condition: 'used',
        price: 8500000,
        location: 'Hà Nội',
        description: 'Xe đạp Giant Escape 3 năm 2022, đi được khoảng 500km, còn rất mới. Đầy đủ phụ kiện kèm theo.',
        shipping: true,
        images: BASE_IMAGES,
        status: 'APPROVE',
        inspectionStatus: 'COMPLETED',
        approvalHistory: [
            {
                date: new Date(Date.now() - 86400000 * 7).toISOString(),
                result: 'PENDING',
                note: 'Tin đăng đã được gửi để duyệt.',
            },
            {
                date: new Date(Date.now() - 86400000 * 6).toISOString(),
                result: 'APPROVE',
                note: 'Tin đăng đã được duyệt thành công.',
                reviewedBy: 'Inspector A',
            },
        ],
        relatedTransactions: [
            {
                id: 101,
                buyerName: 'Nguyễn Văn B',
                amount: 8500000,
                status: 'COMPLETED',
                createdDate: new Date(Date.now() - 86400000 * 2).toISOString(),
            },
        ],
        createdDate: new Date(Date.now() - 86400000 * 7).toISOString(),
        updatedDate: new Date(Date.now() - 86400000).toISOString(),
        views: 120,
        inquiries: 3,
    },
    {
        id: 2,
        title: 'Trek FX 2 2023 – Đỉnh Cao Hybrid',
        brand: 'Trek',
        model: 'FX 2',
        year: 2023,
        category: 'Hybrid Bike',
        condition: 'new',
        price: 12000000,
        location: 'Hồ Chí Minh',
        description: 'Trek FX 2 đời 2023 hoàn toàn mới, chưa qua sử dụng. Xe hybrid lý tưởng cho đường phố.',
        shipping: false,
        images: BASE_IMAGES,
        status: 'APPROVE',
        inspectionStatus: 'COMPLETED',
        approvalHistory: [
            {
                date: new Date(Date.now() - 86400000 * 5).toISOString(),
                result: 'PENDING',
                note: 'Chờ duyệt.',
            },
            {
                date: new Date(Date.now() - 86400000 * 4).toISOString(),
                result: 'APPROVE',
                note: 'OK.',
                reviewedBy: 'Inspector B',
            },
        ],
        relatedTransactions: [],
        createdDate: new Date(Date.now() - 86400000 * 5).toISOString(),
        updatedDate: new Date(Date.now() - 86400000 * 2).toISOString(),
        views: 85,
        inquiries: 1,
    },
    {
        id: 3,
        title: 'Specialized Sirrus X – Chờ Duyệt',
        brand: 'Specialized',
        model: 'Sirrus X',
        year: 2021,
        category: 'Hybrid Bike',
        condition: 'used',
        price: 15500000,
        location: 'Đà Nẵng',
        description: 'Specialized Sirrus X 2021, đã qua sử dụng nhưng còn tốt. Phù hợp đường địa hình nhẹ.',
        shipping: true,
        images: BASE_IMAGES,
        status: 'PENDING',
        inspectionStatus: 'IN_PROGRESS',
        approvalHistory: [
            {
                date: new Date(Date.now() - 86400000 * 3).toISOString(),
                result: 'PENDING',
                note: 'Đang trong quá trình kiểm tra.',
            },
        ],
        relatedTransactions: [],
        createdDate: new Date(Date.now() - 86400000 * 3).toISOString(),
        updatedDate: new Date().toISOString(),
        views: 45,
        inquiries: 0,
    },
    {
        id: 4,
        title: 'Cannondale Trail 5 – Bị Từ Chối',
        brand: 'Cannondale',
        model: 'Trail 5',
        year: 2020,
        category: 'Mountain Bike',
        condition: 'used',
        price: 9500000,
        location: 'Hà Nội',
        description: 'Cannondale Trail 5 đã qua sử dụng',
        shipping: true,
        images: BASE_IMAGES,
        status: 'REJECT',
        inspectionStatus: 'COMPLETED',
        rejectionReason: 'Ảnh không rõ ràng, khó xác định tình trạng xe. Vui lòng cung cấp ảnh rõ hơn cho phần khung, bánh và phanh xe.',
        approvalHistory: [
            {
                date: new Date(Date.now() - 86400000 * 2).toISOString(),
                result: 'PENDING',
                note: 'Đang chờ duyệt.',
            },
            {
                date: new Date(Date.now() - 86400000).toISOString(),
                result: 'REJECT',
                note: 'Ảnh không đủ chất lượng để đánh giá tình trạng xe.',
                reviewedBy: 'Inspector C',
            },
        ],
        relatedTransactions: [],
        createdDate: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedDate: new Date(Date.now() - 86400000).toISOString(),
        views: 12,
        inquiries: 0,
    },
    {
        id: 5,
        title: 'Merida Scultura 400 – Cần Bổ Sung',
        brand: 'Merida',
        model: 'Scultura 400',
        year: 2022,
        category: 'Road Bike',
        condition: 'new',
        price: 18000000,
        location: 'Đà Nẵng',
        description: 'Merida Scultura 400 mới 100%, còn trong thùng.',
        shipping: true,
        images: BASE_IMAGES,
        status: 'NEED_MORE_INFO',
        inspectionStatus: 'IN_PROGRESS',
        approvalHistory: [
            {
                date: new Date(Date.now() - 86400000 * 4).toISOString(),
                result: 'PENDING',
                note: 'Đang chờ',
            },
            {
                date: new Date(Date.now() - 86400000 * 1).toISOString(),
                result: 'NEED_MORE_INFO',
                note: 'Cần thêm thông tin về số serial và hóa đơn mua hàng.',
                reviewedBy: 'Inspector A',
            },
        ],
        relatedTransactions: [],
        infoRequest: {
            requestedBy: 'Inspector A',
            requestedDate: new Date(Date.now() - 86400000).toISOString(),
            message: 'Vui lòng cung cấp thêm thông tin để chúng tôi có thể duyệt tin đăng của bạn.',
            requiredItems: [
                'Số serial của xe (thường ở dưới gầm khung)',
                'Hóa đơn mua hàng hoặc biên lai',
                'Ảnh rõ hơn của bộ groupset',
                'Ảnh của bánh trước và bánh sau',
            ],
        },
        createdDate: new Date(Date.now() - 86400000 * 4).toISOString(),
        updatedDate: new Date().toISOString(),
        views: 0,
        inquiries: 0,
    },
    {
        id: 6,
        title: 'Scott Speedster 40 – Bản Nháp',
        brand: 'Scott',
        model: 'Speedster 40',
        year: 2023,
        category: 'Road Bike',
        condition: 'new',
        price: 22000000,
        location: 'Hà Nội',
        description: '',
        shipping: false,
        images: [],
        status: 'DRAFT',
        inspectionStatus: 'NOT_STARTED',
        approvalHistory: [],
        relatedTransactions: [],
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
        views: 0,
        inquiries: 0,
    },
];

/** Helper: find a listing by id */
export function findSellerListingById(id: number): SellerListingDetail | undefined {
    return MOCK_SELLER_LISTINGS.find((l) => l.id === id);
}
