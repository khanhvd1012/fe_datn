import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Breadcrumb, Button, Spin, message } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  sizes: string[];
  colors: string;
}

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [mainImage, setMainImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/products/${id}`)
      .then(res => {
        const data = res.data.data;

        // Đảm bảo dữ liệu có đầy đủ mảng
        const fixedData: Product = {
          ...data,
          images: Array.isArray(data.images) ? data.images : [],
          sizes: Array.isArray(data.sizes) ? data.sizes : [],
        };

        setProduct(fixedData);
        setMainImage(fixedData.images?.[0] || '');
        setSelectedSize(fixedData.sizes?.[0] || null);
        setLoading(false);
      })
      .catch(err => {
        message.error('Không thể tải chi tiết sản phẩm');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: 50 }}><Spin size="large" /></div>;
  }

  if (!product) return <div>Không tìm thấy sản phẩm</div>;

  return (
    <div className="product-detail-container">
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
        <Breadcrumb.Item>Sản phẩm</Breadcrumb.Item>
        <Breadcrumb.Item>{product.name}</Breadcrumb.Item>
      </Breadcrumb>

      <div className="product-detail-content">
        <div className="product-images">
          <div className="thumbnail-list">
            {product.images?.map((img, idx) => (
              <img key={idx} src={img} onClick={() => setMainImage(img)} />
            ))}
          </div>
          <div className="main-image">
            <img src={mainImage} alt={product.name} />
          </div>
        </div>

        <div className="product-info">
          <h2>{product.name}</h2>
          <p className="price">
            {typeof product.price === 'number'
              ? product.price.toLocaleString('vi-VN') + '₫'
              : 'Đang cập nhật giá'}
          </p>

          <div className="size-section">
            {Array.isArray(product.sizes) && product.sizes.length > 0 ? (
              product.sizes.map((size) => (
                <button
                  key={size}
                  className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))
            ) : (
              <p>Không có size</p>
            )}
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
            <p>{product.description}</p>
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

        .price {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 16px;
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
      `}</style>
    </div>
  );
};

export default ProductDetail;
