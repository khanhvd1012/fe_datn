export interface ISize {
    _id?: string;
    name: string;
    value: string;
    description?: string;
    status: 'active' | 'inactive';
    createdAt?: Date;
    updatedAt?: Date;
}
