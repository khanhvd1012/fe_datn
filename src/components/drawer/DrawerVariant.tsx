import { Drawer, Descriptions, Skeleton, Divider, Tag } from 'antd';
import type { IVariant } from '../../interface/variant';

interface DrawerVariantProps {
  visible: boolean;
  variant: IVariant | null;
  onClose: () => void;
  loading?: boolean;
}

const DrawerVariant = ({ visible, variant, onClose, loading }: DrawerVariantProps) => {
  // Helper render for color/size array
  const renderArray = (arr: any, color: string) => {
    if (!arr) return '---';
    if (Array.isArray(arr)) {
      return arr.length > 0 ? (
        arr.map((item: any, idx: number) => (
          <Tag color={color} key={idx}>
            {typeof item === 'string' ? item : item?.name}
          </Tag>
        ))
      ) : (
        '---'
      );
    }
    return typeof arr === 'string' ? <Tag color={color}>{arr}</Tag> : arr?.name;
  };

  return (
    <Drawer
      title={<span className="text-lg font-semibold">Chi tiết biến thể</span>}
      placement="right"
      onClose={onClose}
      open={visible}
      width={500}
    >
      {loading ? (
        <Skeleton active />
      ) : (
        <>
          <div className="mb-4">
            <h3 className="text-base font-medium mb-2">Thông tin cơ bản</h3>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="SKU" className="bg-gray-50">
                {variant?.sku}
              </Descriptions.Item>
              <Descriptions.Item label="Sản phẩm">
                {typeof variant?.product_id === 'string' ? variant?.product_id : variant?.product_id?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Màu sắc" className="bg-gray-50">
                {renderArray(variant?.color, 'blue')}
              </Descriptions.Item>
              <Descriptions.Item label="Kích cỡ">
                {Array.isArray(variant?.size)
                  ? variant.size.map((s: any) => (typeof s === 'string' ? s : s.size)).join(', ')
                  : '---'}
              </Descriptions.Item>
              <Descriptions.Item label="Giá bán" className="bg-gray-50">
                {variant?.price?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
              </Descriptions.Item>
              <Descriptions.Item label="Giá nhập">
                {variant?.import_price?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
              </Descriptions.Item>
              <Descriptions.Item label="Hình ảnh" className="bg-gray-50">
                {variant?.image_url && variant.image_url.length > 0 ? (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {variant.image_url.map((url: string, idx: number) => (
                      <img
                        key={idx}
                        src={url}
                        alt={`Ảnh ${idx + 1}`}
                        style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4, border: '1px solid #eee' }}
                      />
                    ))}
                  </div>
                ) : (
                  '---'
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {variant?.status === 'inStock' ? (
                  <Tag color="success">Còn hàng</Tag>
                ) : (
                  <Tag color="red">Hết hàng</Tag>
                )}
              </Descriptions.Item>
            </Descriptions>
          </div>

          <Divider />

          <div>
            <h3 className="text-base font-medium mb-2">Thông tin thời gian</h3>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Ngày tạo" className="bg-gray-50">
                {variant?.createdAt ? new Date(variant.createdAt).toLocaleString('vi-VN') : '---'}
              </Descriptions.Item>
              <Descriptions.Item label="Cập nhật lần cuối">
                {variant?.updatedAt ? new Date(variant.updatedAt).toLocaleString('vi-VN') : '---'}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </>
      )}
    </Drawer>
  );
};

export default DrawerVariant;