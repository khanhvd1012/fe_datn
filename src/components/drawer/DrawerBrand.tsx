import { Drawer, Empty, Skeleton } from 'antd';
import Title from 'antd/es/typography/Title';
import type { IBrand } from '../../interface/brand';

interface DrawerBrandProps {
  visible: boolean;
  brand: IBrand | null;
  loading: boolean;
  onClose: () => void;
}

const DrawerBrand = ({ visible, brand, loading, onClose }: DrawerBrandProps) => {
  return (
    <div>
      <Drawer
        title={<Title level={4}>{brand?.name || 'Chi tiết thương hiệu'}</Title>}
        placement="right"
        width={500}
        onClose={onClose}
        open={visible}
      >
        {loading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : brand ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <strong>Mô tả:</strong>
              <p>{brand.description || 'Không có mô tả'}</p>
            </div>

            <div>
              <strong>Logo:</strong>
              <div style={{ marginTop: '8px' }}>
                {brand.logo_image ? (
                  <img
                    src={brand.logo_image}
                    alt={brand.name}
                    style={{
                      width: 120,
                      height: 120,
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '1px solid #f0f0f0',
                    }}
                  />
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có ảnh" />
                )}
              </div>
            </div>

            <div>
              <strong>Sản phẩm:</strong>
              <p>{brand.products?.length || 0} sản phẩm trong thương hiệu này</p>
            </div>

            <div>
              <strong>Ngày tạo:</strong>
              <p>{brand.createdAt ? new Date(brand.createdAt).toLocaleDateString() : 'N/A'}</p>
            </div>

            <div>
              <strong>Cập nhật lần cuối:</strong>
              <p>{brand.updatedAt ? new Date(brand.updatedAt).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
        ) : (
          <Empty description="Không có thương hiệu được chọn" />
        )}
      </Drawer>
    </div>
  );
};

export default DrawerBrand;