import { Card, Row, Col, Statistic, Table, DatePicker, Spin, Button } from "antd";
import { Column, Line } from "@ant-design/charts";
import {
  ShoppingOutlined,
  ShoppingCartOutlined,
  UsergroupAddOutlined,
  DollarOutlined,
  RightOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import dayjs from "dayjs";
import type { ITopProduct } from "../../interface/dashboard";
import { useDashboardStats } from "../../hooks/useDasboard";

const { RangePicker } = DatePicker;

const Dashboard = () => {
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);

  const currentYear = new Date().getFullYear();
  const [yearRange, setYearRange] = useState({ startYear: currentYear - 4, endYear: currentYear });

  const { data: stats, isLoading } = useDashboardStats({
    startDate: dateRange ? dateRange[0].format("YYYY-MM-DD") : undefined,
    endDate: dateRange ? dateRange[1].format("YYYY-MM-DD") : undefined,
    startYear: yearRange.startYear,
    endYear: yearRange.endYear,
  });

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      width: "20%",
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
      width: "20%",
      render: (sku: string) => <span style={{ fontWeight: 500 }}>{sku}</span>,
    },
    {
      title: "Số lượng",
      dataIndex: "totalSales",
      key: "totalSales",
      width: "20%",
      sorter: (a: ITopProduct, b: ITopProduct) => a.totalSales - b.totalSales,
    },
    {
      title: "Doanh thu",
      dataIndex: "totalRevenue",
      key: "totalRevenue",
      width: "20%",
      render: (value: number) => `${value.toLocaleString("vi-VN")} đ`,
      sorter: (a: ITopProduct, b: ITopProduct) => a.totalRevenue - b.totalRevenue,
    },
  ];

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px" }}>
      {/* Thống kê số liệu */}
      <Row gutter={[16, 16]}>
        <Col xs={12} md={6}>
          <Card>
            <Statistic
              title="Tổng sản phẩm"
              value={stats?.totalProducts || 0}
              prefix={<ShoppingOutlined style={{ color: "#1890ff" }} />}
            />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card>
            <Statistic
              title="Tổng đơn hàng"
              value={stats?.totalOrders || 0}
              prefix={<ShoppingCartOutlined style={{ color: "#52c41a" }} />}
            />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card>
            <Statistic
              title="Doanh thu theo ngày"
              value={stats?.revenue || 0}
              prefix={<DollarOutlined style={{ color: "#faad14" }} />}
              suffix="đ"
              formatter={(val: number | string) =>
                Number(val).toLocaleString("vi-VN")
              }
            />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card>
            <Statistic
              title="Người dùng"
              value={stats?.totalUsers || 0}
              prefix={<UsergroupAddOutlined style={{ color: "#eb2f96" }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ */}
      <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
        <Col xs={24} md={12}>
          <Card
            title="Thống kê đơn hàng"
            extra={
              <RangePicker
                size="small"
                value={dateRange}
                onChange={(dates) => {
                  if (dates && dates[0] && dates[1]) {
                    setDateRange([dates[0], dates[1]]);
                  } else {
                    setDateRange(null);
                  }
                }}
              />
            }
          >
            <Line
              data={stats?.ordersByDate || []}
              xField="date"
              yField="orders"
              height={250}
              point={{ size: 4, shape: "diamond" }}
              autoFit
            />
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            title="Doanh thu theo năm"
            extra={
              <div>
                <Button
                  icon={<LeftOutlined />}
                  size="small"
                  onClick={() =>
                    setYearRange((prev) => ({
                      startYear: prev.startYear - 5,
                      endYear: prev.endYear - 5,
                    }))
                  }
                />
                <Button
                  icon={<RightOutlined />}
                  size="small"
                  style={{ marginLeft: 8 }}
                  onClick={() =>
                    setYearRange((prev) => ({
                      startYear: prev.startYear + 5,
                      endYear: prev.endYear + 5,
                    }))
                  }
                />
              </div>
            }
          >
            <Column
              data={stats?.revenueByYear || []}
              xField="year"
              yField="revenue"
              height={250}
              autoFit
              label={{
                position: "top",
                formatter: (val: number | string) =>
                  `${Number(val).toLocaleString("vi-VN")} đ`,
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Bảng top sản phẩm */}
      <Card
        size="small"
        title="Top sản phẩm bán chạy"
        style={{ marginTop: "16px" }}
      >
        <Table
          rowKey="variantId"
          columns={columns}
          dataSource={stats?.topProducts || []}
          pagination={{
            pageSize: 5,
            showSizeChanger: false,
          }}
          size="small"
        />
      </Card>
    </div>
  );
};

export default Dashboard;
