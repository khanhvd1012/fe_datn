import type { IProduct } from "./product";
import type { IStock } from "./stock";

export interface IVariant {
    _id?: string;
    product_id: string | IProduct;
    variant_id: string;
    sku: string;
    color: string | { _id: string; name: string; code: string };
    size: string | { _id: string; size: string };
    price: number;
    image_url: string[];
    import_price: number;
    gender?: 'unisex' | 'male' | 'female';
    status?: 'inStock' | 'outOfStock' | 'paused';
    weight?: number;
    length?: number;
    width?: number;
    height?: number;
    totalSold?: number;
    averageRating?: number;
    reviewCount?: number;
    createdAt?: Date;
    updatedAt?: Date;
    stock?: IStock;
}