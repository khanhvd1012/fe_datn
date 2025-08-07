import { Routes, Route, Navigate, useLocation, useMatch } from 'react-router-dom';

import Header from './Header';
import Footer from './Footer';
import Slideshow from './SlideShow';
import Gallery from './Gallery';

import Home from '../../pages/Client/Home';
import About from '../../pages/Client/About';
import Blog from '../../pages/Client/Blog';
import Contact from '../../pages/Client/Contact';
import Products from '../../pages/Client/Products';
import Cart from '../../pages/Client/Cart';
import ProductDetail from './ProductDetail';
import Login from '../../pages/Auth/login';
import Register from '../../pages/Auth/register';
import Profile from '../../pages/Client/Profile';
import Checkout from './Checkout';
import CollectionPage from './CollectionPage';
import CheckoutSuccess from './CheckoutSuccess';
import OrderHistory from './OrderHistory';
import OrderDetail from './OrderDetail';
import ProductReview from './ProductReview';
import BlogDetail from '../../pages/Client/BlogDetail';
import CheckoutFailed from './CheckoutFailed';


const IndexClient = () => {
  const location = useLocation();
  const matchProductDetail = useMatch('/products/:slug');
  const matchCollectionPage = useMatch('/collection/:slug');
   const matchOrderDetailPage = useMatch('/OrderDetail/:id');
     const matchBlogDetailPage = useMatch('/blog/:id');

  // Kiểm tra các trang cần ẩn slideshow
  const isNoSlidePage =
    ['/login', '/register', '/profile', '/cart', '/checkout','/checkout/success' ,'/order-history' ,'/ProductReview'].includes(location.pathname) ||
    Boolean(matchProductDetail) ||
    Boolean(matchCollectionPage) ||
    Boolean(matchOrderDetailPage)||
    Boolean(matchBlogDetailPage);

  return (
    <div>
      <Header />
      {!isNoSlidePage && <Slideshow />}

      <div style={{ padding: isNoSlidePage ? '0' : '20px' }}>
        <Routes>
          {/* Trang chính */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          {/* <Route path="/collection" element={<Collection />} /> */}
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
          <Route path="/collection/:slug" element={<CollectionPage />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/checkout/failed" element={<CheckoutFailed />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/OrderDetail/:id" element={<OrderDetail />} />
          <Route path="/ProductReview" element={<ProductReview />} />
          <Route path="/blog/:id" element={<BlogDetail />} />

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