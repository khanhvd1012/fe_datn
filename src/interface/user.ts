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
  isBlocked?: boolean;  
  blockReason?: string;
  blockedBy?: {
    _id: string;
    username: string;
    email: string;
    role: "employee" | "admin";
  } | null;
  role: "user" | "employee" | "admin";
  createdAt?: string;
  updatedAt?: string;
}