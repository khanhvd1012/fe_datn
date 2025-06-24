import { Form, Input, InputNumber, Select, Button, Card, Popconfirm, Upload } from 'antd';
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { useState } from 'react';
import type { ISize } from '../interface/size';
import type { IColor } from '../interface/color';

interface VariantFormProps {
    sizes?: ISize[];
    colors?: IColor[];
}

const VariantForm = ({ sizes, colors }: VariantFormProps) => {
    const [variantImages, setVariantImages] = useState<{ [key: number]: UploadFile[] }>({});

    const handleUploadChange = (index: number, { fileList }: { fileList: UploadFile[] }) => {
        setVariantImages(prev => ({
            ...prev,
            [index]: fileList
        }));
    };

    return (
        <Form.List name="variants">
            {(fields, { add, remove }) => (
                <>
                    {fields.map(({ key, name, ...restField }, index) => (
                        <Card
                            key={key}
                            className="mb-4"
                            title={`Biến thể ${index + 1}`}
                            extra={
                                <Popconfirm
                                    title="Xóa biến thể"
                                    description="Bạn có chắc chắn muốn xóa biến thể này?"
                                    onConfirm={() => {
                                        remove(name);
                                        setVariantImages(prev => {
                                            const newImages = { ...prev };
                                            delete newImages[index];
                                            return newImages;
                                        });
                                    }}
                                    okText="Có"
                                    cancelText="Không"
                                >
                                    <MinusCircleOutlined />
                                </Popconfirm>
                            }
                        >
                            <Form.Item
                                {...restField}
                                label="SKU"
                                name={[name, 'sku']}
                                rules={[
                                    { required: true, message: 'Vui lòng nhập SKU' },
                                    { pattern: /^[A-Za-z0-9-_]+$/, message: 'SKU chỉ được chứa chữ cái, số và dấu gạch ngang' }
                                ]}
                            >
                                <Input placeholder="Nhập SKU" />
                            </Form.Item>

                            <Form.Item
                                {...restField}
                                label="Kích thước"
                                name={[name, 'sizes']}
                                rules={[{ required: true, message: 'Vui lòng chọn ít nhất một kích thước' }]}
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="Chọn kích thước"
                                    loading={false}
                                    notFoundContent={false ? <span>Đang tải...</span> : <span>Không tìm thấy kích thước</span>}
                                >
                                    {sizes?.map((size: ISize) => (
                                        <Select.Option key={size._id} value={size._id}>
                                            {size.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                {...restField}
                                label="Màu sắc"
                                name={[name, 'color_id']}
                                rules={[{ required: true, message: 'Vui lòng chọn màu sắc' }]}
                            >
                                <Select
                                    placeholder="Chọn màu sắc"
                                    loading={false}
                                    notFoundContent={false ? <span>Đang tải...</span> : <span>Không tìm thấy màu sắc</span>}
                                >
                                    {colors?.map((color: IColor) => (
                                        <Select.Option key={color._id} value={color._id}>
                                            {color.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                {...restField}
                                label="Giá"
                                name={[name, 'price']}
                                rules={[
                                    { required: true, message: 'Vui lòng nhập giá' },
                                    { type: 'number', min: 0, message: 'Giá phải lớn hơn hoặc bằng 0' }
                                ]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    placeholder="Nhập giá"
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                                />
                            </Form.Item>

                            <Form.Item
                                {...restField}
                                label="Số lượng"
                                name={[name, 'quantity']}
                                rules={[
                                    { required: true, message: 'Vui lòng nhập số lượng' },
                                    { type: 'number', min: 0, message: 'Số lượng phải lớn hơn hoặc bằng 0' }
                                ]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    placeholder="Nhập số lượng"
                                    min={0}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Ảnh biến thể"
                                required
                                tooltip="Tải lên ít nhất một ảnh cho biến thể"
                            >
                                <Upload
                                    listType="picture-card"
                                    onChange={(info) => handleUploadChange(index, info)}
                                    maxCount={5}
                                    multiple
                                    accept="image/*"
                                    action="/api/upload" // Thay đổi URL upload của bạn
                                >
                                    <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
                                </Upload>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'images']}
                                    hidden
                                >
                                    <Input />
                                </Form.Item>
                            </Form.Item>
                        </Card>
                    ))}
                    <Form.Item>
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                            Thêm biến thể
                        </Button>
                    </Form.Item>
                </>
            )}
        </Form.List>
    );
};

export default VariantForm;
