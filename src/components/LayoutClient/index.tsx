import React from 'react';
import { Link, Route, Routes, Navigate,  } from 'react-router-dom';

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
import Breadcrumb from 'antd/es/breadcrumb/Breadcrumb';


// Import các page

const IndexClient = () => {
  return (
    <div>
      <Header />
      <Slideshow />
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="brand" element={<Brand />} />
          <Route path="about" element={<About />} />
          <Route path="blog" element={<Blog />} />
          <Route path="contact" element={<Contact />} />
          <Route path="cart" element={<Cart />} />
          {/* fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>

      <Gallery />
      <Footer />
    </div>
  );
};

export default IndexClient;
