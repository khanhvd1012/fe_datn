import { useQueryClient } from "@tanstack/react-query";
import { Button, Empty, message, Popconfirm, Skeleton, Table, Tag } from "antd";
import { Link } from "react-router-dom";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { useDeleteVoucher, useVouchers } from "../../../hooks/useVouchers";
import type { IVoucher } from "../../../interface/voucher";
import { useState } from "react";
import DrawerVoucher from "../../../components/drawer/DrawerVoucher";

const Vouchers = () => {
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState<IVoucher | null>(null);
    const [drawerLoading, setDrawerLoading] = useState(false);
    const { mutate } = useDeleteVoucher();
    const { data, isLoading } = useVouchers();

    const handleDelete = (id: string) => {
        mutate(id, {
            onSuccess: () => {
                messageApi.success("Xóa voucher thành công");
                queryClient.invalidateQueries({ queryKey: ["vouchers"] });
            },
            onError: () => {
                messageApi.error("Xóa voucher thất bại");
            },
        });
    };

    const showVoucherDetails = (voucher: IVoucher) => {
        setDrawerLoading(true);
        setSelectedVoucher(voucher);
        setIsDrawerVisible(true);
        setTimeout(() => {
            setDrawerLoading(false);
        }, 500);
    };

    if (isLoading) return <Skeleton active />;
    if (!data || !Array.isArray(data)) return <Empty />;

    const columns = [
        {
            title: "Mã voucher",
            dataIndex: "code",
            key: "code",
            render: (text: string) => <Tag color="blue">{text}</Tag>,
        },
        {
            title: "Loại",
            dataIndex: "type",
            key: "type",
            render: (type: IVoucher["type"]) =>
                type === "percentage" ? "Phần trăm" : "Giảm cố định",
        },
        {
            title: "Giá trị",
            dataIndex: "value",
            key: "value",
            render: (value: number, record: IVoucher) =>
                record.type === "percentage"
                    ? `${value}%`
                    : value.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                    }),
        },
        {
            title: "Giảm tối đa",
            dataIndex: "maxDiscount",
            key: "maxDiscount",
            render: (max: number | null) =>
                max !== null
                    ? max.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                    })
                    : "Không giới hạn",
        },
        {
            title: "Đơn tối thiểu",
            dataIndex: "minOrderValue",
            key: "minOrderValue",
            render: (min: number) =>
                min.toLocaleString("en-US", { style: "currency", currency: "USD" }),
        },
        {
            title: "Thời gian",
            key: "duration",
            render: (_: any, record: IVoucher) =>
                `${new Date(record.startDate).toLocaleDateString()} - ${new Date(
                    record.endDate
                ).toLocaleDateString()}`,
        },
        {
            title: "Số lượng",
            dataIndex: "quantity",
            key: "quantity",
        },
        {
            title: "Đã dùng",
            dataIndex: "usedCount",
            key: "usedCount",
        },
        {
            title: "Trạng thái",
            dataIndex: "isActive",
            key: "isActive",
            render: (isActive: boolean) =>
                isActive ? (
                    <Tag color="green">Đang hoạt động</Tag>
                ) : (
                    <Tag color="red">Không hoạt động</Tag>
                ),
        },
        {
            title: "Thao tác",
            key: "actions",
            render: (_: any, record: IVoucher) => (
                <div style={{ display: "flex", gap: "8px" }}>
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        onClick={() => showVoucherDetails(record)}
                    />
                    <Link to={`/admin/vouchers/edit/${record._id}`}>
                        <Button type="default" icon={<EditOutlined />} />
                    </Link>
                    <Popconfirm
                        title="Xóa voucher"
                        description="Bạn có chắc chắn muốn xóa voucher này?"
                        onConfirm={() => handleDelete(record._id!)}
                        okText="Đồng ý"
                        cancelText="Hủy"
                    >
                        <Button type="primary" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div>
            {contextHolder}
            <div style={{ marginBottom: 16 }}>
                <Link to="/admin/vouchers/create">
                    <Button type="primary">Thêm voucher</Button>
                </Link>
            </div>
            <Table
                columns={columns}
                dataSource={data}
                rowKey="_id"
                pagination={{
                    total: data.length,
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `Tổng ${total} voucher`,
                }}
            />

            <DrawerVoucher
                visible={isDrawerVisible}
                voucher={selectedVoucher}
                loading={drawerLoading}
                onClose={() => {
                    setIsDrawerVisible(false);
                    setSelectedVoucher(null);
                }}
            />

        </div>
    );
};

export default Vouchers;
