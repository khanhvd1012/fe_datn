import { useEffect, useState } from 'react';
import { Button, Form, Input, Upload, message, Typography, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import type { UploadFile, UploadChangeParam } from 'antd/es/upload';
import { useQueryClient } from '@tanstack/react-query';
import { useGetNewsById, useUpdateNews } from '../../../hooks/useBlogs';

const { Title } = Typography;

const EditBlogs = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const { data: news, isLoading } = useGetNewsById(id!);

  const { mutate, isPending: isUpdating } = useUpdateNews();

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  useEffect(() => {
    if (news?.images) {
      const fileListFromUrls: UploadFile[] = news.images.map((url: string, index: number) => ({
        uid: `${index}`,
        name: `image-${index}`,
        status: 'done',
        url,
      }));
      setFileList(fileListFromUrls);
    }
  }, [news]);

  const handleFileChange = (info: UploadChangeParam) => {
    setFileList(info.fileList);
    const files = info.fileList
      .filter((file) => file.originFileObj)
      .map((file) => file.originFileObj as File);
    setImageFiles(files);
  };

  useEffect(() => {
    if (news) {
      form.setFieldsValue({
        title: news.title,
        content: news.content,
      });
    }
  }, [news, form]);

  const handleSubmit = (values: any) => {
    if (!id) return;

    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('content', values.content);

    imageFiles.forEach((file) => {
      formData.append('images', file);
    });

    mutate(
      { id, data: formData },
      {
        onSuccess: () => {
          messageApi.success('Cập nhật tin tức thành công!');
          queryClient.invalidateQueries({ queryKey: ['news'] });
          setTimeout(() => navigate('/admin/blogs'), 1000);
        },
        onError: (err: any) => {
          const errorMsg = err?.response?.data?.message || 'Cập nhật thất bại!';
          messageApi.error(errorMsg);
        },
      }
    );
  };

  if (isLoading) return <Spin />;
  if (!news) return <p>Dữ liệu không tồn tại.</p>;
  return (
    <div className="max-w-2xl mx-auto p-4">
      {contextHolder}
      <Title level={2}>Cập nhật Tin Tức</Title>
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Tiêu đề"
          name="title"
          rules={[
            { required: true, message: 'Tiêu đề là bắt buộc' },
            { min: 5, message: 'Tiêu đề phải có ít nhất 5 ký tự' },
            { max: 200, message: 'Tiêu đề không vượt quá 200 ký tự' },
          ]}
        >
          <Input placeholder="Nhập tiêu đề tin tức" />
        </Form.Item>

        <Form.Item
          label="Nội dung"
          name="content"
          rules={[
            { required: true, message: 'Nội dung là bắt buộc' },
            { min: 10, message: 'Nội dung phải có ít nhất 10 ký tự' },
          ]}
        >
          <Input.TextArea rows={8} placeholder="Nhập nội dung chi tiết" />
        </Form.Item>

        <Form.Item label="Ảnh tin tức" required>
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
            <Button type="primary" htmlType="submit" loading={isUpdating}>
              {isUpdating ? 'Đang cập nhật...' : 'Cập nhật Tin Tức'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditBlogs;
