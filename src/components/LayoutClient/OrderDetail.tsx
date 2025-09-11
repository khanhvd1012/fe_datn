import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Card,
    Descriptions,
    Table,
    Typography,
    Tag,
    Image,
    message,
    Spin,
    Button,
    Modal,
    Input,
} from 'antd';
import Breadcrumb from './Breadcrumb';

const { Title, Text } = Typography;

const statusColor: Record<string, string> = {
    pending: 'orange',
    processing: 'blue',
    shipped: 'purple',
    delivered: 'green',
    canceled: 'red',
    returned: 'gray',
};

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [variantMap, setVariantMap] = useState<Record<string, any>>({});
    const [colorMap, setColorMap] = useState<Record<string, any>>({});

    const handleCancel = () => {
        let cancelReason = "";

        Modal.confirm({
            title: "Xác nhận hủy đơn hàng",
            content: (
                <div>
                    <p>Vui lòng nhập lý do hủy:</p>
                    <Input
                        placeholder="Lý do hủy đơn"
                        onChange={(e) => (cancelReason = e.target.value)}
                    />
                </div>
            ),
            okText: "Xác nhận hủy",
            cancelText: "Thoát",
            onOk: async () => {
                if (!cancelReason.trim()) {
                    message.warning("Vui lòng nhập lý do hủy đơn");
                    return Promise.reject();
                }

                try {
                    const token = localStorage.getItem("token");

                    await axios.put(
                        `http://localhost:3000/api/orders/${order._id}/cancel`,
                        { cancel_reason: cancelReason },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                        }
                    );

                    message.success("Hủy đơn hàng thành công");
                    window.location.reload();
                } catch (error) {
                    console.error("Lỗi khi hủy đơn hàng:", error);
                    message.error("Hủy đơn hàng thất bại");
                }
            },
        });
    };

    const fetchOrder = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`http://localhost:3000/api/orders/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("Orders từ API:gtgt ", res.data);
            setOrder(res.data);
        } catch (err) {
            console.error("Lỗi khi lấy chi tiết đơn hàng:", err);
            message.error("Không thể tải chi tiết đơn hàng");
        } finally {
            setLoading(false);
        }
    };

    const fetchVariantDetails = async (items: any[]) => {
        const map: Record<string, any> = {};

        for (const item of items) {
            const variantId = item.variant_id?._id || item.variant_id;
            if (!variantId || map[variantId]) continue;

            try {
                const res = await axios.get(`http://localhost:3000/api/variants/${variantId}`);
                map[variantId] = res.data?.data;
                console.log(`Dữ liệu variant ${variantId}:`, map[variantId]);
            } catch (error) {
                console.error("Không lấy được thông tin biến thể:", variantId, error);
            }
        }


        setVariantMap(map);
    };

    useEffect(() => {
        fetchOrder();
    }, [id]);

    useEffect(() => {
        if (order?.items?.length) {
            fetchVariantDetails(order.items);
        }
    }, [order]);

    const parseShippingAddress = (address?: string | null) => {
        if (!address) return { name: '', phone: '', address: '' };
        const parts = address.split(" - ");
        return {
            name: parts[0] || '',
            phone: parts[1] || '',
            address: parts.slice(2).join(" - ") || '',
        };
    };

    const shipping = parseShippingAddress(order?.shipping_address);

    // công thức: tính shipping_fee
    const shippingFee = (order?.total_price || 0) - (order?.sub_total || 0) + (order?.voucher_discount || 0);
    const finalPrice = order?.sub_total - (order?.voucher_discount || 0);


    useEffect(() => {
        const fetchColors = async () => {
            const uniqueColorIds = Array.from(
                new Set(Object.values(variantMap).map((v: any) => v?.color).filter(Boolean))
            );

            const newColorMap: Record<string, any> = {};

            for (const colorId of uniqueColorIds) {
                if (colorMap[colorId]) continue;

                try {

                    const res = await axios.get(`http://localhost:3000/api/colors/${colorId}`);
                    newColorMap[colorId] = res.data;
                } catch (err) {
                    console.error("Không lấy được màu:", colorId, err);
                }
            }

            setColorMap(prev => ({ ...prev, ...newColorMap }));
        };

        if (Object.keys(variantMap).length) {
            fetchColors();
        }
    }, [variantMap]);



    const columns = [
        {
            title: 'Hình ảnh',
            render: (_: any, record: any) => {
                const variantId = record.variant_id?._id || record.variant_id;
                const variant = variantMap[variantId];
                const imageUrl = variant?.image_url?.[0];
                return (
                    <Image
                        width={60}
                        src={imageUrl || 'https://via.placeholder.com/60x60?text=No+Image'}
                        alt="product"
                        preview={false}
                    />
                );
            },
        },
        {
            title: 'Sản phẩm',
            render: (_: any, record: any) => (
                <Text>{record.product_id?.name || 'Không rõ'}</Text>
            ),
        },
        {
            title: 'Size',
            render: (_: any, record: any) => {
                const variantId = record.variant_id?._id || record.variant_id;
                const variant = variantMap[variantId];
                return <>{variant?.size?.size || 'Không rõ'}</>;
            },
        },
        {
            title: 'Màu sắc',
            render: (_: any, record: any) => {
                const variantId = record.variant_id?._id || record.variant_id;
                const variant = variantMap[variantId];
                const colorId = variant?.color;
                const color = colorMap[colorId];

                if (!color) return <span>Không rõ</span>;

                return (
                    <div className="flex items-center gap-2">
                        <span
                            style={{
                                width: 16,
                                height: 16,
                                display: 'inline-block',
                                backgroundColor: color?.color.code || '#ccc',
                                border: '1px solid #ccc',
                                borderRadius: 4
                            }}
                        ></span>
                        <span>{color?.colorname}</span>
                    </div>
                );
            }
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
        },
        {
            title: 'Giá',
            render: (_: any, record: any) => (
                <>{(record.price || 0).toLocaleString('vi-VN')}đ</>
            )
        },
        {
            title: 'Mã giảm giá',

            render: (_: any, record: any) => (
                console.log("record:", record),
                <>

                    {order.voucher_discount > 0 ? (
                        <span className="text-red-600">
                            -{order.voucher_discount.toLocaleString("vi-VN")}đ
                        </span>
                    ) : (
                        <span>0đ</span>
                    )}
                </>
            )
        }

    ];

    if (loading) return <Spin size="large" className="mt-20 block mx-auto" />;
    if (!order) return <Text>Không tìm thấy đơn hàng</Text>;

    return (
        <div className="max-w-5xl mx-auto p-6">
            <Breadcrumb current="Chi tiết đơn hàng" />
            <Title level={3} className="mb-4">
                Đơn hàng #{order._id?.slice(-6).toUpperCase()}
            </Title>

            <Card bordered>
                <Descriptions column={1} bordered>
                    <Descriptions.Item label="Ngày đặt">
                        {new Date(order.createdAt).toLocaleString('vi-VN')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                        <Tag color={statusColor[order.status] || 'default'}>
                            {order.status === 'pending' && 'Chờ xác nhận'}
                            {order.status === 'processing' && 'Đã xác nhận'}
                            {order.status === 'shipped' && 'Đang giao'}
                            {order.status === 'delivered' && 'Đã giao'}
                            {order.status === 'canceled' && 'Đã hủy'}
                            {order.status === 'returned' && 'Đã trả hàng'}
                        </Tag>
                    </Descriptions.Item>

                    <Descriptions.Item label="Người nhận">
                        {shipping.name}
                    </Descriptions.Item>

                    <Descriptions.Item label="Số điện thoại">
                        {shipping.phone}
                    </Descriptions.Item>

                    <Descriptions.Item label="Địa chỉ giao hàng">
                        {shipping.address}
                    </Descriptions.Item>


                    <Descriptions.Item label="Phương thức thanh toán">
                        {order.payment_method === 'cod'
                            ? 'Thanh toán khi nhận hàng'
                            : order.payment_method === 'zalopay'
                                ? 'Chuyển khoản'
                                : 'Zalopay'}
                    </Descriptions.Item>
                </Descriptions>

                <Table
                    className="mt-6"
                    columns={columns}
                    dataSource={order.items}
                    rowKey={(r) => r._id}
                    pagination={false}
                />

                <div className="flex justify-between mt-4">
                    <Text strong>Giá sau khi giảm:</Text>
                    <Text>{finalPrice.toLocaleString("vi-VN")}đ</Text>
                </div>
                <div className="flex justify-between mt-4">
                    <Text strong>Phí vận chuyển:</Text>
                    <Text>{shippingFee.toLocaleString("vi-VN")}đ</Text>
                </div>

                <div className="flex justify-between mt-6">
                    <Text strong className="text-lg">Tổng thanh toán:</Text>
                    <Text strong className="text-lg text-green-600">
                        {(order.total_price || 0).toLocaleString('vi-VN')}đ
                    </Text>
                </div>

                <div className="mt-6 flex justify-between">
                    <Button onClick={() => navigate('/order-history')}>
                        ⬅ Quay lại danh sách
                    </Button>

                    {order.status === 'pending' && (
                        <Button danger onClick={handleCancel}>
                            Hủy đơn hàng
                        </Button>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default OrderDetail;