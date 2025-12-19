import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getJournalistProfile } from "../services/api";
import NewsGrid from "./NewsGrid"; // <--- 1. Import NewsGrid
import "./JournalistProfile.css";

function JournalistProfile() {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getJournalistProfile(id)
            .then(data => setProfile(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="loading">Loading Profile...</div>;
    if (!profile) return <div className="error">Journalist not found.</div>;

    return (
        <div className="journalist-profile-page">

            {/* HEADER (Keep this, you liked it!) */}
            <div className="profile-header">
                <div className="profile-flex">
                    <div className="profile-image-wrapper">
                        <img
                            src={profile.avatarUrl || `https://ui-avatars.com/api/?name=${profile.name}&background=000&color=D4AF37&size=256`}
                            alt={profile.name}
                            className="profile-avatar"
                        />
                    </div>
                    <div className="profile-info">
                        <span className="profile-label">Senior Columnist</span>
                        <h1>{profile.name}</h1>
                        <div className="divider-small"></div>
                        <p className="profile-bio">{profile.bio || "Journalist at The Gilded Press."}</p>

                        <div className="profile-stats">
                            <div className="stat-item">
                                <span className="stat-number">{profile.totalViews || 0}</span>
                                <span className="stat-label">Total Reads</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{profile.articleCount || 0}</span>
                                <span className="stat-label">Articles</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* LOWER PART: REPLACED WITH NEWS GRID */}
            {/* This will automatically look like the homepage cards */}
            <div className="profile-content-wrapper">
                <NewsGrid
                    articles={profile.articles}
                    title="Latest Publications"
                />
            </div>

        </div>
    );
}

export default JournalistProfile;