import { useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, message, Upload, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import type { UploadFile, UploadChangeParam } from 'antd/es/upload';
import { useCreateNews } from '../../../hooks/useBlogs';

const { Title } = Typography;

const CreateBlog = () => {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateNews();

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
    formData.append("title", values.title);
    formData.append("content", values.content);

    imageFiles.forEach(file => formData.append("images", file));

    mutate(formData, {
      onSuccess: () => {
        messageApi.success("Thêm tin tức thành công!");
        queryClient.invalidateQueries({ queryKey: ['news'] });
        setTimeout(() => navigate("/admin/blogs"), 1000);
      },
      onError: (error: any) => {
        const backendErrors = error?.response?.data?.errors;

        if (Array.isArray(backendErrors) && backendErrors.length > 0) {
          message.error(backendErrors[0].message);
        } else {
          message.error(error?.response?.data?.message || "Lỗi khi thêm tin tức.");
        }
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {contextHolder}
      <Title level={2}>Thêm Tin Tức</Title>
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        initialValues={{}}
      >
        <Form.Item
          label="Tiêu đề"
          name="title"
          rules={[
            { required: true, message: "Tiêu đề là bắt buộc" },
            { min: 5, message: "Tiêu đề phải có ít nhất 5 ký tự" },
            { max: 200, message: "Tiêu đề không vượt quá 200 ký tự" },
          ]}        >
          <Input placeholder="Nhập tiêu đề tin tức" />
        </Form.Item>

        <Form.Item
          label="Nội dung"
          name="content"
          rules={[
            { required: true, message: "Nội dung là bắt buộc" },
            { min: 10, message: "Nội dung phải có ít nhất 10 ký tự" },
          ]}        >
          <Input.TextArea rows={8} placeholder="Nhập nội dung chi tiết" />
        </Form.Item>

        <Form.Item label="Ảnh" required>
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

        <Form.Item>
          <div className="flex justify-end gap-4">
            <Button onClick={() => navigate('/admin/blogs')}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={isPending}>
              {isPending ? 'Đang thêm...' : 'Thêm Blogs'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateBlog;
