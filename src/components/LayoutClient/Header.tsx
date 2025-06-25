// Header.tsx
import React, { useState } from 'react';
import {
  UserOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import {
  HeaderTop,
  HeaderMain,
  Logo,
  NavMenu,
  NavItem,
  IconGroup,
  Icon,
  HamburgerIcon,
} from './style';
import { Link, NavLink } from 'react-router-dom';
import SideCart from '../../pages/Client/SideCart';
import BrandDropdown from './BrandDropdown';
import CateDropdown from './CateDropdown';
import { Dropdown, Menu } from 'antd';
import SearchBox from './Search';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    window.location.reload();
  };

  // Lấy role và userName từ localStorage
  const role = localStorage.getItem("role");
  const userName = localStorage.getItem("userName");

  // Menu cho admin
  const adminMenu = (
    <Menu>
      <Menu.Item key="admin">
        <Link to="/admin">Quản trị Admin</Link>
      </Menu.Item>
      <Menu.Item key="profile">
        <Link to="/profile">Thông tin tài khoản</Link>
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  // Menu cho user thường
  const userMenu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to="/profile">Thông tin tài khoản</Link>
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  // Menu cho khách chưa đăng nhập
  const guestMenu = (
    <Menu>
      <Menu.Item key="login">
        <Link to="/login">Đăng nhập</Link>
      </Menu.Item>
      <Menu.Item key="register">
        <Link to="/register">Đăng ký</Link>
      </Menu.Item>
    </Menu>
  );

  // Chọn menu phù hợp
  let menuToShow = guestMenu;
  if (localStorage.getItem("token")) {
    menuToShow = role === "admin" ? adminMenu : userMenu;
  }

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
          <NavItem onClick={toggleMenu}><NavLink to="/products">SẢN PHẨM</NavLink></NavItem>
          <NavItem onClick={toggleMenu}><CateDropdown /></NavItem>
          <NavItem onClick={toggleMenu}><BrandDropdown /></NavItem>
          <NavItem onClick={toggleMenu}><NavLink to="/about">GIỚI THIỆU</NavLink></NavItem>
          <NavItem onClick={toggleMenu}><NavLink to="/blog">TIN TỨC</NavLink></NavItem>
          <NavItem onClick={toggleMenu}><NavLink to="/contact">LIÊN HỆ</NavLink></NavItem>
        </NavMenu>

        <IconGroup>
          <Dropdown overlay={menuToShow} trigger={['hover']}>
            <Icon style={{ cursor: 'pointer' }}>
              <UserOutlined />
              {userName && (
                <span style={{ marginLeft: 8, fontSize: 13 }}>
                  {role === "admin" ? `Admin: ${userName}` : userName}
                </span>
              )}
            </Icon>
          </Dropdown>
          <Link to="/search">
            <Icon><SearchBox /></Icon>
          </Link>
          <Icon onClick={() => setIsCartOpen(true)}>
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

      {isCartOpen && <SideCart onClose={() => setIsCartOpen(false)} />}
    </>
  );
};

export default Header;
