import { FC } from 'react';
import { Link } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  rating: number | null;
  reviewCount: number;
  categoryId: string;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const mainImage = product.images && product.images.length > 0
    ? product.images[0]
    : 'https://placehold.co/300x300/EEE/31343C?text=No+Image';

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <Link to={`/product/${product.id}`}>
        <div className="aspect-square mb-3">
          <img
            src={mainImage}
            alt={product.title}
            className="w-full h-full object-cover rounded"
          />
        </div>
        <h3 className="font-medium text-sm line-clamp-2 mb-2">{product.title}</h3>
        <div className="flex items-center mb-1">
          <span className="text-amazon-orange font-bold text-lg">${product.price.toFixed(2)}</span>
        </div>
        <div className="text-xs text-gray-600">
          {product.rating && product.rating > 0 ? (
            <span>⭐ {product.rating.toFixed(1)} ({product.reviewCount} reviews)</span>
          ) : (
            <span>No ratings yet</span>
          )}
        </div>
        {product.stock < 5 && product.stock > 0 && (
          <div className="text-xs text-red-600 mt-1">Only {product.stock} left in stock</div>
        )}
        {product.stock === 0 && (
          <div className="text-xs text-gray-500 mt-1">Currently unavailable</div>
        )}
      </Link>
    </div>
  );
};

export default ProductCard;
