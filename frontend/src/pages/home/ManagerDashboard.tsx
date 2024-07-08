import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { getProjects, createProject, getMembers, postResources } from "../../services/api";
import Modal from 'react-modal';
import Select from 'react-select';
import './ManagerDashboard.css';
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";

interface Member {
    _id: string;
    username: string;
    email: string;
}

interface Task {
    name: string;
    description: string;
    status?: string;
}

interface Project {
    _id: string;
    name: string;
    members: Member[];
    tasks: Task[];
    startTime: Date;
    endTime: Date;
    manager: { username: string; email: string };
    // members: { username: string, email: string }[];
    // tasks: { name: string, description: string, status: string }[];
}

interface Resource {
    name: string;
    link: string;
}

const ManagerDashboard = () => {
    const { token } = useContext(UserContext)!;
    const [projects, setProjects] = useState<Project[]>([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [members, setMembers] = useState<Member[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<{ value: string, label: string }[]>([]);
    const [tasks, setTasks] = useState<{ name: string, description: string}[]>([{ name: '', description: ''}]);
    const [resources, setResources] = useState<Resource[]>([{ name: '', link: '' }]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    // const [newResource, setNewResource] = useState<Resource>({ name: '', link: '' });

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await getProjects();
                const projectsWithMembers = response.data.map((project: any) => ({
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
                console.log("Project with members:", projectsWithMembers);
                setProjects(projectsWithMembers);
                // const response = await getProjects();
                // setProjects(response.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };
        const fetchMembers = async () => {
            try {
                const response = await getMembers();
                setMembers(response.data);
            } catch (error) {
                console.error('Error fetching members:', error);
            }
        };
        fetchProjects();
        fetchMembers();
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newProject = { 
            _id: '',
            name: projectName, 
            members: selectedMembers.map(member => member.value),
            tasks,
            startTime: new Date(),
            endTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        };
        try {
            // post resources
            console.log("Resources to be sent:", resources);
            if (resources.length > 0) {
                await postResources(resources);
            }
            await createProject(newProject);
            setModalIsOpen(false);
            window.location.reload();
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    const handleAddTask = () => {
        if (tasks[tasks.length - 1].name && tasks[tasks.length - 1].description) {
            setTasks([...tasks, { name: '', description: '' }]);
        }
    };

    // const handleDeleteTask = (index: number) => {
    //     const newTasks = [...tasks];
    //     newTasks.splice(index, 1);
    //     setTasks(newTasks);
    // };

    const handleAddResource = () => {
        if (resources[resources.length - 1].name && resources[resources.length - 1].link) {
            setResources([...resources, { name: '', link: '' }]);
        }
        // setResources([...resources, newResource]);
        // setNewResource({ name: '', link: '' });
    };

    // const handleDeleteResource = (index: number) => {
    //     const newResources = [...resources];
    //     newResources.splice(index, 1);
    //     setResources(newResources);
    // };

    const handleTaskChange = (index: number, field: string, value: string) => {
        const newTasks = [...tasks];
        newTasks[index] = { ...newTasks[index], [field]: value };
        setTasks(newTasks);
    };

    const handleResourceChange = (index: number, field: string, value: string) => {
        // setNewResource({ ...newResource, [e.target.name]: e.target.value });
        const updatedResources = [...resources];
        updatedResources[index] = { ...updatedResources[index], [field]: value };
        setResources(updatedResources);
    };

    const memberOptions = members.map(member => ({
        value: member._id,
        label: `${member.username} (${member.email})`
    }));

    const handleMemberChange = (selectedOptions: any) => {
        // setSelectedMembers(selectedOptions.map((option: any) => option.value));
        setSelectedMembers(selectedOptions);
        console.log("Selected Members:", selectedOptions);
    };

    const openProjectDetails = (project: Project) => {
        setSelectedProject(project);
    };

    const closeProjectDetails = () => {
        setSelectedProject(null);
    };

    // const handleMemberChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //     const options = Array.from(e.target.options);
    //     const selected: string[] = [];
    //     for (const option of options) {
    //         if (option.selected) {
    //             selected.push(option.value);
    //         }
    //     }
    //     setSelectedMembers(selected);
    // };

    const formatDate = (dateString: Date) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="manager-home">
            <Navigation />
            <div className="manager-content">
                <button onClick={() => setModalIsOpen(true)}>Create New Project</button>
                <table className="projects-table">
                    <thead>
                        <tr>
                            <th>Project Name</th>
                            <th>Assigned Members</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map(project => (
                            <tr key={project._id}>
                                <td className="project-name" onClick={() => openProjectDetails(project)}>{project.name}</td>
                                <td>{project.members.map(member => `${member.username} (${member.email})`).join(', ')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Footer />

            <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} contentLabel="Create Project" className="manager-modal-content">
                <h2>Create Project</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Project Name:
                        <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} required />
                    </label>
                    <label>
                        Add Members:
                        <Select
                            isMulti
                            options={memberOptions}
                            onChange={handleMemberChange}
                            className="select-container"
                            classNamePrefix="react-select"
                        />
                    </label>
                    <h3>Add Tasks</h3>
                    {tasks.map((task, index) => (
                        <div key={index}>
                            <input
                                type="text"
                                placeholder="Task Name"
                                value={task.name}
                                onChange={(e) => handleTaskChange(index, 'name', e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Task Description"
                                value={task.description}
                                onChange={(e) => handleTaskChange(index, 'description', e.target.value)}
                                required
                            />
                            {/* <button type="button" onClick={() => handleDeleteTask(index)}>-</button> */}
                        </div>
                    ))}
                    <button type="button" onClick={handleAddTask}>Add Task</button>
                    <input type="file" />
                    <h3>Add Resources</h3>
                    {resources.map((resource, index) => (
                        <div key={index}>
                            <input
                                type="text"
                                placeholder="Resource Name"
                                value={resource.name}
                                onChange={(e) => handleResourceChange(index, 'name', e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Resource Link"
                                value={resource.link}
                                onChange={(e) => handleResourceChange(index, 'link', e.target.value)}
                                required
                            />
                            {/* <button type="button" onClick={() => handleDeleteResource(index)}>-</button> */}
                        </div>
                    ))}
                    <button type="button" onClick={handleAddResource}>Add Resource</button>
                    <button type="submit">Submit</button>
                </form>
            </Modal>

            {selectedProject && (
                <Modal isOpen={true} onRequestClose={closeProjectDetails} contentLabel="Project Details" className="manager-modal-content">
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
                        <button className="close-button" onClick={closeProjectDetails}>Close</button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default ManagerDashboard;
