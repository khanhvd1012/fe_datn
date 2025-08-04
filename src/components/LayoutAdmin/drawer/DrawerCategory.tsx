import { Drawer, Descriptions, Divider, Skeleton, Empty } from 'antd';
import type { ICategory } from '../../../interface/category';

interface DrawerCategoryProps {
  visible: boolean;
  category: ICategory | null;
  onClose: () => void;
  loading?: boolean;
}

const DrawerCategory = ({ visible, category, onClose, loading }: DrawerCategoryProps) => {
  return (
    <Drawer
      title={<span className="text-lg font-semibold">Chi tiết danh mục</span>}
      placement="right"
      onClose={onClose}
      open={visible}
      width={500}
    >
      {loading ? (
        <Skeleton active />
      ) : category ? (
        <>
          <div className="mb-4">
            <h3 className="text-base font-medium mb-2">Thông tin cơ bản</h3>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Tên danh mục" className="bg-gray-50">
                {category.name}
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả">
                {category.description || '---'}
              </Descriptions.Item>
              <Descriptions.Item label="Số lượng sản phẩm" className="bg-gray-50">
                {category.products?.length || 0}
              </Descriptions.Item>
              <Descriptions.Item label="Hình ảnh">
                {category.logo_image ? (
                  <img
                    src={category.logo_image}
                    alt={category.name}
                    style={{
                      width: 100,
                      height: 100,
                      objectFit: 'cover',
                      borderRadius: 4,
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
                {category.createdAt
                  ? new Date(category.createdAt).toLocaleString('vi-VN')
                  : '---'}
              </Descriptions.Item>
              <Descriptions.Item label="Cập nhật lần cuối">
                {category.updatedAt
                  ? new Date(category.updatedAt).toLocaleString('vi-VN')
                  : '---'}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </>
      ) : (
        <Empty description="Không có danh mục được chọn" />
      )}
    </Drawer>
  );
};

export default DrawerCategory;
