import { Drawer, Descriptions, Skeleton, Divider } from 'antd';
import type { IProduct } from '../../../interface/product';

interface DrawerProductProps {
  visible: boolean;
  product: IProduct | null;
  onClose: () => void;
  loading?: boolean;
}

const DrawerProduct = ({ visible, product, onClose, loading }: DrawerProductProps) => {
  return (
    <Drawer
      title={<span className="text-lg font-semibold">Chi tiết sản phẩm</span>}
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
              <Descriptions.Item label="Tên sản phẩm" className="bg-gray-50">
                {product?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả">
                {product?.description || '---'}
              </Descriptions.Item>
              <Descriptions.Item label="Thương hiệu" className="bg-gray-50">
                {typeof product?.brand === 'string' ? product?.brand : product?.brand?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Danh mục">
                {typeof product?.category === 'string' ? product?.category : product?.category?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Biến thể" className="bg-gray-50">
                {product?.variants?.length || 0}
              </Descriptions.Item>
              <Descriptions.Item label="Kích cỡ">
                {Array.isArray(product?.size)
                  ? product.size.map((s: any) => (typeof s === 'string' ? s : s.size)).join(', ')
                  : '---'}
              </Descriptions.Item>
            </Descriptions>
          </div>

          <Divider />

          <div>
            <h3 className="text-base font-medium mb-2">Thông tin thời gian</h3>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Ngày tạo" className="bg-gray-50">
                {product && (product as any).createdAt
                  ? new Date((product as any).createdAt).toLocaleString('vi-VN')
                  : '---'}
              </Descriptions.Item>
              <Descriptions.Item label="Cập nhật lần cuối">
                {product && (product as any).updatedAt
                  ? new Date((product as any).updatedAt).toLocaleString('vi-VN')
                  : '---'}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </>
      )}
    </Drawer>
  );
};

export default DrawerProduct;