export interface IBrand {
    _id?: string;  // MongoDB's ID field
    name: string;
    description: string;
    logo_image: string;
    products?: string[];  // Array of product IDs
    createdAt?: Date;
    updatedAt?: Date;
}
