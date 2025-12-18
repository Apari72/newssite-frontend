import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ user }) => {
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    return (
        <header className="site-header">
            {/* ... Top Bar ... */}
            <div className="top-bar">
                <div className="container">
          <span className="date">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>

                    <div className="auth-links">
                        {user ? (
                            // --- LOGGED IN VIEW ---
                            <div className="user-section">
                 <span
                     className="welcome-text"
                     onClick={() => setShowProfileMenu(!showProfileMenu)}
                 >
                   Welcome, <span className="gold-text">{user.username || user.name}</span> ▾
                 </span>

                                {showProfileMenu && (
                                    <div className="profile-dropdown">

                                        {/* ADMIN sees Dashboard */}
                                        {user.role === 'ADMIN' && (
                                            <Link to="/dashboard" className="dropdown-item">Dashboard</Link>
                                        )}

                                        {/* JOURNALIST sees Write Article directly */}
                                        {(user.role === 'JOURNALIST' || user.role === 'ADMIN') && (
                                            <Link to="/create-article" className="dropdown-item">Write Article</Link>
                                        )}

                                        {/* EVERYONE sees Profile (Optional) & Logout */}
                                        {/* <Link to={`/journalists/${user.id}`} className="dropdown-item">My Profile</Link> */}

                                        <div className="dropdown-divider"></div>
                                        <a href="http://localhost:8080/logout" className="dropdown-item logout">Sign Out</a>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // --- GUEST VIEW ---
                            <>
                                <a href="http://localhost:8080/login" className="auth-link">Sign In</a>
                                <span className="divider">|</span>
                                <a href="http://localhost:8080/register" className="auth-link">Subscribe</a>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* ... Main Header (Logo/Nav) remains unchanged ... */}
            <div className="main-header container">
                <div className="logo">
                    <Link to="/" className="logo">
                        THE <span className="gold-text">GILDED</span> PRESS
                    </Link>
                </div>
                <nav className="nav-links">
                    <Link to="/">World</Link>
                    <Link to="/category/Business">Business</Link>
                    <Link to="/category/Tech">Tech</Link>
                    <Link to="/category/Science">Science</Link>
                    <Link to="/category/Health">Health</Link>
                    <Link to="/category/Style">Style</Link>
                </nav>
            </div>
            <div className="border-bottom"></div>
        </header>
    );
};

export default Header;