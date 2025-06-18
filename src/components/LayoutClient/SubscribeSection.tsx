import React from 'react';
import { Input, Button, Typography } from 'antd';
import styled from 'styled-components';

const { Title, Text } = Typography;

const Wrapper = styled.div`
 background-image: url('https://picsum.photos/id/100/1600/600');
  background-size: cover;
  background-position: center;
  padding: 80px 20px;
  text-align: center;
  color: #fff;
  font-family: 'Quicksand', sans-serif;
`;

const InputGroup = styled.div`
  display: flex;
  justify-content: center;
  max-width: 520px;
  margin: 24px auto 0;
`;

const EmailInput = styled(Input)`
  border-radius: 0;
  height: 48px;
  width: 70%;
  font-family: 'Quicksand', sans-serif;
`;

const SubmitButton = styled(Button)`
  border-radius: 0;
  height: 48px;
  width: 30%;
  background: black;
  border-color: black;
  color: white;
  font-weight: bold;
  font-family: 'Quicksand', sans-serif;
`;

const SubscribeSection: React.FC = () => {
  return (
    <Wrapper>
      <Title
        level={2}
        style={{ color: '#fff', fontWeight: 700, fontFamily: 'Quicksand, sans-serif' }}
      >
        ĐĂNG KÝ
      </Title>
      <Text
        style={{
          display: 'block',
          fontSize: 14,
          maxWidth: 620,
          margin: '0 auto',
          fontFamily: 'Quicksand, sans-serif',
        }}
      >
        Đăng ký nhận bản tin của Runner Inn để cập nhật những sản phẩm mới, nhận thông tin ưu đãi đặc biệt và thông tin giảm giá khác.
      </Text>
      <InputGroup>
        <EmailInput placeholder="Nhập email của bạn" />
        <SubmitButton>GỬI</SubmitButton>
      </InputGroup>
    </Wrapper>
  );
};

export default SubscribeSection;
