import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { apiFetch } from "../services/api";
import "./CreateArticle.css";

function EditArticle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const editorRef = useRef(null);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);

    // 1. FETCH DATA
    useEffect(() => {
        apiFetch(`/api/articles/${id}`)
            .then(data => {
                setTitle(data.title);
                setContent(data.content);
                // Don't set innerHTML here. The div doesn't exist yet!
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load article", err);
                navigate("/");
            });
    }, [id, navigate]);

    // 2. POPULATE EDITOR (Runs only after loading is done)
    useEffect(() => {
        // If we are done loading, AND the ref exists, AND we have content...
        if (!loading && editorRef.current && content) {
            // Check if it's empty to avoid overwriting if user is typing (safety check)
            if (editorRef.current.innerHTML === "") {
                editorRef.current.innerHTML = content;
            }
        }
    }, [loading]); // Only run when loading state changes

    const handleSave = async () => {
        if (!title.trim() || !content.trim()) return;

        try {
            await apiFetch(`/api/articles/${id}`, {
                method: "PUT",
                body: JSON.stringify({ title, content }),
            });
            navigate(`/articles/${id}`);
        } catch (err) {
            alert("Update failed: " + err.message);
        }
    };

    const exec = (command, value = null) => {
        editorRef.current?.focus();
        document.execCommand(command, false, value);
    };

    if (loading) return <div className="loading">Loading Editor...</div>;

    return (
        <div className="container create-article-page">
            <div className="editor-header">
                <h1>Edit Article</h1>
                <Link to={`/articles/${id}`} className="back-link">Cancel</Link>
            </div>

            <div className="input-group">
                <input
                    type="text"
                    className="title-input"
                    placeholder="Article Headline"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            <div className="editor-toolbar">
                <button onClick={() => exec("bold")}><b>B</b></button>
                <button onClick={() => exec("italic")}><i>I</i></button>
                <button onClick={() => exec("underline")}><u>U</u></button>
                <div className="toolbar-divider"></div>
                <button onClick={() => exec("formatBlock", "h2")}>H2</button>
                <button onClick={() => exec("formatBlock", "h3")}>H3</button>
            </div>

            <div
                ref={editorRef}
                className="editor-content"
                contentEditable
                onInput={(e) => setContent(e.currentTarget.innerHTML)}
                suppressContentEditableWarning
                placeholder="Start writing..."
            />

            <div className="action-bar">
                <button className="btn-gold" onClick={handleSave}>
                    Save Changes
                </button>
                <button className="btn-outline" onClick={() => navigate(`/articles/${id}`)}>
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default EditArticle;