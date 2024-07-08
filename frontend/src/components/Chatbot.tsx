import React, { useState, useEffect, useContext } from 'react';
import './Chatbot.css';
import { getResources } from '../services/api';
import { FaRobot } from 'react-icons/fa'; // Import the robot icon
import { UserContext } from '../context/UserContext';
import { getMemberProjects } from '../services/api';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const userContext = useContext(UserContext);

    const { user } = userContext || {};
    console.log('User:', user);

    useEffect(() => {
        const fetchProjects = async () => {
            if (user) {
                try {
                    const response = await getMemberProjects();
                    const projectNames = response.data.map((project: any) => project.name);
                    const assignedProjects = projectNames.join(', ');
                    const welcomeMessage = `Bot: Hello ${user.username}, welcome onboard! Looks like you have been assigned to project(s) ${assignedProjects}.`;
                    setMessages([welcomeMessage]);
                } catch (error) {
                    console.error('Error fetching projects:', error);
                }
            }
        };

        fetchProjects();
    }, [user]);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleSend = async () => {
        if (input.trim()) {
            setMessages([...messages, `You: ${input}`]);
            setInput(''); // Clear the input field immediately
            setLoading(true);
            const lastWord = input.trim().split(' ').slice(-1)[0];
            setTimeout(async () => {
                try {
                    const response = await getResources(lastWord);
                    const resources = response.data.map(resource => (
                        `<a href="${resource.link}" target="_blank" rel="noopener noreferrer">${resource.link}</a>`
                    )).join('<br />');
                    setMessages(prevMessages => [
                        ...prevMessages,
                        `Bot: ${resources.length > 0 ? resources : 'No resources found.'}`
                    ]);
                } catch (error) {
                    setMessages(prevMessages => [
                        ...prevMessages,
                        'Bot: There was an error fetching resources. Please try again later.'
                    ]);
                }
                setLoading(false);
            }, 500);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
            <button className="chatbot-button" onClick={handleToggle}>
                <FaRobot size={50} /> {/* Use the robot icon */}
            </button>
            {isOpen && (
                <div className="chatbot-popup">
                    <div className="chatbot-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className="chatbot-message" dangerouslySetInnerHTML={{ __html: msg.includes('Bot:') ? `<FaRobot className="chatbot-avatar" /> ${msg}` : msg }} />
                        ))}
                        {loading && <div className="chatbot-message">Bot: <span className="typing-indicator">...</span></div>}
                    </div>
                    <div className="chatbot-input">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask a question..."
                            onKeyPress={handleKeyPress}
                        />
                        <button onClick={handleSend}>Send</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
