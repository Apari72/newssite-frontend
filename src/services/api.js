// src/services/api.js

// 1. DEFINE BASE URL
// If on Vercel, it uses the Env Var. If local, it defaults to localhost.
// Note: We remove the trailing slash from the env var if present to avoid double slashes.
const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080").replace(/\/$/, "");

export async function apiFetch(path, options = {}) {
    // 2. CONSTRUCT FULL URL
    // This turns "/api/articles" into "https://your-render-backend.com/api/articles"
    const url = `${BASE_URL}${path}`;

    const response = await fetch(url, {
        credentials: "include", // Crucial for cookies/sessions across domains
        headers: {
            "Content-Type": "application/json",
        },
        ...options,
    });

    // Handle Errors (Non-200 responses)
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error ${response.status}: ${response.statusText}`);
    }

    // Handle 204 No Content
    if (response.status === 204) {
        return null;
    }

    // Handle 200 OK with empty body
    const text = await response.text();
    if (!text) return null;

    try {
        return JSON.parse(text);
    } catch (err) {
        console.error("JSON Parse Error:", err);
        throw new Error("Server sent invalid JSON");
    }
}

export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    // FIX: Removed hardcoded "http://localhost:8080"
    const url = `${BASE_URL}/api/uploads/image`;

    const response = await fetch(url, {
        method: "POST",
        body: formData,
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error("Image upload failed");
    }

    return response.json();
};

// ---------- COMMENTS ----------

export function getComments(articleId) {
    return apiFetch(`/api/articles/${articleId}/comments`);
}

export function addComment(articleId, content) {
    return apiFetch(`/api/articles/${articleId}/comments`, {
        method: "POST",
        body: JSON.stringify(content),
    });
}

export function updateComment(commentId, content) {
    return apiFetch(`/api/comments/${commentId}`, {
        method: "PUT",
        body: JSON.stringify(content),
    });
}

export function deleteComment(commentId) {
    return apiFetch(`/api/comments/${commentId}`, {
        method: "DELETE",
    });
}

export function likeComment(commentId) {
    return apiFetch(`/api/comments/${commentId}/like`, {
        method: "POST",
    });
}

// ---------- PROFILES & AUTH ----------

export function getJournalistProfile(id) {
    return apiFetch(`/api/journalists/${id}`);
}

export function getCurrentUser() {
    return apiFetch("/api/auth/me");
}

// ---------- ADMIN ----------

export function getAllUsers() {
    return apiFetch("/api/admin/users");
}

export function promoteUserToJournalist(userId) {
    return apiFetch(`/api/admin/promote/${userId}`, {
        method: "POST",
    });
}

export function getArticles(category = null) {
    const url = category
        ? `/api/articles?category=${encodeURIComponent(category)}`
        : "/api/articles";
    return apiFetch(url);
}

export function toggleArticleLike(articleId) {
    return apiFetch(`/api/articles/${articleId}/like`, { method: "POST" });
}