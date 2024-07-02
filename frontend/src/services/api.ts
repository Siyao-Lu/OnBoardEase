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
    };
}

const AUTH_URL = 'http://localhost:8080/auth';

const api = axios.create({
    baseURL: AUTH_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// signup
export const signup = async (userData: UserData): Promise<AxiosResponse<AuthResponse>> => {
    return await api.post<AuthResponse>('/signup', userData);
};

// login
export const login = async (userData: UserData): Promise<AxiosResponse<AuthResponse>> => {
    return await api.post<AuthResponse>('/login', userData);
};