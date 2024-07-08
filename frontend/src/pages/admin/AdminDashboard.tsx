import React, { useState, useEffect, useContext } from "react";
import { getPendingUsers, approveUser } from "../../services/api";
import { UserContext } from "../../context/UserContext";
import './AdminDashboard.css';
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";

interface User {
    _id: string;
    username: string;
    email: string;
    role: string;
    status: string;
}

const AdminDashboard = () => {
    const { token } = useContext(UserContext)!;
    const [pendingUsers, setPendingUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<{ [key: string]: string }>({});
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const fetchPendingUsers = async () => {
            try {
                const response = await getPendingUsers();
                console.log("Fetched pending users:", response.data); // Debug log
                setPendingUsers(response.data);
            } catch (err) {
                console.error('Error fetching pending users:', err);
            }
        };
        fetchPendingUsers();
        // const intervalId = setInterval(fetchPendingUsers, 5000); // Fetch every 5 seconds
        // return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, [token]);

    const handleRoleChange = (userId: string, role: string) => {
        if (!userId) {
            console.error("User ID is undefined. Cannot set role.");
            return;
        }
        console.log(`Setting role for user ${userId} to ${role}`); // Debug log
        setRoles(prevRoles => ({
            ...prevRoles,
            [userId]: role,
        }));
        setErrors(prevErrors => ({
            ...prevErrors,
            [userId]: '',
        }));
    };

    const handleApprove = async (userId: string) => {
        if (!userId) {
            console.error("User ID is undefined. Cannot approve user.");
            return;
        }
        if (!roles[userId]) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [userId]: 'Please select a role before approving.',
            }));
            return;
        }
        try {
            const role = roles[userId];
            console.log(`Approving user ${userId} with role ${roles[userId]}`);
            await approveUser(userId, role);
            setPendingUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
            setErrors(prevErrors => ({
                ...prevErrors,
                [userId]: '',
            }));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="admin-dashboard">
            <Navigation />
            <div className="admin-content">
                <h2>Pending Users</h2>
                <table className="pending-users-table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingUsers.map(user => (
                            <tr key={user._id}>
                                <td>{user.username} ({user.email})</td>
                                <td>
                                    <select
                                        value={roles[user._id] || ''}
                                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                    >
                                        <option value="">Select Role</option>
                                        <option value="member">Employee</option>
                                        <option value="manager">Manager</option>
                                    </select>
                                    {errors[user._id] && <p className="error">{errors[user._id]}</p>}
                                </td>
                                <td>
                                    <button onClick={() => handleApprove(user._id)}>Approve</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Footer />
        </div>
    );
}

export default AdminDashboard;
