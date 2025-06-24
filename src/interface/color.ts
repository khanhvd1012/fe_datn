export interface IColor {
    _id?: string;
    name: string;
    code: string;
    description: string;
    variants?: string[]; 
    status: 'active' | 'inactive';
    createdAt?: Date;
    updatedAt?: Date;
}
