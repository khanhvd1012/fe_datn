import { Empty, Input, message, Skeleton, Table } from "antd";
import { useState } from "react";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import type { IContact } from "../../../interface/contact";
import { useGetAllContacts } from "../../../hooks/useContact";

const Contacts = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { data, isLoading } = useGetAllContacts();
  
  const [filters, setFilters] = useState({ name: '', email: '', phone: '' });

  const filteredData = data?.filter((contact: IContact) => {
    const nameMatch = filters.name ? contact.username.toLowerCase().includes(filters.name.toLowerCase()) : true;
    const emailMatch = filters.email ? contact.email.toLowerCase().includes(filters.email.toLowerCase()) : true;
    const phoneMatch = filters.phone ? contact.phone.includes(filters.phone) : true;

    return nameMatch && emailMatch && phoneMatch;
  });


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
