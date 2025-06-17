import { Form, Input, InputNumber, Select, Button, Card, Popconfirm } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useSizes } from '../hooks/useSizes';
import { useColors } from '../hooks/useColors';

const VariantForm = () => {
    const { data: sizes, isLoading: sizesLoading } = useSizes();
    const { data: colors, isLoading: colorsLoading } = useColors();

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
                                    onConfirm={() => remove(name)}
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
                                name={[name, 'SKU']}
                                rules={[{ required: true, message: 'Vui lòng nhập SKU' }]}
                            >
                                <Input placeholder="Nhập SKU" />
                            </Form.Item>

                            <Form.Item
                                {...restField}
                                label="Size"
                                name={[name, 'size']}
                                rules={[{ required: true, message: 'Vui lòng nhập size' }]}
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="Chọn kích thước"
                                    loading={sizesLoading}
                                    notFoundContent={sizesLoading ? <span>Đang tải...</span> : <span>Không tìm thấy kích thước</span>}
                                >
                                    {sizes?.sizes?.map((size) => (
                                        <Select.Option key={size._id} value={size._id}>
                                            {size.name} - {size.value}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                {...restField}
                                label="Màu sắc"
                                name={[name, 'color']}
                                rules={[{ required: true, message: 'Vui lòng chọn màu sắc' }]}
                            >
                                <Select
                                    placeholder="Chọn màu sắc"
                                    loading={colorsLoading}
                                    notFoundContent={colorsLoading ? <span>Đang tải...</span> : <span>Không tìm thấy màu sắc</span>}
                                >
                                    {colors?.map((color) => (
                                        <Select.Option key={color._id} value={color._id}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div 
                                                    style={{ 
                                                        width: '20px', 
                                                        height: '20px', 
                                                        backgroundColor: color.code,
                                                        border: '1px solid #d9d9d9',
                                                        borderRadius: '4px'
                                                    }} 
                                                />
                                                {color.name}
                                            </div>
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                {...restField}
                                label="Hình ảnh"
                                name={[name, 'image']}
                                rules={[{ required: true, message: 'Vui lòng nhập URL hình ảnh' }]}
                            >
                                <Input placeholder="Nhập URL hình ảnh" />
                            </Form.Item>

                            <Form.Item
                                {...restField}
                                label="Giá"
                                name={[name, 'price']}
                                rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
                            >
                                <InputNumber
                                    placeholder="Nhập giá"
                                    min={0}
                                    style={{ width: '100%' }}
                                    addonAfter="VND"
                                />
                            </Form.Item>

                            <Form.Item
                                {...restField}
                                label="Số lượng"
                                name={[name, 'stock']}
                                rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
                            >
                                <InputNumber
                                    placeholder="Nhập số lượng"
                                    min={0}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>

                            <Form.Item
                                {...restField}
                                label="Trạng thái"
                                name={[name, 'status']}
                                rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                            >
                                <Select placeholder="Chọn trạng thái">
                                    <Select.Option value="Còn hàng">Còn hàng</Select.Option>
                                    <Select.Option value="Hết hàng">Hết hàng</Select.Option>
                                    <Select.Option value="Ngừng bán">Ngừng bán</Select.Option>
                                </Select>
                            </Form.Item>
                        </Card>
                    ))}

                    <Form.Item>
                        <Button
                            type="dashed"
                            onClick={() => add()}
                            block
                            icon={<PlusOutlined />}
                        >
                            Thêm biến thể
                        </Button>
                    </Form.Item>
                </>
            )}
        </Form.List>
    );
};

export default VariantForm;
