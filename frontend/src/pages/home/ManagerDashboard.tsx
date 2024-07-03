import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { getProjects, createProject, getMembers } from "../../services/api";
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
    // const [newResource, setNewResource] = useState<Resource>({ name: '', link: '' });

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await getProjects();
                const projectsWithMembers = response.data.map((project: any) => ({
                    ...project,
                    members: project.members.map((memberId: string) => {
                        const member = members.find((m) => m._id === memberId);
                        return member ? member : { _id: memberId, username: "", email: "" };
                    })
                }));
                setProjects(projectsWithMembers);
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
            endTime: new Date(),
        };
        try {
            await createProject(newProject);
            setModalIsOpen(false);
            window.location.reload();
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    const handleAddTask = () => {
        setTasks([...tasks, { name: '', description: ''}]);
    };

    const handleAddResource = () => {
        setResources([...resources, { name: '', link: '' }]);
        // setResources([...resources, newResource]);
        // setNewResource({ name: '', link: '' });
    };

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
        setSelectedMembers(selectedOptions.map((option: any) => option.value));
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
                                <td>{project.name}</td>
                                <td>{project.members.map(member => `${member.username} (${member.email})`).join(', ')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Footer />

            <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} contentLabel="Create Project">
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
                            classNamePrefix="Select"
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
                        </div>
                    ))}
                    <button type="button" onClick={handleAddTask}>Add Task</button>
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
                        </div>
                    ))}
                    <button type="button" onClick={handleAddResource}>Add Resource</button>
                    <button type="submit">Submit</button>
                </form>
            </Modal>
        </div>
    );
};

export default ManagerDashboard;
