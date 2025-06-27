export interface IVoucher {
  _id?: string;
  code: string; 
  type: "percentage" | "fixed"; 
  value: number; 
  maxDiscount?: number | null; 
  minOrderValue?: number; 
  startDate: string; 
  endDate: string;
  quantity: number; 
  usedCount: number; 
  isActive: boolean; 
  createdAt?: string; 
  updatedAt?: string; 
}