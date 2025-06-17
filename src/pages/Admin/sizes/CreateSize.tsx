import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, Select, message, Card } from 'antd';
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
                    label="Tên kích thước"
                    name="name"
                    rules={[
                        { required: true, message: 'Vui lòng nhập tên kích thước!' },
                        { min: 2, message: 'Tên phải có ít nhất 2 ký tự!' },
                        { max: 50, message: 'Tên không được vượt quá 50 ký tự!' }
                    ]}
                >
                    <Input placeholder="Nhập tên kích thước" />
                </Form.Item>

                <Form.Item
                    label="Giá trị"
                    name="value"
                    rules={[
                        { required: true, message: 'Vui lòng nhập giá trị kích thước!' }
                    ]}
                >
                    <Input placeholder="Nhập giá trị kích thước (ví dụ: 35, XL, XXL)" />
                </Form.Item>

                <Form.Item
                    label="Mô tả"
                    name="description"
                    rules={[
                        { required: true, message: 'Vui lòng nhập mô tả kích thước!' },
                        { min: 10, message: 'Mô tả phải có ít nhất 10 ký tự!' },
                        { max: 500, message: 'Mô tả không được vượt quá 500 ký tự!' }
                    ]}
                >
                    <TextArea rows={4} placeholder="Nhập mô tả kích thước" />
                </Form.Item>

                <Form.Item
                    label="Trạng thái"
                    name="status"
                    rules={[
                        { required: true, message: 'Vui lòng chọn trạng thái!' }
                    ]}
                >
                    <Select placeholder="Chọn trạng thái">
                        <Select.Option value="active">Đang hoạt động</Select.Option>
                        <Select.Option value="inactive">Ngừng hoạt động</Select.Option>
                    </Select>
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
