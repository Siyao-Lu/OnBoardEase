import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { getMemberProjects } from "../../services/api";
import Modal from 'react-modal';
import './MemberDashboard.css';
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import Chatbot from "../../components/Chatbot";

interface Task {
    name: string;
    description: string;
    status?: string;
}

interface Member {
    _id: string;
    username: string;
    email: string;
}

interface Project {
    _id: string;
    name: string;
    // manager: Member;
    members: string[];
    tasks: Task[];
    startTime: Date;
    endTime: Date;
}

const MemberDashboard = () => {
    const { token } = useContext(UserContext)!;
    const [projects, setProjects] = useState<Project[]>([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await getMemberProjects();
                setProjects(response.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchProjects();
    }, [token]);

    const handleProjectClick = (project: Project) => {
        setSelectedProject(project);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedProject(null);
    };

    return (
        <div className="member-home">
            <Navigation />
            <div className="member-content">
                <table className="projects-table">
                    <thead>
                        <tr>
                            <th>Project Name</th>
                            <th>Assigned By</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map(project => (
                            <tr key={project._id} onClick={() => handleProjectClick(project)}>
                                <td>{project.name}</td>
                                {/* <td>{project.manager.username} ({project.manager.email})</td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Footer />

            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Project Details">
                {selectedProject && (
                    <>
                        <h2>Project Details</h2>
                        <p><strong>Project Name:</strong> {selectedProject.name}</p>
                        {/* <p><strong>Manager:</strong> {selectedProject.manager.username} ({selectedProject.manager.email})</p> */}
                        <h3>Tasks</h3>
                        <ul>
                            {selectedProject.tasks.map((task, index) => (
                                <li key={index}>{task.name}: {task.description}</li>
                            ))}
                        </ul>
                        <button onClick={closeModal}>Close</button>
                    </>
                )}
            </Modal>

            <Chatbot />
        </div>
    );
};

export default MemberDashboard;
