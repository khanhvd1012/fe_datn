import { useQueryClient } from '@tanstack/react-query';
import { Button, Empty, Form, Input, message, Skeleton, Select } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useProduct, useUpdateProduct } from '../../../hooks/useProducts';
import { useBrands } from '../../../hooks/useBrands';
import { useCategories } from '../../../hooks/useCategories';

const EditProducts = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const { data: product, isLoading } = useProduct(id!);
  const { mutate, isPending: isUpdating } = useUpdateProduct();
  const { data: brands } = useBrands();
  const { data: categories } = useCategories();

  // Chuẩn hóa dữ liệu initialValues
  const initialValues = product && product.data ? {
    ...product.data,
    brand: typeof product.data.brand === 'object' ? product.data.brand._id : product.data.brand,
    category: typeof product.data.category === 'object' ? product.data.category._id : product.data.category,
  } : {};

  const handleSubmit = (values: any) => {
    if (!id) return;
    const submitValues = {
      ...values,
    };
    mutate(
      { id, product: submitValues },
      {
        onSuccess: () => {
          messageApi.success('Cập nhật sản phẩm thành công!');
          queryClient.invalidateQueries({ queryKey: ['products'] });
          setTimeout(() => {
            navigate("/admin/products");
          }, 1000);
        },
        onError: () => {
          messageApi.error('Cập nhật sản phẩm thất bại!');
        },
      }
    );
  };

  if (isLoading) return <Skeleton active />;
  if (!product) return <Empty description="Không tìm thấy dữ liệu" />;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {contextHolder}
      <h2 className="text-2xl font-bold mb-4">Chỉnh Sửa Sản Phẩm</h2>
      <Form
        layout="vertical"
        initialValues={initialValues}
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Tên sản phẩm"
          name="name"
          rules={[
            { required: true, message: 'Vui lòng nhập tên sản phẩm!' },
            { min: 2, message: 'Tên phải có ít nhất 2 ký tự!' },
            { max: 100, message: 'Tên không được vượt quá 100 ký tự!' }
          ]}
        >
          <Input placeholder="Nhập tên sản phẩm" />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="description"
          rules={[
            { required: true, message: 'Vui lòng nhập mô tả sản phẩm!' },
            { max: 1000, message: 'Mô tả không được vượt quá 1000 ký tự!' }
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
            {brands?.map((b) => (
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

        <Form.Item>
          <div className="flex justify-end gap-4">
            <Button onClick={() => navigate('/admin/products')}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={isUpdating}>
              {isUpdating ? 'Đang cập nhật...' : 'Cập nhật sản phẩm'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditProducts;