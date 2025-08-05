// src/pages/CheckoutFailed.tsx

import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const CheckoutFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Result
        status="error"
        title="Thanh toán thất bại"
        subTitle="Có lỗi xảy ra khi xử lý đơn hàng. Vui lòng thử lại sau hoặc kiểm tra lại thông tin của bạn."
        extra={[
          <Button type="primary" onClick={() => navigate('/checkout')}>
            Thử lại
          </Button>,
          <Button onClick={() => navigate('/cart')}>Quay lại giỏ hàng</Button>,
        ]}
      />
    </div>
  );
};

export default CheckoutFailed;
