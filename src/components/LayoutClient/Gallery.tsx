import { Carousel, Rate, Typography, Spin } from 'antd';
import { useReviews } from '../../hooks/useReview';

const { Text, Title } = Typography;

const Gallery = () => {
  const { data: reviews, isLoading, isError } = useReviews();

  if (isLoading) return <Spin tip="Đang tải đánh giá..." />;
  if (isError) return <div>Đã có lỗi xảy ra khi tải đánh giá</div>;

  const filteredReviews = (reviews || [])
    .filter(r => r.rating > 4)
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    })
    .slice(0, 3);

  if (filteredReviews.length === 0)
    return <Text>Không có bình luận nào phù hợp</Text>;

  return (
    <>
      <Title level={2} style={{ textAlign: 'center', fontSize: '20px', marginBottom: 20 }}>
        <span style={{ display: 'inline-block', paddingBottom: 4, position: 'relative' }}>
          Khách hàng và SneakerTrend
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
      <div
        style={{
          width: '100%', // full width màn hình
          height: 400,
          backgroundImage:
            'url("https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1350&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          justifyContent: 'center', // căn giữa ngang
          alignItems: 'center', // căn giữa dọc
          padding: 20,
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(255,255,255,0.85)',
            borderRadius: 8,
            maxWidth: 600,
            width: '100%',  
            padding: 20,
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}
        >
          <Carousel autoplay>
            {filteredReviews.map((review) => (
              <div
                key={review._id}
                style={{
                  height: 250,
                  padding: '0 20px',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  <Title level={4} style={{ marginBottom: 8 }}>
                    {typeof review.user_id === 'object' ? review.user_id.username : review.user_id}
                  </Title>
                  <Rate disabled defaultValue={review.rating} style={{ marginBottom: 12 }} />
                  <p style={{ fontSize: 16, lineHeight: 1.5, maxWidth: '80%' }}>{review.comment}</p>
                </div>
              </div>
            ))}
          </Carousel>
        </div>


      </div>
    </>
  );
};

export default Gallery;
