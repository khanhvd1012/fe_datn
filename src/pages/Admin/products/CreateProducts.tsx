import { useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, message, Select, Skeleton } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAddProduct } from '../../../hooks/useProducts';
import { useBrands } from '../../../hooks/useBrands';
import { useCategories } from '../../../hooks/useCategories';

const CreateProduct = () => {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const { mutate, isPending } = useAddProduct();
  const { data: brands, isLoading: loadingBrands } = useBrands();
  const { data: categories, isLoading: loadingCategories } = useCategories();

  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    // Chuyển images thành mảng
    const submitValues = {
      ...values,
      images: values.images
        ? Array.isArray(values.images)
          ? values.images
          : values.images
            .split(',')
            .map((img: string) => img.trim())
            .filter((img: string) => img)
        : [],
      variants: values.variants
        ? Array.isArray(values.variants)
          ? values.variants
          : values.variants.split(',').map((v: string) => v.trim())
        : [],
    };
    console.log('submitValues', submitValues); 
    mutate(submitValues, {
      onSuccess: () => {
        messageApi.success('Thêm sản phẩm thành công!');
        queryClient.invalidateQueries({ queryKey: ['products'] });
        setTimeout(() => {
          navigate('/admin/products');
        }, 1000);
      },
      onError: () => {
        messageApi.error('Thêm sản phẩm thất bại!');
      },
    });
  };

  if (loadingBrands || loadingCategories) return <Skeleton active />;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {contextHolder}
      <h2 className="text-2xl font-bold mb-4">Thêm Sản Phẩm</h2>
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        initialValues={{
          name: '',
          description: '',
          brand: undefined,
          category: undefined,
          images: '',
          variants: '',
        }}
      >
        <Form.Item
          label="Tên sản phẩm"
          name="name"
          rules={[
            { required: true, message: 'Vui lòng nhập tên sản phẩm!' },
            { min: 2, message: 'Tên phải có ít nhất 2 ký tự!' },
            { max: 100, message: 'Tên không được vượt quá 100 ký tự!' },
          ]}
        >
          <Input placeholder="Nhập tên sản phẩm" />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="description"
          rules={[
            { required: true, message: 'Vui lòng nhập mô tả sản phẩm!' },
            { max: 1000, message: 'Mô tả không được vượt quá 1000 ký tự!' },
          ]}
        >
          <Input.TextArea rows={4} placeholder="Nhập mô tả sản phẩm" />
        </Form.Item>

        <Form.Item
          label="Thương hiệu"
          name="brand"
          rules={[{ required: true, message: 'Vui lòng chọn thương hiệu!' }]}
        >
          <Select placeholder="Chọn thương hiệu">
            {brands?.map((b: any) => (
              <Select.Option key={typeof b === 'string' ? b : b._id} value={typeof b === 'string' ? b : b._id}>
                {typeof b === 'string' ? b : b.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Danh mục"
          name="category"
          rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
        >
          <Select placeholder="Chọn danh mục">
            {categories?.map((c: any) => (
              <Select.Option key={typeof c === 'string' ? c : c._id} value={typeof c === 'string' ? c : c._id}>
                {typeof c === 'string' ? c : c.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Ảnh sản phẩm"
          name="images"
          rules={[{ required: true, message: 'Vui lòng nhập ít nhất 1 ảnh!' }]}
        >
          <Input placeholder="Nhập các URL ảnh, cách nhau bởi dấu phẩy" />
        </Form.Item>

        <Form.Item
          label="Biến thể sản phẩm"
          name="variants"
        >
          <Input placeholder="Nhập các biến thể, cách nhau bởi dấu phẩy (nếu có)" />
        </Form.Item>

        <Form.Item>
          <div className="flex justify-end gap-4">
            <Button onClick={() => navigate('/admin/products')}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={isPending}>
              {isPending ? 'Đang thêm...' : 'Thêm sản phẩm'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateProduct;