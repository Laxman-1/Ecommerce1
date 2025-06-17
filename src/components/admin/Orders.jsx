import React, { useState, useEffect } from 'react';
import Layout from '../common/layout';
import { apiCall } from '../common/http';
import { toast } from 'react-toastify';
import AdminSidebar from '../common/AdminSidebar';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await apiCall('/admin/orders', {
                method: 'GET',
                isAdmin: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (response.status === 200) {
                setOrders(response.orders || []);
            } else {
                toast.error(response.message || 'Failed to fetch orders');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to fetch orders. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const response = await apiCall(`/orders/${orderId}/status`, {
                method: 'POST',
                isAdmin: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.status === 200) {
                toast.success('Order status updated successfully');
                fetchOrders();
            } else {
                toast.error(response.message || 'Failed to update order status');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            toast.error('Failed to update order status. Please try again.');
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getStatusBadgeClass = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-warning text-dark';
            case 'confirmed':
                return 'bg-info text-white';
            case 'shipped':
                return 'bg-primary text-white';
            case 'delivered':
                return 'bg-success text-white';
            case 'cancelled':
                return 'bg-danger text-white';
            default:
                return 'bg-secondary text-white';
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="d-flex">
                    <AdminSidebar />
                    <div className="flex-grow-1 p-4">
                        <div className="text-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-2">Loading orders...</p>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="d-flex">
                <AdminSidebar />
                <div className="flex-grow-1 p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2>Manage Orders</h2>
                    </div>
                    
                    {orders.length === 0 ? (
                        <div className="alert alert-info">
                            No orders found.
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-bordered table-hover">
                                <thead className="table-light">
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Date</th>
                                        <th>Items</th>
                                        <th>Total Amount</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order.id}>
                                            <td>#{order.id}</td>
                                            <td>{order.user?.name || 'Guest'}</td>
                                            <td>{formatDate(order.created_at)}</td>
                                            <td>
                                                <ul className="list-unstyled mb-0">
                                                    {order.order_items?.map((item) => (
                                                        <li key={item.id}>
                                                            {item.name} (Size: {item.size}) x {item.qty}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </td>
                                            <td>Rs. {order.grandtotal}</td>
                                            <td>
                                                <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td>
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                    className="form-select form-select-sm"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Orders;
