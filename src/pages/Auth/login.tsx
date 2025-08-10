
import React from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', {
        email: values.email,
        password: values.password,
      });
      if (res.data.token && res.data.user) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.user.role || 'user');
        localStorage.setItem('userName', res.data.user.username || 'User');
        // Lưu toàn bộ thông tin user vào localStorage
        localStorage.setItem('user', JSON.stringify(res.data.user));
        message.success('Đăng nhập thành công!');
        navigate('/');
      } else {
        message.error(res.data.message || 'Đăng nhập thất bại!');
      }
    } catch (error: any) {
      message.error(
        error?.response?.data?.message || 'Đăng nhập thất bại!'
      );
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Lỗi đăng nhập:', errorInfo);
  };

  return (
    <div style={styles.container}>
      {/* Cột trái */}
      <div style={styles.leftColumn}>
        <h1 style={styles.title}>Đăng nhập</h1>
        <div style={styles.underline}></div>
      </div>

      {/* Cột phải */}
      <div style={styles.rightColumn}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          style={styles.form}
        >
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

          <p style={styles.note}>
            This site is protected by reCAPTCHA and the Google{' '}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Privacy Policy</a> and{' '}
            <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer">Terms of Service</a> apply.
          </p>

          <Form.Item style={{ marginTop: 16 }}>
            <Button type="primary" htmlType="submit" block size="large" style={styles.button}>
              ĐĂNG NHẬP
            </Button>
          </Form.Item>

          <div style={styles.footerText}>
            <span>Quên mật khẩu?</span> hoặc <a href="/register">Đăng kí</a>
          </div>
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
  note: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  button: {
    backgroundColor: '#000',
    color: '#fff',
    fontWeight: 600,
  },
  footerText: {
    fontSize: 13,
    textAlign: 'left',
    color: '#555',
  },
};

export default Login; 