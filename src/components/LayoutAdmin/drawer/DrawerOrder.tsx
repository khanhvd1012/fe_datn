import { Drawer, Descriptions, Skeleton, Divider, Tag, Table } from 'antd';
import type { IOrder } from '../../../interface/order';
import type { ColumnsType } from 'antd/es/table';
import { useColors } from '../../../hooks/useColors';
import { useSizes } from '../../../hooks/useSizes';


interface DrawerOrderProps {
  visible: boolean;
  order: IOrder | null;
  onClose: () => void;
  loading?: boolean;
}

const DrawerOrder = ({ visible, order, onClose, loading }: DrawerOrderProps) => {
  { console.log("Order data:", order) }
  // const { data: colors } = useColor();
  const { data: colors } = useColors();
  const { data: sizesData } = useSizes();

  const renderStatus = (status: string) => {
    switch (status) {
      case "pending":
        return <Tag color="blue">Chờ xử lý</Tag>;
      case "processing":
        return <Tag color="cyan">Đang xử lý</Tag>;
      case "shipped":
        return <Tag color="orange">Đang giao</Tag>;
      case "delivered":
        return <Tag color="green">Đã giao</Tag>;
      case "canceled":
        return <Tag color="red">Đã hủy</Tag>;
      case "returned":
        return <Tag color="purple">Đã trả hàng</Tag>;
      default:
        return <Tag color="default">Không rõ</Tag>;
    }
  };



  const columns: ColumnsType<any> = [
    {
      title: 'Tên sản phẩm',
      key: 'product_name',
      render: (_, record) => record.variant_id?.product_id?.name || "Không rõ",
    },

    {
      title: 'Màu sắc',
      key: 'color',
      render: (_, record) => {
        const colorId = record.variant_id?.color;
        const colorDetail = colors?.find((c: any) => c._id === colorId);

        return colorDetail ? (
          <span>{colorDetail.name}</span>
        ) : (
          "---"
        );
      },
    },
    {
      title: 'Kích thước',
      key: 'size',
      render: (_, record) => {
        const sizeId = record.variant_id?.size;
        const sizeDetail = sizesData?.find((s: any) => s._id === sizeId);

        return sizeDetail ? (
          <span>{sizeDetail.size}</span>
        ) : (
          "---"
        );
      },
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
                {order.order_code}
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
              <Descriptions.Item label="Tạm tính">
                {(order.sub_total || 0).toLocaleString("vi-VN")} ₫
              </Descriptions.Item>

              {(order?.voucher_discount || 0) > 0 && (
                <Descriptions.Item label="Mã giảm giá">
                  -{(order?.voucher_discount || 0).toLocaleString("vi-VN")} ₫
                </Descriptions.Item>
              )}

              <Descriptions.Item label="Phí vận chuyển">
                {(
                  (order.total_price || 0) -
                  (order.sub_total || 0) +
                  (order.voucher_discount || 0)
                ).toLocaleString("vi-VN")} ₫
              </Descriptions.Item>

              <Descriptions.Item label="Tổng thanh toán">
                <strong className="text-green-600">
                  {(order.total_price || 0).toLocaleString("vi-VN")} ₫
                </strong>
              </Descriptions.Item>
            </Descriptions>
          </div>
          <Divider />

          {/* Người đặt hàng */}
          <div className="mb-4">
            <h3 className="text-base font-medium mb-2">Thông tin người đặt</h3>
            <Descriptions column={1} bordered size="small">
              {/* Tách shipping_address thành Tên - SĐT - Địa chỉ */}
              {order.shipping_address && (
                <>
                  <Descriptions.Item label="Người nhận">
                    {order.shipping_address.split(" - ")[0] || "---"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại">
                    {order.shipping_address.split(" - ")[1] || "---"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Địa chỉ">
                    {order.shipping_address.split(" - ")[2] || "---"}
                  </Descriptions.Item>
                </>
              )}
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
