import { useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { ICategory } from '../../../interface/category';
import { useAddCategory } from '../../../hooks/useCategories';

const CreateCategories = () => {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const { mutate } = useAddCategory();

  const handleSubmit = (values: ICategory) => {
    mutate(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["categories"],
        });
        messageApi.success("Tạo danh mục thành công");
        setTimeout(() => {
          navigate("/admin/categories");
        }, 1000);
      },
      onError: (error: any) => {
        if (error?.response?.data?.errors) {
          error.response.data.errors.forEach((err: any) => {
            messageApi.error(err.message);
          });
        } else {
          messageApi.error("Lỗi khi tạo danh mục");
        }
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {contextHolder}
      <h2 className="text-2xl font-bold mb-4">Tạo Danh Mục Mới</h2>
      <Form
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Tên Danh Mục"
          name="name"
          rules={[
            { required: true, message: 'Vui lòng nhập tên danh mục!' },
            { min: 2, message: 'Tên phải có ít nhất 2 ký tự!' },
            { max: 50, message: 'Tên không được vượt quá 50 ký tự!' }
          ]}
        >
          <Input placeholder="Nhập tên danh mục" />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="description"
          rules={[
            { required: true, message: 'Vui lòng nhập mô tả danh mục!' },
            { max: 500, message: 'Mô tả không được vượt quá 500 ký tự!' }
          ]}
        >
          <Input.TextArea rows={4} placeholder="Nhập mô tả danh mục" />
        </Form.Item>

        <Form.Item
          label="URL Hình Ảnh Logo"
          name="logo_image"
          rules={[
            { required: true, message: 'Vui lòng nhập URL hình ảnh logo!' },
            { type: 'url', message: 'Vui lòng nhập một URL hợp lệ!' }
          ]}
        >
          <Input placeholder="Nhập URL hình ảnh logo" />
        </Form.Item>

        <Form.Item>
          <div className="flex justify-end gap-4">
            <Button onClick={() => navigate('/admin/categories')}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Tạo Danh Mục
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateCategories;