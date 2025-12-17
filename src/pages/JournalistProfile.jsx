import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getJournalistProfile, apiFetch } from "../services/api";

function JournalistProfile() {
    const { id } = useParams();

    const [profile, setProfile] = useState(null);
    const [bio, setBio] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        getJournalistProfile(id).then(data => {
            setProfile(data);
            setBio(data.bio || "");
        });
    }, [id]);

    const saveBio = async () => {
        try {
            setSaving(true);
            await apiFetch(`/api/journalists/${id}`, {
                method: "PUT",
                body: JSON.stringify({ bio }),
            });
            setProfile(prev => ({ ...prev, bio }));
        } catch {
            alert("Failed to update bio");
        } finally {
            setSaving(false);
        }
    };

    if (!profile) return <p>Loading...</p>;

    const stars = (profile.rating / 2).toFixed(1);

    return (
        <div style={{ padding: "40px", maxWidth: "800px" }}>
            <Link to="/">← Back to News</Link>

            <h1>{profile.name}</h1>

            {/* ---------- BIO ---------- */}
            {profile.canEdit ? (
                <>
                    <textarea
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                        rows={4}
                        style={{ width: "100%" }}
                    />
                    <button
                        onClick={saveBio}
                        disabled={saving}
                        style={{ marginTop: "8px" }}
                    >
                        {saving ? "Saving..." : "Save Bio"}
                    </button>
                </>
            ) : (
                <p>{profile.bio}</p>
            )}

            {/* ---------- STATS ---------- */}
            <div style={{ marginTop: "15px" }}>
                <p>
                    ⭐ Rating: <strong>{profile.rating.toFixed(1)} / 10</strong>
                    {" "}({stars} ⭐)
                </p>
                <p>
                    📰 Articles: <strong>{profile.totalArticles}</strong><br />
                    👁 Total Views: <strong>{profile.totalViews}</strong><br />
                    ❤️ Total Likes: <strong>{profile.totalLikes}</strong><br />
                    💬 Total Comments: <strong>{profile.totalComments}</strong>
                </p>

            </div>

            <hr />

            {/* ---------- ARTICLES ---------- */}
            <h3>Articles</h3>

            {profile.articles.length === 0 && (
                <p>No articles yet.</p>
            )}

            {profile.articles.map(article => (
                <div key={article.id} style={{ marginBottom: "12px" }}>
                    <Link to={`/articles/${article.id}`}>
                        <strong>{article.title}</strong>
                    </Link>
                    <div style={{ fontSize: "14px", color: "#555" }}>
                        👁 {article.views} —{" "}
                        {new Date(article.createdAt).toLocaleDateString()}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default JournalistProfile;
