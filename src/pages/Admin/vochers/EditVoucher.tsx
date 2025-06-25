import { useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, InputNumber, DatePicker, Select, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useVoucher, useUpdateVoucher } from '../../../hooks/useVouchers';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const EditVoucher = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const { data: voucherData, isLoading } = useVoucher(id || '');
  const { mutate } = useUpdateVoucher();

  const [form] = Form.useForm();

  // Set dữ liệu lên form khi lấy được voucher
  if (voucherData && !form.getFieldValue('code')) {
    form.setFieldsValue({
      code: voucherData.code,
      type: voucherData.type,
      value: voucherData.value,
      maxDiscount: voucherData.maxDiscount,
      minOrderValue: voucherData.minOrderValue,
      quantity: voucherData.quantity,
      dateRange: [
        dayjs(voucherData.startDate),
        dayjs(voucherData.endDate)
      ]
    });
  }

  const handleSubmit = (values: any) => {
    const [startDate, endDate] = values.dateRange || [];
    const payload = {
      code: values.code,
      type: values.type,
      value: values.value,
      maxDiscount: values.maxDiscount || null,
      minOrderValue: values.minOrderValue || 0,
      quantity: values.quantity,
      startDate: startDate?.toISOString() || '',
      endDate: endDate?.toISOString() || '',
    };


    mutate({ id, voucher: payload }, {
           
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["vouchers"] });
        messageApi.success("Cập nhật voucher thành công");
        setTimeout(() => {
          navigate("/admin/vouchers");
        }, 1000);
      },
      onError: (error: any) => {
        if (error?.response?.data?.errors) {
          error.response.data.errors.forEach((err: any) => {
            messageApi.error(err.message);
          });
        } else {
          messageApi.error("Lỗi khi cập nhật voucher");
        }
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {contextHolder}
      <h2 className="text-2xl font-bold mb-4">Cập Nhật Voucher</h2>
      <Form layout="vertical" onFinish={handleSubmit} form={form}>
        <Form.Item label="Mã Voucher" name="code" rules={[{ required: true, message: 'Vui lòng nhập mã voucher!' }]}>
          <Input placeholder="Nhập mã voucher" />
        </Form.Item>

        <Form.Item label="Loại Voucher" name="type" rules={[{ required: true, message: 'Vui lòng chọn loại voucher!' }]}>
          <Select placeholder="Chọn loại voucher">
            <Select.Option value="percentage">Phần trăm</Select.Option>
            <Select.Option value="fixed">Cố định</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Giá trị" name="value" rules={[{ required: true, message: 'Vui lòng nhập giá trị!' }]}>
          <InputNumber min={1} style={{ width: '100%' }} placeholder="Nhập giá trị" />
        </Form.Item>

        {/* <Form.Item label="Giảm tối đa" name="maxDiscount">
          <InputNumber min={1} style={{ width: '100%' }} placeholder="Nhập giảm tối đa (nếu có)" />
        </Form.Item>

        <Form.Item label="Giá trị đơn hàng tối thiểu" name="minOrderValue">
          <InputNumber min={0} style={{ width: '100%' }} placeholder="Nhập giá trị đơn hàng tối thiểu" />
        </Form.Item> */}

        <Form.Item label="Khoảng thời gian" name="dateRange" rules={[{ required: true, message: 'Vui lòng chọn khoảng thời gian!' }]}>
          <RangePicker style={{ width: '100%' }} showTime />
        </Form.Item>

        <Form.Item label="Số lượng" name="quantity" rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}>
          <InputNumber min={1} style={{ width: '100%' }} placeholder="Nhập số lượng" />
        </Form.Item>

        <Form.Item>
          <div className="flex justify-end gap-4">
            <Button onClick={() => navigate('/admin/vouchers')}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={isLoading}>Cập Nhật</Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditVoucher;
