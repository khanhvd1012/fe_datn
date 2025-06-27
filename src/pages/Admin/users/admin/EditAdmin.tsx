import { useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, message, Select, Skeleton } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useUpdateUser, useUser } from '../../../../hooks/useUser';
import { useShippingAddresses } from '../../../../hooks/useShippingAddress';

const EditAdmin = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const { data: user, isLoading } = useUser(id!);
  const { mutate, isPending: isUpdating } = useUpdateUser();
  const { data: shipping_addresses } = useShippingAddresses();

  const initialValues = user && user.data ? {
    ...user.data,
    shipping_addresses: Array.isArray(user.data.shipping_addresses)
      ? user.data.shipping_addresses.map((s: any) => (typeof s === 'object' ? s._id : s))
      : [],
  } : {};
  console.log("initialValues", initialValues);

  const handleSubmit = (values: any) => {
    if (!id) return;
    const submitValues = {
      ...values,
    };
    mutate(
      { id, userData: submitValues },
      {
        onSuccess: () => {
          messageApi.success('Cập nhật người dùng thành công!');
          queryClient.invalidateQueries({ queryKey: ['users'] });
          setTimeout(() => {
            navigate("/admin/users/admin_users");
          }, 1000);
        },
        onError: () => {
          messageApi.error('Cập nhật người dùng thất bại!');
        },
      }
    );
  };

  if (isLoading) return <Skeleton active />;
  return (
    <div className="max-w-2xl mx-auto p-4">
      {contextHolder}
      <h2 className="text-2xl font-bold mb-4">Cập nhật người dùng</h2>
      <Form layout="vertical" initialValues={initialValues} onFinish={handleSubmit}>
        <Form.Item
          label="Tên đăng nhập"
          name="username"
          rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Địa chỉ giao hàng"
          name="shipping_addresses"
          rules={[{ required: true, message: 'Vui lòng chọn ít nhất một kích thước!' }]}
        >
          <Select
            mode="multiple"
            placeholder="Địa chỉ giao hàng"
            allowClear
          >
            {shipping_addresses?.map((shipping_addresses: any) => (
              <Select.Option
                key={typeof shipping_addresses === 'string' ? shipping_addresses : shipping_addresses._id}
                value={typeof shipping_addresses === 'string' ? shipping_addresses : shipping_addresses._id}
              >
                {typeof shipping_addresses === 'string' ? shipping_addresses : shipping_addresses.shipping_addresses}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Vai trò"
          name="role"
          rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
        >
          <Select placeholder="Chọn vai trò">
            <Select.Option value="user">Người dùng</Select.Option>
            <Select.Option value="employee">Nhân viên</Select.Option>
            <Select.Option value="admin">Quản trị viên</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <div className="flex justify-end gap-4">
            <Button onClick={() => navigate('/admin/users/admin_users')}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={isUpdating}>
              {isUpdating ? 'Đang cập nhật...' : 'Cập nhật người dùng'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  )
}

export default EditAdmin