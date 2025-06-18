import React from 'react';
import BestSellingProducts from '../../components/LayoutClient/BestSellingProducts';
import BrandBanner from '../../components/LayoutClient/BrandBanner';
import NewProducts from '../../components/LayoutClient/NewProducts';
import LatestPosts from '../../components/LayoutClient/LatestPosts';
import SubscribeSection from '../../components/LayoutClient/SubscribeSection';
 // Cập nhật đúng đường dẫn nếu cần

const Home = () => {
  return (
    <div>

      {/* Section: Sản phẩm bán chạy */}
      <BestSellingProducts />
      <BrandBanner/>
      <NewProducts/>
      <LatestPosts/>
      <SubscribeSection/>
    </div>
  );
};

export default Home;
