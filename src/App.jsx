import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import JournalistProfile from "./components/JournalistProfile";
import ArticleDetail from "./components/ArticleDetail";
import CreateArticle from "./components/CreateArticle";
import AdminDashboard from "./components/AdminDashboard";
import EditArticle from "./components/EditArticle";
// IMPORT THE NEW HOME PAGE
import Home from "./components/Home";

import { apiFetch } from "./services/api";

function App() {
    const [currentUser, setCurrentUser] = useState(null);

    // We only fetch the USER here, not the news
    useEffect(() => {
        apiFetch("/api/auth/me")
            .then(userData => setCurrentUser(userData))
            .catch(() => setCurrentUser(null)); // null means guest
    }, []);

    return (
        <div className="app">
            <Header user={currentUser} />

            <main style={{ minHeight: "80vh" }}>
                <Routes>
                    {/* The Home component now handles its own data fetching */}
                    <Route path="/" element={<Home />} />
                    <Route path="/articles/:id" element={<ArticleDetail />} />
                    <Route path="/journalists/:id" element={<JournalistProfile />} />
                    <Route path="/create-article" element={<CreateArticle />} />
                    <Route path="/dashboard" element={<AdminDashboard />} />
                    <Route path="/edit-article/:id" element={<EditArticle />} />
                </Routes>
            </main>

            <Footer />
        </div>
    );
}

export default App;