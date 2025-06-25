export interface Address {
  address: string;
  is_default: boolean;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  phone?: string;
  dob?: string;
  createdAt: string;
  shipping_addresses?: Address[];
}
