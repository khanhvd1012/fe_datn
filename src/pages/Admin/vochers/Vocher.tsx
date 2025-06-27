import { useQueryClient } from '@tanstack/react-query';
import { Button, Empty, message, Popconfirm, Skeleton, Table } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import type { IVoucher } from '../../../interface/voucher';
import { useDeleteVoucher, useVouchers } from '../../../hooks/useVouchers';
import DrawerVoucher from '../../../components/drawer/DrawerVoucher';

const Vouchers = () => {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<IVoucher | null>(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const { mutate } = useDeleteVoucher();
  const { data, isLoading } = useVouchers();

  const handleDelete = (id: string) => {
    mutate(id, {
      onSuccess: () => {
        messageApi.success("Xóa voucher thành công");
        queryClient.invalidateQueries({
          queryKey: ["vouchers"],
        });
      },
      onError: () => messageApi.error("Lỗi khi xóa voucher"),
    });
  };

  const showVoucherDetails = (voucher: IVoucher) => {
    setDrawerLoading(true);
    setSelectedVoucher(voucher);
    setIsDrawerVisible(true);
    setTimeout(() => {
      setDrawerLoading(false);
    }, 500);
  };

  if (isLoading) return <Skeleton active />;
  if (!data) return <Empty />;

  const columns = [
    {
      title: "Mã voucher",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Giá trị",
      dataIndex: "value",
      key: "value",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Đã sử dụng",
      dataIndex: "usedCount",
      key: "usedCount",
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_: any, voucher: IVoucher) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => showVoucherDetails(voucher)}
          />
          <Link to={`/admin/vouchers/edit/${voucher._id}`}>
            <Button type="default" icon={<EditOutlined />} />
          </Link>
          <Popconfirm
            title="Xóa voucher"
            description="Bạn có chắc chắn muốn xóa voucher này?"
            onConfirm={() => handleDelete(voucher._id!)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <Button type="primary" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      {contextHolder}
      <div style={{ marginBottom: 16 }}>
        <Link to="/admin/vouchers/create">
          <Button type="primary">Thêm voucher</Button>
        </Link>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="_id"
        pagination={{
          total: data.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Tổng ${total} voucher`,
        }}
      />

      <DrawerVoucher
        visible={isDrawerVisible}
        voucher={selectedVoucher}
        loading={drawerLoading}
        onClose={() => {
          setIsDrawerVisible(false);
          setSelectedVoucher(null);
        }}
      />
    </div>
  );
};

export default Vouchers;