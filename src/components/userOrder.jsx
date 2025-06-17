import React, { useState, useEffect } from 'react';
import Layout from './common/layout';
import { apiCall } from './common/http';
import { toast } from 'react-toastify';

const UserOrder = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserOrders();
    }, []);

    const fetchUserOrders = async () => {
        try {
            setLoading(true);
            const response = await apiCall('/user-orders', {
                method: 'GET',
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

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await apiCall(`/cancel-order/${orderId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (response.status === 200) {
                setOrders(orders.filter(order => order.id !== orderId));
                toast.success('Order cancelled and removed successfully');
            } else {
                toast.error(response.message || 'Failed to cancel order');
            }
        } catch (error) {
            console.error('Error cancelling order:', error);
            toast.error('Failed to cancel order. Please try again.');
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to delete this cancelled order? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await apiCall(`/delete-cancelled-order/${orderId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (response.status === 200) {
                setOrders(orders.filter(order => order.id !== orderId));
                toast.success('Order deleted successfully');
            } else {
                toast.error(response.message || 'Failed to delete order');
            }
        } catch (error) {
            console.error('Error deleting order:', error);
            toast.error('Failed to delete order. Please try again.');
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

    const getPaymentStatusBadgeClass = (status) => {
        switch (status.toLowerCase()) {
            case 'paid':
                return 'bg-success text-white';
            case 'pending':
                return 'bg-warning text-dark';
            case 'failed':
                return 'bg-danger text-white';
            default:
                return 'bg-secondary text-white';
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="container mt-4">
        
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2">Loading orders...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mt-4">
            <nav aria-label="breadcrumb" className="py-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="/account">Home</a></li>
            <li className="breadcrumb-item active" aria-current="Orders">Orders</li>
          </ol>
        </nav>
         <h2 className="mb-4">My Orders</h2>
                
                {orders.length === 0 ? (
                    <div className="alert alert-info">
                        You haven't placed any orders yet.
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                            <thead className="table-light">
                                <tr>
                                    <th>Order ID</th>
                                    <th>Date</th>
                                    <th>Items</th>
                                    <th>Total Amount</th>
                                    <th>Status</th>
                                    <th>Payment Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id}>
                                        <td>#{order.id}</td>
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
                                            <span className={`badge ${getPaymentStatusBadgeClass(order.payment_status)}`}>
                                                {order.payment_status}
                                            </span>
                                        </td>
                                        <td>
                                            {order.status.toLowerCase() === 'pending' && (
                                                <button
                                                    onClick={() => handleCancelOrder(order.id)}
                                                    className="btn btn-sm btn-danger me-2"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                            {order.status.toLowerCase() === 'cancelled' && (
                                                <button
                                                    onClick={() => handleDeleteOrder(order.id)}
                                                    className="btn btn-sm btn-outline-danger"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default UserOrder;
