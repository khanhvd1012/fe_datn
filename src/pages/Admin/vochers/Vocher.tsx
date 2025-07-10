import { useQueryClient } from "@tanstack/react-query";
import { Button, Empty, Input, message, Popconfirm, Select, Skeleton, Table, Tag } from "antd";
import { Link } from "react-router-dom";
import { DeleteOutlined, EditOutlined, EyeOutlined, FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { useDeleteVoucher, useVouchers } from "../../../hooks/useVouchers";
import type { IVoucher } from "../../../interface/voucher";
import { useState } from "react";
import DrawerVoucher from "../../../components/LayoutAdmin/drawer/DrawerVoucher";

const Vouchers = () => {
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState<IVoucher | null>(null);
    const [drawerLoading, setDrawerLoading] = useState(false);
    const { mutate } = useDeleteVoucher();
    const { data: voucher, isLoading } = useVouchers();
    const [filters, setFilters] = useState({
        code: '',
        type: '',
        value: '',
        maxDiscount: '',
        minOrderValue: '',
        quantity: '',
        isActive: '',
    });

    const normalizeText = (value: any) =>
        typeof value === 'string'
            ? value.toLowerCase()
            : value?.name?.toLowerCase?.() || '';

    const filteredData = voucher?.filter((stocks_history: IVoucher) => {
        if (
            filters.code &&
            !normalizeText(stocks_history.code).includes(filters.code.toLowerCase())
        ) {
            return false;
        }
        if (
            filters.type &&
            stocks_history.type?.toLowerCase() !== filters.type.toLowerCase()
        ) {
            return false;
        }
        if (
            filters.maxDiscount &&
            String(stocks_history.maxDiscount).toLowerCase().indexOf(filters.maxDiscount.toLowerCase()) === -1
        ) {
            return false;
        }
        if (
            filters.minOrderValue &&
            String(stocks_history.minOrderValue).toLowerCase().indexOf(filters.minOrderValue.toLowerCase()) === -1
        ) {
            return false;
        }
        if (
            filters.quantity &&
            String(stocks_history.quantity).toLowerCase().indexOf(filters.quantity.toLowerCase()) === -1
        ) {
            return false;
        }
        if (filters.isActive !== '') {
            const isActiveBool = filters.isActive === 'true';
            if (stocks_history.isActive !== isActiveBool) return false;
        }

        return true;
    });

    const handleFilterChange = (value: string | number, type: string) => {
        setFilters(prev => ({
            ...prev,
            [type]: value
        }));
    };

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
    if (!voucher || !Array.isArray(voucher)) return <Empty />;

    const columns = [
        {
            title: "Mã voucher",
            dataIndex: "code",
            key: "code",
            filterDropdown: () => (
                <div style={{ padding: 8, backgroundColor: 'white', borderRadius: 6 }}>
                    <Input
                        placeholder="Tìm theo mã voucher"
                        value={filters.code}
                        onChange={(e) => handleFilterChange(e.target.value, 'code')}
                        prefix={<SearchOutlined />}
                        allowClear
                    />
                </div>
            ),
            filterIcon: () => <FilterOutlined style={{ color: filters.code ? '#1890ff' : undefined }} />,
            render: (text: string) => <Tag color="blue">{text}</Tag>,
        },
        {
            title: "Loại",
            dataIndex: "type",
            key: "type",
            filterDropdown: () => (
                <div style={{ padding: 8, backgroundColor: 'white', borderRadius: 6 }}>
                    <Select
                        style={{ width: '200px' }}
                        placeholder="Chọn loại voucher"
                        allowClear
                        value={filters.type}
                        onChange={(value) => handleFilterChange(value || '', 'type')}
                    >
                        <Select.Option value="percentage">Phần trăm</Select.Option>
                        <Select.Option value="fixed">Giảm cố định</Select.Option>
                    </Select>
                </div>
            ),
            filterIcon: () => <FilterOutlined style={{ color: filters.type ? '#1890ff' : undefined }} />,
            render: (type: IVoucher["type"]) =>
                type === "percentage" ? "Phần trăm" : "Giảm cố định",
        },
        {
            title: "Giá trị",
            dataIndex: "value",
            key: "value",
            filterDropdown: () => (
                <div style={{ padding: 8, backgroundColor: 'white', borderRadius: 6 }}>
                    <Input
                        placeholder="Tìm theo giá trị voucher"
                        value={filters.value}
                        onChange={(e) => handleFilterChange(e.target.value, 'value')}
                        prefix={<SearchOutlined />}
                        allowClear
                    />
                </div>
            ),
            filterIcon: () => <FilterOutlined style={{ color: filters.value ? '#1890ff' : undefined }} />,
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
            filterDropdown: () => (
                <div style={{ padding: 8, backgroundColor: 'white', borderRadius: 6 }}>
                    <Input
                        placeholder="Tìm theo giá giảm tối đa"
                        value={filters.maxDiscount}
                        onChange={(e) => handleFilterChange(e.target.value, 'maxDiscount')}
                        prefix={<SearchOutlined />}
                        allowClear
                    />
                </div>
            ),
            filterIcon: () => <FilterOutlined style={{ color: filters.maxDiscount ? '#1890ff' : undefined }} />,
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
            filterDropdown: () => (
                <div style={{ padding: 8, backgroundColor: 'white', borderRadius: 6 }}>
                    <Input
                        placeholder="Tìm theo giá trị đơn hàng tối thiểu"
                        value={filters.minOrderValue}
                        onChange={(e) => handleFilterChange(e.target.value, 'minOrderValue')}
                        prefix={<SearchOutlined />}
                        allowClear
                    />
                </div>
            ),
            filterIcon: () => <FilterOutlined style={{ color: filters.minOrderValue ? '#1890ff' : undefined }} />,
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
            filterDropdown: () => (
                <div style={{ padding: 8, backgroundColor: 'white', borderRadius: 6 }}>
                    <Input
                        placeholder="Tìm theo số lượng voucher"
                        value={filters.quantity}
                        onChange={(e) => handleFilterChange(e.target.value, 'quantity')}
                        prefix={<SearchOutlined />}
                        allowClear
                    />
                </div>
            ),
            filterIcon: () => <FilterOutlined style={{ color: filters.quantity ? '#1890ff' : undefined }} />,
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
            filterDropdown: () => (
                <div style={{ padding: 8, backgroundColor: 'white', borderRadius: 6 }}>
                    <Select
                        style={{ width: '200px' }}
                        placeholder="Chọn loại voucher"
                        allowClear
                        value={filters.isActive}
                        onChange={(value) => handleFilterChange(value || '', 'isActive')}
                    >
                        <Select.Option value="true">Đang hoạt động</Select.Option>
                        <Select.Option value="false">Không hoạt động</Select.Option>
                    </Select>
                </div>
            ),
            filterIcon: () => <FilterOutlined style={{ color: filters.isActive ? '#1890ff' : undefined }} />,
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
                dataSource={filteredData}
                rowKey="_id"
                pagination={{
                    total: filteredData.length,
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
