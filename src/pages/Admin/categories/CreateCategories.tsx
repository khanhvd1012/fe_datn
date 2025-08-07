import { useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, message, Upload, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAddCategory } from '../../../hooks/useCategories';
import { useState } from 'react';
import type { UploadChangeParam, UploadFile } from 'antd/es/upload';

const CreateCategories = () => {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const { mutate } = useAddCategory();
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

    if (values.brand && Array.isArray(values.brand)) {
      values.brand.forEach((brandId: string) => {
        formData.append("brand", brandId); 
      });
    }

    mutate(formData, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        messageApi.success("Tạo danh mục thành công");
        setTimeout(() => navigate("/admin/categories"), 1000);
      },
      onError: (error: any) => {
        console.error("Lỗi khi tạo danh mục:", error);
        messageApi.error("Lỗi khi tạo danh mục");
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
      <h2 className="text-2xl font-bold mb-4">Tạo Danh Mục Mới</h2>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Tên Danh Mục"
          name="name"
          rules={[
            { required: true, message: 'Vui lòng nhập tên danh mục!' },
            { min: 2, message: 'Tên phải có ít nhất 2 ký tự!' },
            { max: 50, message: 'Tên không được vượt quá 50 ký tự!' }
          ]}
        >
          <Input placeholder="Nhập tên danh mục" />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="description"
          rules={[
            { required: true, message: 'Vui lòng nhập mô tả danh mục!' },
            { max: 500, message: 'Mô tả không được vượt quá 500 ký tự!' }
          ]}
        >
          <Input.TextArea rows={4} placeholder="Nhập mô tả danh mục" />
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
            <Button onClick={() => navigate('/admin/categories')}>Hủy</Button>
            <Button type="primary" htmlType="submit">Tạo Danh Mục</Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateCategories;
