import { useParams } from 'react-router-dom';
import { Typography, Spin } from 'antd';
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
      <div style={{ padding: '24px', fontFamily: "'Quicksand', sans-serif", maxWidth: 1000, margin: 'auto' }}>
        {/* Tiêu đề + thông tin */}
        <Title level={2} style={{ marginBottom: 8 }}>{blog.title}</Title>
        <Text type="secondary">
          Người viết: {blog.author?.username} / {dayjs(blog.createdAt).format('DD/MM/YYYY')}
        </Text>

        {/* Hình ảnh */}
        {blog.images?.length > 0 && (
          <div style={{ marginTop: 16, marginBottom: 24 }}>
            {blog.images.map((img: string, index: number) => (
              <img
                key={index}
                src={img}
                alt={`${blog.title} - ${index + 1}`}
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  marginBottom: 16,
                  maxHeight: 500,
                  objectFit: 'cover',
                }}
              />
            ))}
          </div>
        )}

        {/* Nội dung blog */}
        <Paragraph
          style={{ fontSize: '16px', lineHeight: 1.8, whiteSpace: 'pre-line' }}
        >
          {blog.content}
        </Paragraph>
      </div>
    </>
  );
};

export default BlogDetail;
