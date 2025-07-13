import { Card, Descriptions } from 'antd';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const ContactDetail = () => {
  const { id } = useParams();
  const [contact, setContact] = useState<any>(null);

  useEffect(() => {
    // Giả lập call API lấy dữ liệu contact theo id
    const fetchContact = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/contacts/${id}`);
        const data = await response.json();
        setContact(data);
      } catch (error) {
        console.error('Lỗi lấy contact:', error);
      }
    };

    fetchContact();
  }, [id]);

  if (!contact) return <p>Đang tải...</p>;

  return (
    <Card title="Chi tiết Liên hệ">
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Họ và tên">{contact.name}</Descriptions.Item>
        <Descriptions.Item label="Email">{contact.email}</Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">{contact.phone}</Descriptions.Item>
        <Descriptions.Item label="Nội dung">{contact.message}</Descriptions.Item>
        <Descriptions.Item label="Ngày gửi">{new Date(contact.createdAt).toLocaleString()}</Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default ContactDetail;
