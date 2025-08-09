import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Button, Spin, message, Card, Row, Col, Rate, Progress } from 'antd';
import { MinusOutlined, PlusOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import axios from 'axios';
import Breadcrumb from './Breadcrumb';
import { useProductBySlug } from '../../hooks/useProducts';
import '../css/Product_detail.css';
import RelatedProducts from './RelatedProducts';
import type { IColor } from '../../interface/color';
import { useSizes } from '../../hooks/useSizes';
import { useColors } from '../../hooks/useColors';
import type { ISize } from '../../interface/size';
import type { IReview } from '../../interface/review';
import { useAddToCart } from '../../hooks/useCart';

const ProductDetail = () => {
  const { slug } = useParams();
  const token = localStorage.getItem("token")
  const [mainImage, setMainImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [showVouchers, setShowVouchers] = useState(false);
  const location = useLocation();
  const variantIdFromState = location.state?.variantId || null;
  const [selectedVoucherId, setSelectedVoucherId] = useState<string | null>(null);
  const { data: sizes = [] } = useSizes();
  const { data: colors = [] } = useColors();
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const { mutate: addToCartMutate, isPending } = useAddToCart();
  const { data: product, isLoading } = useProductBySlug(slug || '');
  
  const [reviews, setReviews] = useState<IReview[]>([]);
  const getColorInfo = (id: string) => {
    return colors.find((c: IColor) => c._id === id) || null;
  };

  const getSizeName = (id: string) => {
    const found = sizes.find((s: ISize) => s._id === id);
    return found ? found.size : id;
  };

  useEffect(() => {
    if (!product || !variantIdFromState) return;

    const targetVariant = product.variants.find((v: any) => v._id === variantIdFromState);
    if (targetVariant) {
      setSelectedColor(targetVariant.color || null);
      setSelectedSize(targetVariant.size || null);
      setMainImage(Array.isArray(targetVariant.image_url) ? targetVariant.image_url[0] : '');
      fetchProductReviews();
    }
  }, [product, variantIdFromState]);


  useEffect(() => {
    if (!selectedColor || !product?.variants) return;
    const variant = product.variants.find((v: any) => v.color === selectedColor);
    if (variant) {
      setSelectedSize(variant.size || null);
      setMainImage(Array.isArray(variant.image_url) ? variant.image_url[0] : '');
    }
    setQuantity(1);
  }, [selectedColor, product]);

  const getSelectedVariant = () => {
    if (!product?.variants || !selectedSize || !selectedColor) return null;
    return product.variants.find((variant: any) => {
      const colorId = typeof variant.color === 'string' ? variant.color : variant.color._id;
      const matchColor = colorId === selectedColor;
      const matchSize = Array.isArray(variant.size)
        ? variant.size.includes(selectedSize)
        : variant.size === selectedSize;
      return matchColor && matchSize;
    });
  };

  const selectedVariant = getSelectedVariant();
  const displayPrice = selectedVariant?.price;
  const brandName = typeof product?.brand === 'object' ? product.brand.name : '';
  const imageList = selectedVariant?.image_url || [];
  const currentMainImage = imageList[mainImageIndex] || '';

  const handleMainImageClick = () => {
    if (!imageList.length) return;
    setMainImageIndex((prevIndex) => (prevIndex + 1) % imageList.length);
  };

  // Validate tăng/giảm số lượng
  const handleIncrease = () => {
    if (quantity < currentStock) {
      setQuantity(q => q + 1);
    } else {
      message.warning(`Chỉ còn ${currentStock} sản phẩm trong kho`);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(q => q - 1);
  };
  
  const addToCart = () => {
    if (!token) {
      message.warning("Vui lòng đăng nhập để thêm vào giỏ hàng!");
      return;
    }

    if (!product || !selectedSize) {
      message.warning("Vui lòng chọn size!");
      return;
    }

    const colorInfo = getColorInfo(selectedColor || '');
    if (!colorInfo) {
      message.warning("Màu không hợp lệ!");
      return;
    }

    if (selectedVariant && quantity > (selectedVariant.stock?.quantity ?? 0)) {
      message.warning(`Chỉ còn ${selectedVariant.stock?.quantity ?? 0} sản phẩm trong kho`);
      return;
    }

    if (!selectedVariant || !selectedVariant._id) {
      message.warning("Vui lòng chọn phân loại sản phẩm!");
      return;
    }

    addToCartMutate(
      {
        variant_id: selectedVariant._id,
        quantity
      },
      {
        onError: () => {
          message.error("Thêm vào giỏ hàng thất bại!");
        }
      }
    );
  };

  const handleToggleVouchers = () => {
    if (!showVouchers && vouchers.length === 0) {
      axios.get("http://localhost:3000/api/vouchers")
        .then(res => {
          const allVouchers = res.data || [];
          const activeVouchers = allVouchers.filter((voucher: any) => {
            const now = new Date();
            return new Date(voucher.startDate) <= now && now <= new Date(voucher.endDate) && voucher.quantity > 0;
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
    if (selectedVoucherId === voucher._id) {
      setSelectedVoucherId(null);
      message.info(`Đã bỏ chọn mã: ${voucher.code}`);
    } else {
      setSelectedVoucherId(voucher._id);
      message.success(`Đã chọn mã: ${voucher.code}`);
    }
  };
  // reviews
  const fetchProductReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/reviews/${product?._id}`);
      setReviews(res.data.reviews);

    } catch (error) {
      console.error('Lỗi khi lấy danh sách đánh giá:', error);
    }
  };

  const totalReviews = reviews.length;

  const ratingStats = [1, 2, 3, 4, 5].reduce((acc: Record<number, number>, star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    acc[star] = count;
    return acc;
  }, {} as Record<number, number>);


  const avgRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
  ).toFixed(1);

  const availableColors = Array.isArray(product?.variants)
    ? product.variants.map((v: any) => v.color).filter((val, i, arr) => val && arr.indexOf(val) === i)
    : [];

  const currentStock = selectedVariant?.stock?.quantity ?? 0;

  if (isLoading) return <div style={{ textAlign: 'center', marginTop: 50 }}><Spin size="large" /></div>;
  if (!product) return <div>Không tìm thấy sản phẩm</div>;

  // Lấy tất cả size duy nhất từ các biến thể sản phẩm (bỏ lọc theo màu)
  const allVariantSizes = Array.isArray(product?.variants)
    ? [...new Set(product.variants.map((v: any) => v.size))]
    : [];

  return (
    <>
      <Breadcrumb current={product.name ? `Sản phẩm / ${product.name}` : 'Sản phẩm'} />
      <div className="product-detail-container">
        <div className="product-detail-content">
          {/* Ảnh sản phẩm */}
          <div className="product-images-vertical">
            <div className="thumbnail-list-vertical">
              {(selectedVariant?.image_url || []).map((img: string, idx: number) => (
                <img
                  key={idx}
                  src={img}
                  alt={`thumb-${idx}`}
                  className={currentMainImage === img ? 'active' : ''}
                  onClick={() => setMainImageIndex(idx)}
                  style={{ objectFit: 'cover' }}
                />
              ))}
            </div>
            <div className="main-image-vertical">
              <img
                src={currentMainImage}
                alt={product.name}
                style={{ objectFit: 'cover' }}
                onClick={handleMainImageClick}
              />
            </div>
          </div>

          {/* Thông tin sản phẩm */}
          <div className="product-info">

            <h2 className="product-name">{product.name}</h2>

            {selectedVariant && (
              <>
                {selectedVariant.gender && (
                  <div style={{ marginBottom: 2, color: '#bbb', fontWeight: 300 }}>
                    SKU: {selectedVariant.sku || 'Không có SKU'}
                  </div>
                )}
              </>
            )}

            {brandName && <div className="brand-name">Thương hiệu: {brandName}</div>}

            {selectedVariant && (
              <>
                {selectedVariant.gender && (
                  <div style={{ marginBottom: 2 }}>
                    Giới tính: <strong>
                      {selectedVariant.gender === 'unisex' ? 'Unisex' : selectedVariant.gender === 'male' ? 'Nam' : 'Nữ'}
                    </strong>
                  </div>
                )}
              </>
            )}

            <p className="price">
              {typeof displayPrice === 'number'
                ? displayPrice.toLocaleString('vi-VN') + 'đ'
                : 'Đang cập nhật giá'}
            </p>

            {/* Chọn màu */}
            {availableColors.length > 0 && (
              <div className="color-section">
                <span className="label">Chọn màu:</span>
                <div
                  className="color-options"
                  style={{
                    display: 'flex',
                    flexWrap: 'nowrap',
                    alignItems: 'center',
                    marginTop: 8,
                    overflowX: 'auto',
                  }}
                >
                  {availableColors.map((colorId: string) => {
                    const color = getColorInfo(colorId);
                    if (!color) return null; // Bỏ qua nếu không tìm thấy màu

                    return (
                      <button
                        key={colorId}
                        className={`color-btn ${selectedColor === colorId ? 'active' : ''}`}
                        onClick={() => setSelectedColor(colorId)}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 4,
                          border: selectedColor === colorId ? '2px solid #1890ff' : '1px solid #ccc',
                          backgroundColor: color.code,
                          cursor: 'pointer',
                          marginRight: 8,
                          padding: 0,
                          outline: 'none',
                        }}
                        title={color.name}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Chọn size */}
            <div className="size-section">
              <span className="label">Chọn size:</span>
              <div className="size-options">
                {allVariantSizes.length > 0 ? (
                  allVariantSizes.map((sizeId) => (
                    <button
                      key={sizeId}
                      className={`size-btn ${selectedSize === sizeId ? 'active' : ''}`}
                      onClick={() => setSelectedSize(sizeId)}
                    >
                      {getSizeName(sizeId)}
                    </button>
                  ))
                ) : (
                  <p>Không có size phù hợp</p>
                )}
              </div>
            </div>

            <div className="quantity-control">
              <span className="label">Số lượng:</span>

              <Button
                icon={<MinusOutlined />}
                onClick={handleDecrease}
                disabled={quantity <= 1}
              />

              <span>{quantity}</span>

              <Button
                icon={<PlusOutlined />}
                onClick={handleIncrease}
              />
            </div>

            <p style={{ marginBottom: 5, color: currentStock === 0 ? 'red' : '#666' }}>
              {currentStock === 0
                ? 'Hết hàng'
                : `Còn lại trong kho: ${currentStock} sản phẩm`}
            </p>

            <div className="action-buttons">
              <Button
                type="default"
                size="large"
                className="add-cart"
                onClick={addToCart}
                disabled={currentStock === 0}
              >
                THÊM VÀO GIỎ
              </Button>

              <Link to="/checkout-access">
                <Button
                  type="primary"
                  size="large"
                  danger
                  className="buy-now"
                  disabled={selectedVariant?.stock?.quantity === 0}
                  style={selectedVariant?.stock?.quantity === 0 ? { background: '#ccc', color: '#fff', border: 'none', cursor: 'not-allowed' } : {}}
                >
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
                              backgroundColor: '#FF3300',
                            }}
                          >
                            <Row justify="space-between" align="middle" wrap={false}>
                              {/* Thông tin bên trái */}
                              <Col flex="auto" style={{ color: '#FFFFFF' }}>
                                <strong style={{ fontSize: '16px' }}>{voucher.code}</strong><br />
                                <small>
                                  Đơn tối thiểu: <strong>{voucher.minOrderValue.toLocaleString('vi-VN')}đ</strong>
                                </small><br />
                                <small style={{ color: '#660000' }}>Còn lại: {timeLeft}</small>
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
                                    : `-${voucher.value.toLocaleString('vi-VN')}đ`}
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
          </div>
        </div>
        <div className="product-description">
          <h3><u>Mô tả sản phẩm</u></h3>
          <p>{product.description}</p>
        </div>
        {/* reviews */}
        <div
          style={{
            display: 'flex',
            gap: '40px',
            alignItems: 'flex-start',
            padding: '30px 50px',
            backgroundColor: '#fafafa',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            marginBottom: 40,
          }}
        >
          {/* Tổng điểm trung bình */}
          <div style={{ textAlign: 'center', minWidth: '150px' }}>
            <h1 style={{ fontSize: '48px', margin: '0 0 10px', color: '#1890ff' }}>{avgRating}</h1>
            <Rate allowHalf disabled value={Number(avgRating)} />
            <div style={{ marginTop: 8, color: '#555' }}>{totalReviews} đánh giá</div>
          </div>

          {/* Thanh phần trăm theo số sao */}
          <div style={{ flex: 1 }}>
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingStats[star] || 0;
              const percent = totalReviews ? (count / totalReviews) * 100 : 0;
              return (
                <div
                  key={star}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: 10,
                  }}
                >
                  <div style={{ width: 40, fontWeight: '500' }}>{star} ★</div>
                  <Progress
                    percent={Math.round(percent)}
                    showInfo={false}
                    strokeColor="#52c41a"
                    style={{ flex: 1, marginRight: 10 }}
                  />
                  <div style={{ width: 30, textAlign: 'right' }}>{count}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Danh sách đánh giá */}
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: 16 }}>Đánh giá sản phẩm</h3>
          {reviews.length === 0 ? (
            <p style={{ color: '#999' }}>Chưa có đánh giá nào.</p>
          ) : (
            reviews.map((review: any) => (
              <div
                key={review._id}
                style={{
                  marginBottom: '24px',
                  padding: '16px',
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                  <strong
                    style={{
                      fontSize: '16px',
                      color: '#333',
                      marginRight: '12px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {review.user_id?.username || 'Ẩn danh'}
                  </strong>
                  <Rate value={review.rating} disabled style={{ fontSize: 16 }} />
                </div>
                <p style={{ margin: '4px 0 8px', color: '#444' }}>{review.comment}</p>
                <div style={{ fontSize: '12px', color: '#999' }}>
                  {new Date(review.createdAt).toLocaleString('vi-VN')}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <RelatedProducts />
    </>
  );
};

export default ProductDetail;