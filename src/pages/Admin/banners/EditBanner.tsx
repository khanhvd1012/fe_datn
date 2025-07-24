import {
  Form,
  Input,
  Button,
  message,
  Typography,
  Upload,
  Select,
  Spin,
} from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { UploadOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import type { UploadFile, UploadChangeParam } from 'antd/es/upload';
import { useBanner, useUpdateBanner } from '../../../hooks/useBanner';
import { useQueryClient } from '@tanstack/react-query';

const { Title } = Typography;
const { Option } = Select;

const EditBanner = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const { data: banner, isLoading } = useBanner(id!);
  const { mutate, isPending } = useUpdateBanner();

  useEffect(() => {
    if (banner) {
      form.setFieldsValue({
        title: banner.title,
        status: banner.status ? 'active' : 'inactive',
      });

      if (banner.image) {
        setFileList([
          {
            uid: '-1',
            name: 'Ảnh hiện tại',
            status: 'done',
            url: banner.image,
          } as UploadFile,
        ]);
      }
    }
  }, [banner, form]);

  const handleFileChange = (info: UploadChangeParam) => {
    const file = info.fileList[0]?.originFileObj;
    setFileList(info.fileList);
    setImageFile(file ?? null);
  };

  const handleSubmit = (values: any) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('status', values.status === 'active' ? 'true' : 'false');

    if (imageFile) {
      formData.append('image', imageFile);
    }

    mutate(
      { id: id!, banner: formData },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['banners'] });
          messageApi.success('Cập nhật banner thành công');
          setTimeout(() => navigate('/admin/banners'), 1000);
        },
        onError: () => {
          messageApi.error('Cập nhật banner thất bại');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <Spin tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {contextHolder}
      <Title level={2} className="mb-4">
        Chỉnh sửa Banner
      </Title>

      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Form.Item
          label="Tiêu đề"
          name="title"
          rules={[
            { required: true, message: 'Tiêu đề là bắt buộc' },
            { min: 5, message: 'Tiêu đề phải có ít nhất 5 ký tự' },
            { max: 100, message: 'Tiêu đề không được vượt quá 100 ký tự' },
            { whitespace: true, message: 'Tiêu đề không được để trống' },
          ]}
        >
          <Input placeholder="Nhập tiêu đề banner" />
        </Form.Item>

        <Form.Item label="Ảnh banner">
          <Upload
            name="image"
            listType="picture"
            beforeUpload={() => false}
            onChange={handleFileChange}
            maxCount={1}
            fileList={fileList}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>

        <Form.Item label="Trạng thái" name="status">
          <Select>
            <Option value="active">Hiển thị</Option>
            <Option value="inactive">Ẩn</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <div className="flex justify-end gap-4">
            <Button onClick={() => navigate('/admin/banners')}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={isPending}>
              Cập nhật
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditBanner;
