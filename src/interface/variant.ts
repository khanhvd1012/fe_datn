export interface IVariant {
    _id?: string;
    product_id: string | { _id: string; name: string };
    sizes: string[] | { _id: string; name: string }[];
    quantity: number;
    color_id: string | { _id: string; name: string };
    sku: string;
    price: number;
    images: string[];
    status: 'active' | 'inactive';
    createdAt?: Date;
    updatedAt?: Date;
}
