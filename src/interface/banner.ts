export interface IBanner {
    _id: string;
    title: string;
    image: string;
    status: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
