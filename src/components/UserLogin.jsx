import React, { useContext } from 'react';
import Layout from './common/Layout';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiUrl } from './common/http';
import { AuthContext } from './context/Auth';

const UserLogin = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const res = await fetch(`${apiUrl}/login`, {
                method: 'POST', // ✅ Fix: Use POST instead of GET
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data), // ✅ Fix: Ensure body is properly formatted
            });

            const result = await res.json();

            if (res.status === 200) {
                const UserInfo = {
                    token: result.token,  // ✅ Token received from backend
                    id: result.id,
                    email: result.email, // ✅ Corrected to store user email
                };

                login(UserInfo); // ✅ Store user info in AuthContext
                localStorage.setItem('UserInfo', JSON.stringify(UserInfo)); // ✅ Save in localStorage

                toast.success('Login successful!');
                navigate('/account', { replace: true }); // ✅ Navigate to dashboard
            } else {
                toast.error(result.message || 'Invalid login credentials.'); // ✅ Show error message
            }
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong. Please try again later.');
        }
    };

    return (
        <Layout>
            <div className="container d-flex justify-content-center py-5">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="card shadow border-0 login">
                        <div className="card-body p-4">
                            <h3 className='border-bottom mb-3'>User Login</h3>

                            {/* Email Input */}
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email Address</label>
                                <input
                                    {...register('email', {
                                        required: 'The email field is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Invalid email address',
                                        },
                                    })}
                                    type="email"
                                    id="email"
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    placeholder="Enter Email Address"
                                />
                                {errors.email && <p className="invalid-feedback">{errors.email.message}</p>}
                            </div>

                            {/* Password Input */}
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input
                                    {...register('password', { required: 'Password field is required' })}
                                    type="password"
                                    id="password"
                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                    placeholder="Enter password"
                                />
                                {errors.password && <p className="invalid-feedback">{errors.password.message}</p>}
                            </div>

                            {/* Submit Button */}
                            <div className="d-grid">
                                <button type="submit" className="btn btn-secondary">Login</button>
                                <div className='d-flex justify-content-center pt-4 pb-2'>
                                    Don't have an account? &nbsp; <a href="/register">Register</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default UserLogin;
