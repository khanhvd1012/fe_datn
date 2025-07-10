export interface IReview {
  _id?: string;
  user_id: string | { _id: string; username: string; email: string; };
  order_item: string;
  product_id: string | { _id: string; name: string };
  product_variant_id?: string;
  rating: number;
  comment: string;
  admin_reply?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
