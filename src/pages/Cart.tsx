import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { removeFromCart, clearCart } from '../redux/cartSlice';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const items = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    dispatch(clearCart());
    alert('Checkout successful! Your cart has been cleared.');
    navigate('/');
  };

  if (items.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Your cart is empty!</h2>
        <button
          onClick={() => navigate('/')}
          style={{ background: '#333', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '5px', cursor: 'pointer' }}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Shopping Cart</h1>
      <p>Total Items: {totalItems}</p>
      {items.map(item => (
        <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid #ddd', padding: '1rem 0' }}>
          <img src={item.image} alt={item.title} style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '0.9rem' }}>{item.title}</h3>
            <p>Quantity: {item.quantity}</p>
            <p>Price: ${(item.price * item.quantity).toFixed(2)}</p>
          </div>
          <button
            onClick={() => dispatch(removeFromCart(item.id))}
            style={{ background: '#ff6b6b', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '5px', cursor: 'pointer' }}
          >
            Remove
          </button>
        </div>
      ))}
      <h2>Total Price: ${totalPrice.toFixed(2)}</h2>
      <button
        onClick={handleCheckout}
        style={{ background: '#4CAF50', color: 'white', border: 'none', padding: '1rem 2rem', borderRadius: '5px', cursor: 'pointer', fontSize: '1rem' }}
      >
        Checkout
      </button>
    </div>
  );
};

export default Cart;
