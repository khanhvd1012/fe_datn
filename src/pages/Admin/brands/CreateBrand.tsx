import { Form, Input, Button, message, Typography, Upload } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAddBrand } from '../../../hooks/useBrands';
import { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadChangeParam, UploadFile } from 'antd/es/upload';
import { useQueryClient } from '@tanstack/react-query';

const { Title } = Typography;

const CreateBrand = () => {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const { mutate, isPending } = useAddBrand();
  const [form] = Form.useForm();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleSubmit = (values: any) => {
    if (!logoFile) {
      messageApi.error("Vui lòng chọn ảnh !");
      return;
    }

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("logo_image", logoFile);

    mutate(formData, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["brands"] });
        messageApi.success("Tạo thương hiệu thành công");
        setTimeout(() => navigate("/admin/brands"), 1000);
      },
      onError: (error: any) => {
        console.error("Lỗi khi tạo thương hiệu:", error);
        messageApi.error("Lỗi khi tạo thương hiệu");
      }
    });
  };

  const handleFileChange = (info: UploadChangeParam) => {
    const file = info.fileList[0]?.originFileObj;

    setFileList(info.fileList);

    if (file) {
      setLogoFile(file as File);
    } else {
      setLogoFile(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {contextHolder}
      <Title level={2} className="mb-4">Thêm Thương Hiệu Mới</Title>

      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Tên Thương Hiệu"
          name="name"
          rules={[
            { required: true, message: 'Vui lòng nhập tên thương hiệu!' },
            { min: 2, message: 'Tên phải có ít nhất 2 ký tự!' },
            { max: 50, message: 'Tên không được vượt quá 50 ký tự!' }
          ]}
        >
          <Input placeholder="Nhập tên thương hiệu" />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="description"
          rules={[
            { required: true, message: 'Vui lòng nhập mô tả thương hiệu!' },
            { max: 500, message: 'Mô tả không được vượt quá 500 ký tự!' }
          ]}
        >
          <Input.TextArea rows={4} placeholder="Nhập mô tả thương hiệu" />
        </Form.Item>

        <Form.Item label="Ảnh">
          <Upload
            name="logo_image"
            beforeUpload={() => false}
            onChange={handleFileChange}
            maxCount={1}
            fileList={fileList}
            listType="picture"
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <div className="flex justify-end gap-4">
            <Button onClick={() => navigate('/admin/brands')}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={isPending}>
              Thêm Thương Hiệu
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateBrand;