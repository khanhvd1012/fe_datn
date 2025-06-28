import { useQueryClient } from "@tanstack/react-query";
import { Button, Empty, message, Popconfirm, Skeleton, Table, Tag } from "antd";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useState } from "react";
import type { IReview } from "../../../interface/review";
import { useDeleteReview, useProductReviews } from "../../../hooks/useReview";

const Reviews = () => {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  const { data, isLoading } = useProductReviews();
  const { mutate } = useDeleteReview();

  const handleDelete = (id: string, product_id: string) => {
    mutate(
      { id, product_id },
      {
        onSuccess: () => {
          messageApi.success("Xóa đánh giá thành công");
          queryClient.invalidateQueries({ queryKey: ["reviews"] });
        },
        onError: () => {
          messageApi.error("Xóa đánh giá thất bại");
        },
      }
    );
  };

  if (isLoading) return <Skeleton active />;
  if (!data || !Array.isArray(data)) return <Empty description="Không có đánh giá nào" />;

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "product_id",
      key: "product_id",
      render: (id: string) => <Tag color="blue">{id}</Tag>,
    },
    {
      title: "Người dùng",
      dataIndex: "user_id",
      key: "user_id",
      render: (id: string) => <Tag>{id}</Tag>,
    },
    {
      title: "Số sao",
      dataIndex: "rating",
      key: "rating",
      render: (rate: number) => <span>{rate} ⭐</span>,
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
      render: (date: Date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_: any, record: IReview) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Popconfirm
            title="Xóa đánh giá"
            description="Bạn có chắc muốn xóa đánh giá này?"
            onConfirm={() => handleDelete(record._id!, record.product_id)}
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
        dataSource={data}
        rowKey="_id"
        pagination={{
          total: data.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Tổng ${total} đánh giá`,
        }}
      />
    </div>
  );
};

export default Reviews;
