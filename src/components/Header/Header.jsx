import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import Button from '../Button/Button';
import styles from './Header.module.css';

function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={styles.header}>
      <Link to={isAuthenticated ? '/dashboard' : '/'} className={styles.logo}>
        <span className={styles.logoSolid}>Solid</span>Habit
      </Link>

      <nav className={styles.nav}>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className={styles.navLink}>
              Dashboard
            </Link>
            <Link to="/marketplace" className={styles.navLink}>
              Marketplace
            </Link>
            <Link to="/network" className={styles.navLink}>
              Network
            </Link>

            <div className={styles.profileWrapper} ref={dropdownRef}>
              <Button
                className={styles.profileBtn}
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                {user?.nickname || user?.name || 'Profile'}
              </Button>

              {showDropdown && (
                <div className={styles.dropdownMenu}>
                  <Link
                    to="/profile"
                    className={styles.dropdownItem}
                    onClick={() => setShowDropdown(false)}
                  >
                    My Profile
                  </Link>
                  <button
                    type="button"
                    className={`${styles.dropdownItem} ${styles.logoutBtn}`}
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <Link to="/">
            <Button className={styles.profileBtn}>Sign In</Button>
          </Link>
        )}
      </nav>
    </header>
  );
}

export default Header;
