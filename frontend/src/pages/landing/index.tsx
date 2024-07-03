import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { signup, login } from "../../services/api";
import { UserContext } from "../../context/UserContext";
import './Landing.css';

interface FormData {
    username?: string;
    email: string;
    password: string;
    confirmPassword?: string;
}

const Landing = () => {
    const { setUser, setToken, user, token } = React.useContext(UserContext)!;
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (token && user) {
            navigate(user.role === 'admin' ? '/admin' : '/home');
        }
    }, [token, user, navigate]);

    const handleLogin = () => {
        setIsLogin(true);
        setFormData({ email: '', password: '' });
        setError(null);
        setMessage(null);
        setModalIsOpen(true);
    };
    const handleSignup = () => {
        setIsLogin(false);
        setFormData({ username: '', email: '', password: '', confirmPassword: '' });
        setError(null);
        setMessage(null);
        setModalIsOpen(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError(null);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        try {
            let response;
            if (isLogin) {
                response = await login({ email: formData.email, password: formData.password });
                if (response.status === 200) {
                    const { token, user } = response.data;
                    setToken(token || '');
                    setUser(user || null);
                    localStorage.setItem('token', token || '');
                    localStorage.setItem('user', JSON.stringify(user));
                    setModalIsOpen(false);
                    navigate(user?.role === 'admin' ? '/admin' : '/home');
                } else {
                    setError(response.data.message || 'An error occurred');
                }
            } else {
                if (formData.password !== formData.confirmPassword) {
                    setError("Passwords do not match");
                    return;
                }
                response = await signup({ username: formData.username, email: formData.email, password: formData.password });
                if (response.status === 201) {
                    setMessage("User created successfully. Awaiting admin approval. Please check back later.");
                } else {
                    setError(response.data.message || 'An error occurred');
                }
            }
        } catch (err: any) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('An error occurred. Please try again later.');
            }
        }
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
                        {!isLogin && (
                            <label>
                                Username:
                                <input type="text" name="username" value={formData.username!} onChange={handleChange} required />
                            </label>
                        )}
                        <label>
                            Email:
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                        </label>
                        <label>
                            Password:
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required autoComplete="current-password" />
                        </label>
                        {!isLogin && (
                            <label>
                                Confirm Password:
                                <input type="password" name="confirmPassword" value={formData.confirmPassword!} onChange={handleChange} required autoComplete="current-password" />
                            </label>
                        )}
                        <input type="submit" value="Submit" />
                    </form>
                    {error && <p className="error">{error}</p>}
                    {message && <p className="message">{message}</p>}
                </div>
            </Modal>
        </div>
    );
};

export default Landing;