import React from 'react';
import './NewsGrid.css';

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
                            <img src={item.image} alt={item.title} />
                        </div>
                        <div className="card-content">
                            <div className="meta">
                                <span className="card-category">{item.category}</span>
                                <span className="card-date">{item.date}</span>
                            </div>
                            <h3>{item.title}</h3>
                            <p>{item.summary}</p>
                            <a href="#" className="read-more">Read More &rarr;</a>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default NewsGrid;