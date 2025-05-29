import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { Button, Empty, Form, Input, message, Select, Skeleton } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import type { IProduct } from '../../../interface/product';
import { getById, updateProduct } from '../../../service/productAPI';

const EditProducts = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery<IProduct>({
    queryKey: ["products", id],
    queryFn: async () => await getById(String(id)),
  });
  const { mutate } = useMutation({
    mutationFn: async (product: IProduct) => await updateProduct(product),
  });
  const handleSubmit = async (values: any) => {
    const { _id, ...rest } = values; // loại bỏ _id

    const formattedValues = {
      ...rest,
      variants: Array.isArray(values.variants)
        ? values.variants
        : values.variants
          ? [values.variants]
          : [], // đảm bảo là mảng
    };
    mutate(formattedValues, {      
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["products"],
        });
        messageApi.success("Cập nhật sản phẩm thành công");
        setTimeout(() => {
          navigate("/admin/products");
        }, 1000);
      },
      onError: (error: any) => {
        if (error?.response?.data?.errors) {
          const errors = error.response.data.errors;
          errors.forEach((err: any) => {
            if (err.field === 'name' && err.message.includes('đã tồn tại')) {
              messageApi.error('Tên sản phẩm đã tồn tại, vui lòng chọn tên khác');
            } else {
              messageApi.error(err.message);
            }
          });
        } else {
          messageApi.error("Lỗi khi cập nhật sản phẩm");
          console.error("Error updating product:", formattedValues);
        }
      }
    });
  };

  if (isLoading) return <Skeleton active />;
  if (!data) return <div><Empty /></div>;
  return (
    <div className="max-w-4xl mx-auto p-4">
      {contextHolder}
      <h2 className="text-2xl font-bold mb-4">Update Product</h2>
      <Form
        initialValues={{ ...data }}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Product Name"
          name="name"
          rules={[{ required: true, message: 'Please input product name!' }]}
        >
          <Input placeholder="Enter product name" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please input product description!' }]}
        >
          <Input.TextArea rows={4} placeholder="Enter product description" />
        </Form.Item>

        <Form.Item
          label="Brand"
          name="brand"
          rules={[{ required: true, message: 'Please select brand!' }]}
        >
          <Input placeholder="Enter brand" />
        </Form.Item>

        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: 'Please select category!' }]}
        >
          <Input placeholder="Enter category" />
        </Form.Item>

        <Form.Item
          label="Gender"
          name="gender"
          rules={[{ required: true, message: 'Please select gender!' }]}
        >
          <Select placeholder="Select gender">
            <Select.Option value="male">Male</Select.Option>
            <Select.Option value="female">Female</Select.Option>
            <Select.Option value="unisex">Unisex</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Variants"
          name="variants"
        >
          <Select mode="tags" placeholder="Nhập các biến thể (ví dụ: màu đỏ, đen, 16GB, 512GB)" />
        </Form.Item>


        <Form.Item>
          <div className="flex justify-end gap-4">
            <Button onClick={() => navigate('/admin/products')}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Update Product
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  )
}

export default EditProducts