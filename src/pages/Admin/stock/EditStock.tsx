import { useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, InputNumber, message, Skeleton, Select } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useStocks, useUpdateStock } from '../../../hooks/useStock';
import { useEffect } from 'react';

const EditStock = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const { data: stock, isLoading } = useStocks();
  const { mutate, isPending: isUpdating } = useUpdateStock();
  const [form] = Form.useForm();

  const selectedStock = stock?.find(item => item._id === id);

  const handleSubmit = (values: { quantity_change: number; reason: string; status?: string }) => {
    if (!selectedStock) return;

    const { quantity_change, status, reason } = values;

    if (quantity_change === 0 && status === selectedStock.status) {
      messageApi.warning('Không có thay đổi nào!');
      return;
    }

    if (quantity_change < 0 && Math.abs(quantity_change) > selectedStock.quantity) {
      messageApi.error('Không thể giảm quá số lượng hiện có!');
      return;
    }

    if (!id || !selectedStock) return;

    mutate(
      { id, quantity_change, reason, status },
      {
        onSuccess: () => {
          messageApi.success('Cập nhật tồn kho thành công!', 1);
          queryClient.invalidateQueries({ queryKey: ['stocks'] });
          setTimeout(() => {
            navigate('/admin/stocks/stock');
          }, 1000);
        },
        onError: (error: any) => {
          const backendErrors = error?.response?.data?.errors;

          if (Array.isArray(backendErrors) && backendErrors.length > 0) {
            message.error(backendErrors[0].message);
          } else {
            message.error(error?.response?.data?.message || "Lỗi khi cập nhật tồn kho.");
          }
        },
      }
    );
  };

  useEffect(() => {
    if (selectedStock) {
      form.setFieldsValue({
        quantity_change: 0, // mặc định = 0 (không thay đổi)
        status: selectedStock.status,
      });
    }
  }, [selectedStock, form]);

  if (isLoading || !selectedStock) return <Skeleton active />;

  return (
    <div className="max-w-md mx-auto p-4">
      {contextHolder}
      <h2 className="text-2xl font-bold mb-4">Cập nhật Tồn Kho</h2>

      <Form form={form} layout="vertical" onFinish={handleSubmit} disabled={isUpdating}>
        {/* Thông tin sản phẩm */}
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

        {/* Số lượng hiện tại */}
        <Form.Item label="Số lượng hiện tại">
          <Input value={selectedStock.quantity} disabled style={{ color: 'black' }} />
        </Form.Item>

        {/* Thay đổi số lượng */}
        <Form.Item
          label="Thay đổi số lượng "
          name="quantity_change"
          rules={[{ required: true, message: 'Vui lòng nhập số thay đổi!' }]}
        >
          <InputNumber style={{ width: '100%' }} min={-selectedStock.quantity} />
        </Form.Item>

        {/* Trạng thái */}
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

        {/* Lý do */}
        <Form.Item
          label="Lý do"
          name="reason"
          rules={[
            { required: true, message: 'Vui lòng nhập lý do!' },
            { max: 1000, message: 'Lý do không được vượt quá 1000 ký tự!' },
          ]}
        >
          <Input.TextArea rows={4} placeholder="Nhập lý do" />
        </Form.Item>

        {/* Action buttons */}
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
