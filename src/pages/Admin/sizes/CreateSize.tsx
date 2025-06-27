import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, Select, message, Card, InputNumber } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { ISize } from '../../../interface/size';
import { useAddSize } from '../../../hooks/useSizes';

const { TextArea } = Input;

const CreateSize: React.FC = () => {
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const { mutate, isPending } = useAddSize();

    const handleSubmit = (values: ISize) => {
        mutate(values, {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ["sizes"],
                });
                messageApi.success("Tạo kích thước thành công");
                setTimeout(() => {
                    navigate("/admin/sizes");
                }, 1000);
            },
            onError: (error: any) => {
                if (error?.response?.data?.errors) {
                    error.response.data.errors.forEach((err: any) => {
                        messageApi.error(err.message);
                    });
                } else {
                    messageApi.error("Lỗi khi tạo kích thước");
                }
            },
        });
    };

    return (
        <div className="p-4">
            {contextHolder}
            <h2 className="text-2xl font-bold mb-4">Tạo kích thước mới</h2>
            <Form
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{ status: 'active' }}
            >
                <Form.Item
                    label="Kích thước"
                    name="size"
                    rules={[
                        { required: true, message: 'Vui lòng nhập kích thước!' },
                    ]}
                >
                    <InputNumber style={{ width: '100%' }} type="number" placeholder="Nhập kích thước (ví dụ: 35, 42)" />
                </Form.Item>

                <Form.Item>
                    <div className="flex justify-end gap-4">
                        <Button onClick={() => navigate('/admin/sizes')}>
                            Hủy
                        </Button>
                        <Button type="primary" htmlType="submit" loading={isPending}>
                            {isPending ? 'Đang tạo...' : 'Tạo kích thước'}
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </div>
    );
};

export default CreateSize;
