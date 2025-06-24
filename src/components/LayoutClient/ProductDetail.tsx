import React, { useState } from 'react';
import { Breadcrumb, Button } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';

const sampleImages = [
  'https://i.imgur.com/X1xqG5L.png',
  'https://i.imgur.com/UoEaK7V.png',
  'https://i.imgur.com/SNv6ga1.png',
  'https://i.imgur.com/J2TbK0y.png',
  'https://i.imgur.com/lJjzZyL.png',
  'https://i.imgur.com/mcPiOJY.png',
];

const ProductDetail = () => {
  const [mainImage, setMainImage] = useState(sampleImages[0]);
  const [selectedColor, setSelectedColor] = useState('purple');
  const [selectedSize, setSelectedSize] = useState<number | null>(36);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="product-detail-container">
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
        <Breadcrumb.Item>Sản phẩm</Breadcrumb.Item>
        <Breadcrumb.Item>Nike Air Max 90</Breadcrumb.Item>
      </Breadcrumb>

      <div className="product-detail-content">
        <div className="product-images">
          <div className="thumbnail-list">
            {sampleImages.map((img, idx) => (
              <img key={idx} src={img} onClick={() => setMainImage(img)} />
            ))}
          </div>
          <div className="main-image">
            <img src={mainImage} alt="product" />
          </div>
        </div>

        <div className="product-info">
          <h2>Nike Air Max 90 Essential "Grape"</h2>
          <p className="sku">SKU: S-0015-1</p>
          <p className="price">4,800,000₫</p>

          <div className="color-section">
            <p>Tím</p>
            <div className="color-options">
              <span className={`color purple ${selectedColor === 'purple' ? 'active' : ''}`} onClick={() => setSelectedColor('purple')}></span>
              <span className={`color blue ${selectedColor === 'blue' ? 'active' : ''}`} onClick={() => setSelectedColor('blue')}></span>
            </div>
          </div>

          <div className="size-section">
            {[36, 37, 38, 39].map(size => (
              <button
                key={size}
                className={`size-btn ${selectedSize === size ? 'active' : ''} ${size === 39 ? 'disabled' : ''}`}
                onClick={() => size !== 39 && setSelectedSize(size)}
                disabled={size === 39}
              >
                {size}
              </button>
            ))}
          </div>

          <div className="quantity-control">
            <Button icon={<MinusOutlined />} onClick={() => setQuantity(Math.max(1, quantity - 1))} />
            <span>{quantity}</span>
            <Button icon={<PlusOutlined />} onClick={() => setQuantity(quantity + 1)} />
          </div>

          <div className="action-buttons">
            <Button type="default" size="large" className="add-cart">THÊM VÀO</Button>
            <Button type="primary" size="large" danger className="buy-now">MUA NGAY</Button>
          </div>

          <Button type="primary" block className="voucher-btn">
            CLICK NHẬN MÃ GIẢM GIÁ NGAY !
          </Button>

          <div className="product-description">
            <h3><u>Mô tả</u></h3>
            <p>
              Hiện đại và thời trang khi diện item mới của Nike. Màu sắc lạ mắt, chất liệu thoáng mát, nhẹ nhàng,
              phù hợp với những chàng trai yêu phong cách sports.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .product-detail-container {
          font-family: 'Quicksand', sans-serif;
          padding: 24px;
        }

        .product-detail-content {
          display: flex;
          gap: 40px;
        }

        .product-images {
          display: flex;
          flex-direction: row;
        }

        .thumbnail-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-right: 12px;
        }

        .thumbnail-list img {
          width: 60px;
          height: 60px;
          object-fit: contain;
          cursor: pointer;
          border: 1px solid #ccc;
        }

        .main-image img {
          width: 400px;
          height: auto;
          object-fit: contain;
        }

        .product-info {
          max-width: 480px;
        }

        .sku {
          color: #999;
          margin-bottom: 8px;
        }

        .price {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 16px;
        }

        .color-section {
          margin-bottom: 16px;
        }

        .color-options {
          display: flex;
          gap: 12px;
        }

        .color {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid #ddd;
        }

        .color.purple {
          background-color: purple;
        }

        .color.blue {
          background-color: #4a90e2;
        }

        .size-section {
          display: flex;
          gap: 10px;
          margin-bottom: 16px;
        }

        .size-btn {
          width: 48px;
          height: 40px;
          border: 1px solid #000;
          background: #fff;
          cursor: pointer;
          font-weight: bold;
        }

        .size-btn.active {
          background: #000;
          color: #fff;
        }

        .size-btn.disabled {
          background: #f2f2f2;
          color: #999;
          border: 1px solid #ccc;
          cursor: not-allowed;
        }

        .quantity-control {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 16px 0;
        }

        .action-buttons {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;
        }

        .add-cart {
          background: #000;
          color: #fff;
          border: none;
        }

        .buy-now {
          background: red;
          color: #fff;
          border: none;
        }

        .voucher-btn {
          background: #3f63c6;
          font-weight: 600;
          margin-bottom: 24px;
        }

        .product-description h3 {
          margin-bottom: 8px;
        }
      `}</style>
    </div>
  );
};

export default ProductDetail;
