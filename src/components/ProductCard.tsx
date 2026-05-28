import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { AppDispatch } from '../redux/store';

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
  rating: { rate: number; count: number };
}

const ProductCard = ({ product }: { product: Product }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
    }));
  };

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <img
        src={product.image}
        alt={product.title}
        style={{ width: '100%', height: '200px', objectFit: 'contain' }}
        onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200'; }}
      />
      <h3 style={{ fontSize: '0.9rem' }}>{product.title}</h3>
      <p style={{ color: '#888', fontSize: '0.8rem' }}>{product.category}</p>
      <p style={{ fontSize: '0.8rem' }}>{product.description.substring(0, 100)}...</p>
      <p>⭐ {product.rating.rate} ({product.rating.count})</p>
      <p style={{ fontWeight: 'bold', color: '#e44d26' }}>${product.price}</p>
      <button
        onClick={handleAddToCart}
        style={{ background: '#333', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '5px', cursor: 'pointer' }}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
