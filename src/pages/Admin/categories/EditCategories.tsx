import { useQueryClient } from '@tanstack/react-query';
import { Button, Empty, Form, Input, message, Skeleton } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import type { ICategory } from '../../../interface/category';
import { useCategory, useUpdateCategory } from '../../../hooks/useCategories';

const EditCategories = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const { data: category, isLoading } = useCategory(id!);
  const { mutate, isPending: isUpdating } = useUpdateCategory();
  const handleSubmit = (values: Partial<Omit<ICategory, '_id' | 'createdAt' | 'updatedAt'>>) => {
    if (!id) return;

    mutate(
      {
        id,
        category: values,
      },
      {
        onSuccess: () => {
          messageApi.success("Tạo danh mục thành công");
        },
      }
    );


  };

  if (isLoading) return <Skeleton active />;
  if (!category) return <Empty description="Không tìm thấy dữ liệu" />;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {contextHolder}
      <h2 className="text-2xl font-bold mb-4">Chỉnh Sửa Danh Mục</h2>
      <Form
        layout="vertical"
        initialValues={category}
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
            <Button type="primary" htmlType="submit" loading={isUpdating}>
              {isUpdating ? 'Đang cập nhật...' : 'Cập nhật danh mục'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditCategories;