export interface IStock {
  _id?: string;
  product_variant_id: string;
  quantity: number;
  last_updated?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IStockHistory {
  _id?: string;
  stock_id: string | IStock; 
  quantity_change: number;
  reason: string;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}