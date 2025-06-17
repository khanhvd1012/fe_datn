import { useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, Select, message, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useColor, useUpdateColor } from '../../../hooks/useColors';
import type { IColor } from '../../../interface/color';
import { useEffect } from 'react';

const { TextArea } = Input;

const EditColor = () => {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const { data: colorData, isLoading } = useColor(id!);
    const { mutate, isPending: isUpdating } = useUpdateColor();
    const [form] = Form.useForm();

    useEffect(() => {
        if (colorData) {
            form.setFieldsValue(colorData);
        }
    }, [colorData, form]);

    const handleSubmit = (values: Partial<Omit<IColor, '_id' | 'createdAt' | 'updatedAt'>>) => {
        if (!id) return;

        mutate(
            { id, color: values },
            {
                onSuccess: () => {
                    messageApi.success('Cập nhật màu sắc thành công!');
                    queryClient.invalidateQueries({ queryKey: ['colors'] });
                    queryClient.invalidateQueries({ queryKey: ['color', id] });
                    setTimeout(() => {
                        navigate('/admin/colors');
                    }, 1000);
                },
                onError: (error: any) => {
                    if (error?.response?.data?.errors) {
                        error.response.data.errors.forEach((err: any) => {
                            messageApi.error(err.message);
                        });
                    } else {
                        messageApi.error('Lỗi khi cập nhật màu sắc');
                    }
                }
            }
        );
    };

    return (
        <div className="p-6">
            {contextHolder}
            <h2 className="text-2xl font-bold mb-6">Chỉnh sửa màu sắc</h2>
            <Spin spinning={isLoading || isUpdating}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    className="max-w-3xl"
                >
                    <Form.Item
                        label="Tên màu sắc"
                        name="name"
                        rules={[
                            { required: true, message: 'Vui lòng nhập tên màu sắc!' },
                            { min: 2, message: 'Tên phải có ít nhất 2 ký tự!' },
                            { max: 50, message: 'Tên không được vượt quá 50 ký tự!' }
                        ]}
                    >
                        <Input placeholder="Nhập tên màu sắc" />
                    </Form.Item>

                    <Form.Item
                        name="code"
                        label="Mã màu"
                        rules={[
                            { required: true, message: 'Vui lòng chọn mã màu!' }
                        ]}
                    >
                        <Input
                            type="color"
                            className="w-20 h-10 cursor-pointer"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Mô tả"
                        name="description"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mô tả màu sắc!' },
                            { min: 10, message: 'Mô tả phải có ít nhất 10 ký tự!' },
                            { max: 500, message: 'Mô tả không được vượt quá 500 ký tự!' }
                        ]}
                    >
                        <TextArea rows={4} placeholder="Nhập mô tả về màu sắc" />
                    </Form.Item>

                    <Form.Item
                        label="Trạng thái"
                        name="status"
                        rules={[
                            { required: true, message: 'Vui lòng chọn trạng thái!' }
                        ]}
                    >
                        <Select>
                            <Select.Option value="active">Đang hoạt động</Select.Option>
                            <Select.Option value="inactive">Ngừng hoạt động</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <div className="flex justify-end gap-4">
                            <Button onClick={() => navigate('/admin/colors')}>
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit" loading={isUpdating}>
                                {isUpdating ? 'Đang cập nhật...' : 'Cập nhật màu sắc'}
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Spin>
        </div>
    );
};

export default EditColor;
