import React, { useContext } from 'react';
import Layout from '../common/layout';
import { useForm } from 'react-hook-form';
import { apiUrl } from '../common/http';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
{/*import { AdminAuthContext } from '../context/AdminAuth';*/}

const Login = () => {
   {/* const{login}=useContext(AdminAuthContext);*/}
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        console.log(data);
    
        try {
            const res = await fetch(`${apiUrl}/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
    
            const result = await res.json();
            console.log(result);
    
            if (res.status === 200) {
                // Clear any existing user info
                localStorage.removeItem('UserInfo');
                
                // Store admin info
                const adminInfo = {
                    token: result.token,
                    id: result.id,
                    name: result.name,
                };
                localStorage.setItem('adminInfo', JSON.stringify(adminInfo));
                
                // Redirect to admin dashboard
                navigate('/admin/dashboard', { replace: true });
            } else {
                toast.error(result.message || 'An error occurred during login.');
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
                            <h3>Admin Login</h3>
                            <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                             Email Address
                            </label>
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
                                    {errors.email && <p className="invalid-feedback">{errors.email?.message}</p>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">
                                        Password
                                    </label>
                                    <input
                                        {...register('password', { required: 'Password field is required' })}
                                        type="password"
                                        id="password"
                                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                        placeholder="Enter password"
                                    />
                                    {errors.password && <p className="invalid-feedback">{errors.password?.message}</p>}
                                </div>

                            <div className="d-grid">
                                <button type="submit" className="btn btn-secondary">
                                    Login
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default Login;
