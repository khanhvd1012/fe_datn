import {
  Empty,
  Input,
  message,
  Modal,
  Skeleton,
  Table,
  Tag,
  Button
} from "antd";
import { useReviews } from "../../../hooks/useReview";
import { replyToReview } from "../../../service/reviewAPI";
import type { IReview } from "../../../interface/review";
import { useState } from "react";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";

const Reviews = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { data: review, isLoading, refetch } = useReviews(); // thêm refetch để reload
  const [filters, setFilters] = useState({
    product_id: "",
    user_id: "",
    rating: "",
  });

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const openReplyModal = (id: string) => {
    setSelectedReviewId(id);
    setReplyText("");
    setIsModalOpen(true);
  };

  const handleReplySubmit = async () => {
    if (!replyText.trim()) {
      messageApi.warning("Vui lòng nhập nội dung phản hồi.");
      return;
    }
    try {
      if (selectedReviewId) {
        await replyToReview(selectedReviewId, replyText);
        messageApi.success(" Đã gửi phản hồi thành công!");
        setIsModalOpen(false);
        refetch(); // reload lại danh sách đánh giá
      }
    } catch (error) {
      messageApi.error("❌ Gửi phản hồi thất bại.");
    }
  };

  const normalizeText = (value: any) =>
    typeof value === "string"
      ? value.toLowerCase()
      : value?.name?.toLowerCase?.() || "";

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
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  if (isLoading) return <Skeleton active />;
  if (!review) return <Empty description="Không có đánh giá nào" />;

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "product_id",
      key: "product_id",
      filterDropdown: () => (
        <div style={{ padding: 8, backgroundColor: "white", borderRadius: 6 }}>
          <Input
            placeholder="Tìm tên sản phẩm"
            value={filters.product_id}
            onChange={(e) => handleFilterChange(e.target.value, "product_id")}
            prefix={<SearchOutlined />}
            allowClear
          />
        </div>
      ),
      filterIcon: () => (
        <FilterOutlined
          style={{ color: filters.product_id ? "#1890ff" : undefined }}
        />
      ),
      render: (product: IReview["product_id"]) => (
        <Tag color="blue">
          {typeof product === "object" && product !== null
            ? product.name
            : product || "Không xác định"}
        </Tag>
      ),
    },
    {
      title: "Người dùng",
      dataIndex: "user_id",
      key: "user_id",
      filterDropdown: () => (
        <div style={{ padding: 8, backgroundColor: "white", borderRadius: 6 }}>
          <Input
            placeholder="Tìm tên người dùng"
            value={filters.user_id}
            onChange={(e) => handleFilterChange(e.target.value, "user_id")}
            prefix={<SearchOutlined />}
            allowClear
          />
        </div>
      ),
      filterIcon: () => (
        <FilterOutlined
          style={{ color: filters.user_id ? "#1890ff" : undefined }}
        />
      ),
      render: (user: any) => (
        <Tag>{typeof user === "object" ? user.username || user.email : user}</Tag>
      ),
    },
    {
      title: "Số sao",
      dataIndex: "rating",
      key: "rating",
      filterDropdown: () => (
        <div style={{ padding: 8, backgroundColor: "white", borderRadius: 6 }}>
          <Input
            placeholder="Tìm số sao"
            value={filters.rating}
            onChange={(e) => handleFilterChange(e.target.value, "rating")}
            prefix={<SearchOutlined />}
            allowClear
          />
        </div>
      ),
      filterIcon: () => (
        <FilterOutlined
          style={{ color: filters.rating ? "#1890ff" : undefined }}
        />
      ),
      render: (rate: number) => <span>{rate}</span>,
    },
    {
      title: "Bình luận",
      dataIndex: "comment",
      key: "comment",
      render: (comment: string) => (
        <div style={{ maxWidth: 250 }}>{comment}</div>
      ),
    },
    {
      title: "Phản hồi",
      key: "action",
      render: (_: any, record: IReview) => (
        <Button
          size="small"
          type="primary"
          onClick={() => openReplyModal(record._id)}
          disabled={!!record.admin_reply}
        >
          {record.admin_reply ? "Đã phản hồi" : "Phản hồi"}
        </Button>
      ),
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

      <Modal
        title="Phản hồi đánh giá"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleReplySubmit}
        okText="Gửi"
        cancelText="Hủy"
      >
        <Input.TextArea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          rows={4}
          placeholder="Nhập nội dung phản hồi..."
        />
      </Modal>
    </div>
  );
};

export default Reviews;
