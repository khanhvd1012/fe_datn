import { useQueryClient } from '@tanstack/react-query';
import { Button, Empty, Form, Input, message, Skeleton, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useCategory, useUpdateCategory } from '../../../hooks/useCategories';
import { useEffect, useState } from 'react';
import type { UploadChangeParam, UploadFile } from 'antd/es/upload';

const EditCategories = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const { data: category, isLoading } = useCategory(id!);
  const { mutate, isPending: isUpdating } = useUpdateCategory();
  const [form] = Form.useForm();

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    if (category?.logo_image) {
      setFileList([
        {
          uid: '-1',
          name: 'Ảnh hiện tại',
          status: 'done',
          url: category.logo_image,
        } as UploadFile,
      ]);
    }
  }, [category]);

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
        category: formData,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["categories"] });
          messageApi.success("Cập nhật danh mục thành công");
          setTimeout(() => navigate('/admin/categories'), 1000);
        },
        onError: () => {
          messageApi.error("Cập nhật danh mục thất bại");
        },
      }
    );
  };

  if (isLoading) return <Skeleton active />;
  if (!category) return <Empty description="Không tìm thấy dữ liệu" />;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {contextHolder}
      <h2 className="text-2xl font-bold mb-4">Chỉnh Sửa Danh Mục</h2>
      <Form
        form={form}
        layout="vertical"
        initialValues={category}
        onFinish={handleSubmit}
      >
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

        <Form.Item label="Ảnh logo">
            <Upload
              listType="picture"
              fileList={fileList}
              onChange={handleFileChange}
              beforeUpload={() => false} 
              maxCount={1}
            >
              {fileList.length < 1 && (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Chọn ảnh</div>
                </div>
              )}
            </Upload>
        </Form.Item>

        <Form.Item>
          <div className="flex justify-end gap-4">
            <Button onClick={() => navigate('/admin/categories')}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={isUpdating}>
              {isUpdating ? 'Đang cập nhật...' : 'Cập nhật danh mục'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditCategories;
