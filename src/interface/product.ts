export interface IProduct {
    _id?: string;  // MongoDB's ID field
    name: string;
    description: string;
    brand: string | { _id: string; name: string };  // Can be either ID string or populated brand object
    category: string | { _id: string; name: string };  // Can be either ID string or populated category object
    gender: 'unisex' | 'male' | 'female';
    variants: string[];  // Array of variant IDs
    images: string[];   // Array of image URLs
    price: number;      // Product price
    status: 'inStock' | 'outOfStock';  // Product status
    createdAt?: Date;  // Optional, for tracking creation date
    updatedAt?: Date;  // Optional, for tracking last update date
}