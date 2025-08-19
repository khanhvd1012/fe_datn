export interface IVariant {
  _id?: string;
  sku: string;
  color: string | { _id: string; name: string; code: string };
  size: string | { _id: string; size: string };
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
  slug: string;
  variants: IVariant[];
}
