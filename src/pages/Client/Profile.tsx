import { useEffect, useState } from "react";
import { Descriptions, Spin, message, Input, Button } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile } from "../../service/authAPI";
import axios from "axios";
import type { IUser } from "../../interface/user";
import UpdateProfileDrawer from "../../components/LayoutClient/UpdateProfileDrawer";

const Profile = () => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [address, setAddress] = useState("");

  const [openDrawer, setOpenDrawer] = useState(false);

  const {
    data: user,
    isLoading,
    error,
  } = useQuery<IUser, Error>({
    queryKey: ["profile"],
    queryFn: getProfile,
    retry: false,
  });

  useEffect(() => {
    if (error) {
      message.error("Không thể lấy thông tin tài khoản!");
    }
  }, [error]);

  const mutation = useMutation<IUser, Error, string>({
    mutationFn: async (newAddress: string) => {
      const token = localStorage.getItem("token");
      if (!user?._id) throw new Error("Không tìm thấy user");
      const shippingAddressObject = {
        address: newAddress,
        is_default: true,
      };

      const { data } = await axios.put(
        `http://localhost:3000/api/auth/profile/${user._id}`,
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
    onError: () => {
      message.error("Cập nhật địa chỉ thất bại!");
    },
  });

  if (isLoading) return <Spin style={{ marginTop: 40 }} />;
  if (!user) return <div className="text-center mt-10 text-red-500">Bạn chưa đăng nhập.</div>;

  const firstAddressObj = user.shipping_addresses?.[0];
  const displayAddress = firstAddressObj?.address || "";

  return (
    <div className="flex gap-8 max-w-6xl mx-auto mt-10 px-4">
      {/* Sidebar trái */}
      <div className="w-1/4 bg-gray-50 rounded-md p-6 shadow">
        {user.image ? (
          <img
            src={user.image}
            alt="avatar"
            className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-orange-300 mx-auto mb-4 flex items-center justify-center text-white text-xl font-semibold">
            {user.username?.charAt(0)?.toUpperCase() || "?"}
          </div>
        )}        
        <div className="text-center mb-6">
          <p className="text-lg font-medium">Xin chào</p>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2 cursor-pointer hover:text-blue-500">
            <span>👤</span> Thông tin tài khoản
          </div>
          <div className="flex items-center gap-2 cursor-pointer hover:text-blue-500">
            <span>📄</span> Quản lý đơn hàng
          </div>
          <div className="flex items-center gap-2 cursor-pointer hover:text-blue-500">
            <span>📍</span> Danh sách địa chỉ
          </div>
          <div className="flex items-center gap-2 cursor-pointer hover:text-blue-500">
            <span>↩</span> Đăng xuất
          </div>
        </div>
      </div>

      {/* Nội dung phải */}
      <div className="w-3/4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">THÔNG TIN TÀI KHOẢN</h2>
          <Button
            type="primary"
            onClick={() => setOpenDrawer(true)}
          >
            CẬP NHẬT THÔNG TIN TÀI KHOẢN
          </Button>

        </div>

        <Descriptions column={1} bordered size="middle">
          <Descriptions.Item label="Tên">
            {user.username || "Chưa cập nhật"}
          </Descriptions.Item>

          <Descriptions.Item label="Họ và tên">
            {firstAddressObj?.full_name || "Chưa cập nhật"}
          </Descriptions.Item>

          <Descriptions.Item label="Email">
            {user.email || "Chưa cập nhật"}
          </Descriptions.Item>

          <Descriptions.Item label="Địa chỉ">
            {firstAddressObj?.address || "Chưa cập nhật"}
          </Descriptions.Item>

          <Descriptions.Item label="Điện thoại">
            {firstAddressObj?.phone || "Chưa cập nhật"}
          </Descriptions.Item>

          <Descriptions.Item label="Ngày tạo">
            {user.createdAt ? new Date(user.createdAt).toLocaleDateString("vi-VN") : "Chưa cập nhật"}
          </Descriptions.Item>
        </Descriptions>

        <div className="mt-6 bg-blue-50 p-4 rounded-md">
          <p className="font-medium text-sm">
            Hạng thẻ tiếp theo <strong>Silver</strong> – chiết khấu 3% membership
          </p>
          <a
            href="#"
            className="text-sm text-blue-600 hover:underline mt-1 inline-block"
          >
            Xem thêm chính sách khách hàng thân thiết.
          </a>
        </div>

        <div className="text-center mt-10 text-sm text-gray-500">
          Đang cập nhật danh sách..
        </div>
      </div>
      <UpdateProfileDrawer open={openDrawer} onClose={() => setOpenDrawer(false)} user={user} />
    </div>
  );
};

export default Profile;