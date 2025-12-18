import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NewsGrid from "../components/NewsGrid";
import { getArticles } from "../services/api";

const CategoryPage = () => {
    const { categoryName } = useParams(); // Get "Tech" from URL
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        // Fetch filtered news
        getArticles(categoryName)
            .then(data => setNews(data || []))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [categoryName]); // Re-run whenever category changes

    if (loading) return <div className="loading" style={{padding:'50px', textAlign:'center'}}>Loading {categoryName}...</div>;

    return (
        <div className="category-page">
            <div className="container" style={{paddingTop: '40px'}}>
                <h1 style={{
                    fontSize: '3rem',
                    fontFamily: 'serif',
                    borderBottom: '4px solid #D4AF37',
                    display: 'inline-block',
                    marginBottom: '40px'
                }}>
                    {categoryName} News
                </h1>
            </div>

            {news.length > 0 ? (
                <NewsGrid articles={news} />
            ) : (
                <div className="container" style={{textAlign: 'center', padding: '50px'}}>
                    <h3>No stories found in {categoryName}.</h3>
                </div>
            )}
        </div>
    );
};

export default CategoryPage;