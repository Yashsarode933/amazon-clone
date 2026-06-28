import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/store';
import { fetchProductById, clearCurrentProduct } from '../store/productSlice';
import { addToCart } from '../store/cartSlice';
import ReviewForm from '../components/ReviewForm';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentProduct, loading } = useAppSelector(state => state.products);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [id, dispatch]);

  const handleAddToCart = () => {
    if (currentProduct && currentProduct.id) {
      dispatch(addToCart({ productId: currentProduct.id, quantity }));
    }
  };

  const handleBuyNow = () => {
    if (currentProduct && currentProduct.id) {
      dispatch(addToCart({ productId: currentProduct.id, quantity }));
      navigate('/cart');
    }
  };

  if (loading || !currentProduct) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-gray-200 animate-pulse rounded-lg h-96" />
      </div>
    );
  }

  const product = currentProduct;

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg">
            <img
              src={product.images?.[0] || 'https://placehold.co/600x600/EEE/31343C?text=No+Image'}
              alt={product.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex space-x-2">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${product.title} ${idx + 1}`}
                  className="w-20 h-20 object-cover rounded border cursor-pointer hover:border-amazon-orange"
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-2xl font-bold mb-2">{product.title}</h1>

          <div className="text-3xl text-amazon-orange font-bold mb-4">
            ${product.price.toFixed(2)}
          </div>

          <div className="flex items-center mb-4">
            {product.rating && product.rating > 0 ? (
              <>
                <span className="text-amazon-orange mr-2">
                  ⭐ {product.rating.toFixed(1)}
                </span>
                <span className="text-gray-600">({product.reviewCount} reviews)</span>
              </>
            ) : (
              <span className="text-gray-600">No ratings yet</span>
            )}
          </div>

          <div className="mb-4">
            <h2 className="font-semibold mb-2">Product Description:</h2>
            <p className="text-gray-700">{product.description}</p>
          </div>

          <div className="mb-4">
            <span className={`px-2 py-1 text-sm rounded ${
              product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
            </span>
          </div>

          {product.stock > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Quantity:</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="border rounded px-3 py-2"
              >
                {Array.from({ length: Math.min(10, product.stock) }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex space-x-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 bg-amazon-orange text-white py-2 px-4 rounded hover:bg-orange-600 transition disabled:opacity-50"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="flex-1 bg-amazon-dark text-white py-2 px-4 rounded hover:bg-gray-800 transition disabled:opacity-50"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>

        {product.reviews && product.reviews.length > 0 ? (
          <div className="space-y-4">
            {product.reviews.map((review: any) => (
              <div key={review.id} className="border-b pb-4">
                <div className="flex items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="text-amazon-orange mr-2">
                        {'⭐'.repeat(review.rating)}
                      </span>
                      <span className="font-semibold">{review.user?.name || 'Anonymous'}</span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No reviews yet. Be the first to review!</p>
        )}

        {/* Add Review Form */}
        <div className="mt-6">
          <ReviewForm productId={product.id} onReviewAdded={() => dispatch(fetchProductById(product.id))} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
