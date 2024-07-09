import React, {createContext, useState, useEffect} from 'react';

interface User {
    id: string;
    username: string;
    email: string;
    role: string;
}

interface UserContextType {
    user: User | null;
    token: string | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    setToken: React.Dispatch<React.SetStateAction<string | null>>;
    logout: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider = ({children}: {children: React.ReactNode}) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }
    }, []);

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <UserContext.Provider value={{user, token, setUser, setToken, logout}}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;