import React from "react";
import { Link } from "react-router-dom";
import "./Hero.css";

const Hero = ({ article }) => {
    if (!article) return null;

    // 1. SMART BACKGROUND
    const bgStyle = article.imageUrl
        ? { backgroundImage: `url(${article.imageUrl})` }
        : {
            background: "linear-gradient(135deg, #0f0f0f 0%, #2c2c2c 100%)",
            position: "relative"
        };

    return (
        <section className="hero-section">
            <div className="hero-image" style={bgStyle}>

                {/* 2. VISUAL FILLER: Increased opacity for better visibility */}
                {!article.imageUrl && (
                    <div style={{
                        position: 'absolute', inset: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 0, overflow: 'hidden'
                    }}>
                        <span style={{
                            fontSize: '10vw',
                            color: '#D4AF37',
                            opacity: 0.20,
                            fontWeight: 900,
                            whiteSpace: 'nowrap',
                            textTransform: 'uppercase',
                            fontFamily: 'serif'
                        }}>
                            The Gilded Press
                        </span>
                    </div>
                )}

                <div className="hero-overlay"></div>

                <div className="hero-content container">
                    <span className="category-tag">
                        {article.category || "Featured"}
                    </span>

                    <h1>{article.title}</h1>

                    {/* AUTHOR LINE */}
                    {article.journalistName && (
                        <p className="hero-author">
                            By{" "}
                            <Link
                                to={`/journalists/${article.journalistId}`}
                                style={{ color: '#f3e5ab', textDecoration: 'underline' }}
                            >
                                {article.journalistName}
                            </Link>
                        </p>
                    )}

                    {article.summary && (
                        <p className="hero-summary">{article.summary}</p>
                    )}

                    <Link
                        to={`/articles/${article.id}`}
                        className="btn-gold"
                    >
                        Read Full Story
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Hero;