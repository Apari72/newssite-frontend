import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    // 1. Load User & Data
    useEffect(() => {
        // First check who is looking at this page
        apiFetch("/api/auth/me")
            .then(user => {
                if (!user || user.role !== "ADMIN") {
                    // Kick them out if they are not ADMIN
                    navigate("/");
                } else {
                    setCurrentUser(user);
                    loadUsers(); // Only load data if allowed
                }
            })
            .catch(() => navigate("/"));
    }, [navigate]);

    const loadUsers = () => {
        apiFetch("/api/admin/users")
            .then(setUsers)
            .catch(() => setError("Failed to load users."));
    };

    const handlePromote = async (userId) => {
        try {
            await apiFetch(`/api/admin/promote/${userId}`, { method: "POST" });
            loadUsers();
        } catch (e) {
            alert(e.message || "Promotion failed");
        }
    };

    if (!currentUser) return null; // Don't render anything while redirecting

    return (
        <div className="container dashboard-page">
            <div className="dashboard-header">
                <h1>Admin Dashboard</h1>
                {/* BUTTON REMOVED as requested. It is now in the Header. */}
            </div>

            {error && <p className="error-text">{error}</p>}

            <div className="table-responsive">
                <table className="dashboard-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>#{user.id}</td>
                            <td className="font-bold">{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                    <span className={`role-badge ${user.role.toLowerCase()}`}>
                                        {user.role}
                                    </span>
                            </td>
                            <td>
                                {user.role === "USER" && (
                                    <button
                                        className="btn-promote"
                                        onClick={() => handlePromote(user.id)}
                                    >
                                        Promote to Journalist
                                    </button>
                                )}
                                {user.role === "JOURNALIST" && (
                                    <span className="status-text">Journalist Access Active</span>
                                )}
                                {user.role === "ADMIN" && (
                                    <span className="status-text admin">System Admin</span>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminDashboard;