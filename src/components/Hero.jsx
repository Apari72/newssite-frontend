import React from 'react';
import './Hero.css';

const Hero = ({ article }) => {
    if (!article) return null;

    return (
        <section className="hero-section">
            <div className="hero-image" style={{ backgroundImage: `url(${article.image})` }}>
                <div className="hero-overlay"></div>
                <div className="hero-content container">
                    <span className="category-tag">{article.category}</span>
                    <h1>{article.title}</h1>
                    <p className="hero-summary">{article.summary}</p>
                    <button className="btn-gold">Read Full Story</button>
                </div>
            </div>
        </section>
    );
};

export default Hero;