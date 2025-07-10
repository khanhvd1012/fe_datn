import type { IVoucher } from '../../../interface/voucher';
import { Drawer, Descriptions, Skeleton, Divider, Tag } from 'antd';

interface DrawerVoucherProps {
    visible: boolean;
    voucher: IVoucher | null;
    loading: boolean;
    onClose: () => void;
}

const DrawerVoucher = ({ visible, voucher, onClose, loading }: DrawerVoucherProps) => {
    return (
        <Drawer
            title={<span className="text-lg font-semibold">Chi tiết voucher</span>}
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
                            <Descriptions.Item label="Mã voucher" className="bg-gray-50">
                                <Tag color="blue">{voucher?.code}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Loại">
                                {voucher?.type === 'percentage' ? 'Phần trăm' : 'Giảm cố định'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Giá trị" className="bg-gray-50">
                                {voucher
                                    ? voucher.type === 'percentage'
                                        ? `${voucher.value}%`
                                        : voucher.value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                                    : '---'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Giảm tối đa">
                                {voucher?.maxDiscount !== null
                                    ? voucher?.maxDiscount.toLocaleString('en-US', {
                                        style: 'currency',
                                        currency: 'USD',
                                    })
                                    : 'Không giới hạn'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Đơn tối thiểu" className="bg-gray-50">
                                {voucher?.minOrderValue.toLocaleString('en-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                })}
                            </Descriptions.Item>
                            <Descriptions.Item label="Số lượng">
                                {voucher?.quantity}
                            </Descriptions.Item>
                            <Descriptions.Item label="Đã dùng" className="bg-gray-50">
                                {voucher?.usedCount}
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">
                                {voucher?.isActive ? (
                                    <Tag color="green">Đang hoạt động</Tag>
                                ) : (
                                    <Tag color="red">Không hoạt động</Tag>
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thời gian hiệu lực" className="bg-gray-50">
                                {voucher
                                    ? `${new Date(voucher.startDate).toLocaleDateString('vi-VN')} - ${new Date(
                                        voucher.endDate
                                    ).toLocaleDateString('vi-VN')}`
                                    : '---'}
                            </Descriptions.Item>
                        </Descriptions>
                    </div>

                    <Divider />

                    <div>
                        <h3 className="text-base font-medium mb-2">Thông tin thời gian</h3>
                        <Descriptions column={1} bordered size="small">
                            <Descriptions.Item label="Ngày tạo">
                                {voucher?.createdAt
                                    ? new Date(voucher.createdAt).toLocaleString('vi-VN')
                                    : '---'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Cập nhật lần cuối" className="bg-gray-50">
                                {voucher?.updatedAt
                                    ? new Date(voucher.updatedAt).toLocaleString('vi-VN')
                                    : '---'}
                            </Descriptions.Item>
                        </Descriptions>
                    </div>
                </>
            )}
        </Drawer>
    );
};
export default DrawerVoucher;
