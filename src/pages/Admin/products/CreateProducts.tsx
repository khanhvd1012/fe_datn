import { useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, Select, message, Card, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { ICategory } from '../../../interface/category';
import type { IBrand } from '../../../interface/brand';
import { useAddProduct } from '../../../hooks/useProducts';
import { useCategories } from '../../../hooks/useCategories';
import { useBrands } from '../../../hooks/useBrands';
import { useSizes } from '../../../hooks/useSizes';
import VariantForm from '../../../components/VariantForm';
import { addVariant } from '../../../service/variantAPI';
import type { IVariant } from '../../../interface/variant';

const { TextArea } = Input;

const CreateProducts = () => {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: brands, isLoading: brandsLoading } = useBrands();
  const { mutate } = useAddProduct();

  const handleSubmit = async (values: any) => {
    try {
      // Format the image array
      const imageArray = values.images ? values.images.split(',').map((url: string) => url.trim()).filter((url: string) => url !== '') : [];

      // Prepare product data - matching backend schema exactly
      const productData = {
        name: values.name,
        description: values.description,
        brand: values.brand,
        category: values.category,
        gender: values.gender,
        variants: [], // Will be populated after variant creation
        images: imageArray,
        price: Number(values.price),
        sizes: values.sizes || [], 
        quantity: 0, // Will be calculated from variants
        status: values.status
      };

      mutate(productData, {
        onSuccess: async (response) => {
          try {
            // After product is created, create variants if they exist
            if (values.variants && values.variants.length > 0) {
              const productId = response._id;
              
              // Map each variant to create a proper variant object
              const variantPromises = values.variants.map((variant: any) => {
                const variantData: IVariant = {
                  SKU: variant.SKU,
                  size: variant.size,
                  color: variant.color,
                  image: variant.image,
                  price: Number(variant.price),
                  stock: Number(variant.stock),
                  status: variant.status,
                  product: productId
                };
                return addVariant(variantData);
              });

              await Promise.all(variantPromises);
            }

            queryClient.invalidateQueries({
              queryKey: ["products"],
            });
            messageApi.success("Tạo sản phẩm và biến thể thành công");
            setTimeout(() => {
              navigate("/admin/products");
            }, 1000);
          } catch (variantError: any) {
            messageApi.error("Lỗi khi tạo biến thể: " + (variantError.response?.data?.message || "Có lỗi xảy ra"));
          }
        },
        onError: (error: any) => {
          const errorMessage = error.response?.data?.message || "Có lỗi xảy ra khi tạo sản phẩm";
          messageApi.error(errorMessage);
        }
      });
    } catch (error: any) {
      messageApi.error(error.message || "Có lỗi xảy ra");
    }
  };
  const handleImageUrls = (value: string) => {
    const urls = value.split(',').map(url => url.trim()).filter(url => url !== '');
    return urls;
  };

  return (
    <div className="p-4">
      {contextHolder}
      <h2 className="text-2xl font-bold mb-4">Tạo sản phẩm mới</h2>
      <Form
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Card title="Thông tin sản phẩm" className="mb-4">
              <Form.Item
                label="Tên sản phẩm"
                name="name"
                rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
              >
                <Input placeholder="Nhập tên sản phẩm" />
              </Form.Item>

              <Form.Item
                label="Mô tả"
                name="description"
                rules={[{ required: true, message: 'Vui lòng nhập mô tả sản phẩm!' }]}
              >
                <TextArea rows={4} placeholder="Nhập mô tả sản phẩm" />
              </Form.Item>

              <Form.Item
                label="Hình ảnh"
                name="images"
                rules={[{ required: true, message: 'Vui lòng nhập đường dẫn hình ảnh!' }]}
              >
                <TextArea
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
              </Form.Item>              <Form.Item
                label="Trạng thái"
                name="status"
                initialValue="inStock"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
              >
                <Select placeholder="Chọn trạng thái">
                  <Select.Option value="inStock">Còn hàng</Select.Option>
                  <Select.Option value="outOfStock">Hết hàng</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Kích thước"
                name="sizes"
                rules={[{ required: true, message: 'Vui lòng chọn ít nhất một kích thước!' }]}
              >
              </Form.Item>

              <Form.Item
                label="Số lượng"
                name="quantity"
                initialValue={0}
                rules={[
                  { required: true, message: 'Vui lòng nhập số lượng!' },
                  {
                    validator: (_, value) => {
                      const quantity = Number(value);
                      if (isNaN(quantity)) {
                        return Promise.reject('Số lượng phải là số!');
                      }
                      if (quantity < 0) {
                        return Promise.reject('Số lượng phải lớn hơn hoặc bằng 0!');
                      }
                      return Promise.resolve();
                    }
                  }
                ]}
              >
                <Input type="number" min={0} placeholder="Nhập số lượng" />
              </Form.Item>
            </Card>
          </Col>

          <Col span={12}>
            <Card title="Biến thể sản phẩm" className="mb-4">
              <VariantForm />
            </Card>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={brandsLoading || categoriesLoading}>
            Tạo sản phẩm
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateProducts;