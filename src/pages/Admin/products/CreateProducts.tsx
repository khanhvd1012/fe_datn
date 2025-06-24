import { Button, Form, Input, Select, message, Card, Row, Col, Typography, InputNumber } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import type { IProduct } from '../../../interface/product';
import type { ICategory } from '../../../interface/category';
import type { IBrand } from '../../../interface/brand';
import type { IColor } from '../../../interface/color';
import type { ISize } from '../../../interface/size';
import { useAddProduct } from '../../../hooks/useProducts';
import { useCategories } from '../../../hooks/useCategories';
import { useBrands } from '../../../hooks/useBrands';
import { useColors } from '../../../hooks/useColors';
import { useSizes } from '../../../hooks/useSizes';
import VariantForm from '../../../components/VariantForm';
import { useMutation } from '@tanstack/react-query';
import { addVariant } from '../../../service/variantAPI';

const { TextArea } = Input;
const { Title } = Typography;

const CreateProducts = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: brands, isLoading: brandsLoading } = useBrands();
  const { data: colorsData, isLoading: colorsLoading } = useColors();
  const { data: sizesData, isLoading: sizesLoading } = useSizes();

  const { mutate: addProduct, isPending: isAddingProduct } = useAddProduct();
  const { mutate: createVariant } = useMutation({
    mutationFn: addVariant,
    onError: (error: any) => {
      messageApi.error(error?.response?.data?.message || 'Có lỗi xảy ra khi tạo biến thể!');
    }
  });

  const handleSubmit = async (values: any) => {
    try {
      if (!values.images || values.images.length === 0) {
        messageApi.error('Vui lòng thêm ít nhất một ảnh sản phẩm!');
        return;
      }

      const productData: Omit<IProduct, '_id' | 'createdAt' | 'updatedAt'> = {
        name: values.name,
        description: values.description,
        brand: values.brand,
        category: values.category,
        gender: values.gender,
        variants: [],
        colors: values.colors,
        sizes: values.sizes || [],
        images: values.images,
        price: Number(values.price),
        quantity: Number(values.quantity),
        status: Number(values.quantity) === 0 ? 'outOfStock' : 'inStock'
      };

      addProduct(productData, {
        onSuccess: async (response) => {
          if (values.variants?.length > 0) {
            const variantPromises = values.variants.map((variant: any) => {
              if (!variant.images?.length) {
                throw new Error('Mỗi biến thể phải có ít nhất một ảnh!');
              }
              return createVariant({
                ...variant,
                product_id: response._id,
                status: 'active'
              });
            });

            await Promise.all(variantPromises);
          }

          messageApi.success('Thêm sản phẩm thành công!');
          navigate('/admin/products');
        },
        onError: (error: any) => {
          messageApi.error(error?.response?.data?.message || 'Có lỗi xảy ra khi tạo sản phẩm!');
        }
      });
    } catch (error: any) {
      messageApi.error(error.message || 'Có lỗi xảy ra!');
    }
  };

  return (
    <div className="p-4">
      {contextHolder}
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={16}>
          <Col span={14}>
            <Card title={<Title level={4}>Thông tin sản phẩm</Title>} className="mb-4">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label="Tên sản phẩm"
                    rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
                  >
                    <Input placeholder="Nhập tên sản phẩm" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="price"
                    label="Giá gốc"
                    rules={[
                      { required: true, message: 'Vui lòng nhập giá!' },
                      { type: 'number', min: 0, message: 'Giá phải lớn hơn hoặc bằng 0!' }
                    ]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      placeholder="Nhập giá sản phẩm"
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="category"
                    label="Danh mục"
                    rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                  >
                    <Select loading={categoriesLoading} placeholder="Chọn danh mục">
                      {categories?.map((category: ICategory) => (
                        <Select.Option key={category._id} value={category._id}>
                          {category.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="brand"
                    label="Thương hiệu"
                    rules={[{ required: true, message: 'Vui lòng chọn thương hiệu!' }]}
                  >
                    <Select loading={brandsLoading} placeholder="Chọn thương hiệu">
                      {brands?.map((brand: IBrand) => (
                        <Select.Option key={brand._id} value={brand._id}>
                          {brand.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="gender"
                    label="Giới tính"
                    rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                  >
                    <Select placeholder="Chọn giới tính">
                      <Select.Option value="male">Nam</Select.Option>
                      <Select.Option value="female">Nữ</Select.Option>
                      <Select.Option value="unisex">Unisex</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="colors"
                    label="Màu sắc chính"
                    rules={[{ required: true, message: 'Vui lòng chọn màu sắc!' }]}
                  >
                    <Select loading={colorsLoading} placeholder="Chọn màu sắc">
                      {colorsData?.map((color: IColor) => (
                        <Select.Option key={color._id} value={color._id}>
                          {color.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
  name="sizes"
  label="Kích thước"
  rules={[{ required: true, message: 'Vui lòng chọn ít nhất một kích thước!' }]}
>
  <Select
    mode="multiple"
    placeholder="Chọn kích thước"
    loading={sizesLoading}
  >
    {sizesData?.map((size: ISize) => (
      <Select.Option key={size._id} value={size._id}>
        {size.name}
      </Select.Option>
    ))}
  </Select>
</Form.Item>

                </Col>
              </Row>

              <Form.Item
                name="quantity"
                label="Số lượng"
                rules={[
                  { required: true, message: 'Vui lòng nhập số lượng!' },
                  { type: 'number', min: 0, message: 'Số lượng phải lớn hơn hoặc bằng 0!' }
                ]}
              >
                <InputNumber style={{ width: '100%' }} min={0} placeholder="Nhập số lượng" />
              </Form.Item>

              <Form.Item
                name="description"
                label="Mô tả"
                rules={[{ required: true, message: 'Vui lòng nhập mô tả sản phẩm!' }]}
              >
                <TextArea rows={4} placeholder="Nhập mô tả sản phẩm" />
              </Form.Item>

              {/* ✅ Thêm link ảnh thay cho Upload */}
              <Form.List name="images" rules={[{
                validator: async (_, value) => {
                  if (!value || value.length < 1) {
                    return Promise.reject(new Error('Phải có ít nhất một đường dẫn ảnh!'));
                  }
                }
              }]}>
                {(fields, { add, remove }) => (
                  <>
                    <label><b>Ảnh sản phẩm</b></label>
                    {fields.map(({ key, name, ...restField }) => (
                      <Row key={key} gutter={8} align="middle" style={{ marginBottom: 8 }}>
                        <Col flex="auto">
                          <Form.Item
                            {...restField}
                            name={name}
                            rules={[
                              { required: true, message: 'Vui lòng nhập đường dẫn ảnh!' },
                              { type: 'url', message: 'URL không hợp lệ!' }
                            ]}
                          >
                            <Input placeholder="https://example.com/image.jpg" />
                          </Form.Item>
                        </Col>
                        <Col>
                          <Button danger onClick={() => remove(name)}>Xóa</Button>
                        </Col>
                      </Row>
                    ))}
                    <Form.Item>
                      <Button type="dashed" onClick={() => add()} block>
                        Thêm ảnh
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>

              <Form.Item>
                <Row justify="end" gutter={16}>
                  <Col>
                    <Button onClick={() => navigate('/admin/products')}>Hủy</Button>
                  </Col>
                  <Col>
                    <Button type="primary" htmlType="submit" loading={isAddingProduct}>
                      Thêm sản phẩm
                    </Button>
                  </Col>
                </Row>
              </Form.Item>
            </Card>
          </Col>

          <Col span={10}>
            <Card title={<Title level={4}>Biến thể sản phẩm</Title>} className="mb-4">
              <VariantForm sizes={sizesData?.sizes} colors={colorsData} />
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default CreateProducts;
