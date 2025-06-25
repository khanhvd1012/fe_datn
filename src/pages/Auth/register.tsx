import React from 'react';
import { Form, Input, Button, message } from 'antd';

const Register: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Đăng ký với dữ liệu:', values);
    message.success('Đăng ký thành công!');
    // TODO: Gửi dữ liệu đến API tại đây
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Lỗi:', errorInfo);
  };

  return (
    <div style={styles.container}>
      {/* Bên trái: tiêu đề */}
      <div style={styles.leftColumn}>
        <h1 style={styles.title}>Tạo tài khoản</h1>
        <div style={styles.underline}></div>
      </div>

      {/* Bên phải: form */}
      <div style={styles.rightColumn}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          style={styles.form}
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
          >
            <Input placeholder="Họ và tên" size="large" style={styles.input} />
          </Form.Item>

          <Form.Item
            name="sdt"
            rules={[{ required: true, message: 'Vui lòng nhập SĐT!' }]}
          >
            <Input placeholder="Số điện thoại" size="large" style={styles.input} />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
            ]}
          >
            <Input placeholder="Email" size="large" style={styles.input} />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password placeholder="Mật khẩu" size="large" style={styles.input} />
          </Form.Item>

          <Form.Item
            name="address"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
          >
            <Input placeholder="Địa chỉ" size="large" style={styles.input} />
          </Form.Item>

          <p style={styles.recaptchaNote}>
            This site is protected by reCAPTCHA and the Google{' '}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Privacy Policy</a> and{' '}
            <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer">Terms of Service</a> apply.
          </p>

          <Form.Item style={{ marginTop: 16 }}>
            <Button type="primary" htmlType="submit" block size="large" style={styles.button}>
              ĐĂNG KÝ
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    minHeight: '50vh',
    backgroundColor: '#fff',
  },
  leftColumn: {
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: 100,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  underline: {
    width: 70,
    height: 4,
    backgroundColor: '#000',
    marginTop: 4,
  },
  rightColumn: {
    width: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 60px',
    backgroundColor: '#fff',
  },
  form: {
    width: '100%',
    maxWidth: 400,
  },
  input: {
    backgroundColor: '#f0f6ff',
    border: '1px solid #ccc',
  },
  recaptchaNote: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  button: {
    backgroundColor: '#000',
    color: '#fff',
    fontWeight: 600,
  },
};

export default Register;
