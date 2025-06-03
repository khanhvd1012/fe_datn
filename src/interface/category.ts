export interface ICategory {
    _id?: string;  // MongoDB's ID field
    name: string;
    description: string;
    logo_image: string;  // URL or path to the category image
    createdAt?: Date;  // Optional, for tracking creation date
    updatedAt?: Date;  // Optional, for tracking last update date
    products?: string[];  // Array of product IDs associated with this category
}