import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Table, Typography, Spin, message } from 'antd';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  QUERY_ORDERS,
  QUERY_PRODUCTS,
  QUERY_USERS,
  QUERY_CATEGORIES,
} from '../../api';

const { Title } = Typography;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658'];

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    orders: 0,
    products: 0,
    users: 0,
    revenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Execute API calls concurrently
        // Note: The API functions take (options, params). We pass {} as options and the query params as the second argument.
        const [ordersAll, productsAll, usersAll, categories] = await Promise.all([
             QUERY_ORDERS({}, { limit: 1000 }),
             QUERY_PRODUCTS({}, { limit: 1000 }),
             QUERY_USERS({}, { limit: 1000 }),
             QUERY_CATEGORIES({}, {})
        ]);

        const ordersList = Array.isArray(ordersAll) ? ordersAll : (ordersAll?.data || []);
        const productsList = Array.isArray(productsAll) ? productsAll : (productsAll?.data || []);
        const usersList = Array.isArray(usersAll) ? usersAll : (usersAll?.data || []);
        const categoriesList = Array.isArray(categories) ? categories : (categories?.data || []);

        // Stats
        // TODO: Exclude cancelled orders later
        const revenue = ordersList.reduce((sum, order) => sum + (order.totalSalePrice || 0), 0);

        // Recent Orders
        const recent = [...ordersList]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);

        // Chart Data
        const chartDataProcessed = categoriesList.map(cat => ({
            name: cat.name,
            count: cat.products ? cat.products.length : 0
        }));

        setStats({
            orders: ordersList.length,
            products: productsList.length,
            users: usersList.length,
            revenue
        });
        setRecentOrders(recent);
        setChartData(chartDataProcessed);

      } catch (error) {
        console.error("Dashboard fetch error:", error);
        message.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Customer Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Total Price',
      dataIndex: 'totalSalePrice',
      key: 'totalSalePrice',
      render: (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
          // Assuming simple mapping for now as status codes aren't defined in prompt
          return <span>{status}</span>;
      }
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" tip="Loading Dashboard..." />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Admin Dashboard</Title>

      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Total Orders" value={stats.orders} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Total Products" value={stats.products} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Total Users" value={stats.users} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
                title="Total Revenue"
                value={stats.revenue}
                precision={2}
                formatter={val => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        {/* Recent Orders Table */}
        <Col xs={24} lg={12}>
          <Card title="Recent Orders">
            <Table
                dataSource={recentOrders}
                columns={columns}
                rowKey="id"
                pagination={false}
                size="small"
            />
          </Card>
        </Col>

        {/* Chart */}
        <Col xs={24} lg={12}>
          <Card title="Products per Category">
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip
                            contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                            cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                        />
                        <Legend />
                        <Bar dataKey="count" name="Product Count">
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
