import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import NewsGrid from '../components/NewsGrid';
import { apiFetch } from '../services/api';

const Home = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // This runs every time the user visits the "/" Home route
        apiFetch("/api/articles")
            .then(data => setNews(data || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="loading" style={{padding:'50px', textAlign:'center'}}>Loading The Gilded Press...</div>;

    return (
        <>
            {news.length > 0 && <Hero article={news[0]} />}
            {news.length > 1 && <NewsGrid articles={news.slice(1)} />}

            {/* Fallback if no articles exist yet */}
            {news.length === 0 && (
                <div style={{textAlign: 'center', padding: '50px'}}>
                    <h2>No news yet.</h2>
                    <p>Be the first to write a story.</p>
                </div>
            )}
        </>
    );
};

export default Home;