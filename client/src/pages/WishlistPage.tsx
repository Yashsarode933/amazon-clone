import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { wishlistAPI, cartAPI } from '../api/client';

interface WishlistItem {
  id: string;
  title: string;
  image?: string;
}

interface Wishlist {
  id: string;
  userId: string;
  items: WishlistItem[];
}

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    setLoading(true);
    try {
      const response = await wishlistAPI.get();
      setWishlist(response.data);
    } catch (error) {
      console.error('Failed to load wishlist', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (itemId: string) => {
    try {
      await wishlistAPI.remove(itemId);
      loadWishlist();
    } catch (error) {
      console.error('Failed to remove from wishlist', error);
    }
  };

  const handleMoveToCart = async (productId: string) => {
    try {
      await cartAPI.add({ productId, quantity: 1 });
      // Optionally remove from wishlist after adding to cart
    } catch (error) {
      console.error('Failed to add to cart', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-gray-200 animate-pulse h-96 rounded-lg" />
      </div>
    );
  }

  if (!wishlist || wishlist.items.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center py-16">
        <h1 className="text-3xl font-bold mb-4">Your Wishlist is Empty</h1>
        <p className="text-gray-600 mb-8">Save items to your wishlist for later!</p>
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
      <h1 className="text-3xl font-bold mb-6">Your Wishlist</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {wishlist.items.map(item => (
          <div key={item.id} className="bg-white rounded-lg shadow p-4">
            <img
              src={item.image || '/placeholder-product.png'}
              alt={item.title}
              className="w-full h-48 object-cover rounded mb-2"
            />

            <h3 className="font-semibold text-sm mb-2 line-clamp-2">{item.title}</h3>

            <div className="flex flex-col space-y-2">
              <button
                onClick={() => handleMoveToCart(item.id)}
                className="text-xs bg-amazon-orange hover:bg-orange-600 text-white py-1 px-2 rounded"
              >
                Move to Cart
              </button>
              <button
                onClick={() => handleRemove(item.id)}
                className="text-xs text-blue-600 hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
