import React from 'react';
import { Col, Row, Typography } from 'antd';
import Breadcrumb from '../../components/LayoutClient/Breadcrumb';
import SidebarMenu from '../../components/LayoutClient/SideBarMenu';


const { Title, Text } = Typography;

const blogPosts = [
  {
    title: 'Adidas Falcon nổi bật mùa Hè với phối màu color block',
    author: 'Nguyen',
    date: '11.06.2019',
    image: 'https://picsum.photos/id/21/480/280',
    desc: 'Cuối tháng 5, adidas Falcon đã cho ra mắt nhiều phối màu đón chào mùa Hè khiến giới trẻ yêu thích không thôi...',
  },
  {
    title: 'Saucony hồi sinh mẫu giày chạy bộ cổ điển – Aya Runner',
    author: 'Nguyen',
    date: '11.06.2019',
    image: 'https://picsum.photos/id/28/480/280',
    desc: 'Là một trong những đôi giày chạy bộ tốt nhất vào những năm 1994, 1995, Saucony Aya Runner vừa có màn trở lại...',
  },
  {
    title: 'Nike Vapormax Plus trở lại với sắc tím mộng mơ',
    author: 'Runner Inn',
    date: '11.06.2019',
    image: 'https://picsum.photos/id/28/480/280',
    desc: 'Nike Vapormax Plus là mẫu retro có nhiều phối màu gradient đẹp mắt từ trước đến nay...',
  },
];

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    padding: '24px',
    fontFamily: "'Quicksand', sans-serif",
  },
  breadcrumb: {
    marginBottom: '16px',
    fontSize: '14px',
    opacity: 0.7,
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
  },
  mainImg: {
    width: '100%',
    borderRadius: '8px',
    objectFit: 'cover',
    marginBottom: '8px',
  },
  blogPost: {
    marginBottom: '32px',
  },
};

const Blog = () => {
  return (
    <>
    <Breadcrumb current="Blog" />
    <div style={styles.page}>
      <Title level={2}>Tin tức</Title>

      <Row gutter={24}>
        <Col xs={24} md={6}>
          <div style={styles.sidebar}>
            <Title level={4}>Bài viết mới nhất</Title>
            {blogPosts.map((post, index) => (
              <Row key={index} gutter={8} style={styles.recentPost}>
                <Col span={8}>
                  <img src={post.image} alt={post.title} style={styles.thumb} />
                </Col>
                <Col span={16}>
                  <Text strong>{post.title}</Text>
                  <br />
                  <Text type="secondary">{post.author} {post.date}</Text>
                </Col>
              </Row>
            ))}
            <SidebarMenu />
          </div>
        </Col>

        <Col xs={24} md={18}>
          {blogPosts.map((post, index) => (
            <Row key={index} gutter={16} style={styles.blogPost}>
              <Col xs={24} md={10}>
                <img src={post.image} alt={post.title} style={styles.mainImg} />
              </Col>
              <Col xs={24} md={14}>
                <Title level={5}>{post.title}</Title>
                <Text type="secondary">Người viết: {post.author} / {post.date}</Text>
                <p>{post.desc}</p>
              </Col>
            </Row>
          ))}
        </Col>
      </Row>
    </div>
    </>
  );
};

export default Blog;
