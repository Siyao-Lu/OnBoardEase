import axios, { AxiosResponse } from 'axios';

interface UserData {
    username?: string;
    email: string;
    password: string;
}

interface AuthResponse {
    token?: string;
    message?: string;
    user?: {
        id: string;
        username: string;
        email: string;
        role: string;
    };
}

interface User {
    _id: string;
    username: string;
    email: string;
    role: string;
    status: string;
}

interface Resource {
    name: string;
    link: string;
}

interface ResourceResponse {
    resources: Resource[];
}

interface Member {
    _id: string;
    username: string;
    email: string;
}

interface Task {
    name: string;
    description: string;
    status?: string; // 'pending' | 'in progress' | 'completed'
}

interface Project {
    _id: string;
    name: string;
    // manager: string;
    members: string[];
    // members: { username: string, email: string }[];
    tasks: Task[];
    startTime: Date;
    endTime: Date;
}

const AUTH_URL = 'http://localhost:8080/auth';
const ADMIN_URL = 'http://localhost:8080/admin';
const PROJECT_URL = 'http://localhost:8080/project';
const RESOURCE_URL = 'http://localhost:8080/resource';

const api = axios.create({
    baseURL: AUTH_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const adminApi = axios.create({
    baseURL: ADMIN_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const resourceApi = axios.create({
    baseURL: RESOURCE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const projectApi = axios.create({
    baseURL: PROJECT_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// include token
adminApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    console.log('Retrieved token for adminApi:', token);
    if (token) {
        config.headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

resourceApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    console.log('Retrieved token for resourceApi:', token);
    if (token) {
        config.headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

projectApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    console.log('Retrieved token for projectApi:', token);
    if (token) {
        config.headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// signup
export const signup = async (userData: UserData): Promise<AxiosResponse<AuthResponse>> => {
    return await api.post<AuthResponse>('/signup', userData);
};

// login
export const login = async (userData: UserData): Promise<AxiosResponse<AuthResponse>> => {
    return await api.post<AuthResponse>('/login', userData);
};

// admin: get pending users
export const getPendingUsers = async (): Promise<AxiosResponse<User[]>> => {
    return await adminApi.get<User[]>('/pending');
};

// Approve user
export const approveUser = async (userId: string, role: string): Promise<AxiosResponse<any>> => {
    return await adminApi.post('/approve', { userId, role });
};

// post array of resources
export const postResources = async (resources: Resource[]): Promise<AxiosResponse<any>> => {
    return await resourceApi.post('/', resources);
};

// get resource, query includes name
export const getResources = async (name: string): Promise<AxiosResponse<ResourceResponse>> => {
    return await resourceApi.get<ResourceResponse>(`/?name=${name}`);
};

// create project
export const createProject = async (project: Project): Promise<AxiosResponse<any>> => {
    return await projectApi.post('/', project);
};

// get projects for manager
export const getProjects = async (): Promise<AxiosResponse<Project[]>> => {
    return await projectApi.get<Project[]>('/manager');
};

// get projects for member
export const getMemberProjects = async (): Promise<AxiosResponse<Project[]>> => {
    return await projectApi.get<Project[]>('/member');
};

// get all members
export const getMembers = async (): Promise<AxiosResponse<Member[]>> => {
    return await projectApi.get<Member[]>('/get-members');
};
