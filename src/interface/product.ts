export interface IReferenceObject {
  _id: string;
  name: string;
}

export interface IProduct {
  _id?: string;
  name: string;
  description?: string;
  brand: string | IReferenceObject;       // Có thể là ObjectId hoặc object {_id, name}
  category: string | IReferenceObject;    // Tương tự
  variants: string[];                     // Mảng ObjectId của biến thể
  images: string[];
  price?: number;
  quantity?: number;
  gender?: 'male' | 'female' | 'unisex';
  status?: 'inStock' | 'outOfStock' | 'discontinued';
  colors?: string[];                      // Mảng ObjectId
  sizes?: string[];                       // Mảng ObjectId
}
