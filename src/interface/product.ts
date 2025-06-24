export interface IProduct {
    _id?: string;
    name: string;
    description?: string;
    brand: string | { _id: string; name: string };
    category: string | { _id: string; name: string };
    variants: string[]; // Mảng ObjectId của variants
    images: string[];
}
