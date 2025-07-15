import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Spin, message, Card, Row, Col } from 'antd';
import { MinusOutlined, PlusOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import axios from 'axios';
import Breadcrumb from './Breadcrumb';
import { useSizes } from '../../hooks/useSizes';
import { useColors } from '../../hooks/useColors';
import type { IProduct, IVariant } from '../../interface/product';
import type { ISize } from '../../interface/size';
import type { IColor } from '../../interface/color';
import '../css/Product_detail.css';
import RelatedProducts from './RelatedProducts';


const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [mainImage, setMainImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [showVouchers, setShowVouchers] = useState(false);
  const [selectedVoucherId, setSelectedVoucherId] = useState<string | null>(null);

  const { data: sizes = [] } = useSizes();
  const { data: colors = [] } = useColors();

  const getSizeName = (id: string) => {
    const found = sizes.find((s: ISize) => s._id === id);
    return found ? found.size : id;
  };

  const getColorInfo = (id: string) => {
    return colors.find((c: IColor) => c._id === id) || null;
  };

  useEffect(() => {
    if (!slug) return;

    axios.get(`http://localhost:3000/api/products/slug/${slug}`)
      .then(res => {
        const data = res.data.data;
        const fixedData: IProduct = {
          ...data,
          variants: Array.isArray(data.variants) ? data.variants : [],
        };
        setProduct(fixedData);

        const firstVariant = fixedData.variants[0];
        if (firstVariant) {
          const firstColor = firstVariant.color;
          const firstSize = Array.isArray(firstVariant.size)
            ? firstVariant.size[0]
            : firstVariant.size;

          setSelectedColor(firstColor || null);
          setSelectedSize(firstSize || null);
          setMainImage(Array.isArray(firstVariant.image_url) ? firstVariant.image_url[0] : '');
        }

        setLoading(false);
      })
      .catch(() => {
        message.error('Không thể tải chi tiết sản phẩm');
        setLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    if (!selectedColor || !product?.variants) return;
    const variant = product.variants.find((v: any) => v.color === selectedColor);
    if (variant) {
      const firstSize = variant.size?.[0] || (typeof variant.size === 'string' ? variant.size : null);
      setSelectedSize(firstSize || null);
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

  const addToCart = () => {
    if (!product || !selectedSize) {
      message.warning("Vui lòng chọn size!");
      return;
    }
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((item: any) => item._id === product._id && item.size === selectedSize);
    if (existing) {
      existing.quantity += quantity;
      existing.voucher = selectedVoucherId || null;
    } else {
      cart.push({
        _id: product._id,
        name: product.name,
        price: displayPrice,
        size: selectedSize,
        quantity,
        voucher: selectedVoucherId || null,
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    if (selectedVoucherId) {
      localStorage.setItem("selected_voucher_id", selectedVoucherId);
    }
    message.success("Đã thêm vào giỏ hàng!");
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

  const sizeIdsFromVariant =
    Array.isArray(product?.variants) && selectedColor
      ? product.variants
        .filter((v: IVariant) => v.color === selectedColor)
        .flatMap((v: IVariant) =>
          Array.isArray(v.size) ? v.size : [v.size]
        )
        .filter((val, idx, arr) => val && arr.indexOf(val) === idx)
      : [];

  const availableColors = Array.isArray(product?.variants)
    ? product.variants.map((v: any) => v.color).filter((val, i, arr) => val && arr.indexOf(val) === i)
    : [];

  if (loading) return <div style={{ textAlign: 'center', marginTop: 50 }}><Spin size="large" /></div>;
  if (!product) return <div>Không tìm thấy sản phẩm</div>;
  console.log("Selected variant:", selectedVariant);
  console.log("Stock quantity:", selectedVariant?.stock?.quantity);
  console.log("Current quantity:", quantity);

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
                  className={mainImage === img ? 'active' : ''}
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
            <div className="main-image-vertical">
              <img src={mainImage} alt={product.name} />
            </div>
          </div>

          {/* Thông tin sản phẩm */}
          <div className="product-info">
            <h2 className="product-name">{product.name}</h2>
            {brandName && <div className="brand-name">Thương hiệu: {brandName}</div>}

            {selectedVariant && (
              <>
                {selectedVariant.status && (
                  <div style={{ marginBottom: 2 }}>
                    Tình trạng: <strong style={{ color: selectedVariant.status === 'inStock' ? 'green' : 'red' }}>
                      {selectedVariant.status === 'inStock' ? 'Còn hàng' : 'Hết hàng'}
                    </strong>
                  </div>
                )}
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
                ? displayPrice.toLocaleString('vi-VN') + '₫'
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
                    return (
                      <button
                        key={colorId}
                        className={`color-btn ${selectedColor === colorId ? 'active' : ''}`}
                        onClick={() => setSelectedColor(colorId)}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 0, // Vuông
                          border: selectedColor === colorId ? '2px solid #7fc9c4' : '1px solid #ccc',
                          background: color?.code || '#eee', // Tô màu trực tiếp
                          cursor: 'pointer',
                          marginRight: 5,
                          outline: 'none',
                          padding: 0,
                        }}
                        title={color?.name}
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
                {sizeIdsFromVariant.length > 0 ? (
                  sizeIdsFromVariant.map((sizeId) => {
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
                  <p>Không có size phù hợp</p>
                )}
              </div>
            </div>

            <div className="quantity-control">
              <span className="label">Số lượng:</span>

              <Button
                icon={<MinusOutlined />}
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                disabled={quantity <= 1}
              />

              <span>{quantity}</span>

              <Button
                icon={<PlusOutlined />}
                onClick={() => {
                  if (selectedVariant && quantity < selectedVariant.stock.quantity) {
                    setQuantity(prev => prev + 1);
                  } else {
                    message.warning(`Chỉ còn ${selectedVariant?.stock?.quantity || 0} sản phẩm trong kho`);
                  }
                }}
                disabled={quantity >= selectedVariant?.stock?.quantity}
              />
            </div>

            <div className="action-buttons">
              <Button type="default" size="large" className="add-cart" onClick={addToCart}>
                <Link to={`/cart`}>
                  THÊM VÀO GIỎ
                </Link>
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
                              backgroundColor: '#FF3300',
                            }}
                          >
                            <Row justify="space-between" align="middle" wrap={false}>
                              {/* Thông tin bên trái */}
                              <Col flex="auto" style={{ color: '#FFFFFF' }}>
                                <strong style={{ fontSize: '16px' }}>{voucher.code}</strong><br />
                                <small>
                                  Đơn tối thiểu: <strong>{voucher.minOrderValue.toLocaleString()}₫</strong>
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
          </div>
        </div>
        <div className="product-description">
          <h3><u>Mô tả sản phẩm</u></h3>
          <p>{product.description}</p>
        </div>
      </div>
      <RelatedProducts />
    </>
  );
};

export default ProductDetail;