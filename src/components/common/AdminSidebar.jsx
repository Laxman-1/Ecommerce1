import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    return (
        <div className="sidebar bg-dark text-white" style={{ width: '250px', minHeight: '100vh' }}>
            <div className="p-3">
                <h4 className="text-center mb-4">Admin Panel</h4>
                <ul className="nav flex-column">
                    <li className="nav-item">
                        <Link 
                            to="/admin/dashboard" 
                            className={`nav-link text-white ${isActive('/admin/dashboard')}`}
                        >
                            Dashboard
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link 
                            to="/admin/orders" 
                            className={`nav-link text-white ${isActive('/admin/orders')}`}
                        >
                            Orders
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link 
                            to="/admin/products" 
                            className={`nav-link text-white ${isActive('/admin/products')}`}
                        >
                            Products
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link 
                            to="/admin/users" 
                            className={`nav-link text-white ${isActive('/admin/users')}`}
                        >
                            Users
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link 
                            to="/admin/categories" 
                            className={`nav-link text-white ${isActive('/admin/categories')}`}
                        >
                            Categories
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default AdminSidebar; 