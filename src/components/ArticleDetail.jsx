import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";
import "./ArticleDetail.css";

const ArticleDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Fetch specific article data (Nested 'author' object)
        const fetchArticle = apiFetch(`/api/articles/${id}`);
        const fetchUser = apiFetch("/api/auth/me").catch(() => null);

        Promise.all([fetchArticle, fetchUser])
            .then(([articleData, userData]) => {
                setArticle(articleData);
                setCurrentUser(userData);
            })
            .catch(err => console.error("Failed to load data", err));
    }, [id]);

    // ... inside ArticleDetail component ...

    const handleDelete = async () => {


        try {
            await apiFetch(`/api/articles/${id}`, { method: "DELETE" });
            // Optional: Show a small notification instead of a popup
            // alert("Article deleted.");
            navigate("/"); // Immediately redirect home
        } catch (err) {
            // It's still good to alert if something goes WRONG
            alert("Failed to delete: " + err.message);
        }
    };

    // ... rest of component ...

    if (!article) return <div className="loading">Loading Article...</div>;

    // --- PERMISSION CHECK ---
    // Uses article.author.id because this endpoint uses the nested structure
    const canManage = currentUser && (
        currentUser.role === "ADMIN" ||
        (currentUser.role === "JOURNALIST" && article.author && currentUser.id === article.author.id)
    );

    return (
        <div className="article-page">
            <div className="article-hero" style={{ backgroundImage: `url(${article.imageUrl || "/placeholder.jpg"})` }}>
                <div className="article-overlay"></div>
                <div className="container article-hero-content">
                    <span className="category-tag-hero">{article.category || "General"}</span>
                    <h1>{article.title}</h1>
                    <p className="article-date">
                        {/* Fallback to current date if createdAt is missing in Detail DTO */}
                        {new Date(article.createdAt || Date.now()).toLocaleDateString()}
                        {article.views && ` · 👁 ${article.views}`}
                    </p>
                </div>
            </div>

            {/* ADMIN / AUTHOR TOOLBAR */}
            {canManage && (
                <div className="container" style={{ marginBottom: '20px' }}>
                    <div className="admin-toolbar" style={{ display: 'flex', gap: '10px', padding: '15px', background: '#f9f9f9', border: '1px solid #ddd' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '0.8rem', alignSelf: 'center' }}>
                            CONTROLS:
                        </span>
                        <Link to={`/edit-article/${article.id}`} className="btn-gold-small" style={{ textDecoration: 'none' }}>
                            ✎ Edit
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="btn-gold-small"
                            style={{ background: '#b91c1c', borderColor: '#b91c1c', color: 'white' }}
                        >
                            ✕ Delete
                        </button>
                    </div>
                </div>
            )}

            <div className="container article-layout">
                <div className="article-main">
                    <div className="article-body" dangerouslySetInnerHTML={{ __html: article.content }} />
                    {/* (Comments section goes here) */}
                </div>

                <aside className="article-sidebar">
                    <div className="journalist-card">
                        <h3>Written By</h3>
                        {/* STRICT API CONTRACT: Use article.author object */}
                        <Link to={`/journalists/${article.author?.id}`} className="journalist-name">
                            {article.author?.name}
                        </Link>
                        <span className="journalist-role">Journalist</span>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default ArticleDetail;