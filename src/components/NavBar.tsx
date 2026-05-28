import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const items = useSelector((state: RootState) => state.cart.items);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const navigate = useNavigate();

  return (
    <nav style={{ background: '#333', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2 style={{ color: 'white', cursor: 'pointer' }} onClick={() => navigate('/')}>
        🛍️ E-Commerce Store
      </h2>
      <button
        onClick={() => navigate('/cart')}
        style={{ background: '#ff6b6b', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '5px', cursor: 'pointer', fontSize: '1rem' }}
      >
        🛒 Cart ({totalItems})
      </button>
    </nav>
  );
};

export default NavBar;
