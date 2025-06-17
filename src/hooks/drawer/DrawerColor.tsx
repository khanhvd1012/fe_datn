import { Drawer, Descriptions, Tag, Skeleton, Divider } from 'antd';
import type { IColor } from '../../interface/color';

interface DrawerColorProps {
    visible: boolean;
    color: IColor | null;
    onClose: () => void;
    loading?: boolean;
}

const DrawerColor = ({ visible, color, onClose, loading }: DrawerColorProps) => {
    return (
        <Drawer
            title={<span className="text-lg font-semibold">Chi tiết màu sắc</span>}
            placement="right"
            onClose={onClose}
            open={visible}
            width={500}
        >
            {loading ? (
                <Skeleton active />
            ) : (
                <>
                    <div className="mb-4">
                        <h3 className="text-base font-medium mb-2">Thông tin cơ bản</h3>
                        <Descriptions column={1} bordered size="small">
                            <Descriptions.Item label="Tên màu sắc" className="bg-gray-50">
                                {color?.name}
                            </Descriptions.Item>
                            <Descriptions.Item label="Mã màu">
                                <div className="flex items-center gap-2">
                                    <div 
                                        className="w-6 h-6 rounded-full border border-gray-200" 
                                        style={{ backgroundColor: color?.code }}
                                    />
                                    <span>{color?.code}</span>
                                </div>
                            </Descriptions.Item>
                            <Descriptions.Item label="Mô tả" className="bg-gray-50">
                                {color?.description}
                            </Descriptions.Item>
                        </Descriptions>
                    </div>

                    <Divider />

                    <div className="mb-4">
                        <h3 className="text-base font-medium mb-2">Trạng thái</h3>
                        <Descriptions column={1} bordered size="small">
                            <Descriptions.Item label="Trạng thái hiện tại">
                                <Tag color={color?.status === 'active' ? 'success' : 'error'}>
                                    {color?.status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                                </Tag>
                            </Descriptions.Item>
                        </Descriptions>
                    </div>

                    <Divider />

                    <div>
                        <h3 className="text-base font-medium mb-2">Thông tin thời gian</h3>
                        <Descriptions column={1} bordered size="small">
                            <Descriptions.Item label="Ngày tạo" className="bg-gray-50">
                                {new Date(color?.createdAt || '').toLocaleString('vi-VN')}
                            </Descriptions.Item>
                            <Descriptions.Item label="Cập nhật lần cuối">
                                {new Date(color?.updatedAt || '').toLocaleString('vi-VN')}
                            </Descriptions.Item>
                        </Descriptions>
                    </div>
                </>
            )}
        </Drawer>
    );
};

export default DrawerColor;
