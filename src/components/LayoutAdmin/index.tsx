// Import các icon và components cần thiết từ antd và react-router-dom
import { DashboardOutlined, ShoppingOutlined, AppstoreOutlined, TagsOutlined, UserOutlined, ShoppingCartOutlined, CommentOutlined, HomeOutlined, EditOutlined, PlusOutlined, BgColorsOutlined, GiftOutlined, SkinOutlined, HistoryOutlined, BarChartOutlined, TeamOutlined, CrownOutlined, IdcardOutlined, UsergroupAddOutlined, StockOutlined } from '@ant-design/icons';
import Sider from 'antd/es/layout/Sider'
import { Breadcrumb, Layout, Menu, theme } from 'antd'
import { Content } from 'antd/es/layout/layout'
import { useState } from 'react';
import { Link, Navigate, Routes, Route, useLocation } from 'react-router-dom'

// Import các components trang admin
import DashBoard from '../../pages/Admin/DashBoard';
import Headers from './Header';
import Brands from '../../pages/Admin/brands/Brands';
import CreateBrand from '../../pages/Admin/brands/CreateBrand';
import EditBrand from '../../pages/Admin/brands/EditBrand';
import Categories from '../../pages/Admin/categories/Categories';
import CreateCategories from '../../pages/Admin/categories/CreateCategories';
import EditCategories from '../../pages/Admin/categories/EditCategories';
import EditOrders from '../../pages/Admin/orders/EditOrders';
import Orders from '../../pages/Admin/orders/Orders';
import CreateProducts from '../../pages/Admin/products/CreateProducts';
import EditProducts from '../../pages/Admin/products/EditProducts';
import Products from '../../pages/Admin/products/Products';
import EditReviews from '../../pages/Admin/reviews/EditReviews';
import Reviews from '../../pages/Admin/reviews/Reviews';
import Admin from '../../pages/Admin/users/admin/Admin';
import EditAdmin from '../../pages/Admin/users/admin/EditAdmin';
import Customers from '../../pages/Admin/users/customer/Customers';
import EditCustomers from '../../pages/Admin/users/customer/EditCustomers';
import EditEmployee from '../../pages/Admin/users/employee/EditEmployee';
import Employee from '../../pages/Admin/users/employee/Employee';
import Footers from './Footer';
import Sizes from '../../pages/Admin/sizes/Sizes';
import CreateSize from '../../pages/Admin/sizes/CreateSize';
import EditSize from '../../pages/Admin/sizes/EditSize';
import Colors from '../../pages/Admin/colors/Colors';
import CreateColor from '../../pages/Admin/colors/CreateColor';
import EditColor from '../../pages/Admin/colors/EditColor';
import Variant from '../../pages/Admin/variant/Variant';
import CreateVariant from '../../pages/Admin/variant/CreateVariant';
import EditVariant from '../../pages/Admin/variant/EditVariant';
import Vouchers from '../../pages/Admin/vochers/Vocher';
import CreateVoucher from '../../pages/Admin/vochers/CreateVoucher';
import EditVoucher from '../../pages/Admin/vochers/EditVoucher';
import Stock from '../../pages/Admin/stock/Stock';
import StockHistory from '../../pages/Admin/stockHistory/StockHistory';
import EditStock from '../../pages/Admin/stock/EditStock';


