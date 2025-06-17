export interface IColor {
    _id: string;
    name: string;
    code: string;
    description: string;
    status: 'active' | 'inactive';
    createdAt?: string;
    updatedAt?: string;
}
