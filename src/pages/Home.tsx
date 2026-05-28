import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
  rating: { rate: number; count: number };
}

const fetchProducts = async (): Promise<Product[]> => {
  const response = await axios.get('https://fakestoreapi.com/products');
  return response.data;
};

const fetchCategories = async (): Promise<string[]> => {
  const response = await axios.get('https://fakestoreapi.com/products/categories');
  return response.data;
};

const fetchByCategory = async (category: string): Promise<Product[]> => {
  const response = await axios.get(`https://fakestoreapi.com/products/category/${category}`);
  return response.data;
};

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { data: categories } = useQuery<string[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const { data: allProducts, isLoading: isAllLoading } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: fetchProducts,
    enabled: selectedCategory === 'all',
  });

  const { data: categoryProducts, isLoading: isCategoryLoading } = useQuery<Product[]>({
    queryKey: ['products', selectedCategory],
    queryFn: () => fetchByCategory(selectedCategory),
    enabled: selectedCategory !== 'all',
  });

  const products = selectedCategory === 'all' ? allProducts : categoryProducts;
  const isLoading = isAllLoading || isCategoryLoading;

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Products</h1>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        style={{ padding: '0.5rem', marginBottom: '1rem', fontSize: '1rem' }}
      >
        <option value="all">All Categories</option>
        {categories?.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      {isLoading && <p>Loading products...</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
        {products?.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Home;
