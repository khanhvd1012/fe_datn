import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  UserOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { Dropdown, Menu } from 'antd';
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
import { NavLink, useNavigate } from 'react-router-dom';
import SideCart from '../../pages/Client/SideCart';
import { useQuery } from '@tanstack/react-query';
import { getProfile } from '../../service/authAPI';
import type { IUser } from '../../interface/user';
import SearchBox from './SearchBox';
import Collection from '../../pages/Client/Collection';
import axios from 'axios';
import NotificationPopup from './NotificationPopup.tsx';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showCollectionMenu, setShowCollectionMenu] = useState(false);
  const [products, setProducts] = useState([]);
  const [showNotification, setShowNotification] = useState(false);

  const collectionRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  const { data: user } = useQuery<IUser>({
    queryKey: ['profile'],
    queryFn: getProfile,
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    axios.get('http://localhost:3000/api/products')
      .then(res => {
        const arr = Array.isArray(res.data?.data?.products) ? res.data.data.products : [];
        const productsWithImage = arr.map(p => ({
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
        ...(userRole === 'admin'
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotification(false);
      }
    };

    const handleScroll = () => setShowNotification(false);

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleOpenSearch = useCallback(() => setShowSearch(true), []);
  const handleCloseSearch = useCallback(() => setShowSearch(false), []);

  return (
    <>
      <HeaderTop>
        MIỄN PHÍ VẬN CHUYỂN VỚI ĐƠN HÀNG NỘI THÀNH &gt; 300K - ĐỔI TRẢ TRONG 30 NGÀY - ĐẢM BẢO CHẤT LƯỢNG
      </HeaderTop>

      <HeaderMain>
        <Logo>
          SNEAKER<span>TREND</span>
        </Logo>

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
            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <Icon><UserOutlined /></Icon>
              {token && <span style={{ marginLeft: 8, fontWeight: 'bold' }}>{user?.username || 'Người dùng'}</span>}
            </div>
          </Dropdown>

          <Icon onClick={() => setShowNotification(true)} style={{ cursor: 'pointer' }}>
            <BellOutlined />
          </Icon>

          <Icon onClick={handleOpenSearch} style={{ cursor: 'pointer' }}>
            <SearchOutlined />
          </Icon>

          <Icon onClick={() => setShowCart(true)} style={{ cursor: 'pointer' }}>
            <ShoppingCartOutlined />
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
      {showNotification && (
        <NotificationPopup
          onClose={() => setShowNotification(false)}
          wrapperRef={notificationRef}
        />
      )}
    </>
  );
};

export default Header;
