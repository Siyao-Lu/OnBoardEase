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

const AUTH_URL = 'http://localhost:8080/auth';
const ADMIN_URL = 'http://localhost:8080/admin';

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
