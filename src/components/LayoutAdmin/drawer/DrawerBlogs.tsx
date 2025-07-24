import { Drawer, Descriptions, Divider, Skeleton, Empty } from 'antd';
import type { IBlogs } from '../../../interface/blogs';

interface DrawerNewsProps {
  visible: boolean;
  news: IBlogs | null;
  onClose: () => void;
  loading?: boolean;
}

const DrawerBlogs = ({ visible, news, onClose, loading }: DrawerNewsProps) => {
  return (
    <Drawer
      title={<span className="text-lg font-semibold">Chi tiết tin tức</span>}
      placement="right"
      onClose={onClose}
      open={visible}
      width={600}
    >
      {loading ? (
        <Skeleton active />
      ) : news ? (
        <>
          <div className="mb-4">
            <h3 className="text-base font-medium mb-2">Thông tin cơ bản</h3>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Tiêu đề" className="bg-gray-50">
                {news.title}
              </Descriptions.Item>
              <Descriptions.Item label="Tác giả">
                {news.author?.username || "---"}
              </Descriptions.Item>
              <Descriptions.Item label="Nội dung" className="bg-gray-50">
                <div
                  style={{
                    maxHeight: 300,
                    overflowY: 'auto',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {news.content}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Hình ảnh">
                {news.images && news.images.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {news.images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Ảnh ${index + 1}`}
                        style={{
                          width: 100,
                          height: 100,
                          objectFit: 'cover',
                          borderRadius: 4,
                          border: '1px solid #f0f0f0',
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Không có ảnh"
                    style={{ margin: 0, textAlign: 'center' }}
                  />
                )}
              </Descriptions.Item>
            </Descriptions>
          </div>

          <Divider />

          <div>
            <h3 className="text-base font-medium mb-2">Thông tin thời gian</h3>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Ngày tạo" className="bg-gray-50">
                {news.createdAt
                  ? new Date(news.createdAt).toLocaleString('vi-VN')
                  : '---'}
              </Descriptions.Item>
              <Descriptions.Item label="Cập nhật lần cuối">
                {news.updatedAt
                  ? new Date(news.updatedAt).toLocaleString('vi-VN')
                  : '---'}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </>
      ) : (
        <Empty description="Không có tin tức được chọn" />
      )}
    </Drawer>
  );
};

export default DrawerBlogs;
