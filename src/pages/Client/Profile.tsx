// Profile.tsx
import { useState } from "react";
import { Descriptions, Spin, message, Button, Modal, Form, Input } from "antd";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../../service/authAPI";
import type { IUser } from "../../interface/user";
import UpdateProfileDrawer from "../../components/LayoutClient/UpdateProfileDrawer";
import { useChangePassword } from "../../hooks/useAuth";

const Profile = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [form] = Form.useForm();

  const { data: user, isLoading, error } = useQuery<IUser, Error>({
    queryKey: ["profile"],
    queryFn: getProfile,
    retry: false,
  });

  const changePasswordMutation = useChangePassword();

  if (isLoading) return <Spin style={{ marginTop: 40 }} />;
  if (!user) return <div className="text-center mt-10 text-red-500">Bạn chưa đăng nhập.</div>;

  const firstAddressObj = user.shipping_addresses?.[0];
  const passwordLength = user.password?.length || 8; // Dùng độ dài mật khẩu nếu có

  return (
    <div className="flex gap-8 max-w-6xl mx-auto mt-10 px-4 mb-20">
      {/* Sidebar trái */}
      <div className="w-1/4 bg-gray-50 rounded-md p-6 shadow">
        {user.image ? (
          <img src={user.image} alt="avatar" className="w-24 h-24 rounded-full mx-auto mb-4 border" />
        ) : (
          <div className="w-24 h-24 rounded-full bg-orange-300 mx-auto mb-4 flex items-center justify-center text-white text-xl font-semibold">
            {user.username?.charAt(0)?.toUpperCase() || "?"}
          </div>
        )}
        <div className="text-center mb-6">
          <p className="text-lg font-medium">Xin chào - {user.username}</p>
        </div>
      </div>

      {/* Nội dung phải */}
      <div className="w-3/4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">THÔNG TIN TÀI KHOẢN</h2>
          <Button type="primary" onClick={() => setOpenDrawer(true)}>
            CẬP NHẬT THÔNG TIN TÀI KHOẢN
          </Button>
        </div>

        <Descriptions column={1} bordered size="middle">
          <Descriptions.Item label="Tên">{user.username || "Chưa cập nhật"}</Descriptions.Item>
          <Descriptions.Item label="Họ và tên">{firstAddressObj?.full_name || "Chưa cập nhật"}</Descriptions.Item>
          <Descriptions.Item label="Email">{user.email || "Chưa cập nhật"}</Descriptions.Item>
          <Descriptions.Item label="Mật khẩu">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>{"*".repeat(passwordLength)}</span>
              <Button type="link" onClick={() => setOpenChangePassword(true)}>Đổi mật khẩu</Button>
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">{firstAddressObj?.address || "Chưa cập nhật"}</Descriptions.Item>
          <Descriptions.Item label="Điện thoại">{firstAddressObj?.phone || "Chưa cập nhật"}</Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">{user.createdAt ? new Date(user.createdAt).toLocaleDateString("vi-VN") : "Chưa cập nhật"}</Descriptions.Item>
        </Descriptions>
      </div>

      {/* Drawer cập nhật thông tin */}
      <UpdateProfileDrawer open={openDrawer} onClose={() => setOpenDrawer(false)} user={user} />

      {/* Modal đổi mật khẩu */}
      <Modal
        title="Đổi mật khẩu"
        open={openChangePassword}
        onCancel={() => setOpenChangePassword(false)}
        onOk={() => form.submit()}
        okText="Đổi mật khẩu"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) =>
            changePasswordMutation.mutate({
              oldPassword: values.oldPassword,
              newPassword: values.newPassword,
            },
              {
                onSuccess: () => {
                  message.success("Đổi mật khẩu thành công!");
                  setOpenChangePassword(false);
                  form.resetFields();
                },
                onError: (err: any) => {
                  message.error(err?.response?.data?.message || "Đổi mật khẩu thất bại!");
                },
              }
            )
          }
        >
          <Form.Item label="Mật khẩu cũ" name="oldPassword" rules={[{ required: true, message: "Nhập mật khẩu cũ" }]}>
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            dependencies={['oldPassword']}
            rules={[
              { required: true, message: "Nhập mật khẩu mới", min: 8 },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || value !== getFieldValue('oldPassword')) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu mới không được trùng với mật khẩu cũ'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu mới"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: "Xác nhận mật khẩu mới" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) return Promise.resolve();
                  return Promise.reject(new Error('Mật khẩu nhập lại không khớp'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;
