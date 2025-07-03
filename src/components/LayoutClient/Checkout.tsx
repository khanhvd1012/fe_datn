import React from 'react'
import Breadcrumb from '../../components/LayoutClient/Breadcrumb'
import { Input, Select, Radio, Button, Card, Image, Row, Col, Typography, Divider } from "antd"

const Checkout = () => {
    const { TextArea } = Input;
    const { Title, Text } = Typography;
  return (
   <>
      <Breadcrumb current="Thanh toán" />
      <div>
        {/* viết code ở đây */}
            <div className="max-w-6xl mx-auto p-6">
      <Title level={2} className="text-center">Xác nhận đơn hàng</Title>
      <Text type="secondary" className="block text-center mb-6">
        Mã đơn hàng của bạn: <strong>ORD-M1NQW</strong>
      </Text>

      <Row gutter={[24, 24]}>
        {/* Thông tin người nhận */}
        <Col xs={24} md={14}>
          <Card title="Thông tin người nhận" bordered={false}>
            <Input className="mb-3" placeholder="Nhập tên của bạn" />
            <Input className="mb-3" placeholder="Số điện thoại *" />
            <Input className="mb-3" placeholder="Địa chỉ nhận hàng *" />
            <Input className="mb-3" placeholder="Nhập gmail của bạn" />
            <TextArea className="mb-3" rows={3} placeholder="Ghi chú (tùy chọn)" />
            <Select className="w-full mb-3" defaultValue="Giao hàng tiêu chuẩn">
              <Select.Option value="standard">Giao hàng tiêu chuẩn</Select.Option>
              <Select.Option value="fast">Giao hàng nhanh</Select.Option>
            </Select>

            <div className="mb-3">
              <Text strong>Phương thức thanh toán</Text>
              <Radio.Group defaultValue="cod" className="block mt-2 space-y-2">
                <div><Radio value="cod">Thanh toán khi nhận hàng</Radio></div>
                <div><Radio value="momo">Thanh toán qua Momo</Radio></div>
                <div><Radio value="bank">Chuyển khoản ngân hàng</Radio></div>
              </Radio.Group>
            </div>

            <Button type="primary" className="mt-4 w-full h-10 bg-green-600 hover:bg-green-700">
              Đặt hàng ngay
            </Button>
          </Card>
        </Col>

        {/* Sản phẩm trong giỏ hàng */}
        <Col xs={24} md={10}>
          <Card title="Sản phẩm trong giỏ hàng" bordered={false}>
            <div className="flex gap-4 mb-3">
              <Image
                width={80}
                src="https://picsum.photos/80"
                alt="product"
                preview={false}
              />
              <div>
                <Text strong>Híu đây hẹ hẹ</Text>
                <div>Màu: Blue</div>
                <div>Dung lượng: 1T</div>
                <div>Số lượng: 1</div>
              </div>
              <div className="ml-auto">
                <Text>50.000.000 ₫</Text>
              </div>
            </div>

            <Divider />

            <div className="flex justify-between">
              <Text>Tổng tiền:</Text>
              <Text>50.000.000 ₫</Text>
            </div>
            <div className="flex justify-between">
              <Text>Phí vận chuyển:</Text>
              <Text>35.000 ₫</Text>
            </div>
            <div className="flex justify-between mt-2">
              <Text strong className="text-lg">Tổng cộng:</Text>
              <Text strong className="text-lg text-black">50.035.000 ₫</Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
      </div>
    </>
  )
}

export default Checkout