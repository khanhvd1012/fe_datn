import { useState } from 'react';
import { Table, Button, Drawer, Rate, Typography, Spin, Empty } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom'; // ✅ thêm dòng này
import type { IReview } from '../../../interface/review';
import { useReviews } from '../../../hooks/useReview';

const { Paragraph, Text, Title } = Typography;

const Reviews: React.FC = () => {
  const { id: product_id } = useParams();

  const { data: reviews, isLoading, isError } = useReviews(product_id || '');
  const [selectedReview, setSelectedReview] = useState<IReview | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const showDrawer = (review: IReview) => {
    setSelectedReview(review);
    setIsDrawerOpen(true);
  };

  const columns = [
    {
      title: 'Số sao',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => <Rate disabled value={rating} />,
    },
    {
      title: 'Bình luận',
      dataIndex: 'comment',
      key: 'comment',
    },
    {
      title: 'Người dùng',
      dataIndex: 'user_id',
      key: 'user_id',
      render: (user_id: string) => <Text code>{user_id}</Text>,
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'product_id',
      key: 'product_id',
      render: (product_id: string) => <Text code>{product_id}</Text>,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) =>
        createdAt ? new Date(createdAt).toLocaleString('vi-VN') : 'N/A',
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, review: IReview) => (
        <Button icon={<EyeOutlined />} onClick={() => showDrawer(review)} />
      ),
    },
  ];

  if (!product_id) return <p style={{ color: 'red' }}>Không có ID sản phẩm</p>;
  if (isLoading) return <Spin tip="Đang tải đánh giá..." />;
  if (isError || !reviews) return <Empty description="Không có đánh giá nào" />;

  return (
    <div>
      <Title level={4}>Danh sách đánh giá</Title>

      <Table
        dataSource={reviews}
        columns={columns}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
        bordered
        locale={{ emptyText: <Empty description="Chưa có đánh giá" /> }}
      />

      <Drawer
        title="Chi tiết đánh giá"
        open={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedReview(null);
        }}
        width={400}
      >
        {selectedReview ? (
          <div>
            <p><Text strong>Số sao:</Text> <Rate disabled value={selectedReview.rating} /></p>
            <p><Text strong>Bình luận:</Text></p>
            <Paragraph>{selectedReview.comment}</Paragraph>
            <p><Text strong>Người dùng:</Text> {selectedReview.user_id}</p>
            <p><Text strong>Sản phẩm:</Text> {selectedReview.product_id}</p>
            <p><Text strong>Ngày tạo:</Text> {new Date(selectedReview.createdAt!).toLocaleString('vi-VN')}</p>
          </div>
        ) : (
          <Spin />
        )}
      </Drawer>
    </div>
  );
};

export default Reviews;
