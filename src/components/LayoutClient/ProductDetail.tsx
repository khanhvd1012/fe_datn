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
        // Đảm bảo dữ liệu có đầy đủ mảng
        const fixedData: IProduct = {
          ...data,
          images: Array.isArray(data.images) ? data.images : [],
          size: Array.isArray(data.size) ? data.size : [],
        };

        setProduct(fixedData);

        // Lấy biến thể đầu tiên (nếu có)
        const firstVariant = Array.isArray(fixedData.variants) && typeof fixedData.variants[0] === 'object'
          ? fixedData.variants[0]
          : undefined;

        // Lấy size đầu tiên của biến thể đầu tiên (nếu có)
        const firstSize = firstVariant?.size?.[0] || (typeof firstVariant?.size === 'string' ? firstVariant.size : null);
        setSelectedSize(firstSize || null);

        // Lấy ảnh đầu tiên từ biến thể đầu tiên (nếu có)
        setMainImage(Array.isArray(firstVariant?.image_url) ? firstVariant.image_url[0] : '');

        setLoading(false);
      })
      .catch(() => {
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
  const displayPrice = selectedVariant?.price;

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
        <div className="product-images-vertical">
          <div className="thumbnail-list-vertical">
            {(selectedVariant?.image_url || []).map((img: string, idx: number) => (
              <img
                key={idx}
                src={img}
                alt={`thumb-${idx}`}
                className={mainImage === img ? 'active' : ''}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
          <div className="main-image-vertical">
            <img
              src={mainImage}
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
             CLICK NHẬN MÃ GIẢM GIÁ NGAY !
          </Button>

          <div className="product-description">
            <h3><u>Mô tả sản phẩm</u></h3>
            <p>{product.description}</p>
          </div>
        </div>
      </div>

      <style>{`
        .product-detail-container {
          font-family: 'Quicksand', 'Helvetica Neue', Arial, sans-serif;
          background: #fff;
          padding: 40px 0;
          display: flex;
          justify-content: center;
          min-height: 100vh;
        }

        .product-detail-content {
          display: flex;
          gap: 60px;
          background: #fff;
          border-radius: 0;
          box-shadow: none;
          max-width: 1200px;
          width: 100%;
          padding: 0 32px;
          border: 1px solid #eee;
        }

        .product-images-vertical {
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          gap: 18px;
        }

        .thumbnail-list-vertical {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .thumbnail-list-vertical img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 0;
          border: 1px solid #eee;
          cursor: pointer;
          background: #fafafa;
          transition: border 0.2s, box-shadow 0.2s;
        }

        .thumbnail-list-vertical img.active,
        .thumbnail-list-vertical img:hover {
          border: 1px solid #111;
          box-shadow: 0 0 0 2px #1112;
        }

        .main-image-vertical img {
          width: 420px;
          height: 420px;
          object-fit: cover;
          border-radius: 0;
          border: 1px solid #eee;
          background: #fafafa;
          box-shadow: none;
        }

        .product-info {
          flex: 1;
          max-width: 420px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .product-name {
          font-size: 2.2rem;
          font-weight: 700;
          margin-bottom: 0;
          letter-spacing: 0.5px;
        }

        .brand-name {
          color: #757575;
          font-size: 1rem;
          margin-bottom: 0;
          font-weight: 500;
        }

        .price {
          font-size: 2rem;
          font-weight: 700;
          color: #111;
          margin: 10px 0 18px 0;
          letter-spacing: 1px;
        }

        .size-section {
          margin-bottom: 0;
        }

        .label {
          font-weight: 600;
          font-size: 1.05rem;
          margin-bottom: 8px;
          display: block;
        }

        .size-options {
          display: flex;
          gap: 12px;
          margin-top: 8px;
          flex-wrap: wrap;
        }

        .size-btn {
          min-width: 48px;
          padding: 10px 18px;
          border: 1px solid #ccc;
          background: #fff;
          cursor: pointer;
          font-weight: 600;
          border-radius: 0;
          font-size: 1rem;
          transition: border 0.2s, background 0.2s, color 0.2s;
          color: #111;
        }

        .size-btn.active,
        .size-btn:hover {
          border: 1px solid #111;
          background: #f5f5f5;
          color: #111;
        }

        .quantity-control {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 18px 0;
        }

        .quantity-control .ant-btn {
          border-radius: 0;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          border: 1px solid #ccc;
          background: #fff;
          color: #111;
          transition: border 0.2s;
        }

        .quantity-control .ant-btn:hover {
          border: 1px solid #111;
          background: #f5f5f5;
        }

        .action-buttons {
          display: flex;
          gap: 18px;
          margin-bottom: 12px;
          margin-top: 12px;
        }

        .add-cart, .buy-now, .voucher-btn {
          border-radius: 0 !important;
          font-weight: 700;
          font-size: 1.1rem;
          height: 48px;
          min-width: 160px;
          box-shadow: none;
          border: 1px solid #111 !important;
          transition: background 0.2s, color 0.2s;
        }

        .add-cart {
          background: #fff;
          color: #111;
        }
        .add-cart:hover {
          background: #111;
          color: #fff;
        }

        .buy-now {
          background: #111 !important;
          color: #fff !important;
        }
        .buy-now:hover {
          background: #333 !important;
          color: #fff !important;
        }

        .voucher-btn {
          background: #f5f5f5 !important;
          color: #111 !important;
          font-weight: 700;
          border-radius: 0 !important;
          border: 1px solid #ccc !important;
          margin-bottom: 18px;
          font-size: 1.05rem;
          height: 44px;
          box-shadow: none;
          transition: border 0.2s, background 0.2s;
        }
        .voucher-btn:hover {
          border: 1px solid #111 !important;
          background: #e5e5e5 !important;
        }

        .product-description {
          background: #fafafa;
          padding: 18px 18px 12px 18px;
          border-radius: 0;
          margin-top: 18px;
          font-size: 1.05rem;
          color: #222;
          line-height: 1.7;
          border: 1px solid #eee;
        }

        .product-description h3 {
          margin-bottom: 8px;
          font-size: 1.15rem;
          font-weight: 700;
          text-decoration: underline;
        }

        @media (max-width: 900px) {
          .product-detail-content {
            flex-direction: column;
            gap: 32px;
            padding: 0 8px;
          }
          .main-image img {
            width: 100vw;
            max-width: 100%;
            height: auto;
          }
          .product-images {
            min-width: unset;
            width: 100%;
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