export interface IContact {
  _id?: string; 
  username: string;
  email: string;
  phone: string;
  address: string;
  message: string;
  userId?: string; 
  createdAt?: Date; 
  updatedAt?: Date;
}
