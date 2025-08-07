import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  Tabs,
  Rate,
  Typography,
  Avatar,
  Row,
  Col,
  Tag,
  Image,
  Divider,
  Button,
  message,
  Input,
} from 'antd';
import { LikeOutlined } from '@ant-design/icons';
const { TextArea } = Input;
const { Text } = Typography;
const { TabPane } = Tabs;

const ProductReview = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, ratingCounts: [0, 0, 0, 0, 0] });
  const [unreviewedProducts, setUnreviewedProducts] = useState<any[]>([]);
  const [variant, setVariant] = useState(null);

  useEffect(() => {
    fetchUnreviewedProducts();
  }, []);

  const fetchUnreviewedProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const orderRes = await axios.get('http://localhost:3000/api/orders/user', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const orders = orderRes.data;
      const deliveredOrders = orders.filter((order: any) => order.status === 'delivered');

      const deliveredOrderDetails = await Promise.all(
        deliveredOrders.map(async (order: any) => {
          const res = await axios.get(`http://localhost:3000/api/orders/${order._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log("✅ res.data:", res.data);
          return res.data;
        })
      );
      console.log("✅ productInfos:", deliveredOrderDetails);
      const productInfos: {
        orderId: string;
        orderItemId: string;
        productId: string;
        productName: string;
        variantId: string;
      }[] = [];

      deliveredOrderDetails.forEach((order) => {
        order.items.forEach((item: any) => {
          productInfos.push({
            orderId: order._id,
            orderItemId: item._id,
            productId: item.product_id?._id,
            productName: item.product_id?.name,
            variantId: item.variant_id?._id
          });
        });
      });



      const isReviewed = async (productId: string, orderItemId: string, token: string,) => {
        try {
          const reviewRes = await axios.get(`http://localhost:3000/api/reviews/${productId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const productReviews = reviewRes.data.reviews;
          return productReviews.some((r: any) => r.order_item === orderItemId);
        } catch (err) {
          console.error('Lỗi kiểm tra review:', err);
          return false;
        }
      };

      const unreviewedProductsMap = new Map();

      for (const info of productInfos) {
        const reviewed = await isReviewed(info.productId, info.orderItemId, token);
        if (!reviewed && !unreviewedProductsMap.has(info.orderItemId)) {
          unreviewedProductsMap.set(info.orderItemId, info);
        }
      }

      const unreviewedList = Array.from(unreviewedProductsMap.values());
      setUnreviewedProducts(unreviewedList);
    } catch (error) {
      console.error('Lỗi khi lấy sản phẩm chưa đánh giá:', error);
    }
  };


  const [variantDetails, setVariantDetails] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    const fetchVariants = async () => {
      const newVariantDetails: any = {};
      await Promise.all(
        unreviewedProducts.map(async (item) => {
          try {
            const res = await axios.get(`http://localhost:3000/api/variants/${item.variantId}`);
            // console.log(`🟢 Variant ${item.variantId}:`, res.data); 
            newVariantDetails[item.variantId] = res.data; // lưu theo variantId
            console.log(`🟢 newVariantDetails[item.variantId] :`, newVariantDetails[item.variantId]);
          } catch (error) {
            console.error(`Lỗi lấy variant ${item.variantId}:`, error);
          }
        })
      );
      setVariantDetails(newVariantDetails);
    };

    if (unreviewedProducts.length > 0) {
      fetchVariants();
    }
  }, [unreviewedProducts]);


  //
  const [reviewStates, setReviewStates] = useState<{ [key: string]: { rating: number; comment: string; loading: boolean } }>({});

  const handleReviewChange = (orderItemId: string, key: keyof (typeof reviewStates)[string], value: any) => {
    setReviewStates(prev => ({
      ...prev,
      [orderItemId]: {
        ...prev[orderItemId],
        [key]: value,
      },
    }));
  };

  const handleSubmitReview = async (item: any) => {
    const review = reviewStates[item.orderItemId];
    if (!review?.rating || !review?.comment) {
      return message.warning('Vui lòng nhập đầy đủ đánh giá và bình luận.');
    }

    try {
      setReviewStates(prev => ({ ...prev, [item.orderItemId]: { ...prev[item.orderItemId], loading: true } }));
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:3000/api/reviews',
        {
          product_id: item.productId,
          order_id: item.orderId,
          rating: review.rating,
          comment: review.comment,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      message.success('Đánh giá thành công!');
      // Optional: reload list or remove the item from list
          setTimeout(() => {
      window.location.reload();
    }, 3000); 
    } catch (err) {
      message.error('Gửi đánh giá thất bại!');
    } finally {
      setReviewStates(prev => ({ ...prev, [item.orderItemId]: { ...prev[item.orderItemId], loading: false } }));
    }
  };
  ///

  const renderStats = () => (
    <Row gutter={[16, 16]} justify="center">
      <Col>
        <Text strong>{stats.total}</Text>
        <br />Đánh giá
      </Col>
      <Col>
        <Text strong>0</Text>
        <br />Xu đã nhận
      </Col>
      <Col>
        <Text strong>0</Text>
        <br />Lượt thích
      </Col>
      <Col>
        <Text strong>0</Text>
        <br />Lượt xem
      </Col>
    </Row>
  );

  return (
    <div style={{ background: '#fff', padding: 16, borderRadius: 8 }}>
      {renderStats()}
      <Divider />
      <Tabs defaultActiveKey="1">
        <TabPane tab="Đã đánh giá" key="1">
          {reviews.length === 0 ? (
            <Text>Chưa có đánh giá nào.</Text>
          ) : (
            reviews.map((review: any, index: number) => (
              <Card key={index} style={{ marginBottom: 16 }}>
                <Row align="middle">
                  <Avatar size="large" src={review.user_id?.avatar || ''} />
                  <div style={{ marginLeft: 12 }}>
                    <strong style={{ fontSize: '18px' }}>
                      {review.user_id?.username || 'Ẩn danh'}
                    </strong>
                    <br />
                    <Rate value={review.rating} disabled />
                  </div>
                </Row>
                <div style={{ marginTop: 8 }}>
                  <Tag color="blue">
                    Phân loại: {review.variant_name || 'Không rõ'}
                  </Tag>
                  <Text type="secondary">
                    {new Date(review.createdAt).toLocaleString('vi-VN')}
                  </Text>
                </div>
                <div style={{ marginTop: 12 }}>
                  {review.image && <Image src={review.image} alt="review" width={80} />}
                  <p>{review.content}</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">
                    <LikeOutlined /> Hữu ích
                  </Text>
                  <Text type="secondary">Sửa</Text>
                </div>
              </Card>
            ))
          )}
        </TabPane>
        <TabPane tab="Chưa đánh giá" key="2">
          {unreviewedProducts.length === 0 ? (
            <Text>Không có sản phẩm nào chờ đánh giá.</Text>
          ) : (
            unreviewedProducts.map((item: any, index: number) => {
              const variant = variantDetails[item.variantId]?.data;
              const review = reviewStates[item.orderItemId] || {};
              return (
                <Card key={index} style={{ marginBottom: 16 }}>
                  {/* ẢNH SẢN PHẨM */}
                  {variant?.image_url?.[0] && (
                    <img
                      src={variant.image_url[0]}
                      alt="Ảnh sản phẩm"
                      style={{ width: 120, height: 120, objectFit: 'cover', marginBottom: 8 }}
                    />
                  )}

                  {/* THÔNG TIN ĐƠN & SẢN PHẨM */}
                  <Text strong>Mã đơn:
                    <Tag color="blue">
                    #{item.orderId?.slice(-6).toUpperCase()}
                  </Tag>
                  </Text>
                  <br />
                  {/* <Text>ID sản phẩm: {item.productId}</Text>
                  <br />
                  <Text>Sản phẩm: {item.productName}</Text>
                  <br />
                  <Text>Variant ID: {item.variantId}</Text>
                  <br />
                  <Text>OrderItem ID: {item.orderItemId}</Text>
                  <br /> */}

                  {/* THÔNG TIN BIẾN THỂ */}
                  <Text>
                    Thông tin sản phẩm:{' '}
                    {variant
                      ? `${variant.product_id?.name || ''} - Giá: ${variant.price?.toLocaleString('vi-VN')} đ`
                      : 'Đang tải...'}
                  </Text>
                  <br />

                  <Text>Đánh giá:</Text>
                  <br />
                  <Rate
                    value={review.rating}
                    onChange={(value) => handleReviewChange(item.orderItemId, 'rating', value)}
                  />
                  <TextArea
                    rows={3}
                    placeholder="Nhập nhận xét..."
                    value={review.comment}
                    onChange={(e) => handleReviewChange(item.orderItemId, 'comment', e.target.value)}
                    style={{ marginTop: 8 }}
                  />
                  <Button
                    type="primary"
                    loading={review.loading}
                    style={{ marginTop: 8 }}
                    onClick={() => handleSubmitReview(item)}
                  >
                    Gửi đánh giá
                  </Button>
                </Card>
              );
            })
          )}
        </TabPane>

      </Tabs>
    </div>
  );
};

export default ProductReview;
