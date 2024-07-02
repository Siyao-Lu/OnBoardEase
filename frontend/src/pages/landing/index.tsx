import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { signup, login } from "../../services/api";
import './Landing.css';

interface FormData {
    username?: string;
    email: string;
    password: string;
    confirmPassword?: string;
}

const Landing = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = () => {
        setIsLogin(true);
        setFormData({ email: '', password: '' });
        setError(null);
        setModalIsOpen(true);
    };
    const handleSignup = () => {
        setIsLogin(false);
        setFormData({ username: '', email: '', password: '', confirmPassword: '' });
        setError(null);
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
                console.log('Logging in with', formData);
                response = await login({ email: formData.email, password: formData.password });
            } else {
                if (formData.password !== formData.confirmPassword) {
                    setError("Passwords do not match");
                    return;
                }
                console.log('Signing up with', formData);
                response = await signup({ username: formData.username, email: formData.email, password: formData.password });
            }
            console.log('Response received', response);
            if (response.status === 200 || response.status === 201) {
                if (isLogin && response.data.token) {
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('username', response.data.user?.username || ''); //login
                }
                if (!isLogin && response.data.user) {
                    localStorage.setItem('username', response.data.user.username); //signup
                }
                setModalIsOpen(false);
                navigate('/home');
            } else {
                setError(response.data.message || 'An error occurred');
            }
        } catch (err: any) {
            console.error(err);
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
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                        </label>
                        {!isLogin && (
                            <label>
                                Confirm Password:
                                <input type="password" name="confirmPassword" value={formData.confirmPassword!} onChange={handleChange} required />
                            </label>
                        )}
                        <input type="submit" value="Submit" />
                    </form>
                    {error && <p className="error">{error}</p>}
                </div>
            </Modal>
        </div>
    );
};

export default Landing;