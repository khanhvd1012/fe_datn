import { Card, Row, Col, Statistic, Table, DatePicker, Spin } from "antd";
import { Line } from "@ant-design/charts";
import { ShoppingOutlined, ShoppingCartOutlined, UsergroupAddOutlined, DollarOutlined } from "@ant-design/icons";
import { useState } from "react";
import dayjs from "dayjs";
import type { ITopProduct } from "../../interface/dashboard";
import { useDashboardStats } from "../../hooks/useDasboard";

const { RangePicker } = DatePicker;

const styles = {
  card: {
    marginBottom: '12px',
  },
  statistic: {
    fontSize: '14px',
  },
  chartCard: {
    marginBottom: '12px',
    height: '300px',
  },
  tableCard: {
    marginBottom: '12px',
  },
  dashboard: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '12px',
  }
};

const Dashboard = () => {
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);

  const { data: stats, isLoading } = useDashboardStats(
    dateRange
      ? {
        startDate: dateRange[0].format("YYYY-MM-DD"),
        endDate: dateRange[1].format("YYYY-MM-DD"),
      }
      : {}
  );

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      width: "40%",
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
      width: "30%",
      render: (sku: string) => <span style={{ fontWeight: 500 }}>{sku}</span>,
    },
    {
      title: "Số lượng",
      dataIndex: "totalSales",
      key: "totalSales",
      width: "30%",
      sorter: (a: ITopProduct, b: ITopProduct) => a.totalSales - b.totalSales,
    },
    {
      title: "Doanh thu",
      dataIndex: "totalRevenue",
      key: "totalRevenue",
      width: "30%",
      render: (value: number) => `${value.toLocaleString("vi-VN")} đ`,
      sorter: (a: ITopProduct, b: ITopProduct) => a.totalRevenue - b.totalRevenue,
    },
  ];

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <Spin size="small" />
      </div>
    );
  }

  return (
    <div style={styles.dashboard}>
      <Row gutter={[12, 12]}>
        <Col xs={12} sm={12} md={6}>
          <Card size="small" style={styles.card} bodyStyle={{ padding: '12px' }}>
            <Statistic title="Tổng sản phẩm" value={stats?.totalProducts || 0} prefix={<ShoppingOutlined />} valueStyle={{ fontSize: '18px' }} />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card size="small" style={styles.card} bodyStyle={{ padding: '12px' }}>
            <Statistic title="Tổng đơn hàng" value={stats?.totalOrders || 0} prefix={<ShoppingCartOutlined />} valueStyle={{ fontSize: '18px' }} />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card size="small" style={styles.card} bodyStyle={{ padding: '12px' }}>
            <Statistic
              title="Doanh thu tháng"
              value={stats?.monthlyRevenue || 0}
              prefix={<DollarOutlined />}
              suffix="đ"
              formatter={(v) => Number(v).toLocaleString("vi-VN")}
              valueStyle={{ fontSize: '18px' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card size="small" style={styles.card} bodyStyle={{ padding: '12px' }}>
            <Statistic title="Tổng người dùng" value={stats?.totalUsers || 0} prefix={<UsergroupAddOutlined />} valueStyle={{ fontSize: '18px' }} />
          </Card>
        </Col>
      </Row>

      <Card
        size="small"
        title="Thống kê đơn hàng"
        style={styles.chartCard}
        bodyStyle={{ padding: '12px', height: '250px' }}
        extra={
          <RangePicker size="small"
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
        <Line data={stats?.ordersByDate || []} xField="date" yField="orders" point={{ size: 4, shape: "diamond" }} height={200} autoFit={true} />
      </Card>

      <Card size="small" title="Top sản phẩm bán chạy" style={styles.tableCard} bodyStyle={{ padding: '12px' }}>
        <Table rowKey="variantId" columns={columns} dataSource={stats?.topProducts || []} pagination={false} size="small" />
      </Card>
    </div>
  );
};

export default Dashboard;
