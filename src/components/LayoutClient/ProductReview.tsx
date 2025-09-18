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
  Upload,
} from 'antd';
import { LikeOutlined, UploadOutlined } from '@ant-design/icons';

import type { UploadFile } from "antd";


const { Paragraph, Text } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

const ProductReview = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, ratingCounts: [0, 0, 0, 0, 0] });
  const [unreviewedProducts, setUnreviewedProducts] = useState<any[]>([]);
  const [variant, setVariant] = useState(null);

  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ rating: number; comment: string }>({ rating: 0, comment: "" });

  const [imageFiles, setImageFiles] = useState<Record<string, File[]>>({});


  useEffect(() => {
    fetchUnreviewedProducts();
    fetchUserReviews();
  }, []);

  const handleImageChange = (orderItemId: string, fileList: UploadFile<any>[]) => {
    const files = fileList
      .map((file) => file.originFileObj)
      .filter(Boolean) as File[];

    setImageFiles((prev) => ({
      ...prev,
      [orderItemId]: files,
    }));
  };

  const handleEditStart = (review: any) => {
    setEditingReviewId(review._id);
    setEditForm({
      rating: review.rating,
      comment: review.comment,
      oldImages: review.images || [], // 👈 gán ảnh cũ vào state
      newImages: [],
    });
  };


  const handleEditSubmit = async (reviewId: string) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("rating", editForm.rating.toString());
      formData.append("comment", editForm.comment);

      // gửi lại danh sách ảnh cũ còn giữ
      editForm.oldImages.forEach((url) => {
        formData.append("existingImages", url);
      });

      // Gửi ảnh mới
      editForm.newImages.forEach((file: File) => {
        formData.append("images", file);
      });

      await axios.put(
        `http://localhost:3000/api/reviews/${reviewId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      message.success("Cập nhật đánh giá thành công!");
      setEditingReviewId(null);
      fetchUserReviews(); // reload danh sách
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      message.error("Cập nhật thất bại!");
    }
  };



  const handleDeleteReview = async (reviewId: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      message.success("Xóa đánh giá thành công!");
      fetchUserReviews();
    } catch (err) {
      message.error("Xóa đánh giá thất bại!");
    }
  };



  const fetchUserReviews = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get("http://localhost:3000/api/reviews/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("🟢 My reviews:", res.data);
      const reviews = res.data.reviews || [];

      // Promise.all để gọi API variants song song
      const enrichedReviews = await Promise.all(
        reviews.map(async (review: any) => {
          if (review.order_item.variant_id?._id) {
            try {
              const variantRes = await axios.get(
                `http://localhost:3000/api/variants/${review.order_item.variant_id._id}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              let colorDetail = null;

              if (review.order_item.variant_id?.color) {
                const colorRes = await axios.get(
                  `http://localhost:3000/api/colors/${review.order_item.variant_id?.color}`,
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                colorDetail = colorRes.data;
              }
              return {
                ...review,
                variantDetail: variantRes.data, // gắn dữ liệu variant vào
                colorDetail,
              };
            } catch (err) {
              console.error("Lỗi lấy variant:", err);
              return review;
            }
          }
          return review;
        })
      );
      console.log("🟢 Enriched Reviews:", enrichedReviews);
      setReviews(enrichedReviews);
    } catch (err) {
      console.error("Lỗi khi lấy đánh giá:", err);
    }
  };


  // const fetchUnreviewedProducts = async () => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     if (!token) return;

  //     const orderRes = await axios.get('http://localhost:3000/api/orders/user', {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //     const orders = orderRes.data;
  //     console.log("🟢 Orders user:", orders);
  //     const deliveredOrders = orders.filter((order: any) => order.status === 'delivered');

  //     const deliveredOrderDetails = await Promise.all(
  //       deliveredOrders.map(async (order: any) => {
  //         const res = await axios.get(`http://localhost:3000/api/orders/${order._id}`, {
  //           headers: { Authorization: `Bearer ${token}` },
  //         });
  //         return res.data;
  //       })
  //     );
  //     const productInfos: {
  //       orderId: string;
  //       orderItemId: string;
  //       product_id: string;
  //       productName: string;
  //       variantId: string;
  //     }[] = [];

  //     deliveredOrderDetails.forEach((order) => {
  //       order.items.forEach((item: any) => {
  //         productInfos.push({
  //           orderId: order._id,
  //           orderItemId: item._id,
  //           product_id: item.product_id?._id,
  //           productName: item.product_id?.name,
  //           variantId: item.variant_id?._id
  //         });
  //       });
  //     });



  //     const isReviewed = async (product_id: string, orderItemId: string, token: string,) => {
  //       try {
  //         const reviewRes = await axios.get(`http://localhost:3000/api/reviews/${product_id}`, {
  //           headers: { Authorization: `Bearer ${token}` },
  //         });

  //         const productReviews = reviewRes.data.reviews;
  //         return productReviews.some((r: any) => r.order_item === orderItemId);
  //       } catch (err) {
  //         console.error('Lỗi kiểm tra review:', err);
  //         return false;
  //       }
  //     };

  //     const unreviewedProductsMap = new Map();

  //     for (const info of productInfos) {
  //       const reviewed = await isReviewed(info.product_id, info.orderItemId, token);
  //       if (!reviewed && !unreviewedProductsMap.has(info.orderItemId)) {
  //         unreviewedProductsMap.set(info.orderItemId, info);
  //       }
  //     }

  //     const unreviewedList = Array.from(unreviewedProductsMap.values());
  //     setUnreviewedProducts(unreviewedList);
  //   } catch (error) {
  //     console.error('Lỗi khi lấy sản phẩm chưa đánh giá:', error);
  //   }
  // };

  const fetchUnreviewedProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const orderRes = await axios.get('http://localhost:3000/api/orders/user', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const orders = orderRes.data;
      // console.log("🟢 Orders user:", orders);

      const deliveredOrders = orders.filter((order: any) => order.status === 'delivered');

      const productInfos: {
        orderId: string;
        orderItemId: string;
        product_id: string;
        productName: string;
        product_variant_id: string;
      }[] = [];

      deliveredOrders.forEach((order: any) => {
        order.items.forEach((item: any) => {
          const info = {
            orderId: order._id,
            orderItemId: item._id,
            product_id: item.product_id,        // đây đã là string
            productName: item.variant_id.product_id.name,
            product_variant_id: item.variant_id?._id // đây cũng là string
          };

          console.log("🟢 Product info:", info);  // log từng sản phẩm

          productInfos.push(info);

        });
      });

      const isReviewed = async (product_id: string, orderItemId: string, token: string) => {
        try {
          const reviewRes = await axios.get(`http://localhost:3000/api/reviews/${product_id}`, {
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
        const reviewed = await isReviewed(info.product_id, info.orderItemId, token);
        if (!reviewed && !unreviewedProductsMap.has(info.orderItemId)) {
          unreviewedProductsMap.set(info.orderItemId, info);
        }
      }

      const unreviewedList = Array.from(unreviewedProductsMap.values());
      // console.log("🟢 Danh sách sản phẩm chưa đánh giá:", unreviewedList);
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
            const res = await axios.get(`http://localhost:3000/api/variants/${item.product_variant_id}`);
            // console.log(`🟢 Variant ${item.variantId}:`, res.data); 
            newVariantDetails[item.product_variant_id] = res.data; // lưu theo variantId
            console.log(`🟢 newVariantDetails[item.product_variant_id] :`, newVariantDetails[item.product_variant_id]);
          } catch (error) {
            console.error(`Lỗi lấy variant ${item.product_variant_id}:`, error);
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

  // const handleSubmitReview = async (item: any) => {
  //   const review = reviewStates[item.orderItemId];
  //   if (!review?.rating || !review?.comment) {
  //     return message.warning('Vui lòng nhập đầy đủ đánh giá và bình luận.');
  //   }

  //   try {
  //     setReviewStates(prev => ({ ...prev, [item.orderItemId]: { ...prev[item.orderItemId], loading: true } }));
  //     const token = localStorage.getItem('token');
  //     await axios.post(
  //       'http://localhost:3000/api/reviews',
  //       {
  //         product_id: item.product_id,          // backend yêu cầu
  //         product_variant_id: item.product_variant_id, // backend yêu cầu
  //         order_id: item.orderId,
  //         rating: review.rating,
  //         comment: review.comment,
  //       },
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     message.success('Đánh giá thành công!');
  //     // Optional: reload list or remove the item from list
  //     setTimeout(() => {
  //       window.location.reload();
  //     }, 3000);
  //   } catch (err) {
  //     message.error('Gửi đánh giá thất bại!');
  //   } finally {
  //     setReviewStates(prev => ({ ...prev, [item.orderItemId]: { ...prev[item.orderItemId], loading: false } }));
  //   }
  // };

  const handleSubmitReview = async (item: any) => {
    const review = reviewStates[item.orderItemId];
    if (!review?.rating || !review?.comment) {
      return message.warning('Vui lòng nhập đầy đủ đánh giá và bình luận.');
    }

    try {
      setReviewStates(prev => ({
        ...prev,
        [item.orderItemId]: { ...prev[item.orderItemId], loading: true }
      }));

      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append("product_id", item.product_id);
      formData.append("product_variant_id", item.product_variant_id);
      formData.append("order_id", item.orderId);
      formData.append("rating", review.rating.toString());
      formData.append("comment", review.comment);

      // thêm ảnh
      if (imageFiles[item.orderItemId]) {
        imageFiles[item.orderItemId].forEach((file) => {
          formData.append("images", file); // backend req.files.images
        });
      }

      console.log(
        "Ảnh gửi đi:",
        imageFiles[item.orderItemId].length,
        imageFiles[item.orderItemId].map((f) => f.name)
      );

      await axios.post(
        'http://localhost:3000/api/reviews',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      message.success('Đánh giá thành công!');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      message.error('Gửi đánh giá thất bại!');
    } finally {
      setReviewStates(prev => ({ ...prev, [item.orderItemId]: { ...prev[item.orderItemId], loading: false } }));
    }
  };

  ///

  // const renderStats = () => (
  //   <Row gutter={[16, 16]} justify="center">
  //     <Col>
  //       <Text strong>{stats.total}</Text>
  //       <br />Đánh giá
  //     </Col>
  //     <Col>
  //       <Text strong>0</Text>
  //       <br />Xu đã nhận
  //     </Col>
  //     <Col>
  //       <Text strong>0</Text>
  //       <br />Lượt thích
  //     </Col>
  //     <Col>
  //       <Text strong>0</Text>
  //       <br />Lượt xem
  //     </Col>
  //   </Row>
  // );

  return (
    <div style={{ background: '#fff', padding: 16, borderRadius: 8 }}>
      {/* {renderStats()} */}
      <Divider />
      <Tabs defaultActiveKey="1">

        <TabPane tab="Đã đánh giá" key="1">
          {reviews.length === 0 ? (
            <Text>Chưa có đánh giá nào.</Text>
          ) : (
            reviews.map((review: any, index: number) => (
              <Card key={index} style={{ marginBottom: 16 }}>
                <Row gutter={16} align="middle">
                  <Col>
                    {review.variantDetail?.data?.image_url?.[0] && (
                      <img
                        src={review.variantDetail.data.image_url[0]}
                        alt="Ảnh sản phẩm"
                        style={{ width: 120, height: 120, objectFit: 'cover', marginBottom: 8 }}
                      />
                    )}
                  </Col>
                  <Col flex="auto">

                    <div>
                      <strong style={{ fontSize: "16px" }}>
                        {review.product_id?.name}
                      </strong>
                      <br />

                      <div style={{ marginTop: 8 }}>
                        <Tag color="blue">
                          Màu: {review.colorDetail?.color?.name || "Không rõ"}
                        </Tag>
                        <Tag color="green">
                          Size: {review.order_item.variant_id?.size?.size || "?"}
                        </Tag>
                        <Tag color="orange">Giá: {review.order_item?.price}₫</Tag>
                      </div>


                      <br />
                      {editingReviewId === review._id ? (
                        <>
                          <Rate
                            value={editForm.rating}
                            onChange={(value) => setEditForm({ ...editForm, rating: value })}
                          />
                          <TextArea
                            rows={3}
                            value={editForm.comment}
                            onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                            style={{ marginTop: 8 }}
                          />

                          {/* Ảnh cũ */}
                          {editForm.oldImages && editForm.oldImages.length > 0 && (
                            <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
                              {editForm.oldImages.map((img: string, idx: number) => (
                                <div
                                  key={idx}
                                  style={{
                                    position: "relative",
                                    width: 90,
                                    height: 90,
                                    borderRadius: 8,
                                    overflow: "hidden",
                                    border: "1px solid #e0e0e0",
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                                  }}
                                >
                                  <img
                                    src={img}
                                    alt={`Ảnh cũ ${idx + 1}`}
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                    }}
                                  />
                                  <button
                                    onClick={() => {
                                      const updated = editForm.oldImages.filter((_, i) => i !== idx);
                                      setEditForm({ ...editForm, oldImages: updated });
                                    }}
                                    style={{
                                      position: "absolute",
                                      top: 4,
                                      right: 4,
                                      background: "rgba(0,0,0,0.6)",
                                      color: "#fff",
                                      border: "none",
                                      borderRadius: "50%",
                                      width: 20,
                                      height: 20,
                                      cursor: "pointer",
                                    }}
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Chọn ảnh mới */}
                          <div style={{ marginTop: 12 }}>
                            <label
                              style={{
                                display: "inline-block",
                                padding: "6px 12px",
                                background: "#1677ff",
                                color: "#fff",
                                borderRadius: 6,
                                cursor: "pointer",
                              }}
                            >
                              Thêm ảnh mới
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                style={{ display: "none" }}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    newImages: [
                                      ...(editForm.newImages || []),
                                      ...Array.from(e.target.files || []),
                                    ],
                                  })
                                }
                              />
                            </label>
                          </div>

                          {/* Preview ảnh mới */}
                          {editForm.newImages && editForm.newImages.length > 0 && (
                            <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
                              {editForm.newImages.map((file: File, idx: number) => (
                                <div
                                  key={idx}
                                  style={{
                                    position: "relative",
                                    width: 90,
                                    height: 90,
                                    borderRadius: 8,
                                    overflow: "hidden",
                                    border: "1px solid #e0e0e0",
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                                  }}
                                >
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt={`Ảnh mới ${idx + 1}`}
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                    }}
                                  />
                                  <button
                                    onClick={() => {
                                      const updated = editForm.newImages.filter((_, i) => i !== idx);
                                      setEditForm({ ...editForm, newImages: updated });
                                    }}
                                    style={{
                                      position: "absolute",
                                      top: 4,
                                      right: 4,
                                      background: "rgba(0,0,0,0.6)",
                                      color: "#fff",
                                      border: "none",
                                      borderRadius: "50%",
                                      width: 20,
                                      height: 20,
                                      cursor: "pointer",
                                    }}
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          <div style={{ marginTop: 8 }}>
                            <Button
                              type="primary"
                              onClick={() => handleEditSubmit(review._id)}
                              style={{ marginRight: 8 }}
                            >
                              Lưu
                            </Button>
                            <Button onClick={() => setEditingReviewId(null)}>Hủy</Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <Rate value={review.rating} disabled />
                          <p style={{ marginTop: 4 }}>{review.comment}</p>
                          {review.images && review.images.length > 0 && (
                            <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap" }}>
                              {review.images.map((img: string, idx: number) => (
                                <img
                                  key={idx}
                                  src={img}
                                  alt={`Ảnh đánh giá ${idx + 1}`}
                                  style={{
                                    width: 80,
                                    height: 80,
                                    objectFit: "cover",
                                    marginRight: 8,
                                    marginTop: 8,
                                    borderRadius: 6,
                                    border: "1px solid #f0f0f0",
                                  }}
                                />
                              ))}
                            </div>
                          )}

                          <Text type="secondary">
                            {new Date(review.createdAt).toLocaleString("vi-VN")}
                          </Text>

                          <div style={{ marginTop: 8 }}>
                            <Button
                              type="link"
                              onClick={() => handleEditStart(review)}
                              style={{ padding: 0, marginRight: 12 }}
                            >
                              Sửa
                            </Button>
                            <Button
                              type="link"
                              danger
                              onClick={() => handleDeleteReview(review._id)}
                              style={{ padding: 0 }}
                            >
                              Xóa
                            </Button>
                          </div>
                        </>
                      )}

                    </div>


                  </Col>
                </Row>

                {review.admin_reply && (
                  <div
                    style={{
                      marginTop: 12,
                      background: "#fafafa",
                      padding: 8,
                      borderRadius: 6,
                      whiteSpace: "pre-wrap",
                      overflowWrap: "anywhere",
                      wordBreak: "break-word",
                    }}
                  >
                    <Text type="secondary">Phản hồi từ shop:</Text>
                    <p style={{ margin: 0 }}>{review.admin_reply}</p>
                  </div>
                )}
              </Card>

            ))
          )}
        </TabPane>

        <TabPane tab="Chưa đánh giá" key="2">
          {unreviewedProducts.length === 0 ? (
            <Text>Không có sản phẩm nào chờ đánh giá.</Text>
          ) : (
            unreviewedProducts.map((item: any, index: number) => {
              const variant = variantDetails[item.product_variant_id]?.data;
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
                  <br />
                  <Upload
                    multiple
                    listType="picture-card"
                    accept="image/*"
                    beforeUpload={() => false} // để không auto upload
                    onChange={({ fileList }) => handleImageChange(item.orderItemId, fileList)}
                    showUploadList={{
                      showPreviewIcon: false, 
                      showRemoveIcon: true,   
                    }}
                  >
                    <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                  </Upload>

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
    </div >
  );
};

export default ProductReview;