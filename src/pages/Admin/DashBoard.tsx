import { Card, Row, Col, Statistic, Table, DatePicker, Spin, Button, message } from "antd";
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

const { RangePicker } = DatePicker;

interface IRevenueData {
  date: string;
  orderRevenue: number;
  actualRevenue: number;
  difference: number;
}

interface IMonthlyRevenueData {
  yearMonth: string;
  orderRevenue: number;
  actualRevenue: number;
  difference: number;
}

interface IYearlyRevenueData {
  year: number;
  orderRevenue: number;
  actualRevenue: number;
  difference: number;
}

interface IDashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  ordersByDate: { date: string; orders: number }[];
  revenueByDate: IRevenueData[];
  totalOrderRevenue: number;
  totalActualRevenue: number;
  revenueLast7Days: IRevenueData[];
  revenueByYear: IYearlyRevenueData[];
  productsByCategory: { categoryName: string; count: number }[];
  topProducts: ITopProduct[];
  deliveredPaidOrders: number;
  revenueByMonth: IMonthlyRevenueData[];
}

const Dashboard = () => {
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [monthRange, setMonthRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const currentYear = new Date().getFullYear();
  const [yearRange, setYearRange] = useState({ startYear: currentYear - 4, endYear: currentYear });
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

  // Debug: Log dữ liệu để kiểm tra
  useEffect(() => {
    if (stats) {
      console.log("Stats data:", stats);
      console.log("Revenue by Date:", stats.revenueByDate);
      console.log("Revenue by Month:", stats.revenueByMonth);
      console.log("Revenue by Year:", stats.revenueByYear);
    }
    if (error) {
      console.error("Error fetching stats:", error);
    }
  }, [stats, error]);

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

  // Hàm xử lý chung để hiển thị orderRevenue, actualRevenue và difference
  const transformRevenueData = (
    data: any[],
    type: "day" | "month" | "year" = "day"
  ) => {
    if (!data || data.length === 0) return [];
    const result: any[] = [];
    data.forEach((item: any) => {
      const orderRev = Number(item.orderRevenue) || 0;
      const actualRev = Number(item.actualRevenue) || 0;
      const diffRev = Number(item.difference) || 0;

      let dateField = "date";
      if (type === "month") dateField = "yearMonth";
      if (type === "year") dateField = "year";

      result.push(
        { [dateField]: item[dateField], revenue: orderRev, type: "Doanh thu đơn hàng" },
        { [dateField]: item[dateField], revenue: actualRev, type: "Doanh thu thực tế" },
        { [dateField]: item[dateField], revenue: diffRev, type: "Chênh lệch" }
      );
    });
    return result;
  };

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

  if (error) {
    return (
      <div style={{ padding: "16px", textAlign: "center", color: "red" }}>
        Lỗi khi tải dữ liệu: {error.message}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px" }}>
      {/* Thống kê số liệu - 6 ô ngang nhau */}
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={8} md={4} lg={4}>
          <Card>
            <Statistic
              title="Tổng sản phẩm"
              value={stats?.totalProducts || 0}
              prefix={<ShoppingOutlined style={{ color: "#1890ff" }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4} lg={4}>
          <Card>
            <Statistic
              title="Tổng đơn hàng"
              value={stats?.totalOrders || 0}
              prefix={<ShoppingCartOutlined style={{ color: "#52c41a" }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4} lg={4}>
          <Card>
            <Statistic
              title="Doanh thu đơn hàng"
              value={stats?.totalOrderRevenue || 0}
              prefix={<DollarOutlined style={{ color: "#faad14" }} />}
              suffix="đ"
              formatter={(val) => Number(val).toLocaleString("vi-VN")}
            />
          </Card>
        </Col>

        <Col xs={12} sm={8} md={4} lg={4}>
          <Card>
            <Statistic
              title="Doanh thu thực tế"
              value={stats?.totalActualRevenue || 0}
              prefix={<DollarOutlined style={{ color: "#faad14" }} />}
              suffix="đ"
              formatter={(val) => Number(val).toLocaleString("vi-VN")}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4} lg={4}>
          <Card>
            <Statistic
              title="Đã giao - thanh toán"
              value={stats?.deliveredPaidOrders || 0}
              prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4} lg={4}>
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
        {/* Thống kê đơn hàng */}
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
              meta={{
                orders: { alias: "Số đơn hàng" },
                date: { formatter: (v: string) => dayjs(v).format("DD/MM") },
              }}
            />
          </Card>
        </Col>

        {/* Doanh thu ngày */}
        <Col xs={24} md={12}>
          <Card
            title="Doanh thu ngày"
            extra={
              <RangePicker
                size="small"
                value={[dayRange.start, dayRange.end]}
                onChange={(dates) => {
                  if (dates && dates[0] && dates[1]) {
                    const diff = dates[1].diff(dates[0], "day");
                    if (diff > 6) {
                      message.warning({
                        content: "Khoảng thời gian không được vượt quá 6 ngày!",
                        key: "range-limit",
                      });
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
              height={250}
              columnWidthRatio={0.15}
              label={{
                position: "top",
                formatter: (v: any) => `${Number(v).toLocaleString("vi-VN")}đ`,
              }}
              legend={{ position: "top" }}
              columnStyle={{ radius: [4, 4, 0, 0] }}
              meta={{
                revenue: { alias: "Doanh thu" },
                date: { formatter: (v: string) => dayjs(v).format("DD/MM") },
              }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
        {/* Doanh thu theo tháng */}
        <Col xs={24} md={12}>
          <Card
            title="Doanh thu theo tháng"
            extra={
              <RangePicker
                picker="month"
                size="small"
                value={monthRange}
                onChange={(dates) => {
                  if (dates && dates[0] && dates[1]) {
                    setMonthRange([dates[0], dates[1]]);
                  } else {
                    setMonthRange(null);
                  }
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
              height={250}
              columnWidthRatio={0.5}
              label={{
                position: "top",
                formatter: (v: any) => `${Number(v).toLocaleString("vi-VN")}đ`,
              }}
              legend={{ position: "top" }}
              columnStyle={{ radius: [4, 4, 0, 0] }}
              meta={{
                revenue: { alias: "Doanh thu" },
                yearMonth: { formatter: (v: string) => dayjs(v + "-01").format("MM/YYYY") },
              }}
            />
          </Card>
        </Col>

        {/* Doanh thu theo năm */}
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
              data={transformRevenueData(stats?.revenueByYear || [], "year")}
              xField="year"
              yField="revenue"
              seriesField="type"
              isGroup
              height={250}
              label={{
                position: "top",
                formatter: (v: any) => `${Number(v).toLocaleString("vi-VN")}đ`,
              }}
              legend={{ position: "top" }}
              columnStyle={{ radius: [4, 4, 0, 0] }}
              meta={{
                revenue: { alias: "Doanh thu" },
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Bảng top sản phẩm */}
      <Card size="small" title="Top sản phẩm bán chạy" style={{ marginTop: "16px" }}>
        <Table
          rowKey="variantId"
          columns={columns}
          dataSource={stats?.topProducts || []}
          pagination={{ pageSize: 5, showSizeChanger: false }}
          size="small"
        />
      </Card>
    </div>
  );
};

export default Dashboard;
