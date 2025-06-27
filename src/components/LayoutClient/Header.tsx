// Header.tsx
import React, { useState } from 'react';
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
} from './style';
import { NavLink, useNavigate } from 'react-router-dom';
import SideCart from '../../pages/Client/SideCart'; // Thêm dòng này

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCart, setShowCart] = useState(false); // State điều khiển SideCart
  const navigate = useNavigate();

  // Kiểm tra token, role và tên người dùng
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  const userName = localStorage.getItem('name');

  const toggleMenu = () => {
    setIsOpen(prev => !prev);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const menuItems = token
    ? [
        { key: '0', label: <span style={{ fontWeight: 'bold' }}>{userName || 'Người dùng'}</span>, disabled: true },
        { key: '1', label: <NavLink to="/profile">Thông tin tài khoản</NavLink> },
        ...(userRole === 'admin' ? [{ key: '2', label: <NavLink to="/admin">Trang quản trị</NavLink> }] : []),
        { key: '3', label: <span onClick={handleLogout}>Đăng xuất</span>, danger: true },
      ]
    : [
        { key: '1', label: <NavLink to="/login">Đăng nhập</NavLink> },
        { key: '2', label: <NavLink to="/register">Đăng ký</NavLink> },
      ];

  const menu = <Menu items={menuItems} />;

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
          <NavItem onClick={toggleMenu}><NavLink to="/collection">BỘ SƯU TẬP</NavLink></NavItem>
          <NavItem onClick={toggleMenu}><NavLink to="/products">SẢN PHẨM</NavLink></NavItem>
          <NavItem onClick={toggleMenu}><NavLink to="/about">GIỚI THIỆU</NavLink></NavItem>
          <NavItem onClick={toggleMenu}><NavLink to="/blog">BLOG</NavLink></NavItem>
          <NavItem onClick={toggleMenu}><NavLink to="/contact">LIÊN HỆ</NavLink></NavItem>
        </NavMenu>

        <IconGroup>
          <Dropdown overlay={menu} trigger={['hover']} placement="bottomRight">
            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <Icon><UserOutlined /></Icon>
              {token && <span style={{ marginLeft: 8, fontWeight: 'bold' }}>{userName || 'Người dùng'}</span>}
            </div>
          </Dropdown>
          <Icon><SearchOutlined /></Icon>
          <Icon onClick={() => setShowCart(true)} style={{ cursor: 'pointer' }}>
            <ShoppingCartOutlined />
          </Icon>
        </IconGroup>

        <HamburgerIcon onClick={toggleMenu} isOpen={isOpen}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </HamburgerIcon>
      </HeaderMain>

      {showCart && <SideCart onClose={() => setShowCart(false)} />}
    </>
  );
};

export default Header;

