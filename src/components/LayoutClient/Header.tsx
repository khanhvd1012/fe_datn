import { useState, useRef, useEffect, useCallback } from 'react';
import {
  UserOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { Avatar, Badge, Dropdown, List, Menu, message, Popover } from 'antd';
import {
  HeaderTop,
  HeaderMain,
  Logo,
  NavMenu,
  NavItem,
  IconGroup,
  Icon,
  HamburgerIcon,
} from '../css/style';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import SideCart from '../../pages/Client/SideCart';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getProfile } from '../../service/authAPI';
import type { IUser } from '../../interface/user';
import SearchBox from './SearchBox';
import Collection from '../../pages/Client/Collection';
import axios from 'axios';
import { useCart } from '../../hooks/useCart.ts';
import { useMarkNotificationAsRead, useNotifications } from '../../hooks/useNotification.ts';
import dayjs from 'dayjs';
import Text from 'antd/es/typography/Text';
import type { IProduct } from '../../interface/order.ts';

const Header = () => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showCollectionMenu, setShowCollectionMenu] = useState(false);
  const [products, setProducts] = useState<IProduct[]>([]);
  const collectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { data: notis } = useNotifications();
  const { mutate: markAsRead } = useMarkNotificationAsRead();

  const { data: cartData } = useCart();
  const items = cartData?.cart_items || [];
  const cartCount = cartData?.cart_items?.reduce((total, item) => total + item.quantity, 0) || 0;

  const { data: user } = useQuery<IUser>({
    queryKey: ['profile'],
    queryFn: getProfile,
    enabled: !!token,
    retry: false,
  });

  const allNotis = [...(notis || [])]
    .sort((a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf())
    .slice(0, 5);

  const unreadCount = allNotis.filter((n) => !n.read).length;

  const [visible, setVisible] = useState(false);

  const handleNotificationClick = (id: string, read: boolean) => {
    if (!read) markAsRead(id);
    setVisible(false);
    navigate('/notifications');
  };

  const notificationContent = (
    <div style={{ width: 320, maxHeight: 320, overflowY: 'auto' }}>
      {allNotis.length === 0 ? (
        <div style={{ padding: 16 }}>Không có thông báo</div>
      ) : (
        <List
          dataSource={allNotis}
          renderItem={(item) => (
            <List.Item
              style={{ cursor: 'pointer', backgroundColor: item.read ? '#fff' : '#f6f6f6' }}
              onClick={() => handleNotificationClick(item._id, item.read)}
            >
              <List.Item.Meta
                title={<Text strong>{item.title}</Text>}
                description={
                  <>
                    <div>{item.message}</div>
                    <div style={{ fontSize: 12, color: '#999' }}>
                      {dayjs(item.createdAt).format('HH:mm DD/MM/YYYY')}
                    </div>
                  </>
                }
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );

  useEffect(() => {
    axios.get('http://localhost:3000/api/products')
      .then(res => {
        const arr = Array.isArray(res.data?.data?.products) ? res.data.data.products : [];
        const productsWithImage = arr.map((p: any) => ({
          ...p,
          image:
            p.image ||
            (Array.isArray(p.images) && p.images[0]) ||
            (Array.isArray(p.image_url) && p.image_url[0]) ||
            (Array.isArray(p.variants) && p.variants[0]?.image_url?.[0]) ||
            '',
        }));
        setProducts(productsWithImage);
      })
      .catch(() => setProducts([]));
  }, []);

  const toggleMenu = () => setIsOpen(prev => !prev);

  const handleLogout = () => {
    localStorage.clear();
    queryClient.removeQueries({ queryKey: ['profile'] });
    message.info('Đăng xuất thành công!');
    navigate('/');
  };

  const menuItems = token
    ? [
      {
        key: '0',
        label: <span style={{ fontWeight: 'bold' }}>{user?.username || 'Người dùng'}</span>,
        disabled: true,
      },
      { key: '1', label: <NavLink to="/profile">Thông tin tài khoản</NavLink> },
      { key: '2', label: <NavLink to="/order-history">Đơn hàng của bạn</NavLink> },
      ...(userRole === 'admin' || userRole === 'employee'
        ? [{ key: '3', label: <NavLink to="/admin">Trang quản trị</NavLink> }]
        : []),
      { key: '4', label: <span onClick={handleLogout}>Đăng xuất</span>, danger: true },
    ]
    : [
      { key: '1', label: <NavLink to="/login">Đăng nhập</NavLink> },
      { key: '2', label: <NavLink to="/register">Đăng ký</NavLink> },
    ];

  const menu = <Menu items={menuItems} />;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        collectionRef.current &&
        !collectionRef.current.contains(event.target as Node)
      ) {
        setShowCollectionMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenSearch = useCallback(() => setShowSearch(true), []);
  const handleCloseSearch = useCallback(() => setShowSearch(false), []);

  return (
    <>
      <HeaderTop>
        <span>🚚 MIỄN PHÍ VẬN CHUYỂN NỘI THÀNH CHO ĐƠN &gt; 300K - ĐỔI TRẢ TRONG 30 NGÀY - CAM KẾT 100% CHÍNH HÃNG</span>
        <span>🎉 KHUYẾN MÃI LỚN MỪNG KHAI TRƯƠNG - GIẢM GIÁ LÊN ĐẾN 50% - SỐ LƯỢNG CÓ HẠN</span>
      </HeaderTop>

      <HeaderMain>
        <Link to={`/`}>
          <Logo>
            SNEAKER<span>TREND</span>
          </Logo>
        </Link>

        <NavMenu isOpen={isOpen}>
          <NavItem onClick={toggleMenu}><NavLink to="/">TRANG CHỦ</NavLink></NavItem>
          <NavItem><span className="cursor-pointer" onClick={() => setShowCollectionMenu(true)}>BỘ SƯU TẬP</span></NavItem>
          <NavItem onClick={toggleMenu}><NavLink to="/products">SẢN PHẨM</NavLink></NavItem>
          <NavItem onClick={toggleMenu}><NavLink to="/about">GIỚI THIỆU</NavLink></NavItem>
          <NavItem onClick={toggleMenu}><NavLink to="/blog">BLOG</NavLink></NavItem>
          <NavItem onClick={toggleMenu}><NavLink to="/contact">LIÊN HỆ</NavLink></NavItem>
        </NavMenu>

        <IconGroup>
          <Dropdown overlay={menu} trigger={['hover']} placement="bottomRight">
            <div className="flex items-center gap-2 cursor-pointer">
              {user ? (
                <div className="flex items-center gap-2">
                  <Avatar
                    src={user.image || 'https://i.pravatar.cc/300'}
                    size={32}
                  />
                  <span className="text-sm font-medium">{user.username}</span>
                </div>
              ) : (
                <Avatar
                  icon={<UserOutlined style={{ color: 'black' }} />}
                  size={32}
                  style={{ backgroundColor: 'white', marginRight: '-10px' }}
                />
              )}
            </div>
          </Dropdown>
          <Popover
            content={notificationContent}
            trigger="click"
            placement="bottomRight"
            open={visible}
            onOpenChange={(open) => setVisible(open)}
          >
            <Badge count={unreadCount} offset={[6, 0]} size="small">
              <span
                style={{
                  fontSize: 20, // kích thước icon
                  lineHeight: '20px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <BellOutlined />
              </span>
            </Badge>
          </Popover>

          <Icon onClick={handleOpenSearch} style={{ cursor: 'pointer' }}>
            <SearchOutlined />
          </Icon>

          <Icon onClick={() => setShowCart(true)} style={{ position: 'relative', cursor: 'pointer' }}>
            <ShoppingCartOutlined />
            {cartCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-6px',
                  background: 'red',
                  color: 'white',
                  borderRadius: '50%',
                  width: '14px',
                  height: '14px',
                  fontSize: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: 1,
                }}
              >
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Icon>

        </IconGroup>

        <HamburgerIcon onClick={toggleMenu} isOpen={isOpen}>
          <span></span><span></span><span></span><span></span>
        </HamburgerIcon>
      </HeaderMain>

      {showCart && <SideCart onClose={() => setShowCart(false)} />}
      {showSearch && <SearchBox onClose={handleCloseSearch} products={products} />}
      {showCollectionMenu && (
        <div ref={collectionRef}>
          <Collection onClose={() => setShowCollectionMenu(false)} />
        </div>
      )}
    </>
  );
};

export default Header;
