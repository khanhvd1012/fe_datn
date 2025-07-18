export interface IShippingAddress {
  _id?: string;
  full_name: string;
  phone: string;
  address: string;
  is_default?: boolean;
}

export interface IUser {
  _id?: string;
  user_id: string;
  username: string;
  email: string;
  password?: string;
  image?: string; 
  shipping_addresses: IShippingAddress[];
  role: "user" | "employee" | "admin";
  createdAt?: string;
  updatedAt?: string;
}