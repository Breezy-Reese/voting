import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Header() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <header className="site-header" role="banner">
      <div className="site-brand">
        <div className="logo-badge">🗳️</div>
        <div>
          <div style={{fontSize:14}}>Online Voting</div>
          <div style={{fontSize:12, color:'#6b7280'}}>Secure • Transparent • Simple</div>
        </div>
      </div>

      <nav className="nav-links" aria-label="Main navigation">
        <Link to="/">Home</Link>
      </nav>

      <div className="user-controls">
        {user ? (
          <>
            <div style={{ display:'flex', gap:12, alignItems:'center' }}>
              <div className="avatar" style={{ cursor: 'default' }}>{(user.username || 'U').charAt(0).toUpperCase()}</div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{user.username}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>{user.role}</div>
              </div>
            </div>
            <button className="btn primary" onClick={() => navigate('/dashboard')} style={{ marginLeft:12 }}>Vote</button>

            {/* logout moved to footer */}
          </>
        ) : (
          <Link to="/login" className="btn primary">Login</Link>
        )}
      </div>
    </header>
  );
}
