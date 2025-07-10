import { Drawer, Descriptions, Divider, Skeleton, Empty } from 'antd';
import type { IBrand } from '../../../interface/brand';

interface DrawerBrandProps {
  visible: boolean;
  brand: IBrand | null;
  onClose: () => void;
  loading?: boolean;
}

const DrawerBrand = ({ visible, brand, onClose, loading }: DrawerBrandProps) => {
  return (
    <Drawer
      title={<span className="text-lg font-semibold">Chi tiết thương hiệu</span>}
      placement="right"
      onClose={onClose}
      open={visible}
      width={500}
    >
      {loading ? (
        <Skeleton active />
      ) : brand ? (
        <>
          <div className="mb-4">
            <h3 className="text-base font-medium mb-2">Thông tin cơ bản</h3>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Tên thương hiệu" className="bg-gray-50">
                {brand.name}
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả">
                {brand.description || '---'}
              </Descriptions.Item>
              <Descriptions.Item label="Số lượng sản phẩm" className="bg-gray-50">
                {brand.products?.length || 0}
              </Descriptions.Item>
              <Descriptions.Item label="Danh mục">
                {brand.category && brand.category.length > 0
                  ? brand.category.map((category) => category?.name).join(", ")
                  : "---"}
              </Descriptions.Item>
              <Descriptions.Item label="Hình ảnh">
                {brand.logo_image ? (
                  <img
                    src={brand.logo_image}
                    alt={brand.name}
                    style={{
                      width: 120,
                      height: 120,
                      objectFit: 'cover',
                      borderRadius: 8,
                      border: '1px solid #f0f0f0',
                    }}
                  />
                ) : (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Không có ảnh"
                    style={{ margin: 0, textAlign: 'center' }}
                  />
                )}
              </Descriptions.Item>
            </Descriptions>
          </div>

          <Divider />

          <div>
            <h3 className="text-base font-medium mb-2">Thông tin thời gian</h3>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Ngày tạo" className="bg-gray-50">
                {brand.createdAt
                  ? new Date(brand.createdAt).toLocaleString('vi-VN')
                  : '---'}
              </Descriptions.Item>
              <Descriptions.Item label="Cập nhật lần cuối">
                {brand.updatedAt
                  ? new Date(brand.updatedAt).toLocaleString('vi-VN')
                  : '---'}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </>
      ) : (
        <Empty description="Không có thương hiệu được chọn" />
      )}
    </Drawer>
  );
};

export default DrawerBrand;
