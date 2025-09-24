import { useQueryClient } from '@tanstack/react-query';
import { Button, DatePicker, Form, Input, InputNumber, message, Select, Skeleton } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { useVoucher, useUpdateVoucher } from '../../../hooks/useVouchers';
import { useEffect } from 'react';

const { Option } = Select;

const EditVoucher = () => {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const { data: voucherData, isLoading } = useVoucher(id!);
    const { mutate, isPending: isUpdating } = useUpdateVoucher();

    useEffect(() => {
        if (voucherData) {
            console.log("Voucher Data:", voucherData);
            form.setFieldsValue({
                ...voucherData,
                duration: [dayjs(voucherData.startDate), dayjs(voucherData.endDate)],
            });
        }
    }, [voucherData, form]);

    const handleSubmit = (values: any) => {
        if (!id) return;
        const [startDate, endDate] = values.duration;

        const submitValues = {
            ...values,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
        };

        delete submitValues.duration;

        mutate(
            { id, voucher: submitValues },
            {
                onSuccess: () => {
                    messageApi.success('Cập nhật voucher thành công!');
                    queryClient.invalidateQueries({ queryKey: ['vouchers'] });
                    setTimeout(() => {
                        navigate('/admin/vouchers');
                    }, 1000)
                },
                onError: (error: any) => {
                    const backendErrors = error?.response?.data?.errors;

                    if (Array.isArray(backendErrors) && backendErrors.length > 0) {
                        message.error(backendErrors[0].message);
                    } else {
                        message.error(error?.response?.data?.message || "Lỗi khi cập nhật voucher.");
                    }
                    console.error("Lỗi khi cập nhật voucher:", error);
                }
            }
        );
    };

    if (isLoading) return <Skeleton active />;

    return (
        <div className="max-w-2xl mx-auto p-4">
            {contextHolder}
            <h2 className="text-2xl font-bold mb-4">Cập nhật Voucher</h2>
            <Form layout="vertical" onFinish={handleSubmit} form={form}>
                <Form.Item
                    label="Mã voucher"
                    name="code"
                    rules={[{ required: true, message: "Vui lòng nhập mã voucher!" }]}
                >
                    <Input placeholder="VD: SALE2025" />
                </Form.Item>

                <Form.Item
                    label="Loại giảm"
                    name="type"
                    rules={[{ required: true, message: "Vui lòng chọn loại giảm giá!" }]}
                >
                    <Select>
                        <Option value="percentage">Phần trăm</Option>
                        <Option value="fixed">Giảm cố định</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Giá trị giảm"
                    name="value"
                    rules={[{ required: true, message: "Vui lòng nhập giá trị!" }]}
                >
                    <InputNumber min={1} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    label="Đơn hàng tối thiểu"
                    name="minOrderValue"
                    rules={[{ required: true, message: "Vui lòng nhập giá trị tối thiểu!" }]}
                >
                    <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    label="Thời gian áp dụng"
                    name="duration"
                    rules={[{ required: true, message: "Vui lòng chọn khoảng thời gian!" }]}
                >
                    <DatePicker.RangePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    label="Số lượng voucher"
                    name="quantity"
                    rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
                >
                    <InputNumber min={1} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    label="Trạng thái"
                    name="status"
                    rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
                >
                    <Select>
                        <Option value="active">Đang hoạt động</Option>
                        <Option value="inactive">Không hoạt động</Option>
                        <Option value="paused">Tạm dừng</Option>
                    </Select>
                </Form.Item>

                <Form.Item>
                    <div className="flex justify-end gap-4">
                        <Button onClick={() => navigate('/admin/vouchers')}>Hủy</Button>
                        <Button type="primary" htmlType="submit" loading={isUpdating}>
                            {isUpdating ? 'Đang cập nhật...' : 'Cập nhật voucher'}
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </div>
    );
};

export default EditVoucher;
