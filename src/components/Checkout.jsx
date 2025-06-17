import React, { useState, useContext, useEffect } from 'react';
import Layout from './common/layout';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from './context/cart';
import { useForm } from 'react-hook-form';

const Checkout = () => {
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const { cartData } = useContext(CartContext);

    // Prefill form from local storage
    useEffect(() => {
        const localData = JSON.parse(localStorage.getItem('user'));
        if (localData) {
            setValue('name', localData.name || '');
            setValue('email', localData.email || '');
            setValue('address', localData.address || '');
            setValue('city', localData.city || '');
            setValue('state', localData.state || '');
            setValue('mobile', localData.mobile || '');
            setValue('zip', localData.zip || '');
        }
    }, [setValue]);

    const calculateSubtotal = () => cartData.reduce((total, item) => total + item.price * item.qty, 0);
    const calculateShipping = () => 0;
    const calculateDiscount = () => 0;
    const calculateGrandTotal = () => (calculateSubtotal() + calculateShipping() - calculateDiscount()).toFixed(2);

    const handlePaymentMethod = (e) => {
        setPaymentMethod(e.target.value);
    };

    const processOrder = (formData) => {
        const orderData = {
            ...formData,
            payment_method: paymentMethod,
            grand_total: parseFloat(calculateGrandTotal()),
            sub_total: calculateSubtotal(),
            shipping: calculateShipping(),
            discount: calculateDiscount(),
            payment_status: paymentMethod === 'cod' ? 'not paid' : 'pending',
            status: 'processing',
            cart: cartData.map(item => ({
                product_id: item.id,
                title: item.title,
                price: item.price,
                unit_price: item.price,
                qty: item.qty,
                size: item.size || 'N/A',
            })),
        };

        navigate('/billing', { state: orderData });
    };

    return (
        <Layout>
            <div className='container pb-5'>

                {/* Breadcrumb */}
                <div className='row'>
                    <div className='col-md-12'>
                        <nav aria-label="breadcrumb" className="py-4">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link to='/'>Home</Link>
                                </li>
                                <li className="breadcrumb-item active">Checkout</li>
                            </ol>
                        </nav>
                    </div>
                </div>

                <form onSubmit={handleSubmit(processOrder)}>
                    <div className='row'>

                        {/* Billing Details */}
                        <div className='col-md-7'>
                            <h3 className='border-bottom pb-3'>Billing details</h3>

                            <div className='row pt-3'>
                                <div className='col-md-6 mb-3'>
                                    <input
                                        {...register('name', { required: "Name required" })}
                                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        placeholder="Full Name"
                                    />
                                    {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                                </div>

                                <div className='col-md-6 mb-3'>
                                    <input
                                        {...register('email', {
                                            required: "Email required",
                                            pattern: { value: /^\S+@\S+$/, message: "Invalid email" }
                                        })}
                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        placeholder="Email"
                                    />
                                    {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                                </div>

                                <div className='col-12 mb-3'>
                                    <input
                                        {...register('address', { required: "Address required" })}
                                        className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                        placeholder="Address"
                                    />
                                    {errors.address && <div className="invalid-feedback">{errors.address.message}</div>}
                                </div>

                                <div className='col-md-6 mb-3'>
                                    <input
                                        {...register('city', { required: "City required" })}
                                        className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                                        placeholder="City"
                                    />
                                    {errors.city && <div className="invalid-feedback">{errors.city.message}</div>}
                                </div>

                                <div className='col-md-6 mb-3'>
                                    <input
                                        {...register('state', { required: "State required" })}
                                        className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                                        placeholder="State"
                                    />
                                    {errors.state && <div className="invalid-feedback">{errors.state.message}</div>}
                                </div>

                                <div className='col-md-6 mb-3'>
                                    <input
                                        {...register('mobile', {
                                            required: "Phone required",
                                            pattern: { value: /^[0-9]{10}$/, message: "Invalid phone number" }
                                        })}
                                        className={`form-control ${errors.mobile ? 'is-invalid' : ''}`}
                                        placeholder="Phone"
                                    />
                                    {errors.mobile && <div className="invalid-feedback">{errors.mobile.message}</div>}
                                </div>

                                <div className='col-md-6 mb-3'>
                                    <input
                                        {...register('zip', { required: "ZIP required" })}
                                        className={`form-control ${errors.zip ? 'is-invalid' : ''}`}
                                        placeholder="ZIP Code"
                                    />
                                    {errors.zip && <div className="invalid-feedback">{errors.zip.message}</div>}
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className='col-md-5'>
                            <h3 className='border-bottom pb-3'>Order Summary</h3>

                            <div className="table-responsive">
                                <table className="table">
                                    <tbody>
                                        {cartData.map((item, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td><img src={item.image_url} alt={item.title} width="60" /></td>
                                                <td>
                                                    {item.title}
                                                    <div>Size: {item.size || 'N/A'}</div>
                                                    <div>Qty: {item.qty}</div>
                                                </td>
                                                <td>Rs. {item.price * item.qty}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="border-top pt-3">
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Subtotal:</span><span>Rs. {calculateSubtotal()}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Shipping:</span><span>Rs. {calculateShipping()}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-3 fw-bold">
                                    <span>Total:</span><span>Rs. {calculateGrandTotal()}</span>
                                </div>
                            </div>

                            <h3 className='border-bottom pb-3 mt-4'>Payment Method</h3>

                            <div className="d-flex gap-4 mb-4">
                                <div className="form-check">
                                    <input
                                        type="radio"
                                        className="form-check-input"
                                        value="cod"
                                        checked={paymentMethod === 'cod'}
                                        onChange={handlePaymentMethod}
                                    />
                                    <label className="form-check-label">Cash on Delivery</label>
                                </div>
                            </div>

                            <button
                                className="btn btn-primary w-100 py-3 mt-4"
                                type="submit"
                                disabled={cartData.length === 0}
                            >
                                Review Order
                            </button>
                        </div>

                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default Checkout;
