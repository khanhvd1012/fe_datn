import React from 'react';
import { Card, Row, Col, Statistic, Table, DatePicker, Spin } from 'antd';
import { 
  ShoppingOutlined, 
  ShoppingCartOutlined, 
  UsergroupAddOutlined, 
  DollarOutlined 
} from '@ant-design/icons';
import { Line } from '@ant-design/charts';
import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '../../service/dashboardAPI';

const { RangePicker } = DatePicker;

interface DashboardProduct {
  _id: string;
  name: string;
  totalSales: number;
  totalRevenue: number;
}

// Định nghĩa một số style để làm cho dashboard nhỏ gọn hơn
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

const DashBoard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats
  });

  const columns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      width: '40%',
    },
    {
      title: 'Số lượng',
      dataIndex: 'totalSales',
      key: 'totalSales',
      width: '30%',
      sorter: (a: DashboardProduct, b: DashboardProduct) => a.totalSales - b.totalSales,
    },
    {
      title: 'Doanh thu',
      dataIndex: 'totalRevenue',
      key: 'totalRevenue',
      width: '30%',
      render: (value: number) => `${value.toLocaleString('en-US')}$`,
      sorter: (a: DashboardProduct, b: DashboardProduct) => a.totalRevenue - b.totalRevenue,
    },
  ];

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Spin size="small" />
      </div>
    );
  }

  return (
    <div style={styles.dashboard}>
      {/* Thống kê tổng quan */}
      <Row gutter={[12, 12]}>
        <Col xs={12} sm={12} md={6}>
          <Card size="small" style={styles.card} bodyStyle={{ padding: '12px' }}>
            <Statistic
              title="Tổng sản phẩm"
              value={stats?.totalProducts || 0}
              prefix={<ShoppingOutlined />}
              valueStyle={{ fontSize: '18px' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card size="small" style={styles.card} bodyStyle={{ padding: '12px' }}>
            <Statistic
              title="Tổng đơn hàng"
              value={stats?.totalOrders || 0}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ fontSize: '18px' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card size="small" style={styles.card} bodyStyle={{ padding: '12px' }}>
            <Statistic
              title="Doanh thu tháng"
              value={stats?.monthlyRevenue || 0}
              prefix={<DollarOutlined />}
              suffix="$"
              valueStyle={{ fontSize: '18px' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card size="small" style={styles.card} bodyStyle={{ padding: '12px' }}>
            <Statistic
              title="Tổng người dùng"
              value={stats?.totalUsers || 0}
              prefix={<UsergroupAddOutlined />}
              valueStyle={{ fontSize: '18px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ thống kê đơn hàng */}
      <Card 
        size="small"
        title="Thống kê đơn hàng"
        style={styles.chartCard}
        bodyStyle={{ padding: '12px', height: '250px' }}
        extra={<RangePicker size="small" />}
      >
        <Line
          data={stats?.ordersByDate || []}
          xField="date"
          yField="orders"
          point={{
            size: 4,
            shape: 'diamond',
          }}
          height={200}
          autoFit={true}
        />
      </Card>

      {/* Bảng sản phẩm bán chạy */}
      <Card 
        size="small" 
        title="Top sản phẩm bán chạy"
        style={styles.tableCard}
        bodyStyle={{ padding: '12px' }}
      >
        <Table 
          columns={columns} 
          dataSource={stats?.topProducts || []} 
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  );
};

export default DashBoard;