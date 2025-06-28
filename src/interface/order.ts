export interface IOrder {
    _id?: string;
    user_id: string;
    cart_id: string;
    voucher_id?: string | null;
    voucher_discount?: number;
    sub_total: number;
    total_price: number;
    status: "pending" | "processing" | "shipped" | "delivered" | "canceled";
    payment_method: string;
    cancel_reason?: string | null;
    cancelled_at?: string | null;
    cancelled_by?: string | null;
    createdAt?: string;
    updatedAt?: string;

    items?: IOrderItem[];
    trangThai?: string;
}

export interface IOrderItem {
    _id?: string;
    product_id: string;
    variant_id: string;
    order_id: string | IOrder;
    quantity: number;
    price: number;
    createdAt?: string;
    updatedAt?: string;
}