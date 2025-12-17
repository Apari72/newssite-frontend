import React from 'react';
import './Header.css'; // We will create this next

const Header = () => {
    return (
        <header className="site-header">
            <div className="top-bar">
                <div className="container">
                    <span className="date">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    <div className="auth-links">
                        {/* These link back to your Thymeleaf/Spring Boot Backend */}
                        <a href="http://localhost:8080/login" className="auth-link">Sign In</a>
                        <span className="divider">|</span>
                        <a href="http://localhost:8080/register" className="auth-link">Subscribe</a>
                    </div>
                </div>
            </div>

            <div className="main-header container">
                <div className="logo">
                    THE <span className="gold-text">DAILY</span> NEWS
                </div>
                <nav className="main-nav">
                    <a href="#" className="nav-item active">World</a>
                    <a href="#" className="nav-item">Business</a>
                    <a href="#" className="nav-item">Tech</a>
                    <a href="#" className="nav-item">Science</a>
                    <a href="#" className="nav-item">Health</a>
                    <a href="#" className="nav-item">Style</a>
                </nav>
            </div>
            <div className="border-bottom"></div>
        </header>
    );
};

export default Header;