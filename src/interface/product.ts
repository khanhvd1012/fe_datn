export interface IVariantInProduct {
    SKU: string;
    size: string | { _id: string; name: string }; // Can be either ID string or populated size object
    color: string | { _id: string; name: string }; // Can be either ID string or populated color object
    image: string;
    price: number;
    stock: number;
    status: 'Còn hàng' | 'Hết hàng' | 'Ngừng bán';
}

export interface IProduct {
    _id?: string;  // MongoDB's ID field
    name: string;
    description: string;
    brand: string | { _id: string; name: string };  // Can be either ID string or populated brand object
    category: string | { _id: string; name: string };  // Can be either ID string or populated category object
    gender: 'unisex' | 'male' | 'female';
    variants: IVariantInProduct[];  // Array of variant objects
    images: string[];   // Array of image URLs
    price: number;      // Product base price
    sizes: string[] | { _id: string; name: string; value: string }[]; // Array of size IDs or populated size objects
    status: 'inStock' | 'outOfStock';  // Product status
    createdAt?: Date;  // Optional, for tracking creation date
    updatedAt?: Date;  // Optional, for tracking last update date
}