import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { fetchProducts } from '../store/productSlice';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector(state => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 20 }));
  }, [dispatch]);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-64" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Featured Products</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
