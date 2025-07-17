import { Drawer, Form, Input, Button, message, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { UploadFile } from "antd/es/upload";
import type { IUser } from "../../interface/user";
import type { UploadFileStatus } from "antd/es/upload/interface";

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
    const address = user.shipping_addresses?.[0] || {};

    useEffect(() => {
        if (open && user) {
            form.setFieldsValue({
                username: user.username,
                email: user.email,
                full_name: address.full_name || "",
                phone: address.phone || "",
                address: address.address || "",
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
    }, [open, user, form, address]);

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
            const token = localStorage.getItem("token");
            const formData = new FormData();

            formData.append("username", values.username);
            formData.append("email", values.email);
            formData.append("shipping_addresses[0][full_name]", values.full_name);
            formData.append("shipping_addresses[0][phone]", values.phone);
            formData.append("shipping_addresses[0][address]", values.address);
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

            console.log("res.data:", res.data); // DEBUG

            if (!res.data.success) {
                return message.open({
                    type: "error",
                    content: res.data.message || "Cập nhật thất bại!",
                });
            }

            message.open({
                type: "success",
                content: "Cập nhật thông tin thành công!",
            });

            await queryClient.invalidateQueries({ queryKey: ["profile"] });
            await queryClient.refetchQueries({ queryKey: ["profile"] });

            setTimeout(() => {
                onClose();
            }, 300);
        } catch (error) {
            message.error("Cập nhật thất bại!");
            console.error(error); // DEBUG lỗi JS nếu có
        }
    };


    return (
        <Drawer
            title="Cập nhật thông tin cá nhân"
            open={open}
            onClose={onClose}
            width={400}
        >
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
