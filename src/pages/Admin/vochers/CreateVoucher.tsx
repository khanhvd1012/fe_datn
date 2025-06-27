import { useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, InputNumber, DatePicker, Select, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAddVoucher } from '../../../hooks/useVouchers';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const CreateVoucher = () => {
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const { mutate, isPending } = useAddVoucher();

    const handleSubmit = (values: {
        code: string;
        type: string;
        value: number;
        quantity: number;
        dateRange: [dayjs.Dayjs, dayjs.Dayjs];
    }) => {
        const [startDate, endDate] = values.dateRange;

        const payload = {
            code: values.code,
            type: values.type,
            value: values.value,
            quantity: values.quantity,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
        };

        mutate(payload, {
            onSuccess: () => {
                messageApi.success("Tạo voucher thành công");
                queryClient.invalidateQueries({ queryKey: ["vouchers"] });
                messageApi.success("Tạo voucher thành công");
                setTimeout(() => navigate("/admin/vouchers"), 1000);
            },
            onError: (error: any) => {
                console.error("Lỗi trả về từ server:", error);
                if (error?.response?.data?.message) {
                    messageApi.error(error.response.data.message);
                } else {
                    messageApi.error("Lỗi khi tạo voucher");
                }
            }
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            {contextHolder}
            <h2 className="text-2xl font-bold mb-4">Tạo Voucher Mới</h2>
            <Form layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    label="Mã Voucher"
                    name="code"
                    rules={[
                        { required: true, message: 'Vui lòng nhập mã voucher!' },
                        { min: 3, message: 'Mã voucher ít nhất 3 ký tự!' }
                    ]}
                >
                    <Input placeholder="Nhập mã voucher" />
                </Form.Item>

                <Form.Item
                    label="Loại Voucher"
                    name="type"
                    rules={[{ required: true, message: 'Vui lòng chọn loại voucher!' }]}
                >
                    <Select placeholder="Chọn loại voucher">
                        <Select.Option value="percentage">Phần trăm</Select.Option>
                        <Select.Option value="fixed">Cố định</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Giá trị"
                    name="value"
                    rules={[{ required: true, message: 'Vui lòng nhập giá trị!' }]}
                >
                    <InputNumber min={1} style={{ width: '100%' }} placeholder="Nhập giá trị" />
                </Form.Item>

                <Form.Item
                    label="Khoảng thời gian"
                    name="dateRange"
                    rules={[{ required: true, message: 'Vui lòng chọn khoảng thời gian!' }]}
                >
                    <RangePicker style={{ width: '100%' }} showTime />
                </Form.Item>

                <Form.Item
                    label="Số lượng"
                    name="quantity"
                    rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
                >
                    <InputNumber min={1} style={{ width: '100%' }} placeholder="Nhập số lượng" />
                </Form.Item>

                <Form.Item>
                    <div className="flex justify-end gap-4">
                        <Button onClick={() => navigate('/admin/vouchers')}>
                            Hủy
                        </Button>
                        <Button type="primary" htmlType="submit" loading={isPending}>
                            {isPending ? 'Đang tạo...' : 'Tạo Voucher'}
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </div>
    );
};

export default CreateVoucher;