import { Form, Input, Button, message, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { IBrand } from '../../../interface/brand';
import { useAddBrand } from '../../../hooks/useBrands';

const { Title } = Typography;

const CreateBrand = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const { mutate, isPending } = useAddBrand();

  const onFinish = (values: Omit<IBrand, '_id' | 'createdAt' | 'updatedAt'>) => {
    mutate(values, {
      onSuccess: () => {
        messageApi.success("Thêm thương hiệu thành công");
        setTimeout(() => {
          navigate("/admin/brands");
        }, 1000);
      },
      onError: (error: any) => {
        if (error?.response?.data?.errors) {
          error.response.data.errors.forEach((err: any) => {
            messageApi.error(err.message);
          });
        } else {
          messageApi.error("Lỗi khi thêm thương hiệu");
        }
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {contextHolder}
      <Title level={2} className="mb-4">Thêm Thương Hiệu Mới</Title>
      
      <Form
        layout="vertical"
        onFinish={onFinish}
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
            <Button type="primary" htmlType="submit" loading={isPending}>
              Thêm Thương Hiệu
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateBrand;