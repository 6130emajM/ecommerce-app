import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { AppDispatch } from '../redux/store';

interface Product {
  id?: string;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ title: '', price: 0, category: '', description: '', image: '' });
  const dispatch = useDispatch<AppDispatch>();

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
    setProducts(data);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editProduct?.id) {
      await updateDoc(doc(db, 'products', editProduct.id), form);
    } else {
      await addDoc(collection(db, 'products'), form);
    }
    setForm({ title: '', price: 0, category: '', description: '', image: '' });
    setShowForm(false);
    setEditProduct(null);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'products', id));
    fetchProducts();
  };

  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setForm({ title: product.title, price: product.price, category: product.category, description: product.description, image: product.image });
    setShowForm(true);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Products</h1>
        <button onClick={() => { setShowForm(!showForm); setEditProduct(null); setForm({ title: '', price: 0, category: '', description: '', image: '' }); }}
          style={{ background: '#333', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
          <h3>{editProduct ? 'Edit Product' : 'Add Product'}</h3>
          <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }} />
          <input placeholder="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })} style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }} />
          <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }} />
          <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }} />
          <input placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }} />
          <button type="submit" style={{ background: '#4CAF50', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            {editProduct ? 'Update' : 'Add'}
          </button>
        </form>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
        {products.map(product => (
          <div key={product.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem' }}>
            <img src={product.image || 'https://placehold.co/200x200'} alt={product.title}
              style={{ width: '100%', height: '200px', objectFit: 'contain' }}
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/200x200'; }} />
            <h3 style={{ fontSize: '0.9rem' }}>{product.title}</h3>
            <p style={{ color: '#888', fontSize: '0.8rem' }}>{product.category}</p>
            <p style={{ fontWeight: 'bold', color: '#e44d26' }}>${product.price}</p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button onClick={() => dispatch(addToCart({ id: product.id as unknown as number, title: product.title, price: product.price, image: product.image, quantity: 1 }))}
                style={{ flex: 1, background: '#333', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '5px', cursor: 'pointer' }}>
                Add to Cart
              </button>
              <button onClick={() => handleEdit(product)}
                style={{ background: '#ffc107', border: 'none', padding: '0.5rem', borderRadius: '5px', cursor: 'pointer' }}>
                Edit
              </button>
              <button onClick={() => handleDelete(product.id!)}
                style={{ background: '#ff6b6b', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '5px', cursor: 'pointer' }}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
