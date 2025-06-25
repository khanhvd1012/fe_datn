import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Header from './Header';
import Footer from './Footer';
import Slideshow from './SlideShow';
import Gallery from './Gallery';

import Home from '../../pages/Client/Home';
import About from '../../pages/Client/About';
import Blog from '../../pages/Client/Blog';
import Contact from '../../pages/Client/Contact';
import Brand from '../../pages/Client/Brand';
import Products from '../../pages/Client/Products';
import Cart from '../../pages/Client/Cart';
import ProductDetail from './ProductDetail';
import Login from '../../pages/Auth/login';
import Register from '../../pages/Auth/register';

const IndexClient = () => {
  const location = useLocation();

  // Chỉ ẩn Slideshow ở các trang này
  const isNoSlidePage = ['/login', '/register'].includes(location.pathname);


  return (
    <div>
      <Header />
      {!isNoSlidePage && <Slideshow />}

      <div style={{ padding: isNoSlidePage ? '0' : '20px' }}>
        <Routes>
          {/* Trang chính */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/brand" element={<Brand />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />

          {/* Auth pages - không slideshow */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>

      <Gallery />
      <Footer />
    </div>
  );
};

export default IndexClient;
