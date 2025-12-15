import { useEffect, useState } from "react";
import { getAllUsers, promoteUserToJournalist } from "../services/api";

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    const loadUsers = () => {
        getAllUsers()
            .then(setUsers)
            .catch(() => setError("Failed to load users"));
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handlePromote = async (userId) => {
        try {
            await promoteUserToJournalist(userId);
            loadUsers(); // refresh list
        } catch (e) {
            alert(e.message || "Promotion failed");
        }
    };

    if (error) return <p>{error}</p>;

    return (
        <div style={{ padding: "40px", fontFamily: "Arial" }}>
            <h1>Admin Dashboard</h1>

            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: "20px",
                }}
            >
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Action</th>
                </tr>
                </thead>

                <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>

                        <td>
                            {user.role === "USER" && (
                                <button onClick={() => handlePromote(user.id)}>
                                    Promote to Journalist
                                </button>
                            )}

                            {user.role === "JOURNALIST" && (
                                <span>Already Journalist</span>
                            )}

                            {user.role === "ADMIN" && (
                                <span style={{ color: "green" }}>
                                        Admin account
                                    </span>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminDashboard;
