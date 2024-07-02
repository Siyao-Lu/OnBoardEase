import React from "react";
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Navigation.css';
import logo from '../assets/logo.png';

const Navigation = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem('username') || 'User';
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <img src={logo} alt="Logo" className="navbar-logo" />
            </div>
            <div className="navbar-right">
                <div className="dropdown">
                    <FaUserCircle size={30} className="dropdown-profile" />
                    <span className="dropdown-username">{username}</span>
                    <div className="dropdown-content">
                        <a onClick={handleLogout}>Logout</a>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;