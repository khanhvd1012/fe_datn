export interface IVoucher {
    _id?: string;
    code: string;
    type: "percentage" | "fixed";
    value: number;
    maxDiscount: number | null;
    minOrderValue: number;
    startDate: string | Date;
    endDate: string | Date;
    quantity: number;
    usedCount: number;
    isActive: boolean;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}
