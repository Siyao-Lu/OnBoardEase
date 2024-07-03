import React, { Suspense, useEffect, useContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManagerDashboard from "../pages/home/ManagerDashboard";
import MemberDashboard from "../pages/home/MemberDashboard";

const Landing = React.lazy(() => import("../pages/landing"));
const Home = React.lazy(() => import("../pages/home"));

const AppRoutes = () => {
    const { token, setToken, setUser, user } = useContext(UserContext)!;
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        if (storedUser && storedToken) {
            console.log("Setting user and token from local storage");
            console.log("User", storedUser);
            console.log("Token", storedToken);
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }
        setIsLoading(false);
    }, [setToken, setUser]);

    const ProtectedRoute = ({children}: {children: JSX.Element}) => {
        return token ? children : <Navigate to="/" />;
    };

    const AdminRoute = ({children}: {children: JSX.Element}) => {
        return user && user.role === 'admin' ? children : <Navigate to="/" />;
    }

    const ManagerRoute = ({ children }: { children: JSX.Element }) => {
        return user && user.role === 'manager' ? children : <Navigate to="/" />;
    };

    const MemberRoute = ({ children }: { children: JSX.Element }) => {
        return user && user.role === 'member' ? children : <Navigate to="/" />;
    };

    console.log("User role", user?.role);

    if (isLoading) {
        return <div>Loading...</div>;
    }
    
    return (
        <Router>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/home" element={<ProtectedRoute>{user?.role === 'manager' ? <ManagerRoute><ManagerDashboard /></ManagerRoute> : <MemberRoute><MemberDashboard /></MemberRoute>}</ProtectedRoute>} />
                    <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                </Routes>
            </Suspense>
        </Router>
    );
};

export default AppRoutes;

