import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
    const navigate = useNavigate();

    const [article, setArticle] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [currentUser, setCurrentUser] = useState(null);

    // ARTICLE EDIT
    const [isEditingArticle, setIsEditingArticle] = useState(false);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");

    // COMMENT EDIT
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState("");

    const [error, setError] = useState(null);

    // -------- CURRENT USER --------
    useEffect(() => {
        apiFetch("/api/auth/me")
            .then(setCurrentUser)
            .catch(() => setCurrentUser(null));
    }, []);

    // -------- LOAD ARTICLE --------
    useEffect(() => {
        apiFetch(`/api/articles/${id}`)
            .then(data => {
                setArticle(data);
                setEditTitle(data.title);
                setEditContent(data.content);
            })
            .catch(() => setError("Failed to load article"));
    }, [id]);

    // -------- LOAD COMMENTS --------
    useEffect(() => {
        getComments(id).then(setComments).catch(() => {});
    }, [id]);

    // -------- LIKE ARTICLE --------
    const handleLikeArticle = async () => {
        try {
            const updated = await apiFetch(`/api/articles/${id}/like`, {
                method: "POST",
            });

            setArticle(prev => ({
                ...updated,
                canEdit: prev.canEdit, // ✅ preserve permissions
            }));
        } catch {
            alert("You must be logged in");
        }
    };

    // -------- UPDATE ARTICLE --------
    const handleUpdateArticle = async () => {
        try {
            const updated = await apiFetch(`/api/articles/${id}`, {
                method: "PUT",
                body: JSON.stringify({
                    title: editTitle,
                    content: editContent,
                }),
            });

            setArticle(prev => ({
                ...updated,
                canEdit: prev.canEdit, // ✅ preserve permissions
            }));

            setIsEditingArticle(false);
        } catch {
            alert("Update failed");
        }
    };

    // -------- DELETE ARTICLE --------
    const handleDeleteArticle = async () => {
        if (!window.confirm("Delete this article?")) return;

        try {
            await apiFetch(`/api/articles/${id}`, { method: "DELETE" });
            navigate("/");
        } catch {
            alert("Delete failed");
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
        } catch {
            alert("Delete failed");
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

            {/* ---------- ARTICLE ---------- */}
            {isEditingArticle ? (
                <>
                    <input
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        style={{ width: "100%", fontSize: "24px" }}
                    />

                    <textarea
                        value={editContent}
                        onChange={e => setEditContent(e.target.value)}
                        rows={10}
                        style={{ width: "100%", marginTop: "10px" }}
                    />

                    <div style={{ marginTop: "10px" }}>
                        <button onClick={handleUpdateArticle}>Save</button>
                        <button onClick={() => setIsEditingArticle(false)}>
                            Cancel
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <h1>{article.title}</h1>

                    <p>
                        By{" "}
                        <Link to={`/journalists/${article.author.id}`}>
                            <strong>{article.author.name}</strong>
                        </Link>
                    </p>

                    {currentUser ? (
                        <button onClick={handleLikeArticle}>
                            ❤️ {article.likeCount} | 👁 {article.views}
                        </button>
                    ) : (
                        <a
                            href="http://localhost:8080/login"
                            style={{
                                padding: "6px 12px",
                                border: "1px solid #ccc",
                                textDecoration: "none",
                                borderRadius: "4px"
                            }}
                        >
                            Login
                        </a>

                    )}

                    {article.canEdit && (
                        <div style={{ marginTop: "10px" }}>
                            <button onClick={() => setIsEditingArticle(true)}>
                                Edit
                            </button>
                            <button
                                onClick={handleDeleteArticle}
                                style={{ marginLeft: "10px", color: "red" }}
                            >
                                Delete
                            </button>
                        </div>
                    )}

                    <hr />
                    <div dangerouslySetInnerHTML={{ __html: article.content }} />
                </>
            )}

            {/* ---------- COMMENTS ---------- */}
            <hr />
            <h3>Comments</h3>

            {currentUser ? (
                <>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        rows={3}
                        style={{ width: "100%" }}
                    />
                    <button onClick={handleAddComment}>Post Comment</button>
                </>
            ) : (
                <p>
                    <a
                        href="http://localhost:8080/login"
                        style={{
                            padding: "6px 12px",
                            border: "1px solid #ccc",
                            textDecoration: "none",
                            borderRadius: "4px"
                        }}
                    >
                        Login
                    </a>

                </p>
            )}

            <div style={{ marginTop: "20px" }}>
                {comments.map(comment => (
                    <div key={comment.id} style={{ borderBottom: "1px solid #ddd" }}>
                        <strong>{comment.authorName}</strong>

                        {editingId === comment.id ? (
                            <>
                                <textarea
                                    value={editingText}
                                    onChange={e => setEditingText(e.target.value)}
                                    rows={2}
                                    style={{ width: "100%" }}
                                />
                                <button onClick={() => submitEdit(comment.id)}>
                                    Save
                                </button>
                                <button onClick={() => setEditingId(null)}>
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <p>{comment.content}</p>
                        )}

                        <button onClick={() => handleLikeComment(comment.id)}>
                            👍 {comment.likeCount}
                        </button>

                        {comment.canEdit && (
                            <button onClick={() => startEdit(comment)}>
                                edit
                            </button>
                        )}

                        {comment.canDelete && (
                            <button
                                onClick={() => handleDelete(comment.id)}
                                style={{ color: "red" }}
                            >
                                delete
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ArticleDetail;
