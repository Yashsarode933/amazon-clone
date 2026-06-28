import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/store';
import { fetchCart, updateCartItem, removeFromCart, clearCart } from '../store/cartSlice';

const CartPage = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error, totalPrice } = useAppSelector(state => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleQuantityChange = (cartItemId: string, quantity: number) => {
    if (quantity > 0) {
      dispatch(updateCartItem({ cartItemId, quantity }));
    }
  };

  const handleRemove = (cartItemId: string) => {
    dispatch(removeFromCart(cartItemId));
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-gray-200 animate-pulse h-96 rounded-lg" />
      </div>
    );
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-600">Error: {error}</div>;
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center py-16">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">Shop today's deals and add items to your cart!</p>
        <Link
          to="/"
          className="inline-block bg-amazon-orange hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow divide-y">
            {items.map(item => (
              <div key={item.id} className="p-4 flex items-center space-x-4">
                <img
                  src={item.image || '/placeholder-product.png'}
                  alt={item.title}
                  className="w-24 h-24 object-cover rounded"
                />

                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-amazon-orange font-bold text-xl">
                    ${Number(item.price || 0).toFixed(2)}
                  </p>

                  <div className="flex items-center mt-2 space-x-2">
                    <label className="text-sm">Qty:</label>
                    <select
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                      className="border rounded px-2 py-1"
                    >
                      {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-lg">
                    ${(Number(item.price || 0) * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-blue-600 hover:underline text-sm mt-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <button
              onClick={() => dispatch(clearCart())}
              className="text-blue-600 hover:underline"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="flex justify-between mb-2">
              <span>Items ({items.reduce((sum, i) => sum + i.quantity, 0)}):</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>

            <div className="flex justify-between mb-2">
              <span>Shipping:</span>
              <span className="text-green-600">FREE</span>
            </div>

            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-bold text-xl">
                <span>Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="block w-full bg-amazon-orange hover:bg-orange-600 text-white text-center font-bold py-3 px-4 rounded-lg mt-6 transition"
            >
              Proceed to Checkout
            </Link>

            <Link
              to="/"
              className="block w-full text-center text-blue-600 hover:underline mt-4"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
