import React, { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Wrapper = styled.div`
  position: fixed;
  top: 100px;
  right: 24px;
  width: 320px;
  background-color: white;
  border: 1px solid #ddd;
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
  border-radius: 4px;
  z-index: 1000;
  padding: 16px;
  font-family: 'Quicksand', sans-serif;
  animation: ${slideUp} 0.3s ease;
`;

const Title = styled.h4`
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 600;
`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 250px;
  overflow-y: auto;
`;

const Item = styled.li`
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  font-size: 14px;

  &:last-child {
    border-bottom: none;
  }
`;

const CloseBtn = styled.div`
  text-align: right;
  font-size: 12px;
  margin-top: 10px;
  color: #888;
  cursor: pointer;
`;

interface Props {
  onClose: () => void;
  wrapperRef: React.RefObject<HTMLDivElement | null>;
}

const NotificationPopup: React.FC<Props> = ({ onClose, wrapperRef }) => {
  const dummyNotifications = [
    '🚚 Đơn hàng #1234 đã được giao thành công.',
    '🎁 Ưu đãi 20% cho đơn hàng từ 500.000đ.',
    '📦 Đơn hàng mới đang được xử lý.',
  ];

  return (
    <Wrapper ref={wrapperRef}>
      <Title>🔔 Thông báo</Title>
      <List>
        {dummyNotifications.map((note, idx) => (
          <Item key={idx}>{note}</Item>
        ))}
      </List>
      <CloseBtn onClick={onClose}>Đóng</CloseBtn>
    </Wrapper>
  );
};

export default NotificationPopup;
