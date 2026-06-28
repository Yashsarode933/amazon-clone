import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/store';
import { fetchCart } from '../store/cartSlice';
import { addressesAPI, ordersAPI } from '../api/client';

interface Address {
  id: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items, totalPrice } = useAppSelector(state => state.cart);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US'
  });

  useEffect(() => {
    dispatch(fetchCart());
    loadAddresses();
  }, [dispatch]);

  const loadAddresses = async () => {
    setLoading(true);
    try {
      const response = await addressesAPI.getAll();
      setAddresses(response.data);
      if (response.data.length > 0) {
        setSelectedAddressId(response.data[0].id);
      }
    } catch (error) {
      console.error('Failed to load addresses', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await addressesAPI.create(newAddress);
      setAddresses([...addresses, response.data]);
      setSelectedAddressId(response.data.id);
      setShowAddForm(false);
      setNewAddress({
        fullName: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'US'
      });
    } catch (error) {
      console.error('Failed to add address', error);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      alert('Please select a shipping address');
      return;
    }

    setSubmitting(true);
    try {
      // Create Stripe checkout session
      const response = await ordersAPI.createCheckout();

      // Redirect to Stripe checkout
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Failed to create checkout session', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-gray-200 animate-pulse rounded-lg h-96" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center py-16">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Link to="/" className="text-blue-600 hover:underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping & Payment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Shipping Address</h2>

            {addresses.length === 0 && !showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="text-blue-600 hover:underline"
              >
                + Add a new address
              </button>
            )}

            {addresses.length > 0 && (
              <div className="space-y-4">
                <select
                  value={selectedAddressId}
                  onChange={(e) => setSelectedAddressId(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  {addresses.map(addr => (
                    <option key={addr.id} value={addr.id}>
                      {addr.fullName}, {addr.city}, {addr.state}
                    </option>
                  ))}
                </select>

                <div>
                  {addresses
                    .filter(addr => addr.id === selectedAddressId)
                    .map(addr => (
                      <div key={addr.id} className="border p-3 rounded bg-gray-50">
                        <p><strong>{addr.fullName}</strong></p>
                        <p>{addr.addressLine1}</p>
                        {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                        <p>{addr.city}, {addr.state} {addr.postalCode}</p>
                        <p>{addr.country}</p>
                      </div>
                    ))}
                </div>

                <button
                  onClick={() => setShowAddForm(true)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  + Add another address
                </button>
              </div>
            )}

            {/* Add Address Form */}
            {showAddForm && (
              <form onSubmit={handleAddAddress} className="mt-4 space-y-4 border-t pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newAddress.fullName}
                    onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                    className="border rounded px-3 py-2"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Country"
                    value={newAddress.country}
                    onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                    className="border rounded px-3 py-2"
                    required
                  />
                </div>

                <input
                  type="text"
                  placeholder="Address Line 1"
                  value={newAddress.addressLine1}
                  onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                />

                <input
                  type="text"
                  placeholder="Address Line 2 (Optional)"
                  value={newAddress.addressLine2}
                  onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="border rounded px-3 py-2"
                    required
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    className="border rounded px-3 py-2"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Postal Code"
                    value={newAddress.postalCode}
                    onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                    className="border rounded px-3 py-2"
                    required
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-amazon-orange hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Save Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="text-gray-600 hover:underline"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Payment Method</h2>
            <div className="border p-4 rounded bg-gray-50">
              <p><strong>Credit/Debit Card</strong></p>
              <p className="text-sm text-gray-600 mt-2">
                (Stripe test mode integration will be added)
              </p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.title} × {item.quantity}</span>
                  <span>${Number(item.price || 0).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-2">
              <div className="flex justify-between mb-2">
                <span>Subtotal ({items.reduce((sum, i) => sum + i.quantity, 0)} items):</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>

              <div className="flex justify-between mb-2">
                <span>Shipping:</span>
                <span className="text-green-600">FREE</span>
              </div>

              <div className="flex justify-between font-bold text-xl">
                <span>Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={submitting}
              className="w-full bg-amazon-orange hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg mt-6 transition disabled:opacity-50"
            >
              {submitting ? 'Placing Order...' : 'Place Your Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
