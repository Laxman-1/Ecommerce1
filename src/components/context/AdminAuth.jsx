import { createContext, useState, useEffect } from "react";

export const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
    const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
    const [user, setUser] = useState(adminInfo);

    useEffect(() => {
        // Set user from localStorage if available
        if (adminInfo) {
            setUser(adminInfo);
        }
    }, [adminInfo]);

    const login = (user) => {
        setUser(user);
        localStorage.setItem('adminInfo', JSON.stringify(user)); // Store user in localStorage
    };

    const logout = () => {
        localStorage.removeItem('adminInfo');
        setUser(null);
        
    };

    return (
        <AdminAuthContext.Provider value={{
             user, login, logout }}>
            {children}
        </AdminAuthContext.Provider>
    );
};
