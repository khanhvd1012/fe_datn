import React from 'react';
import { Row, Col, Typography, Card } from 'antd';

const { Title, Text } = Typography;

const posts = [
  {
    title: 'Adidas Falcon nổi bật mùa Hè với phối màu color block',
    date: 'THỨ BA 11,06,2019',
    description:
      'Cuối tháng 5, adidas Falcon đã cho ra mắt nhiều phối màu đón chào mùa Hè khiến giới trẻ yêu thích không thôi...',
    image: 'https://picsum.photos/id/104/600/400', // ảnh ngang
  },
  {
    title: 'Saucony hồi sinh mẫu giày chạy bộ cổ điển của mình – Aya Runner',
    date: 'THỨ BA 11,06,2019',
    description:
      'Là một trong những đôi giày chạy bộ tốt nhất vào những năm 1994, 1995, Saucony Aya Runner vừa có màn trở lại...',
    image: 'https://picsum.photos/id/104/600/400',
  },
  {
    title: 'Nike Vapormax Plus trở lại với sắc tím mộng mơ',
    date: 'THỨ BA 11,06,2019',
    description:
      'Nike Vapormax Plus là mẫu retro có nhiều phối màu gradient đẹp nhất từ trước đến nay...',
    image: 'https://picsum.photos/id/104/600/400',
  },
];

const LatestPosts: React.FC = () => {
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
        {posts.map((post, index) => (
          <Col xs={24} sm={24} md={12} lg={8} key={index}>
            <Card
              hoverable
              cover={
                <img
                  alt={post.title}
                  src={post.image}
                  style={{
                    height: 300,
                    width: '100%',
                    objectFit: 'cover',
                  }}
                />
              }
              style={{ textAlign: 'left' }}
            >
              <Text type="secondary" style={{ fontSize: 11 }}>
                {post.date}
              </Text>
              <br />
              <Text strong style={{ fontSize: 14, display: 'inline-block', marginTop: 4 }}>
                {post.title}
              </Text>
              <br />
              <Text style={{ fontSize: 12, display: 'block', marginTop: 8, color: '#444' }}>
                {post.description}
              </Text>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default LatestPosts;
