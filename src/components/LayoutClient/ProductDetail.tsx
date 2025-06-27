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
  const { id } = useParams();
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
    axios.get(`http://localhost:8080/api/products/${id}`)
      .then(res => {
        const data = res.data.data;
        console.log('Product data:', data); // Thêm dòng này để kiểm tra dữ liệu

        // Đảm bảo dữ liệu có đầy đủ mảng
        const fixedData: IProduct = {
          ...data,
          images: Array.isArray(data.images) ? data.images : [],
          size: Array.isArray(data.size) ? data.size : [],
        };

        setProduct(fixedData);
        setMainImage(fixedData.images?.[0] || '');
        // Nếu size là mảng object {_id, name} thì lấy _id, nếu là string thì lấy luôn
        const firstSize = fixedData.size?.[0];
        setSelectedSize(typeof firstSize === 'object' ? firstSize._id : firstSize || null);
        setLoading(false);
      })
      .catch(err => {
        message.error('Không thể tải chi tiết sản phẩm');
        setLoading(false);
      });
  }, [id]);

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
                  // Nếu variant có ảnh thì ưu tiên ảnh variant, nếu không thì lấy ảnh sản phẩm
                  (selectedVariant?.image_url && selectedVariant.image_url[0])
                    ? selectedVariant.image_url[0]
                    : mainImage
                }
                alt={product.name}
              />
            </div>
          </div>

          <div className="product-info">
            <h2>{product.name}</h2>
            {brandName && <div className="text-gray-500 text-sm mb-1">Thương hiệu: {brandName}</div>}
            
            <p className="price">
              {typeof displayPrice === 'number'
                ? displayPrice.toLocaleString('vi-VN') + '$'
                : 'Đang cập nhật giá'}
            </p>

            <div className="size-section">
              {Array.isArray(product.size) && product.size.length > 0 ? (
                product.size.map((sizeObj: any) => {
                  // Nếu là object {_id, name}, lấy _id, nếu là string thì lấy luôn
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

            <div className="quantity-control">
              <Button icon={<MinusOutlined />} onClick={() => setQuantity(Math.max(1, quantity - 1))} />
              <span>{quantity}</span>
              <Button icon={<PlusOutlined />} onClick={() => setQuantity(quantity + 1)} />
            </div>

            <div className="action-buttons">
              <Button
                type="default"
                size="large"
                className="add-cart"
                onClick={addToCart}
              >
                THÊM VÀO
              </Button>
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

          .product_images {
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
    </>
  );
};

export default ProductDetail;