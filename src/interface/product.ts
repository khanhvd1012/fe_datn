export interface IVariant {
  image_url: string[];  
  price?: number;
  size: string | string[]; 
}

export interface IProduct {
  _id: string;
  name: string;
  price: number;
  images: string[];
  size: any[];
  brand?: {
    name: string;
  } | string;
  description?: string;
  variants?: IVariant[]; 
}
