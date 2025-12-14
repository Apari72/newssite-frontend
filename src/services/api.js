export async function apiFetch(path, options = {}) {
    const response = await fetch(path, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        ...options,
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }

    // ✅ VERY IMPORTANT
    if (response.status === 204) {
        return null;
    }

    return response.json();
}


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
export function getJournalistProfile(id) {
    return apiFetch(`/api/journalists/${id}`);
}

