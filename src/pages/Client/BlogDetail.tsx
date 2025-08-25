import { useParams } from 'react-router-dom';
import { Typography, Spin } from 'antd';
import Breadcrumb from '../../components/LayoutClient/Breadcrumb';
import { useGetNewsById } from '../../hooks/useBlogs';
import dayjs from 'dayjs';
import { useEffect } from 'react';

const { Title, Text, Paragraph } = Typography;

const BlogDetail = () => {
  const { id } = useParams();
  const { data: blog, isLoading } = useGetNewsById(id as string);
  useEffect(() => {
    if (blog?.images) {
      console.log("Danh sách hình ảnh:", blog.images);
    }
  }, [blog]);


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
        {/* Hình ảnh */}
        {blog.images?.length > 0 && (
          <div style={{ marginTop: 16, marginBottom: 24 }}>
            {/* Ảnh chính */}
            <img
              src={blog.images[0]}
              alt={`${blog.title} - 1`}
              style={{
                width: "100%",
                borderRadius: "8px",
                marginBottom: 16,
                maxHeight: 400,
                objectFit: "cover",
              }}
            />
            {/* Các ảnh nhỏ */}
            <div
              style={{
                display: "flex",
                gap: 16,
              }}
            >
              {blog.images.slice(1).map((img: string, index: number) => (
                <img
                  key={index}
                  src={img}
                  alt={`${blog.title} - ${index + 2}`}
                  style={{
                    flex: 1,
                    borderRadius: "8px",
                    maxHeight: 200,
                    objectFit: "cover",
                  }}
                />
              ))}
            </div>
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
