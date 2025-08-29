// Thống kê sản phẩm theo danh mục
export interface IProductsByCategory {
  categoryId: string;      // _id của category
  categoryName: string;    // tên category
  count: number;           // số sản phẩm trong category đó
}

// Top sản phẩm bán chạy
export interface ITopProduct {
  _id: string;             // product_id
  name: string;            // tên sản phẩm
  variantId: string;
  sku: string;
  totalSales: number;      // số lượng đã bán
  totalRevenue: number;    // doanh thu từ sản phẩm này
}

// Số đơn hàng theo ngày
export interface IOrdersByDate {
  date: string;            // yyyy-mm-dd
  orders: number;          // số đơn trong ngày
}

// Tổng quan Dashboard
export interface IDashboardStats {
  totalProducts: number;                 // tổng sản phẩm
  productsByCategory: IProductsByCategory[]; // danh sách sản phẩm theo category
  topProducts: ITopProduct[];            // top sản phẩm bán chạy
  totalOrders: number;                   // tổng số đơn hàng
  totalUsers: number;                    // tổng số user
  ordersByDate: IOrdersByDate[];         // thống kê đơn theo ngày
  monthlyRevenue: number;                // doanh thu tháng hiện tại
}

// API Response
export interface IDashboardResponse {
  success: boolean;
  data: IDashboardStats;
  message?: string;
  error?: string;
}
