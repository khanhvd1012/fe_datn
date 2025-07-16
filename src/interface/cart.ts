export interface ICartItem {
  _id: string;
  cart_id: string;
  product_id?: {
    _id: string;
    name: string;
  };
  variant_id: {
    _id: string;
    color: string;
    size: string;
    price: number;
    image_url: string;
    product_id: {
      _id: string;
      name: string;
    };
  };
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICart {
  _id: string;
  user_id: string;
  cart_items: ICartItem[];
  createdAt?: string;
  updatedAt?: string;
}
