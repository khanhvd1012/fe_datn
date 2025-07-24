import React from 'react';
import { Col, Row, Typography, Spin, Card } from 'antd';
import Breadcrumb from '../../components/LayoutClient/Breadcrumb';
import SidebarMenu from '../../components/LayoutClient/SideBarMenu';
import { useGetNews } from '../../hooks/useBlogs';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    padding: '24px',
    fontFamily: "'Quicksand', sans-serif",
  },
  sidebar: {
    paddingRight: '12px',
  },
  recentPost: {
    marginBottom: '12px',
  },
  thumb: {
    width: '100%',
    borderRadius: '4px',
    objectFit: 'cover',
    height: '70px',
  },
  mainImg: {
    width: '100%',
    borderRadius: '8px',
    objectFit: 'cover',
    height: '200px',
    marginBottom: '8px',
  },
  blogPost: {
    marginBottom: '32px',
  },
};

const Blog = () => {
  const { data: blogPosts, isLoading } = useGetNews();

  return (
    <>
      <Breadcrumb current="Tin tức" />
      <div style={styles.page}>
        <Title level={2}>Tin tức</Title>

        {isLoading ? (
          <Spin size="large" />
        ) : (
          <Row gutter={24}>
            {/* Sidebar */}
            <Col xs={24} md={6}>
              <div style={styles.sidebar}>
                <Title level={4}>Bài viết mới nhất</Title>
                {blogPosts?.slice(0, 5).map((post) => (
                  <Row key={post._id} gutter={8} style={styles.recentPost}>
                    <Col span={8}>
                      <Link to={`/blog/${post._id}`}>
                        <img
                          src={post.images?.[0] || '/default-blog-thumb.jpg'}
                          alt={post.title}
                          style={styles.thumb}
                        />
                      </Link>
                    </Col>
                    <Col span={16}>
                      <Link to={`/blog/${post._id}`}>
                        <Text strong style={{ color: '#000' }}>{post.title}</Text>
                      </Link>
                      <br />
                      <Text type="secondary">
                        {post.author?.username} - {dayjs(post.createdAt).format('DD/MM/YYYY')}
                      </Text>
                    </Col>
                  </Row>
                ))}
                <SidebarMenu />
              </div>
            </Col>

            {/* Main Content */}
            <Col xs={24} md={18}>
              <Row gutter={[16, 24]}>
                {blogPosts?.map((post) => (
                  <Col key={post._id} xs={24}>
                    <Link to={`/blog/${post._id}`} style={{ color: 'inherit' }}>
                      <Card
                        hoverable
                        style={styles.blogPost}
                        bodyStyle={{ padding: 16 }}
                      >
                        <Row gutter={16} align="middle">
                          <Col xs={24} md={8}>
                            <img
                              alt={post.title}
                              src={post.images?.[0] || '/default-blog-thumb.jpg'}
                              style={{
                                width: '100%',
                                height: '150px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                              }}
                            />
                          </Col>
                          <Col xs={24} md={16}>
                            <Title level={5} style={{ marginBottom: 4 }}>{post.title}</Title>
                            <Text type="secondary">
                              Người viết: {post.author?.username} / {dayjs(post.createdAt).format('DD/MM/YYYY')}
                            </Text>
                            <p style={{ marginTop: 8 }}>{post.content.slice(0, 150)}...</p>
                          </Col>
                        </Row>
                      </Card>
                    </Link>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        )}
      </div>
    </>
  );
};

export default Blog;
