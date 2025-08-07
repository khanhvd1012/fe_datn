// interface/cart.ts
import type { IColor } from "./color";
import type { ISize } from "./size";

export interface ICartItem {
  _id: string;
  cart_id: string;
  product_id?: {
    _id: string;
    name: string;
  };
  variant_id: {
    _id: string;
    color: string | IColor;
    size: string | ISize;
    price: number;
    image_url: string;
    product_id: {
      _id: string;
      name: string;
      slug?: string;
    };
  };
  quantity: number;
  is_returning?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface INotification {
  _id: string;
  title: string;
  message: string;
  type: string;
  createdAt?: string;
}

export interface ICart {
  cart_items: ICartItem[];         
  returning_items: ICartItem[];    
  total: number;                   
  auto_restore_enabled: boolean;   
  new_notifications: INotification[]; 
}
