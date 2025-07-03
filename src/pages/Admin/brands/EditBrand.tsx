import { useQueryClient } from '@tanstack/react-query';
import { Button, Empty, Form, Input, message, Skeleton, Upload } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import type { UploadChangeParam, UploadFile } from 'antd/es/upload';
import { useBrand, useUpdateBrand } from '../../../hooks/useBrands';
import { useEffect, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';


const EditBrand = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const { data: brand, isLoading } = useBrand(id!);
  const { mutate, isPending: isUpdating } = useUpdateBrand();
  const [form] = Form.useForm();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    if (brand?.logo_image) {
      setFileList([
        {
          uid: '-1',
          name: 'Ảnh hiện tại',
          status: 'done',
          url: brand.logo_image,
        } as UploadFile,
      ]);
    }
  }, [brand]);

  const handleFileChange = (info: UploadChangeParam) => {
    const file = info.fileList[0]?.originFileObj;

    if (file) {
      const newFileList = [
        {
          uid: '-1',
          name: file.name,
          status: 'done',
          originFileObj: file,
          url: URL.createObjectURL(file),
        } as UploadFile,
      ];
      setFileList(newFileList);
      setLogoFile(file);
    } else {
      setFileList([]);
      setLogoFile(null);
    }
  };

  const handleSubmit = (values: any) => {
    if (!id) return;

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    if (logoFile) {
      formData.append("logo_image", logoFile);
    }

    mutate(
      {
        id,
        brand: formData,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["brands"] });
          messageApi.success("Cập nhật thương hiệu thành công");
          setTimeout(() => navigate('/admin/brands'), 1000);
        },
        onError: () => {
          messageApi.error("Cập nhật thương hiệu thất bại");
        },
      }
    );
  };

  if (isLoading) return <Skeleton active />;
  if (!brand) return <Empty />;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {contextHolder}
      <h2 className="text-2xl font-bold mb-4">Chỉnh Sửa Thương Hiệu</h2>
      <Form
        layout="vertical"
        form={form}
        initialValues={brand}
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
            <Button type="primary" htmlType="submit" loading={isUpdating}>
              {isUpdating ? 'Đang cập nhật...' : 'Cập nhật'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditBrand;