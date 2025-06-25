import React from 'react';
import { Form, Input, Button, message } from 'antd';

const Login: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Đăng nhập với dữ liệu:', values);
    message.success('Đăng nhập thành công!');
    // Gửi API đăng nhập ở đây nếu cần
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Lỗi đăng nhập:', errorInfo);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.formCard}>
        <h1 style={styles.title}>Đăng nhập</h1>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
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

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Đăng nhập
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
    width: '80%',
  },
  title: {
    marginBottom: 24,
    fontSize: 28,
    textAlign: 'center',
    fontWeight: 'bold',
  },
};

export default Login;
