import { Button, Form, Input, Select, Typography, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const CreateBanner = () => {
  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 24, background: '#fff', borderRadius: 8 }}>
      <Title level={3}>Tạo Banner Mới</Title>

      <Form layout="vertical">
        <Form.Item label="Tiêu đề" name="title" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
          <Input placeholder="Nhập tiêu đề banner" />
        </Form.Item>

        <Form.Item label="Liên kết (URL)" name="link">
          <Input placeholder="https://example.com/..." />
        </Form.Item>

        <Form.Item label="Hình ảnh" name="image">
          <Upload name="banner" listType="picture" maxCount={1}>
            <Button icon={<UploadOutlined />}>Tải lên ảnh</Button>
          </Upload>
        </Form.Item>

        <Form.Item label="Trạng thái" name="status" initialValue="active">
          <Select>
            <Option value="active">Hiển thị</Option>
            <Option value="inactive">Ẩn</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button type="primary">Lưu</Button>
            <Button type="default">Hủy</Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateBanner;
