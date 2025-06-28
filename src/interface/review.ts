export interface IReview {
  _id?: string;
  user_id: string;
  order_item: string;
  product_id: string;
  product_variant_id?: string;
  rating: number;
  comment: string;
  admin_reply?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
