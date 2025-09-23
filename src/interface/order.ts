import type { IShippingAddress } from "./user";

export interface IOrder {
  _id: string;
  user_id: IUser | string;
  cart_id: string;
  voucher_id?: string | null;
  voucher_discount?: number;
  sub_total: number;
  total_price: number;
  status:
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "return_requested"
  | "return_accepted"
  | "return_rejected"
  | "returned"
  | "canceled";
  payment_method: string;
  payment_status?: "unpaid" | "paid" | "failed" | "canceled" | "refunded";
  app_trans_id: string;

  // Hủy đơn
  cancel_reason?: string | null;
  cancelled_at?: string | null;
  cancelled_by?: string | null;

  // Hoàn hàng
  return_reason?: string | null;
  return_requested_at?: string | null;
  return_accepted_at?: string | null;
  return_accepted_by?: string | null;
  return_rejected_at?: string | null;
  return_rejected_by?: string | null;
  return_reject_reason?: string | null;
  returned_at?: string | null;
  reject_reason?: string;

  // Xác nhận nhận hàng
  confirmed_received?: boolean;
  confirmed_received_at?: string | null;

  // Giao hàng
  delivered_at?: string | null;
  shipping_fee?: number;
  shipping_service?: string | null;
  shipping_address?: IShippingAddress | string;

  createdAt?: string;
  updatedAt?: string;

  // Virtuals
  order_code?: string;
  images: string[];
  items?: IOrderItem[];
  trangThai?: string;
}

export interface IOrderItem {
  _id?: string;
  product_id: IProduct | string;
  variant_id: IVariant | string;
  order_id: string | IOrder;
  quantity: number;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}

// Định nghĩa thêm để tránh lỗi khi render
export interface IUser {
  _id: string;
  username: string;
  email: string;
}

export interface IProduct {
  _id: string;
  name: string;
}

export interface IVariant {
  _id: string;
  color: {
    _id: string;
    name: string;
  };
  price: number;
}
