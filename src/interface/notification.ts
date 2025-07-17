export interface INotification {
  _id: string;
  user_id: string;

  title: string;
  message: string;

  type: 'low_stock' | 'new_order' | 'voucher' | 'back_in_stock';

  read: boolean;

  data?: {
    product_id?: string;
    variant_id?: string;
    quantity?: number;
  };

  createdAt: string;
  updatedAt: string;
}
