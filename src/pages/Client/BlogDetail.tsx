import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Spin, Row, Col } from 'antd';
import Breadcrumb from '../../components/LayoutClient/Breadcrumb';
import { useGetNewsById } from '../../hooks/useBlogs';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

const BlogDetail = () => {
  const { id } = useParams();
  const { data: blog, isLoading } = useGetNewsById(id as string);

  if (isLoading) return <Spin size="large" style={{ margin: 40 }} />;
  if (!blog) return <Text>Không tìm thấy bài viết.</Text>;

  return (
    <>
      <Breadcrumb current={blog.title ? `Tin tức / ${blog.title}` : 'Tin tức'} />
      <div style={{ padding: '24px', fontFamily: "'Quicksand', sans-serif" }}>
        <Row gutter={32} align="middle">
          {/* Hình ảnh */}
          <Col xs={24} md={12}>
            <img
              src={blog.images?.[0]}
              alt={blog.title}
              style={{
                width: '100%',
                borderRadius: '8px',
                maxHeight: 400,
                objectFit: 'cover',
              }}
            />
          </Col>

          {/* Nội dung */}
          <Col xs={24} md={12}>
            <Title level={2}>{blog.title}</Title>
            <Text type="secondary">
              Người viết: {blog.author?.username} / {dayjs(blog.createdAt).format('DD/MM/YYYY')}
            </Text>
            <Paragraph style={{ fontSize: '16px', lineHeight: 1.8, marginTop: 16 }}>
              {blog.content}
            </Paragraph>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default BlogDetail;
