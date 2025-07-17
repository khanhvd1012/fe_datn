// src/pages/AdminLogin.tsx
import React from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../../components/css/style';

const AdminLogin: React.FC = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onFinish = async (values: any) => {
        try {
            const res = await axios.post('http://localhost:3000/api/auth/login', {
                email: values.email,
                password: values.password,
            });

            if (res.data.token && res.data.user) {
                if (res.data.user.role !== 'admin') {
                    return message.error('Chỉ quản trị viên mới được truy cập!');
                }

                localStorage.setItem('token', res.data.token);
                localStorage.setItem('role', res.data.user.role);
                localStorage.setItem('userName', res.data.user.username || 'Admin');

                message.success('Đăng nhập Admin thành công!');
                navigate('/admin');
            } else {
                message.error(res.data.message || 'Đăng nhập thất bại!');
            }
        } catch (error: any) {
            message.error(error?.response?.data?.message || 'Đăng nhập thất bại!');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.leftColumn}>
               <h1 style={styles.title}>Đăng nhập quản trị</h1>
                <Logo>
                    SNEAKER<span>TREND</span>
                </Logo>
                <div style={styles.underline}></div>
            </div>

            <div style={styles.rightColumn}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
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
                        Trang dành cho quản trị viên. Nếu bạn không phải admin, vui lòng quay lại trang người dùng.
                    </p>

                    <Form.Item style={{ marginTop: 16 }}>
                        <Button type="primary" htmlType="submit" block size="large" style={styles.button}>
                            ĐĂNG NHẬP ADMIN
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        marginTop: 150,
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
};

export default AdminLogin;
