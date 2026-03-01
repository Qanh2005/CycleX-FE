// app/seller/edit-listing/[id]/components/EditListingForm.tsx
// S-16 – Wraps the Create Listing 3-step components for Editing

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Step1VehicleInfo from '../../../create-listing/components/Step1VehicleInfo';
import Step2ImageUpload from '../../../create-listing/components/Step2ImageUpload';
import Step3Preview from '../../../create-listing/components/Step3Preview';
import { CREATE_LISTING_STEPS } from '../../../create-listing/constants';
import { type ListingFormData } from '../../../create-listing/types';
import { type SellerListingDetail } from '@/app/mocks/sellerListingDetail';

interface EditListingFormProps {
    listing: SellerListingDetail;
}

export default function EditListingForm({ listing }: EditListingFormProps) {
    const router = useRouter();
    const [step, setStep] = useState<number>(CREATE_LISTING_STEPS.VEHICLE_INFO);
    const [isSaving, setIsSaving] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Initialize form data from listing
    const [formData, setFormData] = useState<ListingFormData>({
        title: listing.title,
        brand: listing.brand,
        model: listing.model,
        category: listing.category,
        condition: listing.condition,
        year: listing.year.toString(),
        price: listing.price.toString(),
        location: listing.location,
        description: listing.description,
        shipping: listing.shipping,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Image state
    const [imageUrls, setImageUrls] = useState<string[]>(listing.images);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => ({ ...prev, [name]: finalValue }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Very basic validation (simplified from useCreateListing)
    const validateStep1 = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.title) newErrors.title = 'Required';
        if (!formData.brand) newErrors.brand = 'Required';
        if (!formData.model) newErrors.model = 'Required';
        if (!formData.category) newErrors.category = 'Required';
        if (!formData.price || Number(formData.price) <= 0) newErrors.price = 'Invalid price';
        if (!formData.location) newErrors.location = 'Required';
        if (!formData.description) newErrors.description = 'Required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        if (imageUrls.length < 3) {
            setUploadError('Vui lòng upload tối thiểu 3 ảnh');
            return false;
        }
        setUploadError(null);
        return true;
    };

    const handleNext = () => {
        if (step === CREATE_LISTING_STEPS.VEHICLE_INFO && validateStep1()) {
            setStep(CREATE_LISTING_STEPS.UPLOAD_IMAGES);
        } else if (step === CREATE_LISTING_STEPS.UPLOAD_IMAGES && validateStep2()) {
            setStep(CREATE_LISTING_STEPS.PREVIEW);
        }
    };

    const handleBack = () => {
        setStep(prev => prev - 1);
    };

    // MOCK image upload exactly like useCreateListing
    const simulateUpload = async () => {
        setIsUploading(true);
        setUploadError(null);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsUploading(false);
        const newUrl = `https://placehold.co/800x600/e2e8f0/64748b?text=Uploaded+${Date.now()}`;
        setImageUrls(prev => [...prev, newUrl]);
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) simulateUpload();
    };
    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files.length > 0) simulateUpload();
    };
    const onDragOver = (e: React.DragEvent) => e.preventDefault();
    const removeImage = (index: number) => {
        setImageUrls(prev => prev.filter((_, i) => i !== index));
    };
    const handleSetPrimary = (index: number) => {
        setImageUrls(prev => {
            const next = [...prev];
            const [item] = next.splice(index, 1);
            next.unshift(item);
            return next;
        });
    };

    // Form submission
    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setIsSaving(true);
        setSubmitError(null);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Redirect to listing detail to see it in PENDING state
        router.push(`/seller/listings/${listing.id}`);
    };

    const handleSaveDraft = async () => {
        setIsSaving(true);
        // Simulate save
        await new Promise(resolve => setTimeout(resolve, 800));
        router.push('/seller/draft-listings');
    };

    return (
        <form onSubmit={handleSubmit} onKeyDown={e => { if (e.key === 'Enter' && step !== CREATE_LISTING_STEPS.PREVIEW) e.preventDefault(); }} className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
            {/* Warning banner if editing a REJECTED listing */}
            {listing.status === 'REJECT' && listing.rejectionReason && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-700 font-bold text-sm mb-1">❌ Tin đăng đã bị từ chối</p>
                    <p className="text-red-600 text-sm">{listing.rejectionReason}</p>
                    <p className="text-red-500 text-xs mt-2">Vui lòng sửa lại tin đăng theo phản hồi của Inspector trước khi nộp lại.</p>
                </div>
            )}

            {step === CREATE_LISTING_STEPS.VEHICLE_INFO && (
                <Step1VehicleInfo formData={formData} errors={errors} onChange={handleInputChange} />
            )}

            {step === CREATE_LISTING_STEPS.UPLOAD_IMAGES && (
                <Step2ImageUpload
                    imageUrls={imageUrls}
                    isUploading={isUploading}
                    onFileChange={onFileChange}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onRemoveImage={removeImage}
                    onSetPrimary={handleSetPrimary}
                    error={uploadError}
                />
            )}

            {step === CREATE_LISTING_STEPS.PREVIEW && (
                <Step3Preview formData={formData} imageUrls={imageUrls} />
            )}

            {submitError && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg mt-4 text-sm">{submitError}</div>
            )}

            {/* Actions */}
            <div className="flex gap-4 mt-8 justify-between pt-6 border-t border-gray-100">
                <button
                    type="button"
                    onClick={handleSaveDraft}
                    disabled={isSaving}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50 text-sm"
                >
                    {isSaving ? "Đang lưu..." : "Lưu Bản Nháp"}
                </button>

                <div className="flex gap-3">
                    {step > CREATE_LISTING_STEPS.VEHICLE_INFO && (
                        <button
                            type="button"
                            onClick={handleBack}
                            className="px-6 py-3 border border-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition text-sm"
                        >
                            Quay Lại
                        </button>
                    )}

                    {step < CREATE_LISTING_STEPS.PREVIEW ? (
                        <button
                            type="button"
                            onClick={handleNext}
                            className="px-6 py-3 bg-[#FF8A00] text-white rounded-lg font-semibold hover:bg-[#FF7A00] transition text-sm shadow-md shadow-orange-500/20"
                        >
                            Tiếp Tục
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSaving}
                            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 text-sm shadow-md shadow-green-600/20"
                        >
                            {isSaving ? "Đang gửi..." : (listing.status === 'REJECT' ? "Nộp Lại Tin Đăng" : "Cập Nhật Tin")}
                        </button>
                    )}
                </div>
            </div>
        </form>
    );
}
