// src/services/api.js

// 1. DEFINE AND EXPORT BASE URL
// We export this constant so we can use it in Header.jsx and other components
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080").replace(/\/$/, "");

export async function apiFetch(path, options = {}) {
    // 2. CONSTRUCT FULL URL
    const url = `${API_BASE_URL}${path}`;

    const response = await fetch(url, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        ...options,
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error ${response.status}: ${response.statusText}`);
    }

    if (response.status === 204) {
        return null;
    }

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

    // Use the dynamic URL
    const url = `${API_BASE_URL}/api/uploads/image`;

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