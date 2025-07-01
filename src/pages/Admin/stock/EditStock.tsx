import { useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, InputNumber, message, Skeleton } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useStocks, useUpdateStock } from '../../../hooks/useStock';
// import type { IStock } from '../../../interface/stock';

const EditStock = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const { data: stock, isLoading } = useStocks(id!);
  const { mutate, isPending: isUpdating } = useUpdateStock();

  const [form] = Form.useForm();

  const initialValues = stock
    ? {
        product_variant_id: stock.product_variant_id,
        quantity: stock.quantity,
        reason: '', 
      }
    : {};

  const handleSubmit = (values: { quantity: number; reason: string }) => {
    if (!id || !stock) return;

    const quantity_change = values.quantity;

    if (quantity_change === 0) {
      messageApi.warning('Số lượng không thay đổi!');
      return;
    }

    mutate(
      { id, quantity_change, reason: values.reason },
      {
        onSuccess: () => {
          messageApi.success('Cập nhật số lượng thành công!');
          queryClient.invalidateQueries({ queryKey: ['stocks'] });
          setTimeout(() => {
            navigate('/admin/stocks');
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
      <Form form={form} layout="vertical" initialValues={initialValues} onFinish={handleSubmit}>
        <Form.Item label="Biến Thể" name="product_variant_id">
          <InputNumber style={{ width: '100%' }} disabled />
        </Form.Item>

        <Form.Item
          label="Số lượng mới"
          name="quantity"
          rules={[
            { required: true, message: 'Vui lòng nhập số lượng!' },
            { type: 'number', min: 0, message: 'Số lượng không được âm!' },
          ]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Lý do"
          name="reason"
          rules={[{ required: true, message: 'Vui lòng nhập lý do!' }]}
        >
          <Input placeholder="Nhập lý do thay đổi" />
        </Form.Item>

        <Form.Item>
          <div className="flex justify-end gap-4">
            <Button onClick={() => navigate('/admin/stocks')}>Hủy</Button>
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