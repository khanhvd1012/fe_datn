import { useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, InputNumber, message, Skeleton, Select } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useStocks, useUpdateStock } from '../../../hooks/useStock';
import { useEffect } from 'react';

const EditStock = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const { data: stock, isLoading } = useStocks();
  const { mutate, isPending: isUpdating } = useUpdateStock();
  const [form] = Form.useForm();

  const selectedStock = stock?.find(item => item._id === id);

  const handleSubmit = (values: { quantity: number; reason: string; status?: string }) => {
    if (!id || !stock) return;

    const selectedStock = stock.find(item => item._id === id);
    if (!selectedStock) return;

    const quantity_change = values.quantity - selectedStock.quantity;

    // Nếu chỉ đổi trạng thái mà không đổi số lượng
    if (quantity_change === 0 && values.status === selectedStock.status) {
      messageApi.warning('Không có thay đổi nào!');
      return;
    }

    if (quantity_change < 0 && Math.abs(quantity_change) > selectedStock.quantity) {
      messageApi.error('Không thể giảm quá số lượng hiện có!');
      return;
    }

    mutate(
      { id, quantity_change, reason: values.reason, status: values.status },
      {
        onSuccess: () => {
          messageApi.success('Cập nhật tồn kho thành công!');
          queryClient.invalidateQueries({ queryKey: ['stocks'] });
          setTimeout(() => {
            navigate('/admin/stocks/stock');
          }, 1000);
        },
        onError: () => {
          messageApi.error('Cập nhật tồn kho thất bại!');
        },
      }
    );
  };

  useEffect(() => {
    if (selectedStock) {
      form.setFieldsValue({
        quantity: selectedStock.quantity,
        status: selectedStock.status, // set mặc định trạng thái hiện tại
      });
    }
  }, [selectedStock, form]);

  if (isLoading || !selectedStock) return <Skeleton active />;

  return (
    <div className="max-w-md mx-auto p-4">
      {contextHolder}
      <h2 className="text-2xl font-bold mb-4">Cập nhật Tồn Kho</h2>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Tên sản phẩm">
          <Input value={selectedStock.product_name} disabled style={{ color: 'black' }} />
        </Form.Item>

        <Form.Item label="SKU">
          <Input value={selectedStock.sku} disabled style={{ color: 'black' }} />
        </Form.Item>

        <Form.Item label="Màu sắc">
          <Input value={selectedStock.color} disabled style={{ color: 'black' }} />
        </Form.Item>

        <Form.Item label="Kích cỡ">
          <Input value={selectedStock.size} disabled style={{ color: 'black' }} />
        </Form.Item>

        <Form.Item
          label="Số lượng"
          name="quantity"
          rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Trạng thái"
          name="status"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
        >
          <Select
            options={[
              { label: 'Còn hàng', value: 'inStock' },
              { label: 'Hết hàng', value: 'outOfStock' },
              { label: 'Tạm dừng', value: 'paused' },
            ]}
          />
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
            <Button onClick={() => navigate('/admin/stocks/stock')}>Hủy</Button>
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
