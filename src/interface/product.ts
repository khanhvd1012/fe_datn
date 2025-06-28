export interface IVariant {
  _id?: string;
  sku: string;
  color: string;
  size: string[] | string;
  gender: string;
  price: number;
  image_url: string[];
  import_price: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export interface IProduct {
  _id?: string;
  name: string;
  description?: string;
  brand: string | { _id: string; name: string };
  category: string | { _id: string; name: string };
  variants: IVariant[];
  size: string[] | { _id: string; name: string }[];
}
