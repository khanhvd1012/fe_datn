import { useQueryClient } from '@tanstack/react-query';
import { Button, Form, InputNumber, message, Select, Skeleton, Upload, Typography, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useUpdateVariant, useVariant } from '../../../hooks/useVariants';
import { useProducts } from '../../../hooks/useProducts';
import { useColors } from '../../../hooks/useColors';
import { useSizes } from '../../../hooks/useSizes';
import { useEffect, useState } from 'react';
import type { UploadFile, UploadChangeParam } from 'antd/es/upload';

const EditVariant = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const { data: variant, isLoading } = useVariant(id!);
  const { mutate, isPending: isUpdating } = useUpdateVariant();
  const { data: products } = useProducts();
  const { data: colors } = useColors();
  const { data: sizes } = useSizes();

  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  // Chuyển URL ảnh sang dạng UploadFile (cho preview)
  useEffect(() => {
    if (variant?.data?.image_url && Array.isArray(variant.data.image_url)) {
      const fileListFromUrls: UploadFile[] = variant.data.image_url.map((url: string, index: number) => ({
        uid: `${index}`,
        name: `image-${index}`,
        status: 'done',
        url,
      }));
      setFileList(fileListFromUrls);
    }
  }, [variant]);

  const handleFileChange = (info: UploadChangeParam) => {
    setFileList(info.fileList);
    const files = info.fileList
      .filter(file => file.originFileObj)
      .map(file => file.originFileObj as File);
    setImageFiles(files);
  };

  const initialValues = variant && variant.data ? {
    ...variant.data,
    color: typeof variant.data.color === 'object' ? variant.data.color._id : variant.data.color,
    product_id: typeof variant.data.product_id === 'object' ? variant.data.product_id._id : variant.data.product_id,
    size: Array.isArray(variant.data.size)
      ? variant.data.size.map((s: any) => (typeof s === 'object' ? s._id : s))
      : typeof variant.data.size === 'object'
        ? [variant.data.size._id]
        : [variant.data.size],
  } : {};

  const handleSubmit = (values: any) => {
    if (!id) return;

    const formData = new FormData();
    formData.append("product_id", values.product_id);
    formData.append("size", values.size);
    formData.append("color", values.color);
    formData.append("price", values.price);
    formData.append("import_price", values.import_price);
    formData.append("gender", values.gender);
    formData.append("weight", values.weight);
    formData.append("length", values.length);
    formData.append("width", values.width);
    formData.append("height", values.height);

    // Tách ảnh cũ (chỉ có url) và ảnh mới (có originFileObj)
    const existingImageUrls = fileList
      .filter(file => !file.originFileObj && file.url)
      .map(file => file.url!);

    const newImageFiles = fileList
      .filter(file => file.originFileObj)
      .map(file => file.originFileObj as File);

    // Gửi ảnh mới
    newImageFiles.forEach(file => {
      formData.append("images", file);
    });

    // Gửi URL ảnh cũ nếu backend hỗ trợ
    existingImageUrls.forEach(url => {
      formData.append("existingImages", url); // cần backend hỗ trợ
    });

    mutate(
      { id, variant: formData },
      {
        onSuccess: () => {
          messageApi.success("Cập nhật biến thể thành công!");
          queryClient.invalidateQueries({ queryKey: ["variants"] });
          setTimeout(() => {
            navigate("/admin/variants");
          }, 1000);
        },
        onError: (error: any) => {
          const backendErrors = error?.response?.data?.errors;

          if (Array.isArray(backendErrors) && backendErrors.length > 0) {
            message.error(backendErrors[0].message);
          } else {
            message.error(error?.response?.data?.message || "Lỗi khi cập nhật biến thể.");
          }
          console.error("Lỗi khi cập nhật:", error);
        },
      }
    );
  };

  if (isLoading) return <Skeleton active />;
  return (
    <div className="max-w-2xl mx-auto p-4">
      {contextHolder}
      <h2 className="text-2xl font-bold mb-4">Cập nhật Biến Thể</h2>
      <Form
        layout="vertical"
        initialValues={initialValues}
        onFinish={handleSubmit}
        form={form}
      >
        <Form.Item label="Sản phẩm" name="product_id" rules={[{ required: true }]}>
          <Select placeholder="Chọn sản phẩm">
            {products?.map((p: any) => (
              <Select.Option key={p._id} value={p._id}>{p.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Kích thước" name="size" rules={[{ required: true }]}>
          <Select placeholder="Chọn kích thước">
            {sizes?.map((size: any) => (
              <Select.Option key={size._id} value={size._id}>{size.size}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Màu sắc" name="color" rules={[{ required: true }]}>
          <Select placeholder="Chọn màu sắc">
            {colors?.map((c: any) => (
              <Select.Option key={c._id} value={c._id}>{c.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Giá bán" name="price" rules={[{ required: true }]}>
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Giá nhập"
          name="import_price"
          rules={[
            { required: true },
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
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Thông số vận chuyển" style={{ marginBottom: 0 }}>
          <Row gutter={12} >
            <Col span={6}>
              <Form.Item
                name="weight"
                rules={[{ required: true, message: 'Nhập trọng lượng!' }]}
              >
                <InputNumber style={{ width: '100%' }} placeholder="Trọng lượng (g)" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="length"
                rules={[{ required: true, message: 'Nhập chiều dài!' }]}
              >
                <InputNumber style={{ width: '100%' }} placeholder="Dài (cm)" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="width"
                rules={[{ required: true, message: 'Nhập chiều rộng!' }]}
              >
                <InputNumber style={{ width: '100%' }} placeholder="Rộng (cm)" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="height"
                rules={[{ required: true, message: 'Nhập chiều cao!' }]}
              >
                <InputNumber style={{ width: '100%' }} placeholder="Cao (cm)" />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>

        <Form.Item label="Giới tính" name="gender" rules={[{ required: true }]}>
          <Select>
            <Select.Option value="unisex">Unisex</Select.Option>
            <Select.Option value="male">Nam</Select.Option>
            <Select.Option value="female">Nữ</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Ảnh biến thể" required>
          <Upload
            multiple
            listType="picture"
            fileList={fileList}
            beforeUpload={() => false}
            onChange={handleFileChange}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <div className="flex justify-end gap-4">
            <Button onClick={() => navigate('/admin/variants')}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={isUpdating}>
              {isUpdating ? 'Đang cập nhật...' : 'Cập nhật biến thể'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditVariant;
