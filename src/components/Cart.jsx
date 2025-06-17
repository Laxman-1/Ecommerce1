import React, { useContext, useState } from 'react';
import Layout from './common/layout';
import { Link } from 'react-router-dom';
import { CartContext } from './context/cart';

const Cart = () => {
    const { cartData, setCartData } = useContext(CartContext);
  
    // Function to remove item from cart
    const removeFromCart = (productId) => {
        const updatedCart = cartData.filter(item => item.id !== productId);
        setCartData(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    // Calculate Subtotal, Shipping, and Grand Total
    const calculateSubtotal = () => {
        return cartData.reduce((total, item) => total + item.price * item.qty, 0);
    };

    const calculateShipping = () => {
        return 4; // Example static shipping cost
    };

    const calculateGrandTotal = () => {
        return calculateSubtotal() + calculateShipping();
    };

    return (
        <Layout>
            <div className='container py-5'>
                <div className='row'>
                    <nav aria-label="breadcrumb" className="py-4">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link to='/'>Home</Link>
                            </li>
                            <li className="breadcrumb-item">
                                <Link to='/shop'>Shop</Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">
                                Cart
                            </li>
                        </ol>
                    </nav>
                </div>

                <div className='col-md-12'>
                    <h2 className='border-bottom pb-3'>Cart</h2>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th width={100}>S.No</th>
                                <th>Product image</th>
                                <th>Product Name</th>
                                <th>Size</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartData && cartData.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td><img src={item.image_url} width={80} alt={item.title} /></td>
                                    <td>{item.title} <span>Rs {item.price}</span></td>
                                    <td>{item.size ? item.size.toUpperCase() : 'N/A'}</td> {/* Display size */}
                                    <td>
                                        <input 
                                            type='number' 
                                            value={item.qty} 
                                            className='form-control' 
                                            onChange={(e) => {
                                                const updatedCart = cartData.map(cartItem =>
                                                    cartItem.id === item.id ? { ...cartItem, qty: parseInt(e.target.value, 10) } : cartItem
                                                );
                                                setCartData(updatedCart);
                                                localStorage.setItem('cart', JSON.stringify(updatedCart));
                                            }}
                                        />
                                    </td>
                                    <td>Rs {item.price * item.qty}</td>
                                    <td>
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            width="20" 
                                            height="20" 
                                            fill="currentColor" 
                                            className="bi bi-trash3" 
                                            viewBox="0 0 16 16"
                                            onClick={() => removeFromCart(item.id)}
                                        >
                                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                                        </svg>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Cart Totals */}
                    <div className='row justify-content-end'>
                        <div className='col-md-3 border-2'>
                            <div className='d-flex justify-content-between border-bottom pb-3'>
                                <div><strong>Subtotal</strong></div>
                                <div>Rs {calculateSubtotal()}</div>
                            </div>
                            <div className='d-flex justify-content-between border-bottom py-3'>
                                <div><strong>Shipping</strong></div>
                                <div>Rs {calculateShipping()}</div>
                            </div>
                            <div className='d-flex justify-content-between border-bottom py-3'>
                                <div><strong>Grand Total:</strong></div>
                                <div>Rs {calculateGrandTotal()}</div>
                            </div>
                            <div className='d-flex justify-content-end border-bottom py-3'>
                            <button class="btn btn-primary">
                             <a href='/checkout'> Proceed to checkout</a>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Cart;
