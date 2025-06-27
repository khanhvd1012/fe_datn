export interface IVariant {
    _id?: string;
    product_id: string | { _id: string; name: string };
    sku: string;
    color: string | { _id: string; name: string }[];
    size: string[] | { _id: string; name: string }[];
    price: number;
    image_url: string[]
    import_price: number;
    gender?: 'unisex' | 'male' | 'female';
    status?: 'inStock' | 'outOfStock';
    createdAt?: Date;
    updatedAt?: Date;
}