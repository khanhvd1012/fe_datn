import { Form, Input, Button, message, Card, Typography } from "antd";
import { useForgotPassword } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const ForgotPassword = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const handleFinish = (values: { email: string }) => {
    forgotPassword(values, {
      onSuccess: () => {
        navigate("/reset-password", { state: { email: values.email } });
      },
      onError: (err: any) => {
        message.error(err?.response?.data?.message || "Gửi OTP thất bại");
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
      }}
    >
      <Card
        style={{
          width: "80%",
          maxWidth: 800,
          padding: "32px",
          borderRadius: 8,
        }}
        bordered={false}
      >
        <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
          Quên mật khẩu
        </Title>
        <Text type="secondary" style={{ display: "block", textAlign: "center", marginBottom: 32 }}>
          Nhập email của bạn để nhận mã OTP đặt lại mật khẩu
        </Text>

        <Form
          form={form}
          onFinish={handleFinish}
          layout="vertical"
          style={{ maxWidth: 600, margin: "0 auto" }}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email của bạn" },
            ]}
          >
            <Input placeholder="example@email.com" size="large" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isPending}
              block
              size="large"
            >
              Gửi OTP
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ForgotPassword;
