import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Button, Spin, message, Descriptions, Rate, Progress } from 'antd';
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
import type { IVariant } from '../../interface/product';
import { useNavigate } from "react-router-dom";

const ProductDetail = () => {
  const { slug } = useParams();
  const token = localStorage.getItem("token")
  const [mainImage, setMainImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const location = useLocation();
  const variantIdFromState = location.state?.variantId || null;
  const { data: sizes = [] } = useSizes();
  const { data: colors = [] } = useColors();
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const { mutate: addToCartMutate, isPending } = useAddToCart();
  const { data: product, isLoading } = useProductBySlug(slug || '');
  const [inputQuantity, setInputQuantity] = useState('1');
  const [showDescription, setShowDescription] = useState(false);
  const [reviews, setReviews] = useState<IReview[]>([]);

  const navigate = useNavigate();

  const handleToggleDescription = () => setShowDescription(prev => !prev);

  const getColorInfo = (id: string) => {
    return colors.find((c: IColor) => c._id === id) || null;
  };

  const getSizeName = (id: string) => {
    const found = sizes.find((s: ISize) => s._id === id);
    return found ? found.size : id;
  };

  // Lấy tất cả color khả dụng dựa trên size
  const getAvailableColors = (size?: string) => {
    if (!product?.variants) return [];
    const variants = size
      ? product.variants.filter(v => Array.isArray(v.size) ? v.size.includes(size) : v.size === size)
      : product.variants;
    return [...new Set(variants.map(v => (typeof v.color === 'string' ? v.color : v.color._id)))];
  };

  // Lấy tất cả size khả dụng dựa trên color
  const getAvailableSizes = (color?: string) => {
    if (!product?.variants) return [];
    const variants = color
      ? product.variants.filter(v => (typeof v.color === 'string' ? v.color : v.color._id) === color)
      : product.variants;
    return [...new Set(variants.flatMap(v => Array.isArray(v.size) ? v.size : [v.size]))];
  };

  const handleSelectColor = (colorId: string) => {
    setSelectedColor(colorId);

    const availableSizesForColor = getAvailableSizes(colorId);
    if (!availableSizesForColor.includes(selectedSize || '')) {
      setSelectedSize(availableSizesForColor[0] || null);
    }

    setQuantity(1);
    setMainImageIndex(0);
  };

  const handleSelectSize = (size: string) => {
    setSelectedSize(size);

    const availableColorsForSize = getAvailableColors(size);
    if (!availableColorsForSize.includes(selectedColor || '')) {
      setSelectedColor(availableColorsForSize[0] || null);
    }

    setQuantity(1);
    setMainImageIndex(0);
  };

  const availableColors = getAvailableColors(selectedSize || undefined);
  const allVariantSizes = Array.isArray(product?.variants)
    ? [...new Set(product.variants.flatMap((v: any) => Array.isArray(v.size) ? v.size : [v.size]))]
    : [];

  useEffect(() => {
    if (!product) return;

    // Lấy variant mặc định: dùng variantIdFromState nếu có, nếu không lấy variant đầu tiên
    const defaultVariant =
      product.variants.find(v => v._id === variantIdFromState) ||
      product.variants[0];

    if (defaultVariant) {
      // Lấy colorId dạng string
      const colorId =
        typeof defaultVariant.color === 'string'
          ? defaultVariant.color
          : defaultVariant.color._id;

      // Lấy sizeId dạng string
      const sizeId =
        typeof defaultVariant.size === 'string'
          ? defaultVariant.size
          : defaultVariant.size._id;

      setSelectedColor(colorId || null);
      setSelectedSize(sizeId || null);
      setMainImage(Array.isArray(defaultVariant.image_url) ? defaultVariant.image_url[0] : '');
    }

    fetchProductReviews();
  }, [product, variantIdFromState]);

  const selectedVariant = product?.variants.find((variant: IVariant) => {
    const colorId = typeof variant.color === 'string' ? variant.color : variant.color._id;
    const sizeId = typeof variant.size === 'string' ? variant.size : variant.size._id;

    const matchColor = colorId === selectedColor;
    const matchSize = sizeId === selectedSize;

    return matchColor && matchSize;
  }) || null;

  const displayPrice = selectedVariant?.price;
  const imageList = selectedVariant?.image_url || [];
  const currentMainImage = imageList[mainImageIndex] || '';

  useEffect(() => {
    if (selectedVariant) {
      console.log("Số lượng đã bán:", selectedVariant.soldQuantity);
    }
  }, [selectedVariant]);

  const handleMainImageClick = () => {
    if (!imageList.length) return;
    setMainImageIndex((prevIndex) => (prevIndex + 1) % imageList.length);
  };

  const currentStock = selectedVariant?.stock?.quantity ?? 0;

  const handleIncrease = () => {
    const q = parseInt(inputQuantity, 10) || 0;
    if (q < currentStock) {
      setQuantity(q + 1);
      setInputQuantity((q + 1).toString());
    } else {
      message.warning(`Chỉ còn ${currentStock} sản phẩm trong kho`);
    }
  };

  const handleDecrease = () => {
    const q = parseInt(inputQuantity, 10) || 0;
    if (q > 1) {
      setQuantity(q - 1);
      setInputQuantity((q - 1).toString());
    }
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

  const avgRating = Number(
    (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
  );


  const handleBuyNow = () => {
    if (!selectedVariant || !selectedVariant._id) {
      message.warning("Vui lòng chọn phân loại sản phẩm!");
      return;
    }

    if (quantity > currentStock) {
      message.warning(`Chỉ còn ${currentStock} sản phẩm trong kho`);
      return;
    }

    navigate("/checkout", {
      state: {
        variant_id: selectedVariant._id,
        quantity,
        size: selectedSize,
      },
    });
  };

  if (isLoading) return <div style={{ textAlign: 'center', marginTop: 50 }}><Spin size="large" /></div>;
  if (!product) return <div>Không tìm thấy sản phẩm</div>;

  return (
    <>
      <Breadcrumb current={product.name ? `Sản phẩm / ${product.name}` : 'Sản phẩm'} />
      <div className="product-detail-container">
        {selectedVariant?.stock?.status && (
          <span
            style={{
              marginLeft: 1150,
              padding: '2px 6px',
              borderRadius: 4,
              fontSize: 12,
              fontWeight: 500,
              backgroundColor:
                selectedVariant.stock.status === 'inStock'
                  ? '#f6ffed'
                  : selectedVariant.stock.status === 'outOfStock'
                    ? '#fff1f0'
                    : '#fffbe6',
              color:
                selectedVariant.stock.status === 'inStock'
                  ? '#52c41a'
                  : selectedVariant.stock.status === 'outOfStock'
                    ? '#cf1322'
                    : '#d48806',
              border: '1px solid #d9d9d9',
            }}
          >
            {selectedVariant.stock.status === 'inStock'
              ? 'Còn hàng'
              : selectedVariant.stock.status === 'outOfStock'
                ? 'Hết hàng'
                : 'Tạm dừng'}
          </span>
        )}
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
                  <div style={{ marginBottom: 2 }}>
                    Giới tính:
                    <strong style={{ marginLeft: 4 }}>
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
                    if (!color) return null;

                    // Kiểm tra color này có size khả dụng không
                    const sizesForColor = getAvailableSizes(colorId);
                    const disabled = sizesForColor.length === 0;

                    return (
                      <button
                        key={colorId}
                        className={`color-btn ${selectedColor === colorId ? 'active' : ''}`}
                        onClick={() => !disabled && handleSelectColor(colorId)}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 4,
                          border: selectedColor === colorId ? '2px solid #1890ff' : '1px solid #ccc',
                          backgroundColor: color.code,
                          cursor: disabled ? 'not-allowed' : 'pointer',
                          marginRight: 8,
                          padding: 0,
                          outline: 'none',
                          opacity: disabled ? 0.4 : 1,
                        }}
                        title={color.name}
                        disabled={disabled}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Chọn size */}
            <div className="size-section">
              <span className="label">Chọn size:</span>
              <div className="size-options" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                {allVariantSizes.length > 0 ? (
                  allVariantSizes.map((sizeId) => {
                    // Kiểm tra size này có color khả dụng không
                    const colorsForSize = getAvailableColors(sizeId);
                    const disabled = colorsForSize.length === 0;

                    return (
                      <button
                        key={sizeId}
                        className={`size-btn ${selectedSize === sizeId ? 'active' : ''}`}
                        onClick={() => !disabled && handleSelectSize(sizeId)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 4,
                          border: selectedSize === sizeId ? '2px solid #1890ff' : '1px solid #ccc',
                          backgroundColor: '#fff',
                          cursor: disabled ? 'not-allowed' : 'pointer',
                          opacity: disabled ? 0.4 : 1,
                        }}
                        disabled={disabled}
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

            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <p
                style={{
                  margin: 0,
                  padding: "4px 8px",
                  border: "1px solid orange", 
                  borderRadius: 8,
                  color:
                    selectedVariant?.stock?.status === "outOfStock" ||
                      selectedVariant?.stock?.status === "paused" ||
                      currentStock === 0
                      ? "red"
                      : "#666",
                  fontWeight: 500,
                }}
              >
                {selectedVariant?.stock?.status === "paused"
                  ? "Sản phẩm đang tạm dừng bán"
                  : selectedVariant?.stock?.status === "outOfStock" || currentStock === 0
                    ? "Hết hàng"
                    : `Còn lại trong kho: ${currentStock} sản phẩm`}
              </p>

              {selectedVariant?.soldQuantity ? (
                <p
                  style={{
                    margin: 0,
                    padding: "4px 8px",
                    border: "1px solid orange",
                    borderRadius: 8,
                    color: "#666",
                    fontWeight: 500,
                  }}
                >
                  Đã bán: {selectedVariant.soldQuantity} sản phẩm
                </p>
              ) : null}
            </div>

            <div className="purchase-section">
              <div className="quantity-control">
                <Button
                  size="small"
                  icon={<MinusOutlined />}
                  onClick={handleDecrease}
                  disabled={
                    parseInt(inputQuantity, 10) <= 1 ||
                    selectedVariant?.stock?.status !== "inStock"
                  }
                />
                <input
                  value={inputQuantity}
                  onChange={(e) => setInputQuantity(e.target.value)}
                  onBlur={() => {
                    let val = parseInt(inputQuantity, 10);
                    if (isNaN(val) || val < 1) val = 1;
                    if (val > currentStock) val = currentStock;
                    setQuantity(val);
                    setInputQuantity(val.toString());
                  }}
                  disabled={selectedVariant?.stock?.status !== "inStock"}
                />
                <Button
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={handleIncrease}
                  disabled={selectedVariant?.stock?.status !== "inStock"}
                />
              </div>

              <Button
                type="default"
                className="add-cart"
                onClick={addToCart}
                disabled={
                  currentStock === 0 ||
                  selectedVariant?.stock?.status === "outOfStock" ||
                  selectedVariant?.stock?.status === "paused"
                }
              >
                {selectedVariant?.stock?.status === "paused"
                  ? "TẠM DỪNG BÁN"
                  : selectedVariant?.stock?.status === "outOfStock" || currentStock === 0
                    ? "HẾT HÀNG"
                    : "THÊM VÀO GIỎ"}
              </Button>
            </div>

            <div className="action-buttons">
              <Button
                type="primary"
                size="large"
                danger
                className="buy-now"
                onClick={handleBuyNow}
                disabled={
                  currentStock === 0 ||
                  selectedVariant?.stock?.status === "outOfStock" ||
                  selectedVariant?.stock?.status === "paused"
                }
                style={
                  currentStock === 0 ||
                    selectedVariant?.stock?.status === "outOfStock" ||
                    selectedVariant?.stock?.status === "paused"
                    ? { color: "#fff", border: "none", cursor: "not-allowed" }
                    : {}
                }
              >
                {selectedVariant?.stock?.status === "paused"
                  ? "TẠM DỪNG BÁN"
                  : selectedVariant?.stock?.status === "outOfStock" || currentStock === 0
                    ? "HẾT HÀNG"
                    : "MUA NGAY"}
              </Button>
            </div>

            <Button
              type="default"
              block
              className="dropdown-btn"
              onClick={handleToggleDescription}
            >
              <span>XEM MÔ TẢ SẢN PHẨM</span>
              {showDescription ? <UpOutlined /> : <DownOutlined />}
            </Button>

            {showDescription && (
              <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                {/* Mô tả chung của sản phẩm */}
                <p className="mb-4">{product?.description || "Không có mô tả sản phẩm"}</p>

                {/* Thông số riêng của biến thể */}
                {selectedVariant && (
                  <Descriptions bordered column={2} size="small">
                    <Descriptions.Item label="Chiều dài">
                      {selectedVariant.length ?? 0} cm
                    </Descriptions.Item>
                    <Descriptions.Item label="Chiều rộng">
                      {selectedVariant.width ?? 0} cm
                    </Descriptions.Item>
                    <Descriptions.Item label="Chiều cao">
                      {selectedVariant.height ?? 0} cm
                    </Descriptions.Item>
                    <Descriptions.Item label="Cân nặng">
                      {selectedVariant.weight ?? 0} g
                    </Descriptions.Item>
                  </Descriptions>
                )}
              </div>
            )}

          </div>
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
            marginTop: 40,
          }}
        >
          {/* Tổng điểm trung bình */}
          <div style={{ textAlign: 'center', minWidth: '150px' }}>
            <h1 style={{ fontSize: '48px', margin: '0 0 10px', color: '#1890ff' }}>
              {isNaN(avgRating) ? 0 : avgRating}
            </h1>
            <Rate allowHalf disabled value={isNaN(avgRating) ? 0 : Number(avgRating)} />
            <div style={{ marginTop: 8, color: '#555' }}>
              {totalReviews} đánh giá
            </div>
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
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: 16 }}>
            Đánh giá sản phẩm
          </h3>
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
                {/* Người dùng + rating */}
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

                {/* Bình luận của user */}
                <p style={{ margin: '4px 0 8px', color: '#444' }}>{review.comment}</p>

                {/* Ngày tạo */}
                <div style={{ fontSize: '12px', color: '#999', marginBottom: 8 }}>
                  {new Date(review.createdAt).toLocaleString('vi-VN')}
                </div>

                {/* Nếu có phản hồi admin thì hiển thị */}
                {review.admin_reply && (
                  <div
                    style={{
                      marginTop: '12px',
                      padding: '12px',
                      borderRadius: '6px',
                      backgroundColor: '#f6f9ff',
                      border: '1px solid #d6e4ff',
                    }}
                  >
                    <strong style={{ color: '#1d39c4' }}>Phản hồi từ Admin:</strong>
                    <p
                      style={{
                        margin: '4px 0 0',
                        color: '#333',
                        wordWrap: 'break-word',   //  tự động xuống dòng
                        whiteSpace: 'pre-wrap',   //  giữ format và xuống dòng
                      }}
                    >
                      {review.admin_reply}
                    </p>
                  </div>
                )}

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