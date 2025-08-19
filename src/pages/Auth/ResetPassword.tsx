import { Form, Input, Button, Card, Typography, message } from "antd";
import { useResetPassword } from "../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const ResetPassword = () => {
    const [form] = Form.useForm();
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || "";
    const { mutate: resetPassword, isPending } = useResetPassword();

    const handleFinish = (values: any) => {
        resetPassword(values, {
            onSuccess: () => {
                message.success("Đặt lại mật khẩu thành công!");
                navigate("/login"); // chuyển về trang login
            },
            onError: (err: any) => {
                message.error(err?.response?.data?.message || "Đặt lại mật khẩu thất bại");
            },
        });
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "80vh",
                padding: 16,
                backgroundColor: "#f0f2f5",
                marginBottom: 30,
            }}
        >
            <Card
                style={{
                    width: "80%",
                    maxWidth: 800,
                    padding: 32,
                    borderRadius: 8,
                }}
                bordered={false}
            >
                <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
                    Đặt lại mật khẩu
                </Title>
                <Text type="secondary" style={{ display: "block", textAlign: "center", marginBottom: 32 }}>
                    Nhập mã OTP và mật khẩu mới để đặt lại mật khẩu của bạn
                </Text>

                <Form
                    form={form}
                    onFinish={handleFinish}
                    layout="vertical"
                    initialValues={{ email }}
                    style={{ maxWidth: 600, margin: "0 auto" }}
                >
                    <Form.Item
                        label="Mã OTP"
                        name="otp"
                        rules={[{ required: true, message: "Vui lòng nhập mã OTP" }]}
                    >
                        <Input placeholder="Nhập mã OTP" size="large" />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu mới"
                        name="newPassword"
                        rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới" }]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu mới" size="large" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={isPending} block size="large">
                            Đặt lại mật khẩu
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default ResetPassword;
