import React, { useEffect, useState } from 'react';
import { Button, Card, Tag } from 'antd';
import { CheckCircleTwoTone } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const CheckoutSuccess = () => {
 

  return (
    <div className="min-h-[60vh] flex justify-center items-center bg-gray-50 px-4">
      <Card
        className="max-w-lg w-full shadow-md rounded-2xl text-center"
      >
        <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: 64 }} />
        <h1 className="text-3xl font-semibold text-green-600 mt-4">Đặt hàng thành công!</h1>
        <p className="text-gray-600 my-4">
          🎉 Cảm ơn bạn đã mua hàng tại <span className="font-medium">Shop của chúng tôi</span>.
        </p>
        <div className="flex justify-center gap-4 mt-6">
          <Link to="/"><Button type="primary" size="large">🏠 Về trang chủ</Button></Link>
          <Link to="/order-history"><Button size="large">📦 Đơn hàng của bạn</Button></Link>
        </div>
      </Card>
    </div>
  );
};

export default CheckoutSuccess;
