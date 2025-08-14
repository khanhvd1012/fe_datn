import BestSellingProducts from '../../components/LayoutClient/BestSellingProducts';
import BrandBanner from '../../components/LayoutClient/BrandBanner';
import NewProducts from '../../components/LayoutClient/NewProducts';
import LatestPosts from '../../components/LayoutClient/LatestPosts';

const Home = () => {
  return (
    <div>

      {/* Section: Sản phẩm bán chạy */}
      <BestSellingProducts />
      <BrandBanner/>
      <NewProducts/>
      <LatestPosts/>
    </div>
  );
};

export default Home;
