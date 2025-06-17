export interface IVariant {
    _id?: string;
    SKU: string;
    size: string | { _id: string; name: string }; // Can be either ID string or populated size object
    color: string | { _id: string; name: string }; // Can be either ID string or populated color object
    image: string;
    price: number;
    stock: number;
    status: 'Còn hàng' | 'Hết hàng' | 'Ngừng bán';
    product: string | { _id: string; name: string }; // Can be either ID string or populated product object
    createdAt?: Date;
    updatedAt?: Date;
}
