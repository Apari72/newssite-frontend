// src/services/api.js

export async function apiFetch(path, options = {}) {
    const response = await fetch(path, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        ...options,
    });

    // 1. Handle Errors (Non-200 responses)
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error ${response.status}: ${response.statusText}`);
    }

    // 2. Handle 204 No Content (Standard empty success)
    if (response.status === 204) {
        return null;
    }

    // 3. FIX: Handle 200 OK with empty body (Prevents "Unexpected end of JSON")
    const text = await response.text();
    if (!text) return null; // If body is empty, return null instead of crashing

    try {
        return JSON.parse(text);
    } catch (err) {
        console.error("JSON Parse Error:", err);
        throw new Error("Server sent invalid JSON");
    }
}


// ---------- COMMENTS ----------

export function getComments(articleId) {
    return apiFetch(`/api/articles/${articleId}/comments`);
}

export function addComment(articleId, content) {
    return apiFetch(`/api/articles/${articleId}/comments`, {
        method: "POST",
        body: JSON.stringify(content), // content should be { content: "..." }
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