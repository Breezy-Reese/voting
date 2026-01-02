import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useToast } from './Toast';

export default function Footer() {
  const { user, logout } = useContext(AuthContext);
  const toast = useToast();

  const handleLogout = () => {
    logout();
    toast.push('Signed out');
  };

  return (
    <footer className="site-footer" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
      <div>
        <p style={{ margin:0 }}>&copy; {new Date().getFullYear()} Online Voting System. All rights reserved.</p>
      </div>
      <div>
        {user ? (
          <button className="btn secondary" onClick={handleLogout}>Logout</button>
        ) : null}
      </div>
    </footer>
  );
}
