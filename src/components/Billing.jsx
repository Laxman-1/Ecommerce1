import React, { useState, useContext, useEffect } from 'react';
import Layout from './common/layout';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CartContext } from './context/cart';
import { apiCall } from './common/http';
import { toast } from 'react-toastify';

const Billing = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { clearCart } = useContext(CartContext);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const orderData = location.state;

    useEffect(() => {
        if (!orderData || !orderData.cart || orderData.cart.length === 0) {
            toast.error('Invalid order data or empty cart.');
            navigate('/checkout');
        }
    }, [orderData, navigate]);

    const subTotal = Number(orderData?.subtotal || orderData?.sub_total || 0);
    const shipping = Number(orderData?.shipping || 0);
    const discount = Number(orderData?.discount || 0);
    const grandTotal = Number(orderData?.grandtotal || orderData?.grand_total || 0);

    const handleConfirmOrder = async () => {
        setIsSubmitting(true);

        const userInfo = JSON.parse(localStorage.getItem('UserInfo'));
        const userId = userInfo?.id;

        if (!userInfo?.token || !userId) {
            toast.error('Please log in to place an order.');
            navigate('/userlogin');
            setIsSubmitting(false);
            return;
        }

        try {
            // Ensure all numeric values are properly formatted
            const formattedSubTotal = Number(subTotal) || 0;
            const formattedShipping = Number(shipping) || 0;
            const formattedDiscount = Number(discount) || 0;
            const formattedGrandTotal = Number(grandTotal) || 0;

            // Process cart items to ensure product_id is a number
            const processedCart = orderData.cart.map(item => ({
                ...item,
                product_id: Number(item.product_id.split('-')[0]), // Extract the numeric part of product_id
                price: Number(item.price || 0),
                unit_price: Number(item.unit_price || item.price || 0),
                qty: Number(item.qty || 1)
            }));

            const payload = {
                user_id: userId,
                name: orderData.name || '',
                email: orderData.email || '',
                address: orderData.address || '',
                mobile: orderData.mobile || '',
                state: orderData.state || '',
                zip: orderData.zip || '',
                city: orderData.city || '',
                grandtotal: formattedGrandTotal,
                subtotal: formattedSubTotal,
                shipping: formattedShipping,
                discount: formattedDiscount,
                payment_status: orderData.payment_status || 'not paid',
                status: 'pending',
                payment_method: orderData.payment_method || 'cod',
                cart: processedCart
            };

            try {
                const responseData = await apiCall('/save-order', {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });

                if (responseData.status === 200) {
                    // Clear cart using the CartContext
                    if (clearCart) {
                        clearCart();
                        // Also clear cart from localStorage
                        localStorage.removeItem('cart');
                    }
                    toast.success(responseData.message || 'Order placed successfully!');
                    navigate('/account');
                } else {
                    throw new Error(responseData.message || 'Order submission failed');
                }
            } catch (error) {
                if (error.message.includes('Failed to fetch')) {
                    toast.error('Connection error. Please check your network and try again.');
                } else {
                    throw error;
                }
            }

        } catch (error) {
            console.error('Order submission error:', error);
            toast.error(error.message || 'Failed to process order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!orderData || !orderData.cart || orderData.cart.length === 0) {
        return null;
    }

    return (
        <Layout>
            <div className="container pb-5">
                <div className="row">
                    <div className="col-md-12">
                        <nav aria-label="breadcrumb" className="py-4">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                <li className="breadcrumb-item"><Link to="/checkout">Checkout</Link></li>
                                <li className="breadcrumb-item active">Billing</li>
                            </ol>
                        </nav>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <div className="text-center">
                            <h3>Invoice</h3>
                            <h5>Order Confirmation</h5>
                            <hr />
                        </div>

                        {/* Customer Details */}
                        <div className="card mb-4">
                            <div className="card-header">
                                <h4>Customer Details</h4>
                            </div>
                            <div className="card-body">
                                <p><strong>Name:</strong> {orderData.name}</p>
                                <p><strong>Email:</strong> {orderData.email}</p>
                                <p><strong>Address:</strong> {orderData.address}</p>
                                <p><strong>City:</strong> {orderData.city}</p>
                                <p><strong>State:</strong> {orderData.state}</p>
                                <p><strong>ZIP:</strong> {orderData.zip}</p>
                                <p><strong>Phone:</strong> {orderData.mobile}</p>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="card mb-4">
                            <div className="card-header">
                                <h4>Order Summary</h4>
                            </div>
                            <div className="card-body">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Size</th>
                                            <th>Qty</th>
                                            <th>Unit Price</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orderData.cart.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.title}</td>
                                                <td>{item.size}</td>
                                                <td>{item.qty}</td>
                                                <td>Rs. {Number(item.price).toFixed(2)}</td>
                                                <td>Rs. {(Number(item.price) * item.qty).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Payment Summary */}
                        <div className="card mb-4">
                            <div className="card-header">
                                <h4>Payment Summary</h4>
                            </div>
                            <div className="card-body">
                                <div className="d-flex justify-content-between mb-2">
                                    <span><strong>Subtotal:</strong></span>
                                    <span>Rs. {subTotal.toFixed(2)}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span><strong>Shipping:</strong></span>
                                    <span>Rs. {shipping.toFixed(2)}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span><strong>Discount:</strong></span>
                                    <span>Rs. {discount.toFixed(2)}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-3 fw-bold">
                                    <span><strong>Grand Total:</strong></span>
                                    <span>Rs. {grandTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="d-grid gap-2">
                            <button
                                className="btn btn-success"
                                onClick={handleConfirmOrder}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Processing...' : 'Confirm Order'}
                            </button>
                            <button
                                className="btn btn-outline-danger"
                                onClick={() => navigate('/checkout')}
                                disabled={isSubmitting}
                            >
                                Cancel Order
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Billing;
