import React from 'react';
import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';
import { Link, Route, Routes, Navigate, useLocation } from 'react-router-dom';

import Header from './Header';
import Footer from './Footer';
import Slideshow from './SlideShow';
import Gallery from './Gallery';
import Home from '../../pages/Client/Home';
import Collection from '../../pages/Client/Collection';
import Products from '../../pages/Client/Products';
import About from '../../pages/Client/About';
import Blog from '../../pages/Client/Blog';
import Contact from '../../pages/Client/Contact';

// Import các page

const IndexClient = () => {
  const location = useLocation();

  // Tạo breadcrumb
  const getBreadcrumbItems = () => {
    const pathSnippets = location.pathname.split('/').filter(i => i);
    let url = '';
    const items = pathSnippets.map(snippet => {
      url += `/${snippet}`;
      return {
        title: (
          <Link to={url}>
            {snippet.charAt(0).toUpperCase() + snippet.slice(1)}
          </Link>
        ),
      };
    });

    return items;
  };

  return (
    <div>
      <Header />
      <Slideshow />

      <div style={{ padding: '20px' }}>
        <Routes>
          <Route index element={<Home />} />
          <Route path="collection" element={<Collection />} />
          <Route path="products" element={<Products />} />
          <Route path="about" element={<About />} />
          <Route path="blog" element={<Blog />} />
          <Route path="contact" element={<Contact />} />
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
