import { useQueryClient } from '@tanstack/react-query';
import { Button, Empty, Form, Input, message, Skeleton } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import type { IBrand } from '../../../interface/brand';
import { useBrand, useUpdateBrand } from '../../../hooks/useBrands';

const EditBrand = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const { data: brand, isLoading } = useBrand(id!);
  const { mutate, isPending: isUpdating } = useUpdateBrand();

  const handleSubmit = (values: Partial<Omit<IBrand, '_id' | 'createdAt' | 'updatedAt'>>) => {
    if (!id) return;
    
    mutate({
      id,
      brand: values
    }, {
      onSuccess: () => {
        messageApi.success('Cập nhật thương hiệu thành công',);
        queryClient.invalidateQueries({ queryKey: ['brands'] });
        setTimeout(() => {
          navigate('/admin/brands');
        }, 1000);
      },
      onError: (error: any) => {
        if (error?.response?.data?.errors) {
          error.response.data.errors.forEach((err: any) => {
            messageApi.error(err.message);
          });
        } else {
          messageApi.error('Lỗi khi cập nhật thương hiệu');
        }
      }
    });
  };

  if (isLoading) return <Skeleton active />;
  if (!brand) return <Empty />;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {contextHolder}
      <h2 className="text-2xl font-bold mb-4">Chỉnh Sửa Thương Hiệu</h2>
      <Form
        layout="vertical"
        initialValues={brand}
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Tên Thương Hiệu"
          name="name"
          rules={[
            { required: true, message: 'Vui lòng nhập tên thương hiệu!' },
            { min: 2, message: 'Tên phải có ít nhất 2 ký tự!' },
            { max: 50, message: 'Tên không được vượt quá 50 ký tự!' }
          ]}
        >
          <Input placeholder="Nhập tên thương hiệu" />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="description"
          rules={[
            { required: true, message: 'Vui lòng nhập mô tả thương hiệu!' },
            { max: 500, message: 'Mô tả không được vượt quá 500 ký tự!' }
          ]}
        >
          <Input.TextArea rows={4} placeholder="Nhập mô tả thương hiệu" />
        </Form.Item>

        <Form.Item
          label="URL Logo"
          name="logo_image"
          rules={[
            { required: true, message: 'Vui lòng nhập URL logo!' },
            { type: 'url', message: 'Vui lòng nhập URL hợp lệ!' }
          ]}
        >
          <Input placeholder="Nhập URL logo" />
        </Form.Item>

        <Form.Item>
          <div className="flex justify-end gap-4">
            <Button onClick={() => navigate('/admin/brands')}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={isUpdating}>
              {isUpdating ? 'Đang cập nhật...' : 'Cập nhật'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditBrand;