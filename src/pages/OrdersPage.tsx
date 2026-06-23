import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

interface Order {
  id: string;
  userId: string;
  items: any[];
  totalPrice: number;
  createdAt: string;
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged((currentUser) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    const q = query(collection(db, 'orders'), where('userId', '==', currentUser.uid));
    getDocs(q).then(querySnapshot => {
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[];
      setOrders(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    });
  });

  return () => unsubscribe();
}, [navigate]);

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Order History</h1>
      {orders.length === 0 ? (
        <p>No orders yet!</p>
      ) : (
        <div>
          {orders.map(order => (
            <div key={order.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', cursor: 'pointer' }}
              onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}>
              <p><strong>Order ID:</strong> {order.id}</p>
              <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
              <p><strong>Total:</strong> ${order.totalPrice?.toFixed(2)}</p>
              <p><strong>Items:</strong> {order.items?.length} product(s)</p>
              {selectedOrder?.id === order.id && (
                <div style={{ marginTop: '1rem', borderTop: '1px solid #ddd', paddingTop: '1rem' }}>
                  <h4>Order Details:</h4>
                  {order.items?.map((item: any, index: number) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                      <img src={item.image} alt={item.title} style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
                      <div>
                        <p style={{ fontSize: '0.9rem' }}>{item.title}</p>
                        <p>Qty: {item.quantity} × ${item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage; 