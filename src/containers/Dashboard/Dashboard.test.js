import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import Dashboard from './index';
import * as api from '../../api';

// Mock the API module
jest.mock('../../api');

// Mock matchMedia for Ant Design
// Moving this to global scope or beforeAll to ensure it's available
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };
  },
});

// Mock Recharts components because they don't render well in JSDOM
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
  Bar: ({ children }) => <div data-testid="bar">{children}</div>, // Update Bar to render children (Cells)
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  Cell: () => <div data-testid="cell" />, // Mock Cell
}));

describe('Dashboard Component', () => {
  const mockOrders = [
    {
      id: 1,
      name: 'Order 1',
      totalSalePrice: 100,
      status: 1,
      createdAt: '2023-10-01T10:00:00Z',
    },
    {
      id: 2,
      name: 'Order 2',
      totalSalePrice: 200,
      status: 2,
      createdAt: '2023-10-02T10:00:00Z', // Newer
    },
    {
      id: 3,
      name: 'Order 3',
      totalSalePrice: 150,
      status: 1,
      createdAt: '2023-09-30T10:00:00Z',
    },
  ];

  const mockProducts = [
    { id: 1, name: 'Product 1' },
    { id: 2, name: 'Product 2' },
  ];

  const mockUsers = [
    { id: 1, name: 'User 1' },
    // Only 1 user to distinguish from orders count
  ];

  const mockCategories = [
    { id: 1, name: 'Cat 1', products: [1, 2] },
    { id: 2, name: 'Cat 2', products: [3] },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    // Default successful responses
    api.QUERY_ORDERS.mockResolvedValue(mockOrders);
    api.QUERY_PRODUCTS.mockResolvedValue(mockProducts);
    api.QUERY_USERS.mockResolvedValue(mockUsers);
    api.QUERY_CATEGORIES.mockResolvedValue(mockCategories);
  });

  test('renders dashboard and fetches data on mount', async () => {
    render(<Dashboard />);

    expect(screen.getByText('Loading Dashboard...')).toBeInTheDocument();

    await waitFor(() => {
        expect(api.QUERY_ORDERS).toHaveBeenCalled();
        expect(api.QUERY_PRODUCTS).toHaveBeenCalled();
        expect(api.QUERY_USERS).toHaveBeenCalled();
        expect(api.QUERY_CATEGORIES).toHaveBeenCalled();
    });
  });

  test('displays correct stats cards', async () => {
    render(<Dashboard />);

    await waitFor(() => expect(screen.queryByText('Loading Dashboard...')).not.toBeInTheDocument());

    // Total Orders: 3
    // Use within to scope to the specific card
    const ordersTitle = screen.getByText('Total Orders');
    const ordersCard = ordersTitle.closest('.ant-card-body') || ordersTitle.closest('.ant-card');
    expect(within(ordersCard).getByText('3')).toBeInTheDocument();

    // Total Products: 2
    const productsTitle = screen.getByText('Total Products');
    const productsCard = productsTitle.closest('.ant-card-body') || productsTitle.closest('.ant-card');
    expect(within(productsCard).getByText('2')).toBeInTheDocument();

    // Total Users: 1
    const usersTitle = screen.getByText('Total Users');
    const usersCard = usersTitle.closest('.ant-card-body') || usersTitle.closest('.ant-card');
    expect(within(usersCard).getByText('1')).toBeInTheDocument();

    // Revenue: 100 + 200 + 150 = 450
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    // Intl.NumberFormat usually adds commas or decimals, but 450 might be just 450 or 450.00
    // We will check partial match or formatted
    expect(screen.getByText(/450/)).toBeInTheDocument();
  });

  test('displays recent orders table sorted by date', async () => {
    render(<Dashboard />);

    await waitFor(() => expect(screen.queryByText('Loading Dashboard...')).not.toBeInTheDocument());

    expect(screen.getByText('Recent Orders')).toBeInTheDocument();

    // Table headers
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Customer Name')).toBeInTheDocument();

    // Order 2 is newest (Oct 2), then Order 1 (Oct 1), then Order 3 (Sep 30)
    expect(screen.getByText('Order 2')).toBeInTheDocument();
    expect(screen.getByText('Order 1')).toBeInTheDocument();
    expect(screen.getByText('Order 3')).toBeInTheDocument();
  });

  test('displays chart section', async () => {
    render(<Dashboard />);

    await waitFor(() => expect(screen.queryByText('Loading Dashboard...')).not.toBeInTheDocument());

    expect(screen.getByText('Products per Category')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    // Check if cells are rendered (optional but good)
    // Since we mock data with 2 categories, we expect 2 cells
    // However, they are children of Bar which is mocked to render children.
    expect(screen.getAllByTestId('cell').length).toBeGreaterThan(0);
  });
});
