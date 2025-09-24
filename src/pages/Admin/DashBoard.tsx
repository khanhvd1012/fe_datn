import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  DatePicker,
  Spin,
  Button,
  message,
} from "antd";
import { Column, Line } from "@ant-design/charts";
import {
  ShoppingOutlined,
  ShoppingCartOutlined,
  UsergroupAddOutlined,
  DollarOutlined,
  RightOutlined,
  LeftOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import type { ITopProduct } from "../../interface/dashboard";
import { useDashboardStats } from "../../hooks/useDasboard";
import "../../components/css/dashboard.css";

const { RangePicker } = DatePicker;

const Dashboard = () => {
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [monthRange, setMonthRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const currentYear = new Date().getFullYear();
  const [yearRange, setYearRange] = useState({
    startYear: currentYear - 4,
    endYear: currentYear,
  });
  const [dayRange, setDayRange] = useState({
    start: dayjs().subtract(6, "day"),
    end: dayjs(),
  });

  const { data: stats, isLoading, error } = useDashboardStats({
    startDate: dateRange ? dateRange[0].format("YYYY-MM-DD") : undefined,
    endDate: dateRange ? dateRange[1].format("YYYY-MM-DD") : undefined,
    startYear: yearRange.startYear,
    endYear: yearRange.endYear,
    startSingle: dayRange.start.format("YYYY-MM-DD"),
    endSingle: dayRange.end.format("YYYY-MM-DD"),
    startMonth: monthRange ? monthRange[0].format("YYYY-MM") : undefined,
    endMonth: monthRange ? monthRange[1].format("YYYY-MM") : undefined,
  });

  useEffect(() => {
    if (stats) console.log("Stats:", stats);
    if (error) console.error("Error fetching stats:", error);
  }, [stats, error]);

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      width: "25%",
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
  ];

  const transformRevenueData = (
    data: any[],
    type: "day" | "month" | "year" = "day"
  ) => {
    if (!data?.length) return [];
    const field = type === "month" ? "yearMonth" : type === "year" ? "year" : "date";
    return data.flatMap((item: any) => [
      { [field]: item[field], revenue: Number(item.orderRevenue) || 0, type: "Doanh thu đơn hàng" },
      { [field]: item[field], revenue: Number(item.actualRevenue) || 0, type: "Doanh thu thực tế" },
      { [field]: item[field], revenue: Number(item.difference) || 0, type: "Chênh lệch" },
    ]);
  };

  if (isLoading)
    return (
      <div className="dashboard-loading">
        <Spin size="large" />
      </div>
    );

  if (error)
    return (
      <div className="dashboard-error">
        Lỗi khi tải dữ liệu: {error.message}
      </div>
    );

  return (
    <div className="dashboard-container">
      {/* ===== Thống kê tổng quan ===== */}
      <Row gutter={[24, 24]}>
        {[
          {
            title: "Tổng sản phẩm",
            value: stats?.totalProducts,
            icon: <ShoppingOutlined style={{ color: "#4f9cf9" }} />,
          },
          {
            title: "Tổng đơn hàng",
            value: stats?.totalOrders,
            icon: <ShoppingCartOutlined style={{ color: "#52c41a" }} />,
          },
          {
            title: "Doanh thu đơn hàng",
            value: stats?.totalOrderRevenue,
            icon: <DollarOutlined style={{ color: "#faad14" }} />,
            suffix: "đ",
          },
          {
            title: "Doanh thu thực tế",
            value: stats?.totalActualRevenue,
            icon: <DollarOutlined style={{ color: "#faad14" }} />,
            suffix: "đ",
          },
          {
            title: "Đã giao - thanh toán",
            value: stats?.deliveredPaidOrders,
            icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
          },
          {
            title: "Người dùng",
            value: stats?.totalUsers,
            icon: <UsergroupAddOutlined style={{ color: "#eb2f96" }} />,
          },
        ].map((item, i) => (
          <Col xs={12} sm={8} md={4} key={i}>
            <Card className="dashboard-card" hoverable>
              <Statistic
                title={<span className="stat-title">{item.title}</span>}
                value={item.value || 0}
                prefix={item.icon}
                suffix={item.suffix}
                formatter={(val) =>
                  item.suffix ? Number(val).toLocaleString("vi-VN") : val
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* ===== Biểu đồ ===== */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} md={24}>
          <Card
            className="dashboard-card"
            title="Thống kê đơn hàng"
            extra={
              <RangePicker
                value={dateRange}
                onChange={(d) => {
                  if (d && d[0] && d[1]) setDateRange([d[0], d[1]]);
                  else setDateRange(null);
                }}
              />
            }
          >
            <Line
              data={stats?.ordersByDate || []}
              xField="date"
              yField="orders"
              height={260}
              point={{ size: 4, shape: "diamond" }}
              legend={{ position: "bottom" }}
              meta={{
                orders: { alias: "Số đơn hàng" },
                date: { formatter: (v: string) => dayjs(v).format("DD/MM") },
              }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} md={24}>
          <Card
            className="dashboard-card"
            title="Doanh thu ngày"
            extra={
              <RangePicker
                size="small"
                value={[dayRange.start, dayRange.end]}
                onChange={(dates) => {
                  if (dates && dates[0] && dates[1]) {
                    if (dates[1].diff(dates[0], "day") > 6) {
                      message.warning("Khoảng thời gian không quá 6 ngày!");
                      return;
                    }
                    setDayRange({ start: dates[0], end: dates[1] });
                  }
                }}
              />
            }
          >
            <Column
              data={transformRevenueData(stats?.revenueByDate || [], "day")}
              xField="date"
              yField="revenue"
              seriesField="type"
              isGroup
              height={260}
              columnWidthRatio={0.25}
              legend={{ position: "bottom" }}
              columnStyle={{ radius: [4, 4, 0, 0] }}
              label={{
                position: "top",
                formatter: (v: any) => `${Number(v).toLocaleString("vi-VN")}đ`,
              }}
              meta={{
                date: { formatter: (v: string) => dayjs(v).format("DD/MM") },
              }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} md={24}>
          <Card
            className="dashboard-card"
            title="Doanh thu theo tháng"
            extra={
              <RangePicker
                picker="month"
                size="small"
                value={monthRange}
                onChange={(d) => {
                  if (d && d[0] && d[1]) setMonthRange([d[0], d[1]]);
                  else setMonthRange(null);
                }}
              />
            }
          >
            <Column
              data={transformRevenueData(stats?.revenueByMonth || [], "month")}
              xField="yearMonth"
              yField="revenue"
              seriesField="type"
              isGroup
              height={260}
              columnWidthRatio={0.4}
              legend={{ position: "bottom" }}
              columnStyle={{ radius: [4, 4, 0, 0] }}
              label={{
                position: "top",
                formatter: (v: any) => `${Number(v).toLocaleString("vi-VN")}đ`,
              }}
              meta={{
                yearMonth: {
                  formatter: (v: string) => dayjs(v + "-01").format("MM/YYYY"),
                },
              }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} md={24}>
          <Card
            className="dashboard-card"
            title="Doanh thu theo năm"
            extra={
              <div>
                <Button
                  icon={<LeftOutlined />}
                  size="small"
                  onClick={() =>
                    setYearRange((p) => ({
                      startYear: p.startYear - 5,
                      endYear: p.endYear - 5,
                    }))
                  }
                />
                <Button
                  icon={<RightOutlined />}
                  size="small"
                  style={{ marginLeft: 8 }}
                  onClick={() =>
                    setYearRange((p) => ({
                      startYear: p.startYear + 5,
                      endYear: p.endYear + 5,
                    }))
                  }
                />
              </div>
            }
          >
            <Column
              data={transformRevenueData(stats?.revenueByYear || [], "year")}
              xField="year"
              yField="revenue"
              seriesField="type"
              isGroup
              height={260}
              columnWidthRatio={0.4}
              legend={{ position: "bottom" }}
              columnStyle={{ radius: [4, 4, 0, 0] }}
              label={{
                position: "top",
                formatter: (v: any) => `${Number(v).toLocaleString("vi-VN")}đ`,
              }}
            />
          </Card>
        </Col>
      </Row>


      {/* ===== Top sản phẩm ===== */}
      <Card
        className="dashboard-card"
        size="small"
        title="Top sản phẩm bán chạy"
        style={{ marginTop: 24 }}
      >
        <Table
          rowKey="variantId"
          columns={columns}
          dataSource={stats?.topProducts || []}
          pagination={{ pageSize: 5, showSizeChanger: false }}
          size="small"
          scroll={{ x: 600 }}
          rowClassName={(_, index) => (index % 2 === 0 ? "table-row-light" : "")}
        />
      </Card>
    </div>
  );
};

export default Dashboard;
