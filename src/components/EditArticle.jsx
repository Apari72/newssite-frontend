import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
// Import API_BASE_URL
import { apiFetch, uploadImage, API_BASE_URL } from "../services/api";
import "./CreateArticle.css";

function EditArticle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const editorRef = useRef(null);
    const fileInputRef = useRef(null);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("General");
    const [imageUrl, setImageUrl] = useState("");
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiFetch(`/api/articles/${id}`)
            .then(data => {
                setTitle(data.title);
                setContent(data.content);
                setCategory(data.category || "General");
                setImageUrl(data.imageUrl || "");
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load article", err);
                navigate("/");
            });
    }, [id, navigate]);

    useEffect(() => {
        if (!loading && editorRef.current && content) {
            if (editorRef.current.innerHTML === "") {
                editorRef.current.innerHTML = content;
            }
        }
    }, [loading, content]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const data = await uploadImage(file);
            // FIX: Use API_BASE_URL instead of localhost
            const fullUrl = data.url;
            setImageUrl(fullUrl);
        } catch (err) {
            alert("Failed to upload image: " + err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        if (!title.trim() || !content.trim()) return;

        try {
            await apiFetch(`/api/articles/${id}`, {
                method: "PUT",
                body: JSON.stringify({ title, content, category, imageUrl }),
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
                <select
                    className="category-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="General">General</option>
                    <option value="Business">Business</option>
                    <option value="Tech">Tech</option>
                    <option value="Science">Science</option>
                    <option value="Style">Style</option>
                </select>
            </div>

            <div className="image-upload-section" style={{marginBottom: '20px'}}>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{display: 'none'}}
                    onChange={handleFileChange}
                    accept="image/*"
                />

                <button
                    className="btn-outline"
                    onClick={() => fileInputRef.current.click()}
                    disabled={uploading}
                >
                    {uploading ? "Uploading..." : "📷 Change Cover Image"}
                </button>

                {imageUrl && (
                    <div style={{marginTop: '10px'}}>
                        <img src={imageUrl} alt="Preview" style={{height: '150px', borderRadius: '4px', border: '1px solid #ddd', objectFit: 'cover'}} />
                        <p style={{fontSize: '0.8rem', color: '#666'}}>Current Cover Image</p>
                    </div>
                )}
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