export interface IBlogs {
    _id?: string; 
    title: string;
    content: string;
    images: string[];
    author: {
        _id: string;
        username: string;
    };
    excerpt?: string; // Thêm field này
    createdAt: Date;
    updatedAt: Date;
}
