import { Empty, Input, message, Skeleton, Table, Tag } from "antd";
import { useReviews } from "../../../hooks/useReview";
import type { IReview } from "../../../interface/review";
import { useState } from "react";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";


const Reviews = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { data: review, isLoading } = useReviews();
  const [filters, setFilters] = useState({
    product_id: '',
    user_id: '',
    rating: '',
  });

  const normalizeText = (value: any) =>
    typeof value === 'string'
      ? value.toLowerCase()
      : value?.name?.toLowerCase?.() || '';

  const filteredData = review?.filter((reviews: IReview) => {
    if (
      filters.product_id &&
      !normalizeText(reviews.product_id).includes(filters.product_id.toLowerCase())
    ) {
      return false;
    }

    if (
      filters.user_id &&
      !normalizeText(reviews.user_id).includes(filters.user_id.toLowerCase())
    ) {
      return false;
    }

    if (
      filters.rating &&
      !normalizeText(reviews.rating).includes(filters.rating.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  const handleFilterChange = (value: string | number, type: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };
  if (isLoading) return <Skeleton active />;
  if (!review) return <Empty />;

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "product_id",
      key: "product_id",
      filterDropdown: () => (
        <div style={{ padding: 8, backgroundColor: 'white', borderRadius: 6 }}>
          <Input
            placeholder="Tìm tên sản phẩm"
            value={filters.product_id}
            onChange={(e) => handleFilterChange(e.target.value, 'product_id')}
            prefix={<SearchOutlined />}
            allowClear
          />
        </div>
      ),
      filterIcon: () => <FilterOutlined style={{ color: filters.product_id ? '#1890ff' : undefined }} />,
      render: (product: IReview["product_id"]) => (
        <Tag color="blue">{typeof product === "object" ? product.name : product}</Tag>
      ),
    },
    {
      title: "Người dùng",
      dataIndex: "user_id",
      key: "user_id",
      filterDropdown: () => (
        <div style={{ padding: 8, backgroundColor: 'white', borderRadius: 6 }}>
          <Input
            placeholder="Tìm tên người dùng"
            value={filters.user_id}
            onChange={(e) => handleFilterChange(e.target.value, 'user_id')}
            prefix={<SearchOutlined />}
            allowClear
          />
        </div>
      ),
      filterIcon: () => <FilterOutlined style={{ color: filters.user_id ? '#1890ff' : undefined }} />,
      render: (user: any) => (
        <Tag>{typeof user === "object" ? user.username || user.email : user}</Tag>
      ),
    },
    {
      title: "Số sao",
      dataIndex: "rating",
      key: "rating",
      filterDropdown: () => (
        <div style={{ padding: 8, backgroundColor: 'white', borderRadius: 6 }}>
          <Input
            placeholder="Tìm số sao"
            value={filters.rating}
            onChange={(e) => handleFilterChange(e.target.value, 'rating')}
            prefix={<SearchOutlined />}
            allowClear
          />
        </div>
      ),
      filterIcon: () => <FilterOutlined style={{ color: filters.rating ? '#1890ff' : undefined }} />,
      render: (rate: number) => <span>{rate}</span>,
    },
    {
      title: "Bình luận",
      dataIndex: "comment",
      key: "comment",
      render: (comment: string) => <div style={{ maxWidth: 250 }}>{comment}</div>,
    },
    {
      title: "Trả lời (Admin)",
      dataIndex: "admin_reply",
      key: "admin_reply",
      render: (reply: string) =>
        reply ? <Tag color="green">Đã trả lời</Tag> : <Tag color="red">Chưa</Tag>,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <div>
      {contextHolder}
      <div style={{ marginBottom: 16 }}>
      </div>
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="_id"
        pagination={{
          total: filteredData?.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Tổng ${total} bình luận`,
        }}
      />
    </div>
  );
};

export default Reviews;