import { useQueryClient } from '@tanstack/react-query';
import { Button, Empty, Form, message, Skeleton, Spin, InputNumber } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import type { ISize } from '../../../interface/size';
import { useSize, useUpdateSize } from '../../../hooks/useSizes';
import { useEffect } from 'react';

const EditSize = () => {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const { data: sizeData, isLoading } = useSize(id!);
    const { mutate, isPending: isUpdating } = useUpdateSize();
    const [form] = Form.useForm();

    useEffect(() => {
        if (sizeData?.size) {
            form.setFieldsValue(sizeData.size);
        }
    }, [sizeData, form]);

    const handleSubmit = (values: Partial<Omit<ISize, '_id' | 'createdAt' | 'updatedAt'>>) => {
        if (!id) return;

        mutate({
            id,
            size: values
        }, {
            onSuccess: () => {
                messageApi.success("Cập nhật kích thước thành công");
                queryClient.invalidateQueries({ queryKey: ["sizes"] });
                queryClient.invalidateQueries({ queryKey: ["size", id] });
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
                    messageApi.error("Lỗi khi cập nhật kích thước");
                }
            }
        });
    };

    if (isLoading) return <Skeleton active />;
    if (!sizeData?.size) return <Empty description="Không tìm thấy kích thước" />;

    return (
        <div className="p-4">
            {contextHolder}
            <h2 className="text-2xl font-bold mb-4">Chỉnh sửa kích thước</h2>
            <Spin spinning={isUpdating} tip="Đang cập nhật...">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
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
                            <Button type="primary" htmlType="submit" loading={isUpdating}>
                                {isUpdating ? 'Đang cập nhật...' : 'Cập nhật kích thước'}
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Spin>
        </div>
    );
};

export default EditSize;
