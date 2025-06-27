import { useQueryClient } from '@tanstack/react-query';
import { Button, Form, InputNumber, message, Select, Skeleton } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useUpdateVariant, useVariant } from '../../../hooks/useVariants';
import { useProducts } from '../../../hooks/useProducts';
import { useColors } from '../../../hooks/useColors';
import { useSizes } from '../../../hooks/useSizes';

const EditVariant = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const { data: variant, isLoading } = useVariant(id!);
  const { mutate, isPending: isUpdating } = useUpdateVariant();
  const { data: products } = useProducts();
  const { data: colors } = useColors();
  const { data: sizes } = useSizes();

  const initialValues = variant && variant.data ? {
    ...variant.data,
    color: typeof variant.data.color === 'object' ? variant.data.color._id : variant.data.color,
    product_id: typeof variant.data.product_id === 'object' ? variant.data.product_id._id : variant.data.product_id,
    size: Array.isArray(variant.data.size)
      ? variant.data.size.map((s: any) => (typeof s === 'object' ? s._id : s))
      : [],
  } : {};

  const handleSubmit = (values: any) => {
    if (!id) return;
    const submitValues = {
      ...values,
    };
    mutate(
      { id, variant: submitValues },
      {
        onSuccess: () => {
          messageApi.success('Cập nhật biến thể thành công!');
          queryClient.invalidateQueries({ queryKey: ['variants'] });
          setTimeout(() => {
            navigate("/admin/variants");
          }, 1000);
        },
        onError: () => {
          messageApi.error('Cập nhật biến thể thất bại!');
        },
      }
    );
  };

  if (isLoading) return <Skeleton active />;
  return (
    <div className="max-w-2xl mx-auto p-4">
      {contextHolder}
      <h2 className="text-2xl font-bold mb-4">Cập nhật Biến Thể</h2>
      <Form
        layout="vertical"
        initialValues={initialValues}
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Sản phẩm"
          name="product_id"
          rules={[{ required: true, message: 'Vui lòng chọn sản phẩm!' }]}
        >
          <Select placeholder="Chọn sản phẩm">
            {products?.map((p: any) => (
              <Select.Option key={typeof p === 'string' ? p : p._id} value={typeof p === 'string' ? p : p._id}>
                {typeof p === 'string' ? p : p.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Kích thước sản phẩm"
          name="size"
          rules={[{ required: true, message: 'Vui lòng chọn ít nhất một kích thước!' }]}
        >
          <Select
            mode="multiple"
            placeholder="Chọn kích thước"
            allowClear
          >
            {sizes?.map((size: any) => (
              <Select.Option
                key={typeof size === 'string' ? size : size._id}
                value={typeof size === 'string' ? size : size._id}
              >
                {typeof size === 'string' ? size : size.size}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Màu sắc"
          name="color"
          rules={[{ required: true, message: 'Vui lòng nhập màu sắc!' }]}
        >
          <Select placeholder="Chọn màu sắc">
            {colors?.map((p: any) => (
              <Select.Option key={typeof p === 'string' ? p : p._id} value={typeof p === 'string' ? p : p._id}>
                {typeof p === 'string' ? p : p.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Giá bán"
          name="price"
          rules={[{ required: true, message: 'Vui lòng nhập giá bán!' }]}
        >
          <InputNumber style={{ width: '100%' }} type="number" placeholder="Nhập giá bán" />
        </Form.Item>
        <Form.Item
          label="Giá nhập"
          name="import_price"
          rules={[
            { required: true, message: 'Vui lòng nhập giá nhập!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const price = getFieldValue('price');
                if (value === undefined || value === null) {
                  return Promise.reject('Vui lòng nhập giá nhập!');
                }
                if (value < 0) {
                  return Promise.reject('Giá nhập không được âm!');
                }
                if (price !== undefined && value > price) {
                  return Promise.reject('Giá nhập không được cao hơn giá bán!');
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <InputNumber style={{ width: '100%' }} type="number" placeholder="Nhập giá nhập" />
        </Form.Item>
        <Form.Item
          label="Giới tính"
          name="gender"
          rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
        >
          <Select placeholder="Chọn giới tính">
            <Select.Option value="unisex">Unisex</Select.Option>
            <Select.Option value="male">Nam</Select.Option>
            <Select.Option value="female">Nữ</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Ảnh biến thể"
          name="image_url"
          rules={[{ required: true, message: 'Vui lòng nhập ít nhất 1 URL ảnh!' }]}
        >
          <Select
            mode="tags"
            style={{ width: '100%' }}
            tokenSeparators={[',']}
            placeholder="Nhập URL ảnh, cách nhau bằng dấu phẩy hoặc Enter"
          />
        </Form.Item>
        <Form.Item
          label="Trạng thái"
          name="status"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
        >
          <Select>
            <Select.Option value="inStock">Còn hàng</Select.Option>
            <Select.Option value="outOfStock">Hết hàng</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <div className="flex justify-end gap-4">
            <Button onClick={() => navigate('/admin/variants')}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={isUpdating}>
              {isUpdating ? 'Đang cập nhật...' : 'Cập nhật biến thể'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  )
}

export default EditVariant