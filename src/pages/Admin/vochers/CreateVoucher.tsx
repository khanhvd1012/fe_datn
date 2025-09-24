import { useQueryClient } from "@tanstack/react-query";
import { Button, DatePicker, Form, Input, InputNumber, message, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { useAddVoucher } from "../../../hooks/useVouchers";

const { Option } = Select;

const CreateVoucher = () => {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { mutate, isPending } = useAddVoucher();

  const handleSubmit = (values: any) => {
    const { duration, ...rest } = values;

    const payload = {
      ...rest,
      startDate: duration?.[0]?.toDate(),
      endDate: duration?.[1]?.toDate(),
      usedCount: 0,
      isActive: true,
    };

    mutate(payload, {
      onSuccess: () => {
        messageApi.success("Thêm voucher thành công!");
        queryClient.invalidateQueries({ queryKey: ["vouchers"] });
        navigate("/admin/vouchers");
      },
      onError: (error: any) => {
        const backendErrors = error?.response?.data?.errors;

        if (Array.isArray(backendErrors) && backendErrors.length > 0) {
          message.error(backendErrors[0].message);
        } else {
          message.error(error?.response?.data?.message || "Lỗi khi thêm voucher.");
        }
        console.error("Lỗi khi thêm voucher:", error);
      }
    });
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      {contextHolder}
      <h2 className="text-2xl font-bold mb-4">Thêm Voucher</h2>
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        initialValues={{
          type: "percentage",
          quantity: 1,
          value: 0,
          maxDiscount: null,
          minOrderValue: 0,
          isActive: true,
        }}
      >
        <Form.Item
          label="Mã voucher"
          name="code"
          rules={[{ required: true, message: "Vui lòng nhập mã voucher!" }]}
        >
          <Input placeholder="VD: SALE2025" />
        </Form.Item>

        <Form.Item
          label="Loại giảm"
          name="type"
          rules={[{ required: true, message: "Vui lòng chọn loại giảm giá!" }]}
        >
          <Select>
            <Option value="percentage">Phần trăm</Option>
            <Option value="fixed">Giảm cố định</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Giá trị giảm"
          name="value"
          rules={[{ required: true, message: "Vui lòng nhập giá trị!" }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Trạng thái"
          name="isActive"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          initialValue={true}
        >
          <Select>
            <Option value={true}>Hoạt động</Option>
            <Option value={false}>Ngừng hoạt động</Option>
          </Select>
        </Form.Item>


        <Form.Item
          label="Đơn hàng tối thiểu"
          name="minOrderValue"
          rules={[{ required: true, message: "Vui lòng nhập giá trị tối thiểu!" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Thời gian áp dụng"
          name="duration"
          rules={[{ required: true, message: "Vui lòng chọn khoảng thời gian!" }]}
        >
          <DatePicker.RangePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Số lượng voucher"
          name="quantity"
          rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item>
          <div className="flex justify-end gap-4">
            <Button onClick={() => navigate("/admin/vouchers")}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={isPending}>
              {isPending ? "Đang thêm..." : "Thêm voucher"}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateVoucher;
