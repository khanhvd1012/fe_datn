export interface IProduct {
    _id?: string;  // MongoDB's ID field
    name: string;
    description: string;
    brand: string;
    category: string;
    gender: 'unisex' | 'male' | 'female';
    variants: string[];  // Array of variant IDs
}