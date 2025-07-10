import { Drawer, Descriptions, Skeleton, Divider, Empty } from 'antd';
import type { ISize } from '../../../interface/size';

interface DrawerSizeProps {
  visible: boolean;
  size: ISize | null;
  loading: boolean;
  onClose: () => void;
}

const DrawerSize = ({ visible, size, loading, onClose }: DrawerSizeProps) => {
  return (
    <Drawer
      title={<span className="text-lg font-semibold">Chi tiết kích thước</span>}
      placement="right"
      onClose={onClose}
      open={visible}
      width={500}
    >
      {loading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : size ? (
        <>
          <div className="mb-4">
            <h3 className="text-base font-medium mb-2">Thông tin cơ bản</h3>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Giá trị kích thước">
                {size.size ?? '---'}
              </Descriptions.Item>
            </Descriptions>
          </div>

          <Divider />

          <div>
            <h3 className="text-base font-medium mb-2">Thông tin thời gian</h3>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Ngày tạo">
                {size.createdAt
                  ? new Date(size.createdAt).toLocaleString('vi-VN')
                  : '---'}
              </Descriptions.Item>
              <Descriptions.Item label="Cập nhật lần cuối">
                {size.updatedAt
                  ? new Date(size.updatedAt).toLocaleString('vi-VN')
                  : '---'}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </>
      ) : (
        <Empty description="Không có kích thước được chọn" />
      )}
    </Drawer>
  );
};

export default DrawerSize;
