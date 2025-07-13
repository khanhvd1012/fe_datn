import { Button, Form, Input, Select, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const CreateBlog = () => {
  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 24 }}>Tạo Blog Mới</h2>
      <Form layout="vertical">
        <Form.Item
          label="Tiêu đề"
          name="title"
          rules={[{ required: true, message: 'Vui lòng nhập tiêu đề blog' }]}
        >
          <Input placeholder="Nhập tiêu đề blog" />
        </Form.Item>

        <Form.Item
          label="Tác giả"
          name="author"
          rules={[{ required: true, message: 'Vui lòng nhập tên tác giả' }]}
        >
          <Input placeholder="Tên tác giả" />
        </Form.Item>

        <Form.Item
          label="Hình ảnh"
          name="image"
        >
          <Upload listType="picture" maxCount={1}>
            <Button icon={<UploadOutlined />}>Tải lên ảnh</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          label="Nội dung"
          name="content"
          rules={[{ required: true, message: 'Vui lòng nhập nội dung blog' }]}
        >
          <Input.TextArea rows={6} placeholder="Nội dung blog..." />
        </Form.Item>

        <Form.Item label="Trạng thái" name="status">
          <Select defaultValue="active">
            <Option value="active">Hiển thị</Option>
            <Option value="inactive">Ẩn</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
            Lưu
          </Button>
          <Button htmlType="button">Hủy</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateBlog;
