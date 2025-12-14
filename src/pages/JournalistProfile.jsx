import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getJournalistProfile } from "../services/api";

function JournalistProfile() {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        getJournalistProfile(id).then(setProfile);
    }, [id]);

    if (!profile) return <p>Loading...</p>;

    return (
        <div style={{ padding: "40px", maxWidth: "800px" }}>
            <Link to="/">← Back to News</Link>

            <h1>{profile.name}</h1>
            <p>{profile.bio}</p>

            <p>
                ⭐ Rating: {profile.ratingScore} <br />
                👁 Total Views: {profile.totalViews}
            </p>

            <hr />

            <h3>Articles</h3>
            {profile.articles.map(article => (
                <div key={article.id} style={{ marginBottom: "10px" }}>
                    <Link to={`/articles/${article.id}`}>
                        <strong>{article.title}</strong>
                    </Link>
                    <div>
                        👁 {article.views} — {article.createdAt}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default JournalistProfile;
