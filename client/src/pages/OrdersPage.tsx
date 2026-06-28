import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ordersAPI } from '../api/client';

interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

interface OrderAddress {
  id: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
}

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
  address?: OrderAddress;
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await ordersAPI.getAll();
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to load orders', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLACED':
        return 'bg-blue-100 text-blue-800';
      case 'PROCESSING':
        return 'bg-yellow-100 text-yellow-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-gray-200 animate-pulse rounded-lg h-96" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center py-16">
        <h1 className="text-3xl font-bold mb-4">No Orders Yet</h1>
        <p className="text-gray-600 mb-8">You haven't placed any orders yet.</p>
        <Link
          to="/"
          className="inline-block bg-amazon-orange hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>

      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-600">Order #{order.id.slice(-8)}</p>
                <p className="text-sm text-gray-600">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <span className={`px-3 py-1 text-sm rounded ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>

            <div className="border-t pt-4">
              {order.items.map(item => (
                <div key={item.id} className="flex justify-between py-2">
                  <span>{item.title} × {item.quantity}</span>
                  <span>${Number(item.price).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-3 mt-3 flex justify-between font-bold">
              <span>Total:</span>
              <span>${Number(order.totalAmount).toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
