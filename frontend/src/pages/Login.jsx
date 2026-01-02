import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import { useToast } from '../components/Toast';

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();

  const checkAdminStatus = async () => {
    try {
      const res = await API.get('/auth/debug/admin-check');
      console.log('Admin check response:', res.data);
      toast.push(JSON.stringify(res.data, null, 2));
    } catch (err) {
      console.error('Admin check error:', err);
      toast.push('Error checking admin status');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Attempting login with username:', username);
      const user = await login(username, password);
      console.log('===== LOGIN RESPONSE =====');
      console.log('User object:', user);
      console.log('User role:', user?.role);
      console.log('Role type:', typeof user?.role);
      console.log('Is admin check:', user?.role === 'admin');
      
      // Check role and navigate
      if (user?.role === 'admin') {
        console.log('✓ ADMIN USER DETECTED - Navigating to /admin');
        navigate('/admin', { replace: true });
      } else if (user?.role === 'user') {
        console.log('✓ REGULAR USER DETECTED - Navigating to /dashboard');
        navigate('/dashboard', { replace: true });
      } else {
        console.log('✗ UNKNOWN ROLE:', user?.role);
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      console.error('===== LOGIN ERROR =====', err);
      toast.push('Login failed! Check credentials.');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0f0f0'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Login</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Username:</label>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                padding: '0.75rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Password:</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                padding: '0.75rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
          </div>
          <button type="submit" style={{
            padding: '0.75rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            cursor: 'pointer',
            marginTop: '1rem'
          }}>Login</button>
        </form>
        <button onClick={checkAdminStatus} style={{
          width: '100%',
          padding: '0.75rem',
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '0.9rem',
          cursor: 'pointer',
          marginTop: '0.5rem'
        }}>Check Admin Status</button>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Don't have an account? <Link to="/register" style={{ color: '#007bff', textDecoration: 'none' }}>Register</Link>
        </p>
      </div>
    </div>
  );
}
