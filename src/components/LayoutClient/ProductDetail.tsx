import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Spin, message, Card, Row, Col } from 'antd';
import { MinusOutlined, PlusOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import axios from 'axios';
import Breadcrumb from './Breadcrumb';
import { useSizes } from '../../hooks/useSizes';
import type { IProduct } from '../../interface/product';
import type { ISize } from '../../interface/size';
import '../css/Product_detail.css';


const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [mainImage, setMainImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [showVouchers, setShowVouchers] = useState(false);
  const [selectedVoucherId, setSelectedVoucherId] = useState<string | null>(null);

  const { data: sizes = [] } = useSizes();

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
        const fixedData: IProduct = {
          ...data,
          images: Array.isArray(data.images) ? data.images : [],
          size: Array.isArray(data.size) ? data.size : [],
        };
        setProduct(fixedData);

        const firstVariant = Array.isArray(fixedData.variants) && typeof fixedData.variants[0] === 'object'
          ? fixedData.variants[0]
          : undefined;

        const firstSize = firstVariant?.size?.[0] || (typeof firstVariant?.size === 'string' ? firstVariant.size : null);
        setSelectedSize(firstSize || null);

        setMainImage(Array.isArray(firstVariant?.image_url) ? firstVariant.image_url[0] : '');
        setLoading(false);
      })
      .catch(() => {
        message.error('Không thể tải chi tiết sản phẩm');
        setLoading(false);
      });

  }, [slug]);

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

  const handleToggleVouchers = () => {
    if (!showVouchers && vouchers.length === 0) {
      axios.get("http://localhost:3000/api/vouchers")
        .then(res => {
          const allVouchers = res.data || [];
          const now = new Date();
          const activeVouchers = allVouchers.filter((voucher: any) => {
            const end = new Date(voucher.endDate);
            return now <= end && voucher.quantity > 0;
          });
          setVouchers(activeVouchers);
          setShowVouchers(true);
        })
        .catch(() => {
          message.error("Không thể tải danh sách voucher");
        });
    } else {
      setShowVouchers(!showVouchers);
    }
  };

  const handleApplyVoucher = (voucher: any) => {
    setSelectedVoucherId(voucher._id);
    message.success(`Đã chọn mã: ${voucher.code}`);
  };

  const brandName = typeof product.brand === 'object' ? product.brand.name : '';

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

              <Link to="/checkout-access">
                <Button type="primary" size="large" danger className="buy-now">
                  Mua Ngay
                </Button>
              </Link>
            </div>

            <Button type="primary" block className="voucher-btn" onClick={handleToggleVouchers} icon={showVouchers ? <UpOutlined /> : <DownOutlined />}>
              {showVouchers ? 'ĐÓNG DANH SÁCH GIẢM GIÁ' : 'CLICK NHẬN MÃ GIẢM GIÁ NGAY'}
            </Button>

            {showVouchers && (
              <div className="voucher-list">
                <h2>Mã giảm giá đang hoạt động:</h2>
                {vouchers.length === 0 ? (
                  <p>Không có mã giảm giá nào</p>
                ) : (
                  <ul>
                    {vouchers.map((voucher) => {
                      const end = new Date(voucher.endDate);
                      const now = new Date();
                      const diffMs = end.getTime() - now.getTime();
                      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                      const diffHours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
                      const diffMinutes = Math.floor((diffMs / (1000 * 60)) % 60);
                      const timeLeft = diffMs <= 0
                        ? "Đã hết hạn"
                        : `${diffDays} ngày ${diffHours} giờ ${diffMinutes} phút`;

                      const isSelected = selectedVoucherId === voucher._id;

                      return (
                        <li
                          key={voucher._id}
                          onClick={() => handleApplyVoucher(voucher)}
                          style={{
                            listStyle: 'none',
                            marginBottom: '12px',
                            cursor: 'pointer',
                          }}
                        >
                          <Card
                            size="small"
                            bordered
                            hoverable
                            bodyStyle={{ padding: '12px' }}
                            style={{
                              border: isSelected ? '2px solid #1677ff' : undefined,
                              borderRadius: '10px',
                              boxShadow: isSelected ? '0 0 0 2px #91caff' : undefined,
                              backgroundColor :'#FF3300',
                            }}
                          >
                            <Row justify="space-between" align="middle" wrap={false}>
                              {/* Thông tin bên trái */}
                              <Col flex="auto" style={{ color: '#FFFFFF' }}>
                                <strong style={{ fontSize: '16px'}}>{voucher.code}</strong><br />
                                <small>
                                  Đơn tối thiểu: <strong>{voucher.minOrderValue.toLocaleString()}₫</strong>
                                </small><br />
                                <small style={{ color: '#660000'}}>Còn lại: {timeLeft}</small>
                              </Col>

                              {/* Giảm giá bên phải */}
                              <Col>
                                <div style={{
                                  backgroundColor: voucher.type === 'percentage' ? '#f6ffed' : '#fff1f0',
                                  color: voucher.type === 'percentage' ? '#52c41a' : '#cf1322',
                                  border: '1px solid',
                                  borderColor: voucher.type === 'percentage' ? '#b7eb8f' : '#ffa39e',
                                  borderRadius: '12px',
                                  fontWeight: 'bold',
                                  fontSize: '16px',
                                  padding: '6px 12px',
                                  textAlign: 'center',
                                  whiteSpace: 'nowrap',
                                }}>
                                  {voucher.type === 'percentage'
                                    ? `-${voucher.value}%`
                                    : `-${voucher.value.toLocaleString()}₫`}
                                </div>
                              </Col>
                            </Row>
                          </Card>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}

            <div className="product-description">
              <h3><u>Mô tả sản phẩm</u></h3>
              <p>{product.description}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
