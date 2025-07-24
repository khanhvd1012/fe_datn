import React from 'react';
import { Row, Col, Typography, Card } from 'antd';
import { Link } from 'react-router-dom';
import { useGetNews } from '../../hooks/useBlogs'; // đường dẫn tùy theo cấu trúc dự án

const { Title, Text } = Typography;

const LatestPosts: React.FC = () => {
  const { data: posts = [], isLoading } = useGetNews();

  return (
    <div style={{ padding: '40px 20px', fontFamily: 'Quicksand, sans-serif' }}>
      <Title
        level={2}
        style={{
          textAlign: 'center',
          fontSize: 20,
          marginBottom: 8,
          fontWeight: 600,
        }}
      >
        <span
          style={{
            display: 'inline-block',
            paddingBottom: 4,
            position: 'relative',
          }}
        >
          Bài viết mới nhất
          <span
            style={{
              position: 'absolute',
              left: '25%',
              bottom: 0,
              width: '50%',
              borderBottom: '2px solid black',
              transform: 'translateY(100%)',
            }}
          />
        </span>
      </Title>

      <div style={{ textAlign: 'center', marginTop: 8, marginBottom: 30 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          Xem thêm
        </Text>
      </div>

      <Row gutter={[24, 24]} justify="center">
        {!isLoading &&
          posts.map((post: any) => (
            <Col xs={24} sm={24} md={12} lg={8} key={post._id}>
              <Card
                hoverable
                cover={
                  <Link to={`/blog/${post._id}`}>
                    <img
                      src={post.images?.[0] || 'https://via.placeholder.com/600x400?text=No+Image'}
                      alt={post.title}
                      style={{
                        height: 300,
                        width: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Link>
                }
                style={{ textAlign: 'left' }}
              >
                <Text type="secondary" style={{ fontSize: 11 }}>
                  {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                </Text>
                <br />
                <Text strong style={{ fontSize: 14, display: 'inline-block', marginTop: 4 }}>
                  {post.title}
                </Text>
                <br />
                <Text style={{ fontSize: 12, display: 'block', marginTop: 8, color: '#444' }}>
                  {post.content?.slice(0, 100)}...
                </Text>
              </Card>
            </Col>
          ))}
      </Row>
    </div>
  );
};

export default LatestPosts;
