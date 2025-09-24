import { Card, Row, Col, Statistic, Table, DatePicker, Spin, Button, message } from "antd";
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
  const [dayRange, setDayRange] = useState({
    start: dayjs().subtract(4, 'day'),
    end: dayjs()
  });

  const { data: stats, isLoading } = useDashboardStats({
    startDate: dateRange ? dateRange[0].format("YYYY-MM-DD") : undefined,
    endDate: dateRange ? dateRange[1].format("YYYY-MM-DD") : undefined,
    startYear: yearRange.startYear,
    endYear: yearRange.endYear,
    startSingle: dayRange.start.format("YYYY-MM-DD"),
    endSingle: dayRange.end.format("YYYY-MM-DD")
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
      width: "10%",
      sorter: (a: ITopProduct, b: ITopProduct) => a.totalSales - b.totalSales,
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

      <Col span={24} style={{ marginTop: 16 }}>
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

      <Col xs={1000} md={500} style={{ marginTop: "16px" }}>
        <Card
          title="Doanh thu 7 ngày gần nhất"
          extra={
            <RangePicker
              size="small"
              value={[dayRange.start, dayRange.end]}
              onChange={(dates) => {
                if (dates && dates[0] && dates[1]) {
                  const diff = dates[1].diff(dates[0], "day");
                  if (diff > 6) {
                    message.warning({
                      content: "Khoảng thời gian không được vượt quá 7 ngày!",
                      key: "range-limit"
                    }); return;
                  }
                  setDayRange({
                    start: dates[0],
                    end: dates[1],
                  });
                }
              }}
            />
          }
        >
          <Column
            data={stats?.dailyRevenue?.slice(-7) || []} // lấy 7 ngày gần nhất
            xField="date"
            yField="revenue"
            height={250}
            label={{
              position: "top",
              formatter: (val: number | string) =>
                `${Number(val).toLocaleString("vi-VN")} đ`,
            }}
          />
        </Card>
      </Col>

      {/* Doanh thu năm */}
      <Col xs={1000} md={500} style={{ marginTop: "16px" }}>
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
            label={{
              position: "top",
              formatter: (val: number | string) =>
                `${Number(val).toLocaleString("vi-VN")} đ`,
            }}
          />
        </Card>
      </Col>

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