// Component chính quản lý layout của trang admin
const IndexAdmin = () => {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();

    // Tạo breadcrumb items dựa trên đường dẫn hiện tại
    const getBreadcrumbItems = () => {
        const pathSnippets = location.pathname.split('/').filter(i => i && i !== 'admin');
        const items: { title: React.ReactNode }[] = [];

        let url = '/admin';
        pathSnippets.forEach((snippet) => {
            url += `/${snippet}`;
            let icon;

            // Xác định icon dựa trên đường dẫn
            switch (snippet) {
                case 'dashboard':
                    icon = <DashboardOutlined />;
                    break;
                case 'products':
                    icon = <ShoppingOutlined />;
                    break;
                case 'categories':
                    icon = <AppstoreOutlined />;
                    break;
                case 'brands':
                    icon = <TagsOutlined />;
                    break;
                case 'users':
                case 'admin_users':
                case 'employees':
                case 'customers':
                    icon = <UserOutlined />;
                    break;
                case 'orders':
                    icon = <ShoppingCartOutlined />;
                    break;
                case 'reviews':
                    icon = <CommentOutlined />;
                    break;
                case 'create':
                    icon = <PlusOutlined />;
                    break;
                case 'edit':
                    icon = <EditOutlined />;
                    break;
                case 'colors':
                    icon = <BgColorsOutlined />;
                    break;
                case 'vouchers':
                    icon = <GiftOutlined />;
                    break;
                case 'stocks':
                    icon = <SkinOutlined />;
                    break;
                case 'stocks_history':
                    icon = <HistoryOutlined />;
                    break;
                case 'analytics':
                    icon = <BarChartOutlined />;
                    break;
                case 'team':
                    icon = <TeamOutlined />;
                    break;
                case 'roles':
                    icon = <CrownOutlined />;
                    break;
                case 'permissions':
                    icon = <IdcardOutlined />;
                    break;
                case 'customers_group':
                    icon = <UsergroupAddOutlined />;
                    break;
                default:
                    icon = null;
            }

            const title = snippet.charAt(0).toUpperCase() + snippet.slice(1);
            items.push({
                title: (
                    <span>
                        {icon && <span style={{ marginRight: '8px' }}>{icon}</span>}
                        <Link to={url}>{title}</Link>
                    </span>
                )
            });
        });

        return items;
    };

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <div>
            {/* Layout chính bao gồm Sidebar và Content */}
            <Layout style={{ minHeight: '100vh' }}>
                {/* Sidebar có thể collapse */}
                <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                    <div className="demo-logo-vertical" />
                    {/* Menu chính của admin với các chức năng */}
                    <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline"
                        items={[
                            // Dashboard
                            {
                                key: "dashboard",
                                label: <Link to="/admin/dashboard">Dashboard</Link>,
                                icon: <BarChartOutlined />,
                            },
                            // Quản lý sản phẩm
                            { key: "2", label: <Link to="/admin/products">Products</Link>, icon: <ShoppingOutlined /> },
                            // Quản lý danh mục
                            { key: "3", label: <Link to="/admin/categories">Categories</Link>, icon: <AppstoreOutlined /> },
                            // Quản lý thương hiệu
                            { key: "brands", label: <Link to="/admin/brands">Brands</Link>, icon: <CrownOutlined /> },
                            // Quản lý size
                            { key: "sizes", label: <Link to="/admin/sizes">Sizes</Link>, icon: <SkinOutlined /> },
                            // Quản lý màu sắc
                            { key: "colors", label: <Link to="/admin/colors">Colors</Link>, icon: <BgColorsOutlined /> },
                            // Quản lý variant
                            { key: "variants", label: <Link to="/admin/variants">Variants</Link>, icon: <TagsOutlined /> },
                            // Quản lý đơn hàng
                            { key: "9", label: <Link to="/admin/orders">Orders</Link>, icon: <ShoppingCartOutlined /> },
                            // Quản lý đánh giá
                            { key: "10", label: <Link to="/admin/reviews">Reviews</Link>, icon: <CommentOutlined /> },
                            // Quản lý kho
                            {
                                key: "11", label: <Link to="/admin/stocks">Stocks</Link>, icon: <StockOutlined />,
                                children: [
                                    { key: '12', label: <Link to="/admin/stocks/stock">Stock</Link>, icon: <DashboardOutlined /> },
                                    { key: '13', label: <Link to="/admin/stocks/stocks_history">Stock History</Link>, icon: <HistoryOutlined /> }
                                ]
                            },
                            // Quản lý Mã giảm giá
                            { key: "vouchers", label: <Link to="/admin/vouchers">Vouchers</Link>, icon: <GiftOutlined /> },
                            // Quản lý người dùng với submenu
                            {
                                key: "5", label: <Link to="/admin/users">Users</Link>, icon: <TeamOutlined />,
                                children: [
                                    { key: '6', label: <Link to="/admin/users/admin_users">Admin</Link>, icon: <UserOutlined /> },
                                    { key: '7', label: <Link to="/admin/users/employees">Employee</Link>, icon: <IdcardOutlined /> },
                                    { key: '8', label: <Link to="/admin/users/customers">Customer</Link>, icon: <UsergroupAddOutlined /> },
                                ],
                            },
                        ]}
                    />
                </Sider>

                {/* Phần nội dung chính */}
                <Layout>
                    {/* Header */}
                    <Headers />
                    {/* Content area */}
                    <Content style={{ margin: '0 16px' }}>
                        <Breadcrumb style={{ margin: '16px 0' }} items={[
                            {
                                title: (
                                    <span>
                                        <HomeOutlined style={{ marginRight: '8px' }} />
                                        <Link to="/admin">Admin</Link>
                                    </span>
                                )
                            },
                            ...getBreadcrumbItems()
                        ]} />
                        <div
                            style={{
                                padding: 24,
                                minHeight: 360,
                                background: colorBgContainer,
                                borderRadius: borderRadiusLG,
                            }}
                        >
                            {/* Định nghĩa các routes cho admin panel */}
                            <Routes>
                                {/* Route mặc định chuyển hướng đến dashboard */}
                                <Route index element={<Navigate to="dashboard" />} />
                                <Route path="dashboard" element={<DashBoard />} />

                                {/* Routes quản lý sản phẩm */}
                                <Route path="products">
                                    <Route path='' element={<Products />} />
                                    <Route path="create" element={<CreateProducts />} />
                                    <Route path="edit/:id" element={<EditProducts />} />
                                </Route>

                                {/* Routes quản lý danh mục */}
                                <Route path="categories">
                                    <Route path='' element={<Categories />} />
                                    <Route path="create" element={<CreateCategories />} />
                                    <Route path="edit/:id" element={<EditCategories />} />
                                </Route>

                                {/* Routes quản lý thương hiệu */}
                                <Route path="brands">
                                    <Route path="" element={<Brands />} />
                                    <Route path="create" element={<CreateBrand />} />
                                    <Route path="edit/:id" element={<EditBrand />} />
                                </Route>

                                {/* Routes quản lý size */}
                                <Route path="sizes">
                                    <Route path="" element={<Sizes />} />
                                    <Route path="add" element={<CreateSize />} />
                                    <Route path="edit/:id" element={<EditSize />} />
                                </Route>

                                {/* Routes quản lý màu sắc */}
                                <Route path="colors">
                                    <Route path="" element={<Colors />} />
                                    <Route path="add" element={<CreateColor />} />
                                    <Route path="edit/:id" element={<EditColor />} />
                                </Route>

                                {/* Routes quản lý variant */}
                                <Route path="variants">
                                    <Route path='' element={<Variant />} />
                                    <Route path="create" element={<CreateVariant />} />
                                    <Route path="edit/:id" element={<EditVariant />} />
                                </Route>

                                {/* Routes quản lý người dùng */}
                                <Route path="users">
                                    {/* Quản lý admin */}
                                    <Route path="admin_users">
                                        <Route path="" element={<Admin />} />
                                        <Route path="edit/:id" element={<EditAdmin />} />
                                    </Route>
                                    {/* Quản lý nhân viên */}
                                    <Route path="employees">
                                        <Route path="" element={<Employee />} />
                                        <Route path="edit/:id" element={<EditEmployee />} />
                                    </Route>
                                    {/* Quản lý khách hàng */}
                                    <Route path="customers">
                                        <Route path="" element={<Customers />} />
                                        <Route path="edit/:id" element={<EditCustomers />} />
                                    </Route>
                                </Route>

                                {/* Routes quản lý đơn hàng */}
                                <Route path="orders">
                                    <Route path="" element={<Orders />} />
                                    <Route path="edit/:id" element={<EditOrders />} />
                                </Route>

                                {/* Routes quản lý mã giảm giá */}
                                <Route path="vouchers">
                                    <Route path="" element={<Vouchers />} />
                                    <Route path="create" element={<CreateVoucher />} />
                                    <Route path="edit/:id" element={<EditVoucher />} />
                                </Route>

                                {/* Routes quản lý đánh giá */}
                                <Route path="reviews">
                                    <Route path="" element={<Reviews />} />
                                    <Route path="create" element={<CreateBrand />} />
                                    <Route path="edit/:id" element={<EditReviews />} />
                                </Route>

                                {/* Routes quản lý kho */}
                                <Route path="stocks">
                                    <Route path="stock">
                                        <Route path="" element={<Stock />} />
                                        <Route path="edit/:id" element={<EditStock />} />
                                    </Route>
                                    <Route path="stocks_history">
                                        <Route path="" element={<StockHistory />} />
                                    </Route>
                                </Route>

                            </Routes>
                        </div>
                    </Content>
                    {/* Footer */}
                    <Footers />
                </Layout>
            </Layout>
        </div>
    )
}

export default IndexAdmin