import { Drawer, Form, Input, Button, message, Upload, Col, Select, Row } from "antd";
import ImgCrop from "antd-img-crop";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { UploadFile } from "antd/es/upload";
import type { IUser } from "../../interface/user";
import type { UploadFileStatus } from "antd/es/upload/interface";
import { useProvinces, useDistricts, useWards } from "../../hooks/useShipping";

interface Props {
    open: boolean;
    onClose: () => void;
    user: IUser;
}

const UpdateProfileDrawer: React.FC<Props> = ({ open, onClose, user }) => {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const [file, setFile] = useState<File | null>(null);
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    // chọn địa chỉ mặc định hoặc fallback sang địa chỉ đầu tiên
    const address =
        user.shipping_addresses?.find((addr) => addr.is_default) ||
        user.shipping_addresses?.[0] ||
        {};

    // gọi hooks để lấy dữ liệu tỉnh/huyện/xã
    const provinceId = Form.useWatch("province_id", form);
    const districtId = Form.useWatch("district_id", form);

    const { data: provinces = [] } = useProvinces();
    const { data: districts = [] } = useDistricts(provinceId ? Number(provinceId) : undefined);
    const { data: wards = [] } = useWards(districtId ? Number(districtId) : undefined);

    useEffect(() => {
        if (open && user) {
            form.setFieldsValue({
                username: user.username,
                email: user.email,
                full_name: address.full_name || "",
                phone: address.phone || "",
                address: address.address || "",
                province_id: address.province_id || undefined,
                district_id: address.district_id || undefined,
                ward_code: address.ward_code || undefined,
            });

            if (user.image) {
                setFileList([
                    {
                        uid: "-1",
                        name: "Ảnh hiện tại",
                        status: "done",
                        url: user.image,
                    },
                ]);
            } else {
                setFileList([]);
            }

            setFile(null);
        }
    }, [open, user, form]);

    const handleUploadChange = (info: any) => {
        const selectedFile = info.fileList[0]?.originFileObj;

        if (selectedFile) {
            const newFileList = [
                {
                    uid: "-1",
                    name: selectedFile.name,
                    status: "done" as UploadFileStatus,
                    originFileObj: selectedFile,
                    url: URL.createObjectURL(selectedFile),
                },
            ];
            setFileList(newFileList);
            setFile(selectedFile);
        } else {
            setFile(null);
            setFileList([]);
        }
    };

    const handleFinish = async (values: any) => {
        try {
            // Lấy object hiển thị từ options dựa trên id
            const province = provinces.find((p: any) => p.value === values.province_id);
            const district = districts.find((d: any) => d.value === values.district_id);
            const ward = wards.find((w: any) => w.value === values.ward_code);

            const token = localStorage.getItem("token");
            const formData = new FormData();

            formData.append("username", values.username);
            formData.append("email", values.email);
            formData.append("shipping_addresses[0][full_name]", values.full_name);
            formData.append("shipping_addresses[0][phone]", values.phone);
            formData.append("shipping_addresses[0][address]", values.address);
            formData.append("shipping_addresses[0][province_id]", values.province_id);
            formData.append("shipping_addresses[0][province_name]", province?.label || "");
            formData.append("shipping_addresses[0][district_id]", values.district_id);
            formData.append("shipping_addresses[0][district_name]", district?.label || "");
            formData.append("shipping_addresses[0][ward_code]", values.ward_code);
            formData.append("shipping_addresses[0][ward_name]", ward?.label || "");
            formData.append("shipping_addresses[0][is_default]", "true");

            if (file) {
                formData.append("image", file);
            }

            const res = await axios.put(
                `http://localhost:3000/api/auth/profile/${user._id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (res.data.error || res.status !== 200) {
                return message.error(res.data.message || "Cập nhật thất bại!");
            }
            message.success(res.data.message || "Cập nhật thông tin thành công!");

            await queryClient.invalidateQueries({ queryKey: ["profile"] });
            await queryClient.refetchQueries({ queryKey: ["profile"] });

            setTimeout(() => {
                onClose();
            }, 300);
        } catch (error) {
            message.error("Cập nhật thất bại!");
            console.error(error);
        }
    };

    return (
        <Drawer title="Cập nhật thông tin cá nhân" open={open} onClose={onClose} width={400}>
            <Form layout="vertical" form={form} onFinish={handleFinish}>
                <Form.Item label="Tên đăng nhập" name="username">
                    <Input />
                </Form.Item>
                <Form.Item label="Email" name="email">
                    <Input type="email" />
                </Form.Item>
                <Form.Item label="Họ và tên" name="full_name">
                    <Input />
                </Form.Item>
                <Form.Item label="Số điện thoại" name="phone">
                    <Input />
                </Form.Item>
                <Form.Item label="Địa chỉ" name="address">
                    <Input />
                </Form.Item>

                <Form.Item name="province_id" rules={[{ required: true, message: "Chọn Tỉnh/Thành phố!" }]}>
                    <Select showSearch placeholder="Chọn Tỉnh/Thành phố *" options={provinces} />
                </Form.Item>

                <Form.Item name="district_id" rules={[{ required: true, message: "Chọn Quận/Huyện!" }]}>
                    <Select showSearch placeholder="Chọn Quận/Huyện *" options={districts} />
                </Form.Item>

                <Form.Item name="ward_code" rules={[{ required: true, message: "Chọn Phường/Xã!" }]}>
                    <Select showSearch placeholder="Chọn Phường/Xã *" options={wards} />
                </Form.Item>

                <Form.Item label="Ảnh đại diện">
                    <ImgCrop aspect={1}>
                        <Upload
                            listType="picture-circle"
                            beforeUpload={() => false}
                            onChange={handleUploadChange}
                            fileList={fileList}
                            maxCount={1}
                            showUploadList={{ showRemoveIcon: true }}
                        >
                            {fileList.length < 1 && (
                                <div>
                                    <UploadOutlined />
                                    <div style={{ marginTop: 8 }}>Chọn ảnh</div>
                                </div>
                            )}
                        </Upload>
                    </ImgCrop>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Lưu thay đổi
                    </Button>
                </Form.Item>
            </Form>
        </Drawer>
    );
};

export default UpdateProfileDrawer;
