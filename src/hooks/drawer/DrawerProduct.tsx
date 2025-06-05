import type { IProduct } from '../../interface/product';
import { Drawer, Empty, Skeleton, Tag } from 'antd';
import Title from 'antd/es/typography/Title';

interface DrawerProductProps {
  visible: boolean;
  product: IProduct | null;
  loading: boolean;
  onClose: () => void;
}

const DrawerProduct = ({ visible, product, loading, onClose }: DrawerProductProps) => {
  return (
    <div>
      <Drawer
        title={<Title level={4}>{product?.name || 'Chi tiết sản phẩm'}</Title>}
        placement="right"
        width={600}
        onClose={onClose}
        open={visible}
      >
        {loading ? (
          <Skeleton active paragraph={{ rows: 10 }} />
        ) : product ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <strong>Hình ảnh:</strong>
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap' }}>
                {product.images && product.images.length > 0 ? (
                  product.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Sản phẩm ${index + 1}`}
                      style={{
                        width: 120,
                        height: 120,
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '1px solid #f0f0f0',
                      }}
                    />
                  ))
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có ảnh" />
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <strong>Giá:</strong>
                <p style={{ margin: '8px 0', fontSize: '16px' }}>{product.price?.toFixed(2)} đ</p>
              </div>

              <div>
                <strong>Trạng thái:</strong>
                <p style={{ margin: '8px 0' }}>
                  <Tag color={product.status === 'inStock' ? 'success' : 'error'}>
                    {product.status === 'inStock' ? 'Còn hàng' : 'Hết hàng'}
                  </Tag>
                </p>
              </div>

              <div>
                <strong>Thương hiệu:</strong>
                <p style={{ margin: '8px 0' }}>
                  {typeof product.brand === 'object' && product.brand !== null && 'name' in product.brand
                    ? product.brand.name
                    : 'Chưa có thương hiệu'}
                </p>
              </div>

              <div>
                <strong>Danh mục:</strong>
                <p style={{ margin: '8px 0' }}>
                  {typeof product.category === 'object' && product.category !== null && 'name' in product.category
                    ? product.category.name
                    : 'Chưa phân loại'}
                </p>
              </div>

              <div>
                <strong>Giới tính:</strong>
                <p style={{ margin: '8px 0' }}>
                  <Tag
                    color={
                      product.gender === 'male' ? 'blue' : product.gender === 'female' ? 'pink' : 'green'
                    }
                  >
                    {product.gender === 'male' ? 'NAM' : product.gender === 'female' ? 'NỮ' : 'UNISEX'}
                  </Tag>
                </p>
              </div>
            </div>

            <div>
              <strong>Mô tả:</strong>
              <p style={{ margin: '8px 0', whiteSpace: 'pre-wrap' }}>{product.description}</p>
            </div>

            <div>
              <strong>Biến thể:</strong>
              <div style={{ marginTop: '8px' }}>
                {product.variants && product.variants.length > 0 ? (
                  <div
                    style={{
                      backgroundColor: '#f5f5f5',
                      padding: '12px',
                      borderRadius: '8px',
                      maxHeight: '200px',
                      overflowY: 'auto',
                    }}
                  >
                    <pre style={{ margin: 0, fontSize: '13px' }}>
                      {JSON.stringify(product.variants, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <Empty description="Không có biến thể" />
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <strong>Ngày tạo:</strong>
                <p style={{ margin: '8px 0' }}>
                  {product.createdAt ? new Date(product.createdAt).toLocaleString() : 'N/A'}
                </p>
              </div>

              <div>
                <strong>Cập nhật lần cuối:</strong>
                <p style={{ margin: '8px 0' }}>
                  {product.updatedAt ? new Date(product.updatedAt).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <Empty description="Không có sản phẩm được chọn" />
        )}
      </Drawer>
    </div>
  );
};

export default DrawerProduct;