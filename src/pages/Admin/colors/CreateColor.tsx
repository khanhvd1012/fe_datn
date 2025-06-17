import { useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, Select, message, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAddColor } from '../../../hooks/useColors';
import type { IColor } from '../../../interface/color';

const { TextArea } = Input;

const CreateColor = () => {
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const { mutate, isPending } = useAddColor();
    const [form] = Form.useForm();

    const handleSubmit = (values: Omit<IColor, '_id' | 'createdAt' | 'updatedAt'>) => {
        mutate(values, {
            onSuccess: () => {
                messageApi.success('Thêm màu sắc thành công!');
                queryClient.invalidateQueries({ queryKey: ['colors'] });
                setTimeout(() => {
                    navigate('/admin/colors');
                }, 1000);
            },
            onError: (error: any) => {
                if (Array.isArray(error?.response?.data?.message)) {
                    error.response.data.message.forEach((err: string) => {
                        messageApi.error(err);
                    });
                } else if (error?.response?.data?.message) {
                    messageApi.error(error.response.data.message);
                } else {
                    messageApi.error('Có lỗi xảy ra khi thêm màu sắc');
                }
            }
        });
    };

    return (
        <div className="p-6">
            {contextHolder}
            <h2 className="text-2xl font-bold mb-6">Thêm màu sắc mới</h2>
            <Spin spinning={isPending}>
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
                        initialValue="active"
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
                            <Button type="primary" htmlType="submit" loading={isPending}>
                                {isPending ? 'Đang thêm...' : 'Thêm màu sắc'}
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Spin>
        </div>
    );
};

export default CreateColor;
