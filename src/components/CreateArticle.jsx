import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiFetch } from "../services/api"; // Ensure this path is correct
import "./CreateArticle.css"; // We will create this CSS file next

function CreateArticle() {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("General"); // Added Category support
    const [content, setContent] = useState("");
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    const navigate = useNavigate();
    const editorRef = useRef(null);

    // ---------- FRONTEND GUARD ----------
    useEffect(() => {
        // Fetch user to check role
        apiFetch("/api/auth/me")
            .then(user => {
                if (!user || (user.role !== "ADMIN" && user.role !== "JOURNALIST")) {
                    navigate("/");
                }
                setCurrentUser(user);
            })
            .catch(() => navigate("/"));
    }, [navigate]);

    // ---------- PUBLISH ----------
    const handlePublish = async () => {
        if (!title.trim() || !content.trim()) {
            setError("Title and content are required");
            return;
        }

        try {
            await apiFetch("/api/articles", {
                method: "POST",
                body: JSON.stringify({
                    title,
                    content,
                    category // Send category if your backend supports it
                }),
            });

            navigate("/");
        } catch (err) {
            setError(err.message || "Publish failed");
        }
    };

    // ---------- EDITOR COMMANDS ----------
    const exec = (command, value = null) => {
        editorRef.current?.focus();
        document.execCommand(command, false, value);
    };

    // ---------- IMAGE UPLOAD ----------
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            // Using standard fetch here because apiFetch handles JSON, not FormData usually
            // Adjust URL to your actual upload endpoint
            const response = await fetch("http://localhost:8080/api/uploads/image", {
                method: "POST",
                credentials: "include", // Important for session
                body: formData,
            });

            if (!response.ok) throw new Error("Upload failed");

            const data = await response.json(); // Expecting { url: "..." }
            exec("insertImage", data.url);
        } catch (err) {
            console.error(err);
            alert("Image upload failed. Ensure backend supports /api/uploads/image");
        }
    };

    if (!currentUser) return <div className="loading">Checking permissions...</div>;

    return (
        <div className="container create-article-page">
            <div className="editor-header">
                <Link to="/" className="back-link">← Back to Home</Link>
                <h1>Write New Story</h1>
            </div>

            {error && <div className="error-banner">{error}</div>}

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

            {/* TOOLBAR */}
            <div className="editor-toolbar">
                <div className="toolbar-group">
                    <button type="button" onClick={() => exec("bold")} title="Bold"><b>B</b></button>
                    <button type="button" onClick={() => exec("italic")} title="Italic"><i>I</i></button>
                    <button type="button" onClick={() => exec("underline")} title="Underline"><u>U</u></button>
                </div>

                <div className="toolbar-divider"></div>

                <div className="toolbar-group">
                    <button type="button" onClick={() => exec("formatBlock", "h2")}>H2</button>
                    <button type="button" onClick={() => exec("formatBlock", "h3")}>H3</button>
                    <button type="button" onClick={() => exec("justifyLeft")}>Left</button>
                    <button type="button" onClick={() => exec("justifyCenter")}>Center</button>
                </div>

                <div className="toolbar-divider"></div>

                <div className="toolbar-group">
                    <button type="button" onClick={() => document.getElementById("imageUpload").click()}>
                        📷 Image
                    </button>
                    <button type="button" onClick={() => exec("createLink", prompt("Enter URL:"))}>
                        Link
                    </button>
                </div>

                <input
                    type="file"
                    accept="image/*"
                    id="imageUpload"
                    style={{ display: "none" }}
                    onChange={handleImageUpload}
                />
            </div>

            {/* WRITING AREA */}
            <div
                ref={editorRef}
                className="editor-content"
                contentEditable
                onInput={(e) => setContent(e.currentTarget.innerHTML)}
                suppressContentEditableWarning
                placeholder="Start writing your story here..."
            />

            <div className="action-bar">
                <button className="btn-gold" onClick={handlePublish}>Publish Article</button>
                <button className="btn-outline" onClick={() => navigate("/")}>Cancel</button>
            </div>
        </div>
    );
}

export default CreateArticle;