import React, { useEffect, useState } from "react";
import { Card, Row, Col, Table, Spin, Alert, Statistic, Tag } from "antd";
import moment from "moment";
import { QUERY_ORDERS, QUERY_PRODUCTS, QUERY_USERS, QUERY_CATEGORIES } from "api";
import { ORDER_STATUS, DATE_FORMAT } from "utils/constant";
import { currencyFormat } from "utils/currencyFormat";
import Link from "components/Link";
import { ORDER_UPDATE } from "config/urls";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      // Note: For accurate revenue calculation, we fetch more orders
      // In production, consider implementing a dedicated dashboard stats endpoint
      const [ordersResponse, productsResponse, usersResponse, categoriesResponse] = await Promise.all([
        QUERY_ORDERS(null, { page: 1, limit: 1000 }),
        QUERY_PRODUCTS(null, { page: 1, limit: 1000 }),
        QUERY_USERS(null, { page: 1, limit: 1000 }),
        QUERY_CATEGORIES(null, { page: 1, limit: 100 }),
      ]);

      // Calculate stats
      const totalOrders = ordersResponse?.total || 0;
      const totalProducts = productsResponse?.total || 0;
      const totalUsers = usersResponse?.total || 0;

      // Calculate total revenue from all orders
      const totalRevenue = ordersResponse?.data?.reduce(
        (sum, order) => sum + (order.totalSalePrice || 0),
        0
      ) || 0;

      setStats({
        totalOrders,
        totalProducts,
        totalUsers,
        totalRevenue,
      });

      // Get 5 most recent orders (sorted by createdAt)
      const sortedOrders = [...(ordersResponse?.data || [])]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentOrders(sortedOrders);

      // Calculate products per category
      const categories = categoriesResponse?.data || [];
      const categoryData = categories.map((category) => ({
        name: category.name,
        productCount: category.products?.length || 0,
      }));
      setCategoryStats(categoryData);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
      setLoading(false);
    }
  };

  const orderColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text) => (
        <Link to={ORDER_UPDATE} params={{ id: text }}>
          {text}
        </Link>
      ),
    },
    {
      title: "Customer Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => moment(text).format(DATE_FORMAT),
    },
    {
      title: "Total Price",
      dataIndex: "totalSalePrice",
      key: "totalSalePrice",
      render: (text) => currencyFormat(text),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusObj = ORDER_STATUS?.find((x) => x.value === status);
        return <Tag color={statusObj?.color}>{statusObj?.label}</Tag>;
      },
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        style={{ marginBottom: 20 }}
      />
    );
  }

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>

      {/* Stats Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Orders"
              value={stats.totalOrders}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Products"
              value={stats.totalProducts}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={stats.totalUsers}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={stats.totalRevenue}
              valueStyle={{ color: "#faad14" }}
              formatter={(value) => currencyFormat(value)}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Orders Table */}
      <Card title="Recent Orders" style={{ marginBottom: 24 }}>
        <Table
          rowKey="id"
          columns={orderColumns}
          dataSource={recentOrders}
          pagination={false}
          size="small"
        />
      </Card>

      {/* Products per Category Visualization */}
      {categoryStats.length > 0 && (
        <Card title="Products per Category">
          <div>
            {(() => {
              const maxCount = Math.max(...categoryStats.map(c => c.productCount), 1);
              return categoryStats.map((category) => {
                const widthPercentage = maxCount > 0 ? (category.productCount / maxCount) * 100 : 0;
                
                return (
                  <div
                    key={category.name}
                    style={{
                      marginBottom: 16,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ width: 150, marginRight: 16 }}>
                      {category.name}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          height: 30,
                          backgroundColor: "#1890ff",
                          width: `${Math.min(widthPercentage, 100)}%`,
                          borderRadius: 4,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          paddingRight: 8,
                          color: "white",
                          fontWeight: "bold",
                          minWidth: 40,
                        }}
                      >
                        {category.productCount}
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
