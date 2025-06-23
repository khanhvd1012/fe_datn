import type { ISize } from '../../interface/size';
import Title from 'antd/es/typography/Title';
import { Drawer, Empty, Skeleton, Tag } from 'antd';

interface DrawerSizeProps {
  visible: boolean;
  size: ISize | null;
  loading: boolean;
  onClose: () => void;
}

const DrawerSize = ({ visible, size, loading, onClose }: DrawerSizeProps) => {
  return (
    <div>
      <Drawer
        title={<Title level={4}>{size?.name || 'Chi tiết kích thước'}</Title>}
        placement="right"
        width={500}
        onClose={onClose}
        open={visible}
      >
        {loading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : size ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <strong>Tên kích thước:</strong>
              <p>{size.name}</p>
            </div>

            <div>
              <strong>Giá trị:</strong>
              <p>{size.value}</p>
            </div>

            <div>
              <strong>Trạng thái:</strong>
              <p style={{ margin: '8px 0' }}>
                <Tag color={size.status === 'active' ? 'success' : 'error'}>
                  {size.status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                </Tag>
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <strong>Ngày tạo:</strong>
                <p style={{ margin: '8px 0' }}>
                  {size.createdAt ? new Date(size.createdAt).toLocaleString() : 'N/A'}
                </p>
              </div>

              <div>
                <strong>Cập nhật lần cuối:</strong>
                <p style={{ margin: '8px 0' }}>
                  {size.updatedAt ? new Date(size.updatedAt).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <Empty description="Không có kích thước được chọn" />
        )}
      </Drawer>
    </div>
  );
};

export default DrawerSize;
