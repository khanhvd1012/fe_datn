import { useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, message, Select, Skeleton } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAddVariant } from '../../../hooks/useVariants';
import { useProducts } from '../../../hooks/useProducts';
import { useColors } from '../../../hooks/useColors';
import { useSizes } from '../../../hooks/useSizes';

const CreateVariant = () => {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const { mutate, isPending } = useAddVariant();
  const { data: products, isLoading: loadingProducts } = useProducts();
  const { data: colors, isLoading: loadingColors } = useColors();
  const { data: sizes, isLoading: loadingSizes } = useSizes();

  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    mutate(values, {
      onSuccess: () => {
        messageApi.success('Thêm biến thể thành công!');
        queryClient.invalidateQueries({ queryKey: ['variants'] });
        setTimeout(() => {
          navigate('/admin/variants');
        }, 1000);
      },
      onError: () => {
        messageApi.error('Thêm biến thể thất bại!');
      },
    });
  };

  if (loadingProducts) return <Skeleton active />;
  if (loadingColors) return <Skeleton active />;
  if (loadingSizes) return <Skeleton active />;


  return (
    <div className="max-w-2xl mx-auto p-4">
      {contextHolder}
      <h2 className="text-2xl font-bold mb-4">Thêm Biến Thể</h2>
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        initialValues={{
          product_id: undefined,
          color: undefined,
          size: undefined,
          price: '',
          import_price: '',
          image_url: '',
          status: 'inStock',
        }}
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
          label="Kích cỡ"
          name="size"
          rules={[{ required: true, message: 'Vui lòng nhập kích cỡ!' }]}
        >
          <Select placeholder="Chọn kích cỡ">
            {sizes?.map((p: any) => (
              <Select.Option key={typeof p === 'string' ? p : p._id} value={typeof p === 'string' ? p : p._id}>
                {typeof p === 'string' ? p : p.name}
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
          <Input type="number" placeholder="Nhập giá bán" />
        </Form.Item>
        <Form.Item
          label="Giá nhập"
          name="import_price"
          rules={[{ required: true, message: 'Vui lòng nhập giá nhập!' }]}
        >
          <Input type="number" placeholder="Nhập giá nhập" />
        </Form.Item>
        <Form.Item
          label="Ảnh biến thể"
          name="image_url"
          rules={[{ required: true, message: 'Vui lòng nhập URL ảnh!' }]}
        >
          <Input placeholder="Nhập URL ảnh" />
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
            <Button type="primary" htmlType="submit" loading={isPending}>
              {isPending ? 'Đang thêm...' : 'Thêm biến thể'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateVariant;