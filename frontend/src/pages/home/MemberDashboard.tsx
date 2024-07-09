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
    manager: Member;
    members: Member[];
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
                const projectsWithManager = response.data.map((project: any) => ({
                    ...project,
                    manager: { username: project.manager.username, email: project.manager.email },
                    members: project.members.map((member: any) => ({
                        _id: member._id,
                        username: member.username,
                        email: member.email
                    })),
                    tasks: project.tasks.map((task: any) => ({
                        name: task.name,
                        description: task.description,
                        status: task.status
                    }))
                }));
                console.log("Project with manager:", projectsWithManager);
                setProjects(projectsWithManager);
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

    const formatDate = (dateString: Date) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
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
                                <td className="project-name">{project.name}</td>
                                <td>{project.manager.username} ({project.manager.email})</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Footer />

            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Project Details" className="member-modal-content">
                {selectedProject && (
                    <div className="project-details">
                        <h2>Project Details</h2>
                        <p><strong>Project Name:</strong> {selectedProject.name}</p>
                        <p><strong>Manager:</strong> {selectedProject.manager.username} ({selectedProject.manager.email})</p>
                        <p><strong>Members:</strong> {selectedProject.members.map(member => `${member.username} (${member.email})`).join(', ')}</p>
                        <p><strong>Tasks:</strong></p>
                        <ul>
                            {selectedProject.tasks.map((task, index) => (
                                <li key={index}>{task.name}: {task.description} ({task.status})</li>
                            ))}
                        </ul>
                        <p><strong>Start Time:</strong> {formatDate(selectedProject.startTime)}</p>
                        <p><strong>End Time:</strong> {formatDate(selectedProject.endTime)}</p>
                        <button onClick={closeModal} className="close-button">Close</button>
                    </div>
                )}
            </Modal>

            <Chatbot />
        </div>
    );
};

export default MemberDashboard;
