import React from "react";
import { Link } from "react-router-dom";
import "./NewsGrid.css";

const NewsGrid = ({ articles }) => {
    return (
        <section className="container news-grid-section">
            <div className="section-header">
                <h2>Latest Headlines</h2>
                <div className="header-line"></div>
            </div>

            <div className="grid-container">
                {articles.map((item) => (
                    <article key={item.id} className="news-card">
                        <div className="card-image">
                            <img
                                src={item.imageUrl || "/placeholder.jpg"}
                                alt={item.title}
                            />
                        </div>

                        <div className="card-content">
                            <div className="meta">
                                <span className="card-category">
                                    {item.category || "General"}
                                </span>
                                <span className="card-date">
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            <h3>{item.title}</h3>

                            {/* STRICT API CONTRACT: Use journalistId/Name directly */}
                            {item.journalistName && (
                                <div className="author-byline">
                                    By{" "}
                                    <Link
                                        to={`/journalists/${item.journalistId}`}
                                        className="gold-link"
                                    >
                                        {item.journalistName}
                                    </Link>
                                </div>
                            )}

                            <p>{item.summary}</p>

                            <Link
                                to={`/articles/${item.id}`}
                                className="read-more"
                            >
                                Read More →
                            </Link>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default NewsGrid;