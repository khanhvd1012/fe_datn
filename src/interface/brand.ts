export interface IBrand {
    _id?: string;  // MongoDB's ID field
    name: string;
    description: string;
    logo_image: string;
    products?: string[]; 
    category?: { _id: string; name: string }[];  
    createdAt?: Date;
    updatedAt?: Date;
}
