import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiFetch } from "../services/api";
import "./JournalistProfile.css";

const JournalistProfile = () => {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        apiFetch(`/api/journalists/${id}`)
            .then(setProfile)
            .catch(() => {});
    }, [id]);

    if (!profile) return <div className="loading">Loading Profile...</div>;

    return (
        <div className="journalist-profile-page">
            {/* ---------- PROFILE HEADER ---------- */}
            <div className="profile-header">
                <div className="container profile-flex">
                    <div className="profile-info">
                        <span className="profile-label">Journalist Profile</span>
                        <h1>{profile.name}</h1>

                        <div className="divider-small"></div>
                        <p className="profile-bio">{profile.bio}</p>

                        <div className="profile-stats">
                            <div className="stat-box">
                                <span className="stat-number">
                                    {profile.totalArticles}
                                </span>
                                <span className="stat-label">
                                    Articles Published
                                </span>
                            </div>
                            <div className="stat-box">
                                <span className="stat-number">
                                    {(profile.rating / 2).toFixed(1)} ⭐
                                </span>
                                <span className="stat-label">Reader Rating</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ---------- ARTICLES ---------- */}
            <div className="container journalist-feed">
                <h2 className="feed-title">Recent Publications</h2>

                <div className="grid-container">
                    {profile.articles.map((item) => (
                        <article key={item.id} className="news-card">
                            <div className="card-image">
                                <img
                                    src={item.imageUrl || "/placeholder.jpg"}
                                    alt={item.title}
                                />
                            </div>

                            <div className="card-content">
                                <span className="card-category">
                                    {item.category || "General"}
                                </span>
                                <h3>{item.title}</h3>
                                <p>{item.summary}</p>

                                <Link
                                    to={`/articles/${item.id}`}
                                    className="read-more"
                                >
                                    Read Full Story →
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default JournalistProfile;
