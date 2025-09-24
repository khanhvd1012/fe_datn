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

// Doanh thu theo ngày (BE trả về orderRevenue, actualRevenue, difference)
export interface IRevenueByDate {
  date: string;            // yyyy-mm-dd
  orderRevenue: number;    // doanh thu theo ngày đặt
  actualRevenue: number;   // doanh thu thực tế
  difference: number;      // chênh lệch
}

// Doanh thu theo tháng
export interface IRevenueByMonth {
  yearMonth: string;       // format: YYYY-MM
  orderRevenue: number;    // doanh thu theo tháng đặt
  actualRevenue: number;   // doanh thu thực tế
  difference: number;      // chênh lệch
}

// Doanh thu theo năm
export interface IRevenueByYear {
  year: number;           // năm
  orderRevenue: number;   // doanh thu theo năm đặt
  actualRevenue: number;  // doanh thu thực tế
  difference: number;     // chênh lệch
}

// Tổng quan Dashboard
export interface IDashboardStats {
  totalProducts: number;                    // tổng sản phẩm
  totalOrders: number;                      // tổng số đơn hàng
  totalUsers: number;                       // tổng số user
  deliveredPaidOrders: number;              // số đơn đã giao và thanh toán
  productsByCategory: IProductsByCategory[];// sản phẩm theo danh mục
  topProducts: ITopProduct[];               // top sản phẩm bán chạy
  ordersByDate: IOrdersByDate[];            // thống kê đơn theo ngày
  revenueByDate: IRevenueByDate[];         // doanh thu theo ngày
  revenueByMonth: IRevenueByMonth[];       // doanh thu theo tháng
  revenueByYear: IRevenueByYear[];         // doanh thu theo năm
  revenueLast7Days: IRevenueByDate[];      // doanh thu 7 ngày gần nhất
  totalOrderRevenue: number;                // tổng doanh thu theo đơn đặt
  totalActualRevenue: number;               // tổng doanh thu thực tế
}

// API Response
export interface IDashboardResponse {
  success: boolean;
  data: IDashboardStats;
  message?: string;
  error?: string;
}