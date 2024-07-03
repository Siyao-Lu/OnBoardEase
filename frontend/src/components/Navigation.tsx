import React, { useContext} from "react";
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import './Navigation.css';
import logo from '../assets/logo.png';

const Navigation = () => {
    const navigate = useNavigate();
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    const { user, logout } = context;
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <img src={logo} alt="Logo" className="navbar-logo" />
            </div>
            <div className="navbar-right">
                {user && (<div className="dropdown">
                    <FaUserCircle size={30} className="dropdown-profile" />
                    <span className="dropdown-username">{user.username}</span>
                    <div className="dropdown-content">
                        <a onClick={handleLogout}>Logout</a>
                    </div>
                </div>
                )}
            </div>
        </nav>
    );
};

export default Navigation;