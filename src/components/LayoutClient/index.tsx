import { Routes, Route, Navigate, useLocation, useMatch } from 'react-router-dom';

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
import Profile from '../../pages/Client/Profile';
import Collection from '../../pages/Client/Collection';
import Checkout from './Checkout';

const IndexClient = () => {
  const location = useLocation();
  const matchProductDetail = useMatch('/products/:slug');

  // Kiểm tra các trang cần ẩn slideshow
  const isNoSlidePage =
    ['/login', '/register', '/profile', '/cart' ,'/checkout'].includes(location.pathname) ||
    Boolean(matchProductDetail);

  return (
    <div>
      <Header />
      {!isNoSlidePage && <Slideshow />}

      <div style={{ padding: isNoSlidePage ? '0' : '20px' }}>
        <Routes>
          {/* Trang chính */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/brand" element={<Brand />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />

          {/* Auth pages - không slideshow */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
           <Route path="/checkout" element={<Checkout />} />

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
