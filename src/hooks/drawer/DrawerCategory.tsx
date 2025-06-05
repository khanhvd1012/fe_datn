import type { ICategory } from '../../interface/category';
import Title from 'antd/es/typography/Title';
import { Drawer, Empty, Skeleton } from 'antd';

interface DrawerCategoryProps {
  visible: boolean;
  category: ICategory | null;
  loading: boolean;
  onClose: () => void;
}

const DrawerCategory = ({ visible, category, loading, onClose }: DrawerCategoryProps) => {
  return (
    <div>
      <Drawer
        title={<Title level={4}>{category?.name || 'Chi tiết danh mục'}</Title>}
        placement="right"
        width={500}
        onClose={onClose}
        open={visible}
      >
        {loading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : category ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <strong>Mô tả:</strong>
              <p>{category.description || 'Không có mô tả'}</p>
            </div>

            <div>
              <strong>Hình ảnh:</strong>
              <div style={{ marginTop: '8px' }}>
                {category.logo_image ? (
                  <img
                    src={category.logo_image}
                    alt={category.name}
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
              <p>{category.products?.length || 0} sản phẩm trong danh mục này</p>
            </div>

            <div>
              <strong>Ngày tạo:</strong>
              <p>{category.createdAt ? new Date(category.createdAt).toLocaleDateString() : 'N/A'}</p>
            </div>

            <div>
              <strong>Cập nhật lần cuối:</strong>
              <p>{category.updatedAt ? new Date(category.updatedAt).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
        ) : (
          <Empty description="Không có danh mục được chọn" />
        )}
      </Drawer>
    </div>
  );
};

export default DrawerCategory;