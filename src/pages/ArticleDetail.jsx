import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    apiFetch,
    getComments,
    addComment,
    deleteComment,
    likeComment,
    updateComment,
} from "../services/api";

function ArticleDetail() {
    const { id } = useParams();

    const [article, setArticle] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState("");
    const [error, setError] = useState(null);

    // -------- LOAD ARTICLE --------
    useEffect(() => {
        apiFetch(`/api/articles/${id}`)
            .then(setArticle)
            .catch(() => setError("Failed to load article"));
    }, [id]);

    // -------- LOAD COMMENTS --------
    const loadComments = () => {
        getComments(id).then(setComments).catch(() => {});
    };

    useEffect(() => {
        loadComments();
    }, [id]);

    // -------- ARTICLE LIKE --------
    const handleLikeArticle = async () => {
        try {
            const updated = await apiFetch(`/api/articles/${id}/like`, {
                method: "POST",
            });
            setArticle(updated);
        } catch {
            alert("You must be logged in");
        }
    };

    // -------- ADD COMMENT --------
    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {
            const created = await addComment(id, newComment);
            setComments(prev => [created, ...prev]);
            setNewComment("");
        } catch {
            alert("You must be logged in");
        }
    };

    // -------- DELETE COMMENT --------
    const handleDelete = async (commentId) => {
        try {
            await deleteComment(commentId);
            setComments(prev => prev.filter(c => c.id !== commentId));
        } catch (err) {
            alert(err.message || "Delete failed");
        }
    };

    // -------- LIKE COMMENT --------
    const handleLikeComment = async (commentId) => {
        try {
            const updated = await likeComment(commentId);
            setComments(prev =>
                prev.map(c => (c.id === updated.id ? updated : c))
            );
        } catch {
            alert("Login required");
        }
    };

    // -------- EDIT COMMENT --------
    const startEdit = (comment) => {
        setEditingId(comment.id);
        setEditingText(comment.content);
    };

    const submitEdit = async (commentId) => {
        try {
            const updated = await updateComment(commentId, editingText);
            setComments(prev =>
                prev.map(c => (c.id === updated.id ? updated : c))
            );
            setEditingId(null);
            setEditingText("");
        } catch {
            alert("Edit failed");
        }
    };

    if (error) return <p>{error}</p>;
    if (!article) return <p>Loading...</p>;

    return (
        <div style={{ padding: "40px", maxWidth: "800px" }}>
            <Link to="/">← Back to News</Link>

            <h1>{article.title}</h1>
            <p>
                By{" "}
                <Link to={`/journalists/${article.author.id}`}>
                    <strong>{article.author.name}</strong>
                </Link>
            </p>

            <button onClick={handleLikeArticle}>
                ❤️ {article.likeCount} | 👁 {article.views}
            </button>

            <hr />
            <div dangerouslySetInnerHTML={{ __html: article.content }} />

            {/* ---------- COMMENTS ---------- */}
            <hr />
            <h3>Comments</h3>

            <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                rows={3}
                style={{ width: "100%" }}
            />
            <button onClick={handleAddComment}>Post Comment</button>

            <div style={{ marginTop: "20px" }}>
                {comments.map(comment => (
                    <div
                        key={comment.id}
                        style={{ borderBottom: "1px solid #ddd", padding: "10px 0" }}
                    >
                        <strong>{comment.authorName}</strong>

                        {/* EDIT MODE */}
                        {editingId === comment.id ? (
                            <>
                    <textarea
                        value={editingText}
                        onChange={e => setEditingText(e.target.value)}
                        rows={2}
                        style={{ width: "100%", marginTop: "5px" }}
                    />
                                <div>
                                    <button onClick={() => submitEdit(comment.id)}>Save</button>
                                    <button onClick={() => setEditingId(null)}>Cancel</button>
                                </div>
                            </>
                        ) : (
                            <p>{comment.content}</p>
                        )}

                        <small>{comment.createdAt}</small>

                        <div style={{ marginTop: "5px" }}>
                            <button onClick={() => handleLikeComment(comment.id)}>
                                👍 {comment.likeCount}
                            </button>

                            {comment.canEdit && (
                                <button
                                    onClick={() => startEdit(comment)}
                                    style={{ marginLeft: "10px" }}
                                >
                                    edit
                                </button>
                            )}

                            {comment.canDelete && (
                                <button
                                    onClick={() => handleDelete(comment.id)}
                                    style={{
                                        marginLeft: "10px",
                                        color: "red",
                                        border: "none",
                                        background: "none",
                                        cursor: "pointer",
                                    }}
                                >
                                    delete
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ArticleDetail;
