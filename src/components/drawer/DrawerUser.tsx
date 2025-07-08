import { Descriptions, Divider, Drawer, Skeleton } from "antd";
import type { IUser } from "../../interface/user";

interface DrawerUserProps {
  visible: boolean;
  user: IUser | null;
  onClose: () => void;
  loading?: boolean;
}

const DrawerUser = ({ visible, user, onClose, loading }: DrawerUserProps) => {
  return (
    <Drawer
      title={<span className="text-lg font-semibold">Chi tiết người dùng</span>}
      placement="right"
      onClose={onClose}
      open={visible}
      width={500}
    >
      {loading ? (
        <Skeleton active />
      ) : (
        <>
          <div className="mb-4">
            <h3 className="text-base font-medium mb-2">Thông tin cơ bản</h3>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Mã người dùng" className="bg-gray-50">
                {user?.user_id}
              </Descriptions.Item>
              <Descriptions.Item label="Họ tên">
                {user?.username}
              </Descriptions.Item>
              <Descriptions.Item label="Email" className="bg-gray-50">
                {user?.email}
              </Descriptions.Item>
              <Descriptions.Item label="Avata" className="bg-gray-50">
                {user?.image}
              </Descriptions.Item>
              <Descriptions.Item label="Vai trò">
                {user?.role === 'admin'
                  ? 'Quản trị viên'
                  : user?.role === 'employee'
                  ? 'Nhân viên'
                  : 'Khách hàng'}
              </Descriptions.Item>
            </Descriptions>
          </div>

          <Divider />

          <div className="mb-4">
            <h3 className="text-base font-medium mb-2">Thông tin cá nhân </h3>
            {user?.shipping_addresses?.length ? (
              <Descriptions column={1} bordered size="small">
                {user.shipping_addresses.map((addr, idx) => (
                  <Descriptions.Item
                    key={addr._id || idx}
                    label={`Thông tin chi tiết`}
                  >
                    <div>
                      <div><strong>Họ tên:</strong> {addr.full_name}</div>
                      <div><strong>SĐT:</strong> {addr.phone}</div>
                      <div><strong>Địa chỉ:</strong> {addr.address}</div>
                    </div>
                  </Descriptions.Item>
                ))}
              </Descriptions>
            ) : (
              <p>Không có địa chỉ nào</p>
            )}
          </div>

          <Divider />

          <div>
            <h3 className="text-base font-medium mb-2">Thông tin thời gian</h3>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Ngày tạo" className="bg-gray-50">
                {(user as any)?.createdAt
                  ? new Date((user as any).createdAt).toLocaleString('vi-VN')
                  : '---'}
              </Descriptions.Item>
              <Descriptions.Item label="Cập nhật lần cuối">
                {(user as any)?.updatedAt
                  ? new Date((user as any).updatedAt).toLocaleString('vi-VN')
                  : '---'}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </>
      )}
    </Drawer>
  );
};

export default DrawerUser;