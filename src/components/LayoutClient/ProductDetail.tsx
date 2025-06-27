import  { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Spin, message } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import Breadcrumb from './Breadcrumb';
import { useSizes } from '../../hooks/useSizes';
import type { IProduct } from '../../interface/product';
import type { ISize } from '../../interface/size';

const ProductDetail = () => {
  // Đổi id thành slug để lấy từ URL
  const { slug } = useParams();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [mainImage, setMainImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Lấy danh sách size từ hook
  const { data: sizes = [] } = useSizes();

  // Hàm lấy tên size từ id
  const getSizeName = (id: string) => {
    if (!id || !Array.isArray(sizes) || sizes.length === 0) return id;
    const found = sizes.find((s: ISize) => s._id === id);
    return found ? found.size : id;
  };

  useEffect(() => {
    if (!slug) return;
    axios.get(`http://localhost:3000/api/products/slug/${slug}`)
      .then(res => {
        const data = res.data.data;
        console.log('Product data:', data);

        // Đảm bảo dữ liệu có đầy đủ mảng
        const fixedData: IProduct = {
          ...data,
          images: Array.isArray(data.images) ? data.images : [],
          size: Array.isArray(data.size) ? data.size : [],
        };

        setProduct(fixedData);
        setMainImage(fixedData.images?.[0] || '');
        const firstSize = fixedData.size?.[0];
        setSelectedSize(typeof firstSize === 'object' ? firstSize._id : firstSize || null);
        setLoading(false);
      })
      .catch(err => {
        message.error('Không thể tải chi tiết sản phẩm');
        setLoading(false);
      });
  }, [slug]);

  // Hàm lấy variant theo size đang chọn
  const getSelectedVariant = () => {
    if (!product?.variants || !selectedSize) return null;
    return product.variants.find((variant: any) =>
      Array.isArray(variant.size)
        ? variant.size.includes(selectedSize)
        : variant.size === selectedSize
    );
  };

  const selectedVariant = getSelectedVariant();
  const displayPrice = selectedVariant?.price ?? product?.price;

  const addToCart = () => {
    if (!product || !selectedSize) {
      message.warning("Vui lòng chọn size!");
      return;
    }
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    // Kiểm tra sản phẩm đã có trong giỏ chưa (theo id + size)
    const existing = cart.find(
      (item: any) => item._id === product._id && item.size === selectedSize
    );
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        _id: product._id,
        name: product.name,
        image: product.images?.[0],
        price: displayPrice,
        size: selectedSize,
        quantity,
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    message.success("Đã thêm vào giỏ hàng!");
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: 50 }}><Spin size="large" /></div>;
  }

  if (!product) return <div>Không tìm thấy sản phẩm</div>;

  // Lấy tên brand và category nếu có
  const brandName = typeof product.brand === 'object' ? product.brand.name : '';

  // Không thay đổi phần logic và import (giữ nguyên như bạn đưa)
