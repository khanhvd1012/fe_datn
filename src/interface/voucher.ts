export interface IVoucher {
    _id?: string;
    code: string;
    type: "percentage" | "fixed";
    value: number;
    minOrderValue: number;
    startDate: string | Date;
    endDate: string | Date;
    quantity: number;
    usedCount: number;
    status: "active" | "inactive" | "paused";
    createdAt?: string | Date;
    updatedAt?: string | Date;

}
