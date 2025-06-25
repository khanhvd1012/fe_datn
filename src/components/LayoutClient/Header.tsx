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

  const userMenu = (
    <Menu>
      <Menu.Item key="login">
        <Link to="/login">Đăng nhập</Link>
      </Menu.Item>
      <Menu.Item key="register">
        <Link to="/register">Đăng ký</Link>
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

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
          
          <NavItem onClick={toggleMenu}>
            <CateDropdown />
          </NavItem>
          <NavItem onClick={toggleMenu}>
            <BrandDropdown />
          </NavItem>

          <NavItem onClick={toggleMenu}><NavLink to="/about">GIỚI THIỆU</NavLink></NavItem>
          <NavItem onClick={toggleMenu}><NavLink to="/blog">TIN TỨC</NavLink></NavItem>
          <NavItem onClick={toggleMenu}><NavLink to="/contact">LIÊN HỆ</NavLink></NavItem>
        </NavMenu>

        <IconGroup>
          <Dropdown overlay={userMenu} trigger={['hover']}>
            <Icon style={{ cursor: 'pointer' }}>
              <UserOutlined />
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
