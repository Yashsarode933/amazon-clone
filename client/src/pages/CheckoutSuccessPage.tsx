import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ordersAPI } from '../api/client';

const CheckoutSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      // Confirm the order with the session ID
      ordersAPI.confirm(sessionId);
    }
  }, [sessionId]);

  return (
    <div className="container mx-auto p-4 text-center py-16">
      <div className="bg-green-100 text-green-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-3xl font-bold mb-4">Thank you for your order!</h1>
      <p className="text-gray-600 mb-8">
        Your payment was successful. Your order has been placed and will be processed soon.
      </p>

      <div className="flex justify-center space-x-4">
        <Link
          to="/orders"
          className="bg-amazon-orange hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg transition"
        >
          View Your Orders
        </Link>
        <Link
          to="/"
          className="bg-amazon-dark hover:bg-gray-800 text-white font-bold py-2 px-6 rounded-lg transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
