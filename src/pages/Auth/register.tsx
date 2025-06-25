import React from 'react';
import { Form, Input, Button, message } from 'antd';

const Register: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Đăng ký với dữ liệu:', values);
    message.success('Đăng ký thành công!');
    // Gửi dữ liệu đến API ở đây nếu cần
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Lỗi:', errorInfo);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.formCard}>
        <h1 style={styles.title}>Tạo tài khoản</h1>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Họ và tên"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
          >
            <Input placeholder="Họ và tên" />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="sdt"
            rules={[{ required: true, message: 'Vui lòng nhập SĐT!' }]}
          >
            <Input type="tel" placeholder="SĐT" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
          >
            <Input placeholder="Địa chỉ" />
          </Form.Item>

          <Form.Item>
            <div style={styles.recaptchaNote}>
              This site is protected by reCAPTCHA and the Google{' '}
              <a href="#">Privacy Policy</a> and{' '}
              <a href="#">Terms of Service</a> apply.
            </div>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Đăng ký
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '50vh',
    background: '#f0f2f5',
  },
  formCard: {
    background: '#fff',
    padding: 40,
    borderRadius: 12,
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    maxWidth: 500,
    width: '100%',
  },
  title: {
    marginBottom: 24,
    fontSize: 28,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  recaptchaNote: {
    fontSize: 12,
    color: '#888',
  },
};

export default Register;
