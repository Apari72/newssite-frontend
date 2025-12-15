import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiFetch, getCurrentUser } from "../services/api";

function CreateArticle() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const editorRef = useRef(null);

    // ---------- FRONTEND GUARD ----------
    useEffect(() => {
        getCurrentUser()
            .then(user => {
                if (user.role !== "ADMIN" && user.role !== "JOURNALIST") {
                    navigate("/");
                }
            })
            .catch(() => navigate("/"));
    }, []);

    // ---------- PUBLISH ----------
    const handlePublish = async () => {
        if (!title.trim() || !content.trim()) {
            setError("Title and content are required");
            return;
        }

        try {
            await apiFetch("/api/articles", {
                method: "POST",
                body: JSON.stringify({ title, content }),
            });

            navigate("/");
        } catch (err) {
            setError(err.message || "Publish failed");
        }
    };

    // ---------- EDITOR COMMAND ----------
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

        const response = await fetch("/api/uploads/image", {
            method: "POST",
            credentials: "include",
            body: formData,
        });

        if (!response.ok) {
            alert("Image upload failed");
            return;
        }

        const data = await response.json();
        exec("insertImage", data.url);
    };

    return (
        <div style={{ padding: "40px", maxWidth: "900px", fontFamily: "Arial" }}>
            {/* HEADER */}
            <div style={{ marginBottom: "20px" }}>
                <Link to="/">← Back to Articles</Link>
            </div>

            <h1>Write Article</h1>

            {/* ERROR */}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* TITLE */}
            <input
                type="text"
                placeholder="Article title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                    width: "100%",
                    padding: "10px",
                    fontSize: "16px",
                    marginBottom: "15px",
                }}
            />

            {/* TOOLBAR */}
            <div style={{ marginBottom: "10px" }}>
                <button onClick={() => exec("bold")}><b>B</b></button>
                <button onClick={() => exec("italic")}><i>I</i></button>
                <button onClick={() => exec("underline")}><u>U</u></button>

                <button onClick={() => document.getElementById("imageUpload").click()}>
                    🖼 Image
                </button>

                <button onClick={() => exec("insertUnorderedList")}>• List</button>
                <button onClick={() => exec("insertOrderedList")}>1. List</button>

                <button onClick={() => exec("formatBlock", "h1")}>H1</button>
                <button onClick={() => exec("formatBlock", "h2")}>H2</button>

                <button onClick={() => exec("removeFormat")}>Clear</button>
            </div>

            <input
                type="file"
                accept="image/*"
                id="imageUpload"
                style={{ display: "none" }}
                onChange={handleImageUpload}
            />

            {/* EDITOR */}
            <div
                ref={editorRef}
                contentEditable
                onInput={(e) => setContent(e.currentTarget.innerHTML)}
                suppressContentEditableWarning
                style={{
                    border: "1px solid #ccc",
                    minHeight: "250px",
                    padding: "10px",
                    marginBottom: "15px",
                }}
            />

            {/* ACTIONS */}
            <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={handlePublish}>Publish</button>
                <button onClick={() => navigate("/")}>Cancel</button>
            </div>
        </div>
    );
}

export default CreateArticle;
