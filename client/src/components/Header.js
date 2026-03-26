import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="nav">
          <Link to="/" className="nav-logo">
            🛡️ Nagrik AI
          </Link>
          <nav>
            <ul className="nav-menu">
              {!user ? (
                <>
                  <li>
                    <Link to="/login">Login</Link>
                  </li>
                  <li>
                    <Link to="/register">Register</Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <span style={{ marginRight: '10px' }}>Welcome, {user.name}</span>
                  </li>
                  {user.role === 'citizen' && (
                    <li>
                      <Link to="/complaints">My Complaints</Link>
                    </li>
                  )}
                  {user.role === 'officer' && (
                    <li>
                      <Link to="/department">Department Dashboard</Link>
                    </li>
                  )}
                  {user.role === 'admin' && (
                    <li>
                      <Link to="/admin">Admin Dashboard</Link>
                    </li>
                  )}
                  <li>
                    <button
                      onClick={handleLogout}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        padding: '10px 15px',
                        borderRadius: '8px',
                      }}
                      onMouseOver={(e) => (e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)')}
                      onMouseOut={(e) => (e.target.style.backgroundColor = 'transparent')}
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
