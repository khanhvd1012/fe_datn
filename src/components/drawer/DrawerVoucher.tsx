import type { IVoucher } from '../../interface/voucher';
import Title from 'antd/es/typography/Title';
import { Drawer, Empty, Skeleton } from 'antd';

interface DrawerVoucherProps {
  visible: boolean;
  voucher: IVoucher | null;
  loading: boolean;
  onClose: () => void;
}

const DrawerVoucher = ({ visible, voucher, loading, onClose }: DrawerVoucherProps) => {
  return (
    <Drawer
      title={<Title level={4}>{voucher?.code || 'Chi tiết voucher'}</Title>}
      placement="right"
      width={500}
      onClose={onClose}
      open={visible}
    >
      {loading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : voucher ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <strong>Mã voucher:</strong>
            <p>{voucher.code}</p>
          </div>

          <div>
            <strong>Loại:</strong>
            <p>{voucher.type}</p>
          </div>

          <div>
            <strong>Giá trị:</strong>
            <p>{voucher.value}</p>
          </div>

          {/* <div>
            <strong>Giảm tối đa:</strong>
            <p>{voucher.maxDiscount ?? 'Không giới hạn'}</p>
          </div>

          <div>
            <strong>Giá trị đơn hàng tối thiểu:</strong>
            <p>{voucher.minOrderValue}</p>
          </div> */}

          <div>
            <strong>Số lượng:</strong>
            <p>{voucher.quantity}</p>
          </div>

          <div>
            <strong>Đã sử dụng:</strong>
            <p>{voucher.usedCount}</p>
          </div>

          <div>
            <strong>Ngày bắt đầu:</strong>
            <p>{voucher.startDate ? new Date(voucher.startDate).toLocaleDateString() : 'N/A'}</p>
          </div>

          <div>
            <strong>Ngày kết thúc:</strong>
            <p>{voucher.endDate ? new Date(voucher.endDate).toLocaleDateString() : 'N/A'}</p>
          </div>

          <div>
            <strong>Trạng thái:</strong>
            <p>{voucher.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}</p>
          </div>
        </div>
      ) : (
        <Empty description="Không có voucher được chọn" />
      )}
    </Drawer>
  );
};

export default DrawerVoucher;
