import { Form, Input, Button, message, Typography, Upload, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAddBanner } from '../../../hooks/useBanner';
import { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadChangeParam, UploadFile } from 'antd/es/upload';
import { useQueryClient } from '@tanstack/react-query';

const { Title } = Typography;
const { Option } = Select;

const CreateBanner = () => {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const { mutate, isPending } = useAddBanner();
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleSubmit = (values: any) => {
    if (!imageFile) {
      messageApi.error("Vui lòng chọn ảnh banner!");
      return;
    }

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("status", values.status === 'active' ? 'true' : 'false');
    formData.append("image", imageFile);

    mutate(formData, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['banners'] });
        messageApi.success("Tạo banner thành công");
        setTimeout(() => navigate("/admin/banners"), 1000);
      },
      onError: (error: any) => {
        console.error("Lỗi khi tạo banner:", error);
        messageApi.error("Lỗi khi tạo banner");
      }
    });
  };

  const handleFileChange = (info: UploadChangeParam) => {
    const file = info.fileList[0]?.originFileObj;

    setFileList(info.fileList);

    if (file) {
      setImageFile(file as File);
    } else {
      setImageFile(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {contextHolder}
      <Title level={2} className="mb-4">Thêm Banner Mới</Title>

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
            { max: 100, message: 'Tiêu đề không được vượt quá 100 ký tự' },
            { whitespace: true, message: 'Tiêu đề không được để trống' }
          ]}
        >
          <Input placeholder="Nhập tiêu đề banner" />
        </Form.Item>

        <Form.Item label="Ảnh banner">
          <Upload
            name="image"
            beforeUpload={() => false}
            onChange={handleFileChange}
            maxCount={1}
            fileList={fileList}
            listType="picture"
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          label="Trạng thái"
          name="status"
          initialValue="active"
        >
          <Select>
            <Option value="active">Hiển thị</Option>
            <Option value="inactive">Ẩn</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <div className="flex justify-end gap-4">
            <Button onClick={() => navigate('/admin/banners')}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={isPending}>
              Thêm Banner
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateBanner;
