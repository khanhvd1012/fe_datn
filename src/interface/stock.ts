export interface IStock {
  _id?: string;
  sku: string;
  quantity: number;
  color: string;
  size: string;
  product_name: string;
  product_variant_id: string; 
  last_updated: string;
  createdAt: string;
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