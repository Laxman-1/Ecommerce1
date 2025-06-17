import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // ✅ Initialize state once from localStorage
        return JSON.parse(localStorage.getItem('UserInfo')) || null;
    });

    useEffect(() => {
        // ✅ No need to set user again inside useEffect
        localStorage.setItem('UserInfo', JSON.stringify(user));
    }, [user]); // ✅ Only runs when user changes

    const login = (user) => {
        setUser(user);
        localStorage.setItem('UserInfo', JSON.stringify(user));
    };

    const logout = () => {
        localStorage.removeItem('UserInfo');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
