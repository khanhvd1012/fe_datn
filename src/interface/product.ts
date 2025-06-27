export interface IProduct {
    _id?: string;
    name: string;
    description?: string;
    brand: string | { _id: string; name: string };
    category: string | { _id: string; name: string };
    variants: string[]; 
    size: string[] | { _id: string; name: string }[];
}
