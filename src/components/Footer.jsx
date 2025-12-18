import React from 'react';

const Footer = () => {
    return (
        <footer style={{ backgroundColor: 'var(--color-black)', color: 'var(--color-white)', padding: '60px 0', marginTop: 'auto' }}>
            <div className="container" style={{ textAlign: 'center' }}>
                <div className="logo" style={{ fontSize: '2rem', marginBottom: '20px' }}>
                    THE <span style={{ color: 'var(--color-gold)' }}>GILDED</span> PRESS
                </div>
                <p style={{ color: '#888', marginBottom: '30px' }}>
                    Providing sophisticated analysis and breaking news for the modern world.
                </p>
                <div className="socials" style={{ marginBottom: '30px' }}>
                    {/* Add social icons here */}
                </div>
                <div style={{ borderTop: '1px solid #333', paddingTop: '20px', fontSize: '0.8rem', color: '#666' }}>
                    &copy; {new Date().getFullYear()} The Gilded Press. All Rights Reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;