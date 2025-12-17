import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useContext(AuthContext);

  return (
    <header>
      {user ? (
        <div>
          <span>{user.username}</span>
          <button onClick={logout}>Logout</button>
        </div>
      ) : null
      }
    </header>
  );
}
