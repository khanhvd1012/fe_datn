import type { IOrderItem } from "./order";

export interface IReview {
  _id?: string;
  user_id: string | { _id: string; username: string; email: string };
  images: string[];
  order_item: IOrderItem;
  product_id: string | { _id: string; name: string };
  product_variant_id?: string | { _id: string };
  rating: number;
  comment: string;
  admin_reply?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