return (
  <>
    <Breadcrumb current={product.name ? `Sản phẩm / ${product.name}` : 'Sản phẩm'} />
    <div className="product-detail-container">
      <div className="product-detail-content">
        <div className="product-images">
          <div className="thumbnail-list">
            {product.images?.map((img: string, idx: number) => (
              <img key={idx} src={img} onClick={() => setMainImage(img)} />
            ))}
          </div>
          <div className="main-image">
            <img
              src={
                (selectedVariant?.image_url && selectedVariant.image_url[0])
                  ? selectedVariant.image_url[0]
                  : mainImage
              }
              alt={product.name}
            />
          </div>
        </div>

        <div className="product-info">
          <h2 className="product-name">{product.name}</h2>
          {brandName && <div className="brand-name">Thương hiệu: {brandName}</div>}

          <p className="price">
            {typeof displayPrice === 'number'
              ? displayPrice.toLocaleString('vi-VN') + '₫'
              : 'Đang cập nhật giá'}
          </p>

          <div className="size-section">
            <span className="label">Chọn size:</span>
            <div className="size-options">
              {Array.isArray(product.size) && product.size.length > 0 ? (
                product.size.map((sizeObj: any) => {
                  const sizeId = typeof sizeObj === 'object' ? sizeObj._id : sizeObj;
                  return (
                    <button
                      key={sizeId}
                      className={`size-btn ${selectedSize === sizeId ? 'active' : ''}`}
                      onClick={() => setSelectedSize(sizeId)}
                    >
                      {getSizeName(sizeId)}
                    </button>
                  );
                })
              ) : (
                <p>Không có size</p>
              )}
            </div>
          </div>

          <div className="quantity-control">
            <span className="label">Số lượng:</span>
            <Button icon={<MinusOutlined />} onClick={() => setQuantity(Math.max(1, quantity - 1))} />
            <span>{quantity}</span>
            <Button icon={<PlusOutlined />} onClick={() => setQuantity(quantity + 1)} />
          </div>

          <div className="action-buttons">
            <Button type="default" size="large" className="add-cart" onClick={addToCart}>
              THÊM VÀO GIỎ
            </Button>
            <Button type="primary" size="large" danger className="buy-now">
              MUA NGAY
            </Button>
          </div>

          <Button type="primary" block className="voucher-btn">
            🎁 CLICK NHẬN MÃ GIẢM GIÁ NGAY !
          </Button>

          <div className="product-description">
            <h3><u>Mô tả sản phẩm</u></h3>
            <p>{product.description}</p>
          </div>
        </div>
      </div>

      <style>{`
        .product-detail-container {
          font-family: 'Quicksand', sans-serif;
          padding: 24px;
          background: #f9f9f9;
        }

        .product-detail-content {
          display: flex;
          flex-wrap: wrap;
          gap: 40px;
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .product-images {
          display: flex;
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
          object-fit: cover;
          border-radius: 6px;
          cursor: pointer;
          border: 1px solid #ccc;
          transition: transform 0.2s ease;
        }

        .thumbnail-list img:hover {
          transform: scale(1.05);
          border-color: #000;
        }

        .main-image img {
          width: 400px;
          height: auto;
          border-radius: 12px;
          border: 1px solid #ddd;
          object-fit: cover;
        }

        .product-info {
          flex: 1;
          max-width: 480px;
          display: flex;
          flex-direction: column;
        }

        .product-name {
          font-size: 28px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .brand-name {
          color: #666;
          font-size: 14px;
          margin-bottom: 12px;
        }

        .price {
          font-size: 26px;
          font-weight: bold;
          color: #d0021b;
          margin-bottom: 16px;
        }

        .label {
          font-weight: 500;
          margin-right: 10px;
        }

        .size-section {
          margin-bottom: 20px;
        }

        .size-options {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 6px;
        }

        .size-btn {
          min-width: 48px;
          padding: 8px 12px;
          border: 2px solid #333;
          background: #fff;
          cursor: pointer;
          font-weight: bold;
          border-radius: 6px;
          transition: 0.2s;
        }

        .size-btn:hover {
          background: #f0f0f0;
        }

        .size-btn.active {
          background: #333;
          color: white;
        }

        .quantity-control {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 20px 0;
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
          font-weight: 600;
          transition: 0.2s;
        }

        .add-cart:hover {
          opacity: 0.9;
        }

        .buy-now {
          background: red;
          color: #fff;
          border: none;
          font-weight: 600;
        }

        .voucher-btn {
          background: #3f63c6;
          font-weight: 600;
          margin-bottom: 24px;
          border-radius: 8px;
        }

        .product-description {
          background: #f5f5f5;
          padding: 16px;
          border-radius: 8px;
        }

        .product-description h3 {
          margin-bottom: 8px;
        }

        .product-description p {
          line-height: 1.6;
          color: #333;
        }

        @media (max-width: 768px) {
          .product-detail-content {
            flex-direction: column;
            padding: 16px;
          }

          .main-image img {
            width: 100%;
          }

          .thumbnail-list {
            flex-direction: row;
            justify-content: center;
            margin-bottom: 12px;
          }

          .product-info {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  </>
);
}
export default ProductDetail;