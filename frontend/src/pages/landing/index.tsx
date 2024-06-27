import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import './Landing.css';

const Landing = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    const handleLogin = () => {
        setIsLogin(true);
        setModalIsOpen(true);
    };
    const handleSignup = () => {
        setIsLogin(false);
        setModalIsOpen(true);
    };

    const handleSubmit = () => {
        setModalIsOpen(false);
        navigate('/home');
    };

    return (
        <div className="landing-page">
            <h1 className="app-name">OnboardEase</h1>
            <div className="landing-buttons">
                <button className="landing-button" onClick={handleLogin}>Login</button>
                <button className="landing-button" onClick={handleSignup}>Sign Up</button>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel={isLogin ? "Login Modal" : "Signup Modal"}
            >
                <div className="modal-content">
                    <h2>{isLogin ? "Login" : "Sign Up"}</h2>
                    <form onSubmit={handleSubmit}>
                        <label>
                            Username:
                            <input type="text" name="username" />
                        </label>
                        <label>
                            Password:
                            <input type="password" name="password" />
                        </label>
                        {!isLogin && (
                            <label>
                                Confirm Password:
                                <input type="password" name="confirmPassword" />
                            </label>
                        )}
                        <input type="submit" value="Submit" />
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default Landing;