import React, { useState } from 'react';
import './Chatbot.css';
import { getResources } from '../services/api';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState('');

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleSend = async () => {
        if (input.trim()) {
            setMessages([...messages, `You: ${input}`]);
            const lastWord = input.trim().split(' ').slice(-1)[0];
            try {
                const response = await getResources(lastWord);
                const resources = response.data.map(resource => resource.link).join(', ');
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
            setInput('');
        }
    };

    return (
        <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
            <button className="chatbot-button" onClick={handleToggle}>
                <img src="path/to/chatbot-icon.png" alt="Chatbot Icon" />
            </button>
            {isOpen && (
                <div className="chatbot-popup">
                    <div className="chatbot-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className="chatbot-message">{msg}</div>
                        ))}
                    </div>
                    <div className="chatbot-input">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask a question..."
                        />
                        <button onClick={handleSend}>Send</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
