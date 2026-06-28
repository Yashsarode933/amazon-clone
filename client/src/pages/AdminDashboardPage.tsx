import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/store';
import { adminAPI, productsAPI, ordersAPI } from '../api/client';

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  recentOrders: any[];
  lowStockProducts: any[];
}

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector(state => state.auth);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check admin access
    if (!user || user.role !== 'ADMIN') {
      navigate('/');
      return;
    }

    loadStats();
  }, [user, navigate]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await adminAPI.updateOrderStatus(orderId, status);
      loadStats();
    } catch (error) {
      console.error('Failed to update order status', error);
    }
  };

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-gray-200 animate-pulse rounded-lg h-96" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-3xl font-bold text-amazon-orange">{stats?.totalProducts}</p>
          <p className="text-gray-600">Products</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-3xl font-bold text-amazon-orange">{stats?.totalOrders}</p>
          <p className="text-gray-600">Orders</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-3xl font-bold text-amazon-orange">{stats?.totalUsers}</p>
          <p className="text-gray-600">Customers</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-3xl font-bold text-amazon-orange">
            ${stats?.totalRevenue?.toFixed(2) || '0.00'}
          </p>
          <p className="text-gray-600">Revenue</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left">Order ID</th>
              <th className="text-left">Status</th>
              <th className="text-left">Total</th>
              <th className="text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {stats?.recentOrders.map(order => (
              <tr key={order.id} className="border-b">
                <td className="py-2">#{order.id.slice(-8)}</td>
                <td className="py-2">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="PLACED">Placed</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </td>
                <td className="py-2">${Number(order.totalAmount).toFixed(2)}</td>
                <td className="py-2">
                  <Link to={`/admin/orders/${order.id}`} className="text-blue-600 hover:underline">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Low Stock Products */}
      {stats?.lowStockProducts && stats.lowStockProducts.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4 text-red-600">Low Stock Alert</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.lowStockProducts.map(product => (
              <div key={product.id} className="border p-3 rounded">
                <p className="font-semibold">{product.title}</p>
                <p className="text-sm text-gray-600">Stock: {product.stock}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
