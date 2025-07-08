import { useState } from 'react';
import { Button, Empty, Input, message, Popconfirm, Select, Skeleton, Table, Tag } from 'antd';
import { Link } from 'react-router-dom';
import { DeleteOutlined, EditOutlined, EyeOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import type { IColor } from '../../../interface/color';
import { useColors, useDeleteColor } from '../../../hooks/useColors';
import DrawerColor from '../../../components/drawer/DrawerColor';

const Colors = () => {
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [selectedColor, setSelectedColor] = useState<IColor | null>(null);
    const [drawerLoading, setDrawerLoading] = useState(false);
    const { mutate } = useDeleteColor();
    const { data: colors, isLoading } = useColors();
    const [filters, setFilters] = useState({
        name: '',
        code: '',
        status: ''
    });

    const filteredData = colors?.filter((color: IColor) => {
        if (filters.name && !color.name.toLowerCase().includes(filters.name.toLowerCase())) {
            return false;
        }
        if (filters.code && !color.code.toLowerCase().includes(filters.code.toLowerCase())) {
            return false;
        }
        if (filters.status && color.status !== filters.status) {
            return false;
        }
        return true;
    });

    const handleFilterChange = (value: string | number, type: string) => {
        setFilters(prev => ({
            ...prev,
            [type]: value
        }));
    };

    const showColorDetails = (color: IColor) => {
        setDrawerLoading(true);
        setSelectedColor(color);
        setIsDrawerVisible(true);
        setTimeout(() => {
            setDrawerLoading(false);
        }, 500);
    };

    const handleDelete = async (id: string) => {
        try {
            mutate(id, {
                onSuccess: () => {
                    messageApi.success("Xóa màu sắc thành công");
                    queryClient.invalidateQueries({
                        queryKey: ["colors"],
                    });
                },
                onError: () => messageApi.error("Lỗi khi xóa màu sắc"),
            });
        } catch (error) {
            console.error("Lỗi khi xóa màu sắc:", error);
        }
    };

    if (isLoading) return <Skeleton active />;
    if (!colors) return <Empty />;

    const columns = [
        {
            title: "Tên màu sắc",
            dataIndex: "name",
            key: "name",
            filterDropdown: () => (
                <div style={{ padding: 8, backgroundColor: 'white', borderRadius: 6 }}>
                    <Input
                        placeholder="Tìm tên màu sắc"
                        value={filters.name}
                        onChange={(e) => handleFilterChange(e.target.value, 'name')}
                        prefix={<SearchOutlined />}
                        allowClear
                    />
                </div>
            ),
            filterIcon: () => <FilterOutlined style={{ color: filters.name ? '#1890ff' : undefined }} />,
        },
        {
            title: "Mã màu",
            dataIndex: "code",
            key: "code",
            filterDropdown: () => (
                <div style={{ padding: 8, backgroundColor: 'white', borderRadius: 6 }}>
                    <Input
                        placeholder="Tìm kiếm theo mã màu"
                        value={filters.code}
                        onChange={(e) => handleFilterChange(e.target.value, 'code')}
                        prefix={<SearchOutlined />}
                        allowClear
                    />
                </div>
            ),
            filterIcon: () => <FilterOutlined style={{ color: filters.code ? '#1890ff' : undefined }} />,
            render: (code: string) => (
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: code }}></div>
                    <span>{code}</span>
                </div>
            )
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            filterDropdown: () => (
                <div style={{ padding: 8, backgroundColor: 'white', borderRadius: 6 }}>
                    <Select
                        style={{ width: '200px' }}
                        placeholder="Chọn trạng thái"
                        allowClear
                        value={filters.status}
                        onChange={(value) => handleFilterChange(value || '', 'status')}
                    >
                        <Select.Option value="active">Đang hoạt động</Select.Option>
                        <Select.Option value="inactive">Ngừng hoạt động</Select.Option>
                    </Select>
                </div>
            ),
            filterIcon: () => <FilterOutlined style={{ color: filters.status ? '#1890ff' : undefined }} />,
            render: (status: string) => {
                const color = status === 'active' ? 'success' : 'error';
                return <Tag color={color}>{status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}</Tag>
            }
        },
        {
            title: "Thao tác",
            key: "actions",
            render: (_: any, color: IColor) => (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        onClick={() => showColorDetails(color)}
                    />
                    <Link to={`/admin/colors/edit/${color._id}`}>
                        <Button type="default" icon={<EditOutlined />} />
                    </Link>
                    <Popconfirm
                        title="Xóa màu sắc"
                        description="Bạn có chắc chắn muốn xóa màu sắc này?"
                        onConfirm={() => handleDelete(color._id!)}
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
                <Link to="/admin/colors/add">
                    <Button type="primary">Thêm màu sắc mới</Button>
                </Link>
            </div>

            <Table
                columns={columns}
                dataSource={filteredData}
                rowKey="_id"
                pagination={{
                    total: filteredData?.length,
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `Tổng ${total} màu sắc`,
                }}
            />

            <DrawerColor
                visible={isDrawerVisible}
                color={selectedColor}
                loading={drawerLoading}
                onClose={() => {
                    setIsDrawerVisible(false);
                    setSelectedColor(null);
                }}
            />
        </div>
    );
};

export default Colors;
