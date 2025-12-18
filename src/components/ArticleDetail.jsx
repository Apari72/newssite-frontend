
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { apiFetch, toggleArticleLike, getComments, addComment, deleteComment, updateComment, likeComment } from "../services/api";
import "./ArticleDetail.css"; // Ensure you have the CSS below

function ArticleDetail({ currentUser }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [article, setArticle] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Comment Form State
    const [newComment, setNewComment] = useState("");
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editCommentText, setEditCommentText] = useState("");

    useEffect(() => {
        // 1. Fetch Article
        apiFetch(`/api/articles/${id}`)
            .then((data) => {
                setArticle(data);
                // 2. Fetch Comments separately to keep things clean
                return getComments(id);
            })
            .then((commentsData) => setComments(commentsData || []))
            .catch((err) => {
                console.error("Error loading article:", err);
                navigate("/"); // Redirect if not found
            })
            .finally(() => setLoading(false));
    }, [id, navigate]);

    // --- ARTICLE ACTIONS ---
    const handleArticleLike = async () => {
        if (!currentUser) return; // Guard clause
        try {
            const updatedArticle = await toggleArticleLike(article.id);
            setArticle(updatedArticle); // Update like count locally
        } catch (err) {
            alert("Could not like article: " + err.message);
        }
    };

    const handleDeleteArticle = async () => {

        try {
            await apiFetch(`/api/articles/${id}`, { method: "DELETE" });
            navigate("/");
        } catch (err) {
            alert("Failed to delete: " + err.message);
        }
    };

    // --- COMMENT ACTIONS ---
    const handlePostComment = async () => {
        if (!newComment.trim()) return;
        try {
            // This sends { "content": "Hello" }
            // The backend will now strip the { "content": ... } wrapper and just save "Hello"
            await addComment(article.id, { content: newComment });

            const updatedComments = await getComments(article.id);
            setComments(updatedComments);
            setNewComment("");
        } catch (err) {
            alert("Failed to post comment.");
        }
    };

    const handleCommentLike = async (commentId) => {
        if (!currentUser) return;
        try {
            await likeComment(commentId);
            // Refresh comments to see new like count
            const updated = await getComments(article.id);
            setComments(updated);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteComment = async (commentId) => {

        try {
            await deleteComment(commentId);
            setComments(comments.filter(c => c.id !== commentId));
        } catch (err) {
            alert("Failed to delete comment");
        }
    };

    const startEditing = (comment) => {
        setEditingCommentId(comment.id);
        setEditCommentText(comment.content);
    };

    const saveEditComment = async (commentId) => {
        try {
            await updateComment(commentId, { content: editCommentText });
            const updated = await getComments(article.id);
            setComments(updated);
            setEditingCommentId(null);
        } catch (err) {
            alert("Failed to update comment");
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (!article) return null;

    // Check ownership
    const isAuthor = currentUser && currentUser.id === article.author?.id;
    const isAdmin = currentUser?.role === "ADMIN";
    const canManageArticle = isAuthor || isAdmin;

    // Fallback Background if no image
    const bgStyle = article.imageUrl
        ? { backgroundImage: `url(${article.imageUrl})` }
        : { background: "linear-gradient(135deg, #0f0f0f 0%, #2c2c2c 100%)" };

    return (
        <div className="article-detail-page">
            {/* 1. HERO HEADER */}
            <div className="article-hero" style={bgStyle}>
                <div className="hero-overlay"></div>
                <div className="container hero-content">
                    <span className="category-badge">{article.category || "General"}</span>
                    <h1>{article.title}</h1>
                    <div className="meta-info">
                        By <span className="author-name">{article.author?.name || article.journalistName}</span>
                        &bull; {new Date(article.createdAt).toLocaleDateString()}
                        &bull; {article.views} Views
                    </div>
                </div>
            </div>

            <div className="container content-wrapper">
                {/* 2. ADMIN/AUTHOR TOOLBAR */}
                {canManageArticle && (
                    <div className="admin-toolbar">
                        <Link to={`/edit-article/${article.id}`} className="btn-toolbar edit">
                            ✎ Edit Article
                        </Link>
                        <button onClick={handleDeleteArticle} className="btn-toolbar delete">
                            ✕ Delete
                        </button>
                    </div>
                )}

                {/* 3. ARTICLE CONTENT */}
                <article className="article-body" dangerouslySetInnerHTML={{ __html: article.content }} />

                {/* 4. ARTICLE LIKE SECTION */}
                <div className="article-actions">
                    {currentUser ? (
                        <button className="btn-like" onClick={handleArticleLike}>
                            ♥ Like this Story <span className="count">({article.likeCount})</span>
                        </button>
                    ) : (
                        <div className="login-prompt">
                            <a href="http://localhost:8080/login" className="gold-link">Sign in</a> to like this story ({article.likeCount} likes)
                        </div>
                    )}
                </div>

                <hr className="divider" />

                {/* 5. COMMENTS SECTION */}
                <section className="comments-section">
                    <h3>Discussion</h3>

                    {/* NEW COMMENT FORM */}
                    {currentUser ? (
                        <div className="comment-form">
                            <textarea
                                placeholder="Share your thoughts..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                            <button className="btn-gold-sm" onClick={handlePostComment}>Post Comment</button>
                        </div>
                    ) : (
                        <p className="login-notice">
                            Please <a href="http://localhost:8080/login" className="gold-link">sign in</a> to join the discussion.
                        </p>
                    )}

                    {/* COMMENTS LIST */}
                    <div className="comments-list">
                        {comments.length === 0 && <p className="no-comments">No comments yet. Be the first.</p>}

                        {comments.map((comment) => (
                            <div key={comment.id} className="comment-card">
                                <div className="comment-header">
                                    <span className="comment-author">{comment.authorName}</span>
                                    <span className="comment-date">
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                {editingCommentId === comment.id ? (
                                    <div className="edit-mode">
                                        <textarea
                                            value={editCommentText}
                                            onChange={(e) => setEditCommentText(e.target.value)}
                                        />
                                        <button onClick={() => saveEditComment(comment.id)}>Save</button>
                                        <button onClick={() => setEditingCommentId(null)}>Cancel</button>
                                    </div>
                                ) : (
                                    <p className="comment-text">{comment.content}</p>
                                )}

                                {/* ... inside comments.map ... */}

                                <div className="comment-footer">
                                    {currentUser ? (
                                        <button className="btn-text-action" onClick={() => handleCommentLike(comment.id)}>
                                            ♥ {comment.likeCount || 0}
                                        </button>
                                    ) : (
                                        <span className="disabled-like">♥ {comment.likeCount || 0}</span>
                                    )}

                                    {/* FIX: Use the 'canEdit' and 'canDelete' flags sent by Java */}
                                    {comment.canEdit && (
                                        <button className="btn-text-action" onClick={() => startEditing(comment)}>
                                            Edit
                                        </button>
                                    )}

                                    {comment.canDelete && (
                                        <button className="btn-text-action delete" onClick={() => handleDeleteComment(comment.id)}>
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default ArticleDetail;