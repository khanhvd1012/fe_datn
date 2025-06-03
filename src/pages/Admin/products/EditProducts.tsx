import { useQueryClient } from '@tanstack/react-query';
import { Button, Empty, Form, Input, message, Select, Skeleton, Spin } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import type { IProduct } from '../../../interface/product';
import type { ICategory } from '../../../interface/category';
import type { IBrand } from '../../../interface/brand';
import { useState, useEffect } from 'react';
import { useProduct, useUpdateProduct } from '../../../hooks/useProducts';
import { useCategories } from '../../../hooks/useCategories';
import { useBrands } from '../../../hooks/useBrands';

const EditProducts = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [images, setImages] = useState<string[]>([]);
  // Fetch product data with enabled condition
  const { data: product, isLoading: productLoading } = useProduct(String(id));

  // Fetch categories and brands for dropdowns
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: brands, isLoading: brandsLoading } = useBrands();

  // Update mutation
  const { mutate, isPending: isUpdating } = useUpdateProduct();

  // Set initial form values when product data is loaded
  useEffect(() => {
    if (product) {
      const formValues = {
        name: product.name,
        description: product.description,
        brand: typeof product.brand === 'object' ? product.brand._id : product.brand,
        category: typeof product.category === 'object' ? product.category._id : product.category,
        gender: product.gender,
        status: product.status,
        price: product.price,
        variants: product.variants,
        images: product.images?.join(', ')
      };
      
      form.setFieldsValue(formValues);
      setImages(product.images || []);
    }
  }, [product, form]);
  const handleUpdate = (values: Partial<Omit<IProduct, "_id" | "createdAt" | "updatedAt">>) => {
    if (!id) return;
    mutate({ id, product: values }, {
      onSuccess: () => {
        // Invalidate both the product list and the individual product query
        queryClient.invalidateQueries({ queryKey: ['products'] });
        queryClient.invalidateQueries({ queryKey: ['product', id] });
        messageApi.success("Cập nhật sản phẩm thành công");
        setTimeout(() => {
          navigate("/admin/products");
        }, 1000);
      },
      onError: (error: any) => {
        if (error?.response?.data?.errors) {
          const errors = error.response.data.errors;
          errors.forEach((err: any) => {
            if (err.field === 'name' && err.message.includes('đã tồn tại')) {
              messageApi.error('Tên sản phẩm đã tồn tại, vui lòng chọn tên khác');
            } else {
              messageApi.error(err.message);
            }
          });
        } else {
          messageApi.error("Lỗi khi cập nhật sản phẩm");
        }
      }
    });
  };

  const handleSubmit = (values: Partial<Omit<IProduct, "_id" | "createdAt" | "updatedAt">>) => {
    if (!id) return;

    const formattedValues = {
      ...values,
      variants: values.variants || [],
      images
    };

    handleUpdate(formattedValues);
  };

  const handleImageUrls = (value: string) => {
    const urls = value.split(',').map(url => url.trim()).filter(url => url !== '');
    setImages(urls);
  };

  if (productLoading) return <Skeleton active />;
  if (!product) return <Empty description="Không tìm thấy sản phẩm" />;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {contextHolder}
      <h2 className="text-2xl font-bold mb-4">Cập nhật sản phẩm</h2>
      <Spin spinning={isUpdating} tip="Đang cập nhật...">
        <Form
          form={form}
          initialValues={{
            ...product
          }}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[
              { required: true, message: 'Vui lòng nhập tên sản phẩm!' },
              { min: 3, message: 'Tên sản phẩm phải có ít nhất 3 ký tự!' }
            ]}
          >
            <Input placeholder="Nhập tên sản phẩm" />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[
              { required: true, message: 'Vui lòng nhập mô tả sản phẩm!' },
              { min: 10, message: 'Mô tả phải có ít nhất 10 ký tự!' }
            ]}
          >
            <Input.TextArea rows={4} placeholder="Nhập mô tả sản phẩm" />
          </Form.Item>

          <Form.Item
            label="Thương hiệu"
            name="brand"
            rules={[{ required: true, message: 'Vui lòng chọn thương hiệu!' }]}
          >
            <Select
              placeholder="Chọn thương hiệu"
              loading={brandsLoading}
              notFoundContent={brandsLoading ? <span>Đang tải...</span> : <span>Không tìm thấy thương hiệu</span>}
            >
              {brands?.map((brand: IBrand) => (
                <Select.Option key={brand._id} value={brand._id}>
                  {brand.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Danh mục"
            name="category"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
          >
            <Select
              placeholder="Chọn danh mục"
              loading={categoriesLoading}
              notFoundContent={categoriesLoading ? <span>Đang tải...</span> : <span>Không tìm thấy danh mục</span>}
            >
              {categories?.map((category: ICategory) => (
                <Select.Option key={category._id} value={category._id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Giới tính"
            name="gender"
            rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
          >
            <Select placeholder="Chọn giới tính">
              <Select.Option value="male">Nam</Select.Option>
              <Select.Option value="female">Nữ</Select.Option>
              <Select.Option value="unisex">Unisex</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Select.Option value="inStock">Còn hàng</Select.Option>
              <Select.Option value="outOfStock">Hết hàng</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Hình ảnh"
            name="images"
            initialValue={product?.images?.join(', ')}
            rules={[{ required: true, message: 'Vui lòng nhập đường dẫn hình ảnh!' }]}
          >
            <Input.TextArea
              placeholder="Nhập các đường dẫn hình ảnh (phân cách bằng dấu phẩy)"
              onChange={(e) => handleImageUrls(e.target.value)}
              rows={3}
            />
          </Form.Item>

          <Form.Item
            label="Giá"
            name="price"
            rules={[
              { required: true, message: 'Vui lòng nhập giá!' },
              {
                validator: (_, value) => {
                  const price = Number(value);
                  if (isNaN(price)) {
                    return Promise.reject('Giá phải là số!');
                  }
                  if (price < 0) {
                    return Promise.reject('Giá phải lớn hơn hoặc bằng 0!');
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <Input type="number" min={0} placeholder="Nhập giá" />
          </Form.Item>

          <Form.Item
            label="Biến thể"
            name="variants"
          >
            <Select
              mode="tags"
              tokenSeparators={[',']}
            />
          </Form.Item>

          <Form.Item>
            <div className="flex justify-end gap-4">
              <Button onClick={() => navigate('/admin/products')}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={isUpdating}>
                Cập nhật sản phẩm
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
}

export default EditProducts