import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addProduct } from '../../../service/productAPI';
import { Button, Form, Input, Select, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { IProduct } from '../../../interface/product';

const CreateProducts = () => {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const { mutate } = useMutation({
    mutationFn: async (product: IProduct) => await addProduct(product),
  });
  const handleSubmit = async (values: any) => {
    const formattedValues = {
      ...values
    };
    mutate(formattedValues, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["products"],
        });
        messageApi.success("Tạo sản phẩm thành công");
        setTimeout(() => {
          navigate("/admin/products");
        }, 2000);
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
          messageApi.error("Lỗi khi tạo sản phẩm");
        }
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {contextHolder}
      <h2 className="text-2xl font-bold mb-4">Create New Product</h2>
      <Form
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
          <Input placeholder="Enter variants" />
        </Form.Item>

        <Form.Item>
          <div className="flex justify-end gap-4">
            <Button onClick={() => navigate('/admin/products')}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Create Product
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}

export default CreateProducts;