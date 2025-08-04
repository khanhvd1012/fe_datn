import { useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, InputNumber, message, Skeleton } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useStocks, useUpdateStock } from '../../../hooks/useStock';

const EditStock = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const { data: stock, isLoading } = useStocks();
  const { mutate, isPending: isUpdating } = useUpdateStock();
  const [form] = Form.useForm();

  const selectedStock = stock?.find(item => item._id === id);

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
            navigate('/admin/stocks/stock');
          }, 1000);
        },
        onError: () => {
          messageApi.error('Cập nhật số lượng thất bại!');
        },
      }
    );
  };

  if (isLoading || !selectedStock) return <Skeleton active />;

  return (
    <div className="max-w-md mx-auto p-4">
      {contextHolder}
      <h2 className="text-2xl font-bold mb-4">Cập nhật Số Lượng</h2>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Tên sản phẩm">
          <Input
            value={selectedStock.product_name}
            disabled
            style={{ color: 'black' }}
          />
        </Form.Item>

        <Form.Item label="SKU">
          <Input
            value={selectedStock.sku}
            disabled
            style={{ color: 'black' }}
          />
        </Form.Item>

        <Form.Item label="Màu sắc">
          <Input
            value={selectedStock.color}
            disabled
            style={{ color: 'black' }}
          />
        </Form.Item>

        <Form.Item label="Kích cỡ">
          <Input
            value={selectedStock.size}
            disabled
            style={{ color: 'black' }}
          />
        </Form.Item>

        <Form.Item
          label="Số lượng thay đổi"
          name="quantity"
          rules={[
            { required: true, message: 'Vui lòng nhập số lượng!' },
            { type: 'number', message: 'Số lượng phải là số!' },
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
