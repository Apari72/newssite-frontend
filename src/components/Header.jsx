import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../services/api'; // <--- Import the URL
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
                                        {user.role === 'ADMIN' && (
                                            <Link to="/dashboard" className="dropdown-item">Dashboard</Link>
                                        )}
                                        {(user.role === 'JOURNALIST' || user.role === 'ADMIN') && (
                                            <Link to="/create-article" className="dropdown-item">Write Article</Link>
                                        )}
                                        <div className="dropdown-divider"></div>
                                        {/* FIX: Use API_BASE_URL for logout */}
                                        <a href={`${API_BASE_URL}/logout`} className="dropdown-item logout">Sign Out</a>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // --- GUEST VIEW ---
                            <>
                                {/* FIX: Use API_BASE_URL for login/register */}
                                <a href={`${API_BASE_URL}/login`} className="auth-link">Sign In</a>
                                <span className="divider">|</span>
                                <a href={`${API_BASE_URL}/register`} className="auth-link">Subscribe</a>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* ... Main Header ... */}
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