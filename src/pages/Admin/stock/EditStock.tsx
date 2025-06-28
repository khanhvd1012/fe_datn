import { useQueryClient } from '@tanstack/react-query';
import { Button, Form, InputNumber, message, Skeleton } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useUpdateStock } from '../../../hooks/useStock';
import type { IStock } from '../../../interface/stock';

const EditStock = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const { data: stock, isLoading } = useStock(id!);
  const { mutate, isPending: isUpdating } = useUpdateStock();

  const initialValues = stock
    ? {
      product_variant_id: stock.product_variant_id,
      quantity: stock.quantity,
    }
    : {};

  const handleSubmit = (values: Partial<IStock>) => {
    if (!id) return;

    // Đảm bảo quantity có giá trị
    if (values.quantity === undefined) {
      messageApi.error('Thiếu số lượng!');
      return;
    }

    mutate(
      { id, quantity: values.quantity },
      {
        onSuccess: () => {
          messageApi.success('Cập nhật số lượng thành công!');
          queryClient.invalidateQueries({ queryKey: ['stocks'] });
          setTimeout(() => {
            navigate('/admin/stock');
          }, 1000);
        },
        onError: () => {
          messageApi.error('Cập nhật số lượng thất bại!');
        },
      }
    );
  };

  if (isLoading) return <Skeleton active />;

  return (
    <div className="max-w-md mx-auto p-4">
      {contextHolder}
      <h2 className="text-2xl font-bold mb-4">Cập nhật Số Lượng</h2>
      <Form layout="vertical" initialValues={initialValues} onFinish={handleSubmit}>
        <Form.Item
          label="Biến Thể"
          name="product_variant_id"
          rules={[{ required: true, message: 'Vui lòng nhập mã biến thể!' }]}
        >
          <InputNumber style={{ width: '100%' }} disabled />
        </Form.Item>

        <Form.Item
          label="Số lượng"
          name="quantity"
          rules={[
            { required: true, message: 'Vui lòng nhập số lượng!' },
            { type: 'number', min: 0, message: 'Số lượng không được âm!' },
          ]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item>
          <div className="flex justify-end gap-4">
            <Button onClick={() => navigate('/admin/stock')}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={isUpdating}>
              {isUpdating ? 'Đang cập nhật...' : 'Cập nhật'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditStock;
