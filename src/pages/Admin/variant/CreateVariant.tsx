import { useQueryClient } from '@tanstack/react-query';
import { Button, Form, InputNumber, message, Select, Skeleton, Upload, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAddVariant } from '../../../hooks/useVariants';
import { useProducts } from '../../../hooks/useProducts';
import { useColors } from '../../../hooks/useColors';
import { useSizes } from '../../../hooks/useSizes';
import { useState } from 'react';
import type { UploadFile, UploadChangeParam } from 'antd/es/upload';

const { Title } = Typography;

const CreateVariant = () => {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const { mutate, isPending } = useAddVariant();
  const { data: products, isLoading: loadingProducts } = useProducts();
  const { data: colors, isLoading: loadingColors } = useColors();
  const { data: sizes, isLoading: loadingSizes } = useSizes();

  const [form] = Form.useForm();

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const handleFileChange = (info: UploadChangeParam) => {
    setFileList(info.fileList);
    const files = info.fileList.map(file => file.originFileObj).filter(Boolean) as File[];
    setImageFiles(files);
  };

  const handleSubmit = (values: any) => {
    if (imageFiles.length === 0) {
      messageApi.error("Vui lòng chọn ít nhất một ảnh!");
      return;
    }

    const formData = new FormData();
    formData.append("product_id", values.product_id);
    formData.append("size", values.size);
    formData.append("color", values.color);
    formData.append("price", values.price);
    formData.append("import_price", values.import_price);
    formData.append("gender", values.gender);
    formData.append("initial_stock", values.initial_stock);

    imageFiles.forEach((file: File) => {
      formData.append("images", file);
    });

    mutate(formData, {
      onSuccess: () => {
        messageApi.success("Thêm biến thể thành công!");
        queryClient.invalidateQueries({ queryKey: ['variants'] });
        setTimeout(() => navigate("/admin/variants"), 1000);
      },
      onError: (err: any) => {
        messageApi.error("Thêm biến thể thất bại!");
        console.error("Lỗi khi thêm biến thể:", err);
      }
    });
  };

  if (loadingProducts || loadingColors || loadingSizes) {
    return <Skeleton active />;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {contextHolder}
      <Title level={2}>Thêm Biến Thể</Title>
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        initialValues={{
          status: 'inStock',
          initial_stock: 0
        }}
      >
        <Form.Item
          label="Sản phẩm"
          name="product_id"
          rules={[{ required: true, message: 'Vui lòng chọn sản phẩm!' }]}
        >
          <Select placeholder="Chọn sản phẩm">
            {products?.map((p: any) => (
              <Select.Option key={p._id} value={p._id}>
                {p.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Kích thước"
          name="size"
          rules={[{ required: true, message: 'Vui lòng chọn ít nhất một kích thước!' }]}
        >
          <Select placeholder="Chọn kích thước">
            {sizes?.map((size: any) => (
              <Select.Option key={size._id} value={size._id}>
                {size.size}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Màu sắc"
          name="color"
          rules={[{ required: true, message: 'Vui lòng chọn màu sắc!' }]}
        >
          <Select placeholder="Chọn màu sắc">
            {colors?.map((color: any) => (
              <Select.Option key={color._id} value={color._id}>
                {color.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Giá bán"
          name="price"
          rules={[{ required: true, message: 'Vui lòng nhập giá bán!' }]}
        >
          <InputNumber style={{ width: '100%' }} placeholder="Nhập giá bán" />
        </Form.Item>

        <Form.Item
          label="Giá nhập"
          name="import_price"
          rules={[
            { required: true, message: 'Vui lòng nhập giá nhập!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const price = getFieldValue('price');
                if (value < 0) return Promise.reject('Giá nhập không được âm!');
                if (price !== undefined && value > price) return Promise.reject('Giá nhập không được cao hơn giá bán!');
                return Promise.resolve();
              }
            })
          ]}
        >
          <InputNumber style={{ width: '100%' }} placeholder="Nhập giá nhập" />
        </Form.Item>

        <Form.Item
          label="Giới tính"
          name="gender"
          rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
        >
          <Select placeholder="Chọn giới tính">
            <Select.Option value="unisex">Unisex</Select.Option>
            <Select.Option value="male">Nam</Select.Option>
            <Select.Option value="female">Nữ</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Ảnh biến thể"
          required
        >
          <Upload
            multiple
            listType="picture"
            beforeUpload={() => false}
            fileList={fileList}
            onChange={handleFileChange}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          label="Số lượng nhập kho"
          name="initial_stock"
          rules={[
            { required: true, message: 'Vui lòng nhập số lượng!' },
            {
              validator(_, value) {
                if (value < 0) return Promise.reject('Số lượng không được âm!');
                return Promise.resolve();
              }
            }
          ]}
        >
          <InputNumber style={{ width: '100%' }} placeholder="Nhập số lượng" />
        </Form.Item>

        <Form.Item>
          <div className="flex justify-end gap-4">
            <Button onClick={() => navigate('/admin/variants')}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={isPending}>
              {isPending ? 'Đang thêm...' : 'Thêm biến thể'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateVariant;
