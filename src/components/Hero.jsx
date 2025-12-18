import React from "react";
import { Link } from "react-router-dom";
import "./Hero.css";

const Hero = ({ article }) => {
    if (!article) return null;

    return (
        <section className="hero-section">
            <div
                className="hero-image"
                style={{
                    backgroundImage: `url(${article.imageUrl || "/placeholder.jpg"})`,
                }}
            >
                <div className="hero-overlay"></div>

                <div className="hero-content container">
                    <span className="category-tag">
                        {article.category || "Featured"}
                    </span>

                    <h1>{article.title}</h1>

                    {/* STRICT API CONTRACT: Use journalistId/Name directly */}
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