import React, { useState, useRef, useEffect } from 'react';
import { UserOutlined, SearchOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Dropdown, Menu } from 'antd';
import {
  HeaderTop,
  HeaderMain,
  Logo,
  NavMenu,
  NavItem,
  IconGroup,
  Icon,
  HamburgerIcon
} from '../css/style';
import { NavLink, useNavigate } from 'react-router-dom';
import SideCart from '../../pages/Client/SideCart';
import { useQuery } from '@tanstack/react-query';
import { getProfile } from '../../service/authAPI';
import type { IUser } from '../../interface/user';
import SearchBox from './SearchBox';
import Collection from '../../pages/Client/Collection';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showCollectionMenu, setShowCollectionMenu] = useState(false);
  const collectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  const { data: user } = useQuery<IUser>({
    queryKey: ['profile'],
    queryFn: getProfile,
    enabled: !!token,
    retry: false,
  });

  const toggleMenu = () => setIsOpen(prev => !prev);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const menuItems = token
    ? [
        { key: '0', label: <span style={{ fontWeight: 'bold' }}>{user?.username || 'Người dùng'}</span>, disabled: true },
        { key: '1', label: <NavLink to="/profile">Thông tin tài khoản</NavLink> },
        ...(userRole === 'admin' ? [{ key: '2', label: <NavLink to="/admin">Trang quản trị</NavLink> }] : []),
        { key: '3', label: <span onClick={handleLogout}>Đăng xuất</span>, danger: true },
      ]
    : [
        { key: '1', label: <NavLink to="/login">Đăng nhập</NavLink> },
        { key: '2', label: <NavLink to="/register">Đăng ký</NavLink> },
      ];

  const menu = <Menu items={menuItems} />;

  // Đóng Collection khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (collectionRef.current && !collectionRef.current.contains(event.target as Node)) {
        setShowCollectionMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Đóng Collection khi cuộn trang
  useEffect(() => {
    const handleScroll = () => setShowCollectionMenu(false);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <HeaderTop>
        MIỄN PHÍ VẬN CHUYỂN VỚI ĐƠN HÀNG NỘI THÀNH &gt; 300K - ĐỔI TRẢ TRONG 30 NGÀY - ĐẢM BẢO CHẤT LƯỢNG
      </HeaderTop>

      <div style={{ position: 'relative', zIndex: 100 }}>
        <HeaderMain>
          <Logo>
            SNEAKER<span>TREND</span>
          </Logo>

          <NavMenu isOpen={isOpen}>
            <NavItem onClick={toggleMenu}><NavLink to="/">TRANG CHỦ</NavLink></NavItem>
            <NavItem>
              <span className="cursor-pointer" onClick={() => setShowCollectionMenu(true)}>BỘ SƯU TẬP</span>
            </NavItem>
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
            <Icon onClick={() => setShowSearch(true)} style={{ cursor: 'pointer' }}><SearchOutlined /></Icon>
            <Icon onClick={() => setShowCart(true)} style={{ cursor: 'pointer' }}><ShoppingCartOutlined /></Icon>
          </IconGroup>

          <HamburgerIcon onClick={toggleMenu} isOpen={isOpen}>
            <span></span><span></span><span></span><span></span>
          </HamburgerIcon>
        </HeaderMain>

        {/* Mega Menu Bộ Sưu Tập */}
        {showCollectionMenu && (
          <div
            ref={collectionRef}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              width: '100%',
              backgroundColor: '#fff',
              zIndex: 999,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            <Collection onClose={() => setShowCollectionMenu(false)} />
          </div>
        )}
      </div>

      {showCart && <SideCart onClose={() => setShowCart(false)} />}
      {showSearch && <SearchBox onClose={() => setShowSearch(false)} />}
    </>
  );
};

export default Header;
