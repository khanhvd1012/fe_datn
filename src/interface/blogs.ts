export interface IBlogs {
    _id?: string; 
    title: string;
    content: string;
    images: string[];
    author: {
        _id: string;
        username: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
}
