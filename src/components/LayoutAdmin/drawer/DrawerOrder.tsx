import { Drawer, Descriptions, Skeleton, Divider, Tag, Table } from 'antd';
import type { IOrder } from '../../../interface/order';
import type { ColumnsType } from 'antd/es/table';

interface DrawerOrderProps {
  visible: boolean;
  order: IOrder | null;
  onClose: () => void;
  loading?: boolean;
}

const DrawerOrder = ({ visible, order, onClose, loading }: DrawerOrderProps) => {
  const renderStatus = (status: string) => {
    switch (status) {
      case 'pending':
        return <Tag color="blue">Chờ xử lý</Tag>;
      case 'processing':
        return <Tag color="green">Đang xử lý</Tag>;
      case 'shipped':
        return <Tag color="orange">Đang giao</Tag>;
      case 'delivered':
        return <Tag color="green">Đã giao</Tag>;
      case 'canceled':
        return <Tag color="red">Đã hủy</Tag>;
      default:
        return <Tag color="default">Không rõ</Tag>;
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: 'Tên sản phẩm',
      dataIndex: ['product_id', 'name'],
      key: 'product_name',
    },
    {
      title: 'Màu sắc',
      dataIndex: ['variant_id', 'color', 'name'],
      key: 'color',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `${price.toLocaleString('vi-VN')} ₫`,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Tổng',
      key: 'total',
      render: (_, record) => `${(record.price * record.quantity).toLocaleString('vi-VN')} ₫`,
    },
  ];

  return (
    <Drawer
      title={<span className="text-lg font-semibold">Chi tiết đơn hàng</span>}
      placement="right"
      onClose={onClose}
      open={visible}
      width={600}
    >
      {loading || !order ? (
        <Skeleton active />
      ) : (
        <>
          {/* Thông tin đơn hàng */}
          <div className="mb-4">
            <h3 className="text-base font-medium mb-2">Thông tin đơn hàng</h3>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Mã đơn hàng">
                {order._id}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {renderStatus(order.status)}
              </Descriptions.Item>
              {order.status === 'canceled' && (
                <>
                  <Descriptions.Item label="Lý do hủy">
                    {order.cancel_reason || '---'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày hủy">
                    {order.cancelled_at
                      ? new Date(order.cancelled_at).toLocaleString('vi-VN')
                      : '---'}
                  </Descriptions.Item>
                </>
              )}
              <Descriptions.Item label="Phương thức thanh toán">
                {order.payment_method === 'cod'
                  ? 'Thanh toán khi nhận hàng'
                  : order.payment_method}
              </Descriptions.Item>
              <Descriptions.Item label="Tổng tiền">
                {order.total_price.toLocaleString('vi-VN')} ₫
              </Descriptions.Item>
            </Descriptions>
          </div>

          <Divider />

          {/* Người đặt hàng */}
          <div className="mb-4">
            <h3 className="text-base font-medium mb-2">Thông tin người đặt</h3>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Tên tài khoản">
                {typeof order.user_id === 'object' && 'username' in order.user_id
                  ? order.user_id.username
                  : '---'}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {typeof order.user_id === 'object' && 'email' in order.user_id
                  ? order.user_id.email
                  : '---'}
              </Descriptions.Item>
            </Descriptions>
          </div>

          <Divider />

          {/* Danh sách sản phẩm */}
          <div className="mb-4">
            <h3 className="text-base font-medium mb-2">Danh sách sản phẩm</h3>
            <Table
              dataSource={order.items || []}
              columns={columns}
              rowKey="_id"
              pagination={false}
              size="small"
            />
          </div>

          <Divider />

          {/* Thời gian */}
          <div>
            <h3 className="text-base font-medium mb-2">Thời gian</h3>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Ngày tạo">
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString('vi-VN')
                  : '---'}
              </Descriptions.Item>
              <Descriptions.Item label="Cập nhật lần cuối">
                {order.updatedAt
                  ? new Date(order.updatedAt).toLocaleString('vi-VN')
                  : '---'}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </>
      )}
    </Drawer>
  );
};

export default DrawerOrder;
