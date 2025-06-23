export interface IVariantInProduct {
    product_id: string;
    sizes: string[] | { _id: string; name: string }[];
    quantity: number;
    color_id: string | { _id: string; name: string };
    sku: string;
    price: number;
    images: string[];
    status: 'active' | 'inactive';
}

export interface IProduct {
    _id?: string;
    name: string;
    description: string;
    brand: string | { _id: string; name: string };
    category: string | { _id: string; name: string };
    gender: 'unisex' | 'male' | 'female';
    sizes: string[] | { _id: string; name: string }[];
    colors: string | { _id: string; name: string };
    images: string[];
    price: number;
    quantity: number;
    status: 'inStock' | 'outOfStock';
    variants: IVariantInProduct[];
    createdAt?: Date;
    updatedAt?: Date;
}