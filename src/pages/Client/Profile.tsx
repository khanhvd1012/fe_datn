import React, { useState } from "react";
import { Card, Descriptions, Spin, message, Input, Button } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile } from "../../service/authAPI";
import axios from "axios";

const Profile: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    retry: false,
    onError: () => message.error("Không thể lấy thông tin tài khoản!"),
  });

  const [editing, setEditing] = useState(false);
  const [address, setAddress] = useState("");

  // Cập nhật địa chỉ
  const mutation = useMutation({
    mutationFn: async (newAddress: string) => {
      const token = localStorage.getItem("token");

      const shippingAddressObject = {
        address: newAddress,
        is_default: true,
      };

      const { data } = await axios.put(
        `http://localhost:8080/api/auth/profile/${user._id}`, // <--- Sửa đúng endpoint
        { shipping_addresses: [shippingAddressObject] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return data.user;
    },
    onSuccess: () => {
      message.success("Cập nhật địa chỉ thành công!");
      setEditing(false);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: () => message.error("Cập nhật địa chỉ thất bại!"),
  });

  if (isLoading) return <Spin style={{ marginTop: 40 }} />;
  if (!user) return null;

  // Cập nhật địa chỉ khi có dữ liệu
  const firstAddressObj = user?.shipping_addresses?.[0];
  const displayAddress = firstAddressObj?.address || "";

  return (
    <div style={{ maxWidth: 500, margin: "40px auto" }}>
      <Card title="Thông tin tài khoản" bordered>
        <Descriptions column={1}>
          <Descriptions.Item label="Tên đăng nhập">{user.username}</Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Vai trò">{user.role}</Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">
            {editing ? (
              <>
                <Input
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  style={{ width: 250, marginRight: 8 }}
                />
                <Button
                  type="primary"
                  size="small"
                  loading={mutation.isLoading}
                  onClick={() => mutation.mutate(address)}
                >
                  Lưu
                </Button>
                <Button
                  size="small"
                  style={{ marginLeft: 8 }}
                  onClick={() => setEditing(false)}
                >
                  Hủy
                </Button>
              </>
            ) : (
              <>
                {displayAddress || "Chưa có"}
                <Button
                  size="small"
                  style={{ marginLeft: 12 }}
                  onClick={() => {
                    setEditing(true);
                    setAddress(displayAddress);
                  }}
                >
                  Chỉnh sửa
                </Button>
              </>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {new Date(user.createdAt).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default Profile;
