// src/pages/CheckoutSuccess.tsx
import React from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

const CheckoutSuccess = () => {
  return (
    <div className="max-w-xl mx-auto text-center p-10">
      <h1 className="text-2xl font-bold mb-4 text-green-600">🎉 Đặt hàng thành công!</h1>
      <p className="mb-6">Cảm ơn bạn đã mua hàng. Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.</p>
      <Link to="/"><Button type="primary">Về trang chủ</Button></Link>
    </div>
  );
};

export default CheckoutSuccess;
