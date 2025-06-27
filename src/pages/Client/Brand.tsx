import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProductsByBrand } from '../../service/productAPI';
import Header from '../../components/LayoutClient/Header';
import Footer from '../../components/LayoutClient/Footer';
import Breadcrumb from '../../components/LayoutClient/Breadcrumb';
import Slideshow from '../../components/LayoutClient/SlideShow';
import SidebarMenu from '../../components/LayoutClient/SideBarMenu';

const priceRanges = ['Dưới 500,000₫', '500,000₫ - 1,000,000₫', '1,000,000₫ - 1,500,000₫', '2,000,000₫ - 5,000,000₫', 'Trên 5,000,000₫'];
const colors = ['#f44336', '#3f51b5', '#000000', '#03a9f4', '#e1e1e1', '#607d8b', '#ff4081', '#9e9e9e'];
const sizes = [35, 36, 37, 38, 39, 40];

const Brand = () => {
  const { id } = useParams();
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', 'brand', id],
    queryFn: () => getProductsByBrand(id!),
    enabled: !!id,
  });

  return (
    <>
      <Header />
      <Slideshow />
      <Breadcrumb current="Thương hiệu" />
      <div className="px-10 py-5 font-[Quicksand]">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-1/4 space-y-5">
            <SidebarMenu />
            <FilterSection title="GIÁ SẢN PHẨM" items={priceRanges} renderItem={(label, i) => (
              <label key={i}><input type="checkbox" className="mr-2" /> {label}</label>
            )} />
            <FilterSection title="MÀU SẮC" items={colors} renderItem={(color, i) => (
              <div key={i} className="w-6 h-6 rounded border" style={{ backgroundColor: color }} />
            )} />
            <FilterSection title="KÍCH THƯỚC" items={sizes} renderItem={(size) => (
              <button key={size} className="border px-2 py-1">{size}</button>
            )} />
          </aside>

          {/* Products */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-4 gap-6">
            {isLoading ? (
              <div className="col-span-4 text-center py-10">Đang tải...</div>
            ) : products.length === 0 ? (
              <div className="col-span-4 text-center py-10">Không có sản phẩm nào</div>
            ) : (
              products.map((product: any) => (
                <Link
                  to={`/products/${product._id}`}
                  key={product._id}
                  className="bg-white rounded-xl shadow text-center p-4 hover:shadow-lg transition block"
                >
                  <img
                    src={product.images?.[0] || ''}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <div className="mt-3 text-base font-medium">{product.name}</div>
                  <div className="text-sm font-semibold text-gray-800 mt-1">
                    {product.price?.toLocaleString('vi-VN')}₫
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

// const FilterSection = ({ title, items, renderItem }: any) => (
//   <div>
//     <h3 className="font-semibold mb-3">{title}</h3>
//     <div className={`space-y-1 ${title === 'MÀU SẮC' || title === 'KÍCH THƯỚC' ? 'flex flex-wrap gap-2' : ''}`}>
//       {items.map(renderItem)}
//     </div>
//   </div>
// );
const FilterSection = <T,>({
  title,
  items,
  renderItem,
}: {
  title: string;
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
}) => (
  <div>
    <h3 className="font-semibold mb-3">{title}</h3>
    <div
      className={`${
        title === 'MÀU SẮC' || title === 'KÍCH THƯỚC'
          ? 'flex flex-wrap gap-2'
          : 'space-y-1'
      }`}
    >
      {items.map((item, index) => renderItem(item, index))}
    </div>
  </div>
);


export default Brand;
