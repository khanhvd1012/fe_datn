import { Button, Empty, Input, message, Popconfirm, Skeleton, Table } from "antd";
import { useState } from "react";
import { DeleteOutlined, FilterOutlined, SearchOutlined } from "@ant-design/icons";
import type { IContact } from "../../../interface/contact";
import { useDeleteContact, useGetAllContacts } from "../../../hooks/useContact";
import dayjs from "dayjs";
import { useQueryClient } from "@tanstack/react-query";

const Contacts = () => {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const { data, isLoading } = useGetAllContacts();
  const { mutate } = useDeleteContact();

  const [filters, setFilters] = useState({ name: '', email: '', phone: '' });

  const filteredData = data?.filter((contact: IContact) => {
    const nameMatch = filters.name ? contact.username.toLowerCase().includes(filters.name.toLowerCase()) : true;
    const emailMatch = filters.email ? contact.email.toLowerCase().includes(filters.email.toLowerCase()) : true;
    const phoneMatch = filters.phone ? contact.phone.includes(filters.phone) : true;

    return nameMatch && emailMatch && phoneMatch;
  });

  const handleDelete = async (id: string) => {
    try {
      mutate(id, {
        onSuccess: () => {
          messageApi.success("Xóa liên hệ thành công");
          queryClient.invalidateQueries({
            queryKey: ["contacts"],
          });
        },
        onError: () => messageApi.error("Lỗi khi xóa liên hệ"),
      });
    } catch (error) {
      console.error("Lỗi khi xóa liên hệ:", error);
    }
  };

  const handleFilterChange = (value: string, type: string) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  };

  if (isLoading) return <Skeleton active />;
  if (!data) return <Empty />;

  const columns = [
    {
      title: "Tên",
      dataIndex: "username",
      key: "username",
      filterDropdown: () => (
        <div style={{ padding: 8, backgroundColor: 'white', borderRadius: 6 }}>
          <Input
            placeholder="Tìm tên"
            value={filters.name}
            onChange={(e) => handleFilterChange(e.target.value, 'name')}
            prefix={<SearchOutlined />}
            allowClear
          />
        </div>
      ),
      filterIcon: () => <FilterOutlined style={{ color: filters.name ? '#1890ff' : undefined }} />,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      filterDropdown: () => (
        <div style={{ padding: 8, backgroundColor: 'white', borderRadius: 6 }}>
          <Input
            placeholder="Tìm email"
            value={filters.email}
            onChange={(e) => handleFilterChange(e.target.value, 'email')}
            prefix={<SearchOutlined />}
            allowClear
          />
        </div>
      ),
      filterIcon: () => <FilterOutlined style={{ color: filters.email ? '#1890ff' : undefined }} />,
    },
    {
      title: "SĐT",
      dataIndex: "phone",
      key: "phone",
      filterDropdown: () => (
        <div style={{ padding: 8, backgroundColor: 'white', borderRadius: 6 }}>
          <Input
            placeholder="Tìm SĐT"
            value={filters.phone}
            onChange={(e) => handleFilterChange(e.target.value, 'phone')}
            prefix={<SearchOutlined />}
            allowClear
          />
        </div>
      ),
      filterIcon: () => <FilterOutlined style={{ color: filters.phone ? '#1890ff' : undefined }} />,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Tin nhắn",
      dataIndex: "message",
      key: "message",
    },
    {
      title: "Ngày gửi",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string | undefined) =>
        date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "-", // format ngày giờ
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_: any, color: IContact) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Popconfirm
            title="Xóa liên hệ"
            description="Bạn có chắc chắn muốn xóa liên hệ này?"
            onConfirm={() => handleDelete(color._id!)}
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
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="_id"
        pagination={{
          total: filteredData?.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Tổng ${total} liên hệ`,
        }}
      />
    </div>
  );
};

export default Contacts;
