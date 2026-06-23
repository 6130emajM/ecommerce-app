import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { deleteUser, onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user: User | null) => {
        if (user) {
          setCurrentUser(user);

          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();

            setName(data.name || '');
            setAddress(data.address || '');
            setEmail(data.email || '');
          }
        }
      }
    );

    return () => unsubscribe();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentUser) {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        name,
        address,
      });

      setMessage('Profile updated!');
    }
  };

  const handleDelete = async () => {
    if (
      currentUser &&
      window.confirm('Are you sure you want to delete your account?')
    ) {
      await deleteDoc(doc(db, 'users', currentUser.uid));
      await deleteUser(currentUser);
      navigate('/');
    }
  };

  return (
    <div
      style={{
        padding: '2rem',
        maxWidth: '400px',
        margin: '0 auto',
      }}
    >
      <h2>Profile</h2>

      {message && (
        <p style={{ color: 'green' }}>
          {message}
        </p>
      )}

      <form onSubmit={handleUpdate}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            disabled
            style={{
              width: '100%',
              padding: '0.5rem',
              background: '#eee',
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            background: '#333',
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Update Profile
        </button>
      </form>

      <button
        onClick={handleDelete}
        style={{
          background: 'crimson',
          color: 'white',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '1rem',
        }}
      >
        Delete Account
      </button>
    </div>
  );
};

export default ProfilePage;